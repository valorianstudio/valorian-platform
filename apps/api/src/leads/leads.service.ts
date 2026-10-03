import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ActivityType, LeadPriority, LeadSettings, LeadSource, LeadStatus, Prisma } from '@prisma/client';
import { AnalyticsService } from '../analytics/analytics.service';
import { env } from '../config/env';
import { NotificationsService } from '../mail/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import type { LeadUpdateInput, PublicLeadInput, StatusChangeInput } from './lead-schemas';

export interface Author {
  id: string;
  name: string;
}

export interface LeadListQuery {
  q?: string;
  status?: string;
  priority?: string;
  source?: string;
  demo?: string;
  service?: string;
  country?: string;
  from?: string;
  to?: string;
  followUp?: string;
  archived?: string;
  sort?: string;
  dir?: string;
  page?: string;
}

const PAGE_SIZE = 15;
const ACTIVE_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION'] as const;

const listSelect = {
  id: true,
  referenceCode: true,
  name: true,
  companyName: true,
  email: true,
  source: true,
  projectType: true,
  platform: true,
  estimatedMin: true,
  estimatedMax: true,
  currency: true,
  finalProjectValue: true,
  finalCurrency: true,
  status: true,
  priority: true,
  followUpAt: true,
  createdAt: true,
  archivedAt: true,
  demo: { select: { name: true } },
  service: { select: { title: true } },
} satisfies Prisma.LeadSelect;

const startOfDay = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 86_400_000);

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: AnalyticsService,
    private readonly notifications: NotificationsService,
  ) {}

  /* ---------- settings ---------- */

  async getSettings(): Promise<LeadSettings> {
    return this.prisma.leadSettings.upsert({ where: { id: 'leads' }, update: {}, create: { id: 'leads' } });
  }

  /* ---------- public intake ---------- */

  async createFromPublic(input: PublicLeadInput): Promise<{ reference: string }> {
    const recent = await this.prisma.lead.findFirst({
      where: { email: input.email, clientMessage: input.message ?? null, source: input.source, createdAt: { gt: new Date(Date.now() - 10 * 60_000) } },
      select: { referenceCode: true },
    });
    if (recent) return { reference: recent.referenceCode };

    const submission = input.estimateId ? await this.prisma.estimatorSubmission.findUnique({ where: { id: input.estimateId }, include: { lead: { select: { referenceCode: true } } } }) : null;
    if (input.estimateId && !submission) throw new BadRequestException('That estimate could not be found. Please recalculate it.');
    if (submission?.lead) return { reference: submission.lead.referenceCode };

    const [demo, service] = await Promise.all([
      input.demo || submission?.demoSlug ? this.prisma.demo.findFirst({ where: { slug: input.demo ?? submission?.demoSlug ?? '' }, select: { id: true, name: true } }) : null,
      input.service ? this.prisma.service.findFirst({ where: { slug: input.service }, select: { id: true, title: true } }) : null,
    ]);

    const attribution = await this.analytics.attributionFor(input.sessionId);
    const lead = await this.createWithReference(async (tx, referenceCode) => {
      const created = await tx.lead.create({
        data: {
          referenceCode,
          name: input.name,
          email: input.email,
          phone: input.phone,
          whatsapp: input.whatsapp,
          companyName: input.companyName,
          country: input.country,
          preferredContact: input.preferredContact,
          source: submission ? 'ESTIMATOR' : input.source,
          sourceUrl: input.sourceUrl,
          projectType: submission?.projectTypeName ?? input.projectType,
          platform: submission?.platform ?? input.platform,
          demoId: demo?.id,
          serviceId: service?.id,
          estimatorSubmissionId: submission?.id,
          estimatedMin: submission?.minAmount,
          estimatedMax: submission?.maxAmount,
          currency: submission?.currency,
          expectedTimeline: input.expectedTimeline,
          budgetRange: input.budgetRange,
          clientMessage: input.message,
          sessionId: input.sessionId,
          trafficChannel: attribution?.channel,
          utmSource: attribution?.source,
          utmMedium: attribution?.medium,
          utmCampaign: attribution?.campaign,
        },
        select: { id: true, referenceCode: true },
      });
      await tx.leadActivity.create({
        data: { leadId: created.id, type: 'CREATED', title: 'Lead created', detail: [`Source: ${submission ? 'ESTIMATOR' : input.source}`, demo && `Demo: ${demo.name}`, service && `Service: ${service.title}`].filter(Boolean).join(' · ') },
      });
      if (submission) {
        await tx.leadActivity.create({
          data: { leadId: created.id, type: 'ESTIMATE', title: 'Estimate submitted', detail: `${submission.currency} ${submission.minAmount.toLocaleString('en')} – ${submission.maxAmount.toLocaleString('en')}` },
        });
      }
      return created;
    });

    void this.analytics.record({ type: 'LEAD_CREATED', sessionId: input.sessionId, path: input.sourceUrl, estimatorSubmissionId: submission?.id, leadId: lead.id, demoId: demo?.id, serviceId: service?.id, platform: submission?.platform ?? input.platform, entityName: demo?.name ?? service?.title ?? null, metadata: { cta: (submission ? 'ESTIMATOR' : input.source).toLowerCase() } });
    if (!submission) void this.analytics.record({ type: 'CONTACT_FORM_SUBMIT', sessionId: input.sessionId, path: input.sourceUrl, leadId: lead.id, demoId: demo?.id, serviceId: service?.id });
    void this.getSettings().then((settings) =>
      this.notifications.leadCreated({
        id: lead.id,
        reference: lead.referenceCode,
        name: input.name,
        email: input.email,
        phone: input.phone ?? input.whatsapp,
        company: input.companyName,
        source: submission ? 'Estimator' : input.source,
        projectType: submission?.projectTypeName ?? input.projectType,
        estimate: submission ? `${submission.currency} ${submission.minAmount.toLocaleString('en')} – ${submission.maxAmount.toLocaleString('en')}` : null,
        timeline: input.expectedTimeline,
        budget: input.budgetRange,
        message: input.message,
        responseNote: settings.responseNote,
      }),
    );
    void this.notify(lead.referenceCode, input, submission ? `${submission.currency} ${submission.minAmount}–${submission.maxAmount}` : null);
    return { reference: lead.referenceCode };
  }

  private async createWithReference<T extends { referenceCode: string }>(create: (tx: Prisma.TransactionClient, code: string) => Promise<T>): Promise<T> {
    const year = new Date().getFullYear();
    for (let attempt = 0; ; attempt += 1) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const counter = await tx.leadCounter.upsert({ where: { year }, update: { value: { increment: 1 } }, create: { year, value: 1 } });
          return create(tx, `VAL-${year}-${String(counter.value).padStart(4, '0')}`);
        });
      } catch (error) {
        const conflict = error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
        if (!conflict || attempt >= 3) throw error;
      }
    }
  }

  private async notify(reference: string, input: PublicLeadInput, estimate: string | null): Promise<void> {
    try {
      const settings = await this.getSettings();
      if (!settings.notifyEnabled || !env.LEAD_WEBHOOK_URL) return;
      await fetch(env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'lead.created', reference, name: input.name, email: input.email, source: input.source, estimate, recipient: settings.notifyEmail }),
        signal: AbortSignal.timeout(5000),
      });
    } catch (error) {
      this.logger.warn(`Lead notification failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  /* ---------- admin queries ---------- */

  private where(query: LeadListQuery): Prisma.LeadWhereInput {
    const and: Prisma.LeadWhereInput[] = [{ archivedAt: query.archived === '1' ? { not: null } : null }];
    const q = query.q?.trim();
    if (q) {
      and.push({
        OR: [
          { referenceCode: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { companyName: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q } },
          { whatsapp: { contains: q } },
        ],
      });
    }
    if (query.status && Object.hasOwn(LeadStatus, query.status)) and.push({ status: query.status as LeadStatus });
    if (query.priority && Object.hasOwn(LeadPriority, query.priority)) and.push({ priority: query.priority as LeadPriority });
    if (query.source && Object.hasOwn(LeadSource, query.source)) and.push({ source: query.source as LeadSource });
    if (query.demo) and.push({ demoId: query.demo });
    if (query.service) and.push({ serviceId: query.service });
    if (query.country) and.push({ country: { equals: query.country, mode: 'insensitive' } });
    const from = query.from ? new Date(query.from) : null;
    const to = query.to ? new Date(query.to) : null;
    if (from && !Number.isNaN(from.getTime())) and.push({ createdAt: { gte: from } });
    if (to && !Number.isNaN(to.getTime())) and.push({ createdAt: { lt: addDays(to, 1) } });
    const today = startOfDay();
    if (query.followUp === 'overdue') and.push({ followUpAt: { lt: today }, status: { in: [...ACTIVE_STATUSES] } });
    if (query.followUp === 'today') and.push({ followUpAt: { gte: today, lt: addDays(today, 1) }, status: { in: [...ACTIVE_STATUSES] } });
    if (query.followUp === 'upcoming') and.push({ followUpAt: { gte: addDays(today, 1) }, status: { in: [...ACTIVE_STATUSES] } });
    return { AND: and };
  }

  private orderBy(query: LeadListQuery): Prisma.LeadOrderByWithRelationInput[] {
    const dir = query.dir === 'asc' ? 'asc' : 'desc';
    switch (query.sort) {
      case 'followUp':
        return [{ followUpAt: { sort: dir, nulls: 'last' } }, { createdAt: 'desc' }];
      case 'estimate':
        return [{ estimatedMax: { sort: dir, nulls: 'last' } }, { createdAt: 'desc' }];
      case 'priority':
        return [{ priority: dir }, { createdAt: 'desc' }];
      case 'updated':
        return [{ updatedAt: dir }];
      default:
        return [{ createdAt: dir }];
    }
  }

  async list(query: LeadListQuery) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const where = this.where(query);
    const [items, total] = await Promise.all([
      this.prisma.lead.findMany({ where, orderBy: this.orderBy(query), skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: listSelect }),
      this.prisma.lead.count({ where }),
    ]);
    return { items, total, page, pageSize: PAGE_SIZE };
  }

  async exportCsv(query: LeadListQuery): Promise<string> {
    const rows = await this.prisma.lead.findMany({ where: this.where(query), orderBy: this.orderBy(query), take: 5000, select: { ...listSelect, phone: true, whatsapp: true, country: true } });
    const header = ['Reference', 'Client', 'Company', 'Email', 'Phone', 'Country', 'Source', 'Project type', 'Demo', 'Service', 'Estimate min', 'Estimate max', 'Currency', 'Final value', 'Final currency', 'Status', 'Priority', 'Created'];
    const lines = rows.map((r) => [
      r.referenceCode, r.name, r.companyName, r.email, r.phone ?? r.whatsapp, r.country, r.source, r.projectType, r.demo?.name, r.service?.title,
      r.estimatedMin, r.estimatedMax, r.currency, r.finalProjectValue, r.finalCurrency, r.status, r.priority, r.createdAt.toISOString().slice(0, 10),
    ]);
    return [header, ...lines].map((line) => line.map(csvCell).join(',')).join('\r\n');
  }

  async stats() {
    const today = startOfDay();
    const base: Prisma.LeadWhereInput = { archivedAt: null };
    const active = { status: { in: [...ACTIVE_STATUSES] } };
    const [grouped, overdue, dueToday, upcoming, recent, followUps, wonValue] = await Promise.all([
      this.prisma.lead.groupBy({ by: ['status'], where: base, _count: { _all: true } }),
      this.prisma.lead.count({ where: { ...base, ...active, followUpAt: { lt: today } } }),
      this.prisma.lead.count({ where: { ...base, ...active, followUpAt: { gte: today, lt: addDays(today, 1) } } }),
      this.prisma.lead.count({ where: { ...base, ...active, followUpAt: { gte: addDays(today, 1) } } }),
      this.prisma.lead.findMany({ where: base, orderBy: { createdAt: 'desc' }, take: 5, select: listSelect }),
      this.prisma.lead.findMany({ where: { ...base, ...active, followUpAt: { not: null } }, orderBy: { followUpAt: 'asc' }, take: 5, select: listSelect }),
      this.prisma.lead.groupBy({ by: ['finalCurrency'], where: { ...base, status: 'WON', finalProjectValue: { not: null } }, _sum: { finalProjectValue: true } }),
    ]);
    const byStatus = Object.fromEntries(grouped.map((g) => [g.status, g._count._all])) as Record<string, number>;
    return {
      byStatus,
      total: grouped.reduce((sum, g) => sum + g._count._all, 0),
      activeCount: ACTIVE_STATUSES.reduce((sum, s) => sum + (byStatus[s] ?? 0), 0),
      followUps: { overdue, today: dueToday, upcoming },
      wonValue: wonValue.map((w) => ({ currency: w.finalCurrency, total: w._sum.finalProjectValue ?? 0 })),
      recent,
      upcomingFollowUps: followUps,
    };
  }

  async get(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        demo: { select: { id: true, name: true, slug: true } },
        service: { select: { id: true, title: true, slug: true } },
        estimatorSubmission: true,
        notes: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!lead) throw new NotFoundException('Lead not found.');
    return lead;
  }

  /* ---------- admin mutations ---------- */

  private async log(tx: Prisma.TransactionClient, leadId: string, type: ActivityType, title: string, author: Author, detail?: string | null) {
    await tx.leadActivity.create({ data: { leadId, type, title, detail: detail ?? null, authorName: author.name } });
  }

  async update(id: string, input: LeadUpdateInput, author: Author) {
    const current = await this.get(id);
    return this.prisma.$transaction(async (tx) => {
      const lead = await tx.lead.update({ where: { id }, data: input });
      if (input.priority && input.priority !== current.priority) await this.log(tx, id, 'PRIORITY_CHANGED', `Priority changed ${current.priority} → ${input.priority}`, author);
      if (input.followUpAt !== undefined && input.followUpAt?.getTime() !== current.followUpAt?.getTime()) {
        await this.log(tx, id, 'FOLLOW_UP', input.followUpAt ? `Follow-up scheduled for ${input.followUpAt.toISOString().slice(0, 10)}` : 'Follow-up cleared', author, input.followUpNote);
      }
      if (input.finalProjectValue !== undefined && input.finalProjectValue !== current.finalProjectValue) {
        await this.log(tx, id, 'FINAL_VALUE', input.finalProjectValue === null ? 'Final value cleared' : `Final value recorded: ${(input.finalCurrency ?? current.finalCurrency ?? current.currency ?? '')} ${input.finalProjectValue.toLocaleString('en')}`.trim(), author);
      }
      return lead;
    });
  }

  async changeStatus(id: string, input: StatusChangeInput, author: Author) {
    const current = await this.get(id);
    if (input.status === 'LOST' && !input.lostReason) throw new BadRequestException('Choose a reason for losing this lead.');
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const data: Prisma.LeadUpdateInput = { status: input.status, wonAt: input.status === 'WON' ? now : null, lostAt: input.status === 'LOST' ? now : null, lostReason: input.status === 'LOST' ? input.lostReason : null };
      if (input.status === 'WON' && input.finalProjectValue !== undefined) {
        data.finalProjectValue = input.finalProjectValue;
        data.finalCurrency = input.finalCurrency ?? current.finalCurrency ?? current.currency ?? 'BDT';
      }
      const lead = await tx.lead.update({ where: { id }, data });
      if (input.status !== current.status) {
        if (input.status === 'WON') await this.log(tx, id, 'WON', 'Marked as won', author, input.finalProjectValue !== undefined ? `Final value: ${data.finalCurrency} ${input.finalProjectValue.toLocaleString('en')}` : null);
        else if (input.status === 'LOST') await this.log(tx, id, 'LOST', 'Marked as lost', author, `Reason: ${input.lostReason}`);
        else await this.log(tx, id, 'STATUS_CHANGED', `Status changed ${current.status} → ${input.status}`, author);
      }
      if (input.note) await tx.leadNote.create({ data: { leadId: id, content: input.note, authorId: author.id, authorName: author.name } });
      return lead;
    });
  }

  async addNote(id: string, content: string, author: Author) {
    await this.get(id);
    return this.prisma.$transaction(async (tx) => {
      const note = await tx.leadNote.create({ data: { leadId: id, content, authorId: author.id, authorName: author.name } });
      await this.log(tx, id, 'NOTE_ADDED', 'Note added', author);
      return note;
    });
  }

  async editNote(noteId: string, content: string, author: Author) {
    const note = await this.prisma.leadNote.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found.');
    if (note.authorId !== author.id) throw new ConflictException('You can only edit your own notes.');
    return this.prisma.leadNote.update({ where: { id: noteId }, data: { content } });
  }

  async deleteNote(noteId: string, author: Author) {
    const note = await this.prisma.leadNote.findUnique({ where: { id: noteId } });
    if (!note) throw new NotFoundException('Note not found.');
    if (note.authorId !== author.id) throw new ConflictException('You can only delete your own notes.');
    await this.prisma.leadNote.delete({ where: { id: noteId } });
  }

  async addActivity(id: string, input: { type: ActivityType; title: string; detail?: string }, author: Author) {
    await this.get(id);
    return this.prisma.leadActivity.create({ data: { leadId: id, type: input.type, title: input.title, detail: input.detail, authorName: author.name } });
  }

  async setArchived(id: string, archived: boolean, author: Author) {
    await this.get(id);
    return this.prisma.$transaction(async (tx) => {
      const lead = await tx.lead.update({ where: { id }, data: { archivedAt: archived ? new Date() : null } });
      await this.log(tx, id, 'ARCHIVED', archived ? 'Lead archived' : 'Lead restored', author);
      return lead;
    });
  }
}

/** Escapes a CSV cell and neutralises spreadsheet formula injection. */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  let text = String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
