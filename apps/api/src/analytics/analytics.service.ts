import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AnalyticsEventType, AnalyticsSettings, Prisma, TrafficChannel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CollectInput } from './analytics-schemas';

const SEARCH_HOSTS = ['google.', 'bing.', 'duckduckgo.', 'yahoo.', 'baidu.', 'yandex.', 'ecosia.', 'brave.'];
const SOCIAL_HOSTS = ['facebook.', 'fb.com', 'instagram.', 'linkedin.', 'lnkd.in', 'twitter.', 't.co', 'x.com', 'youtube.', 'reddit.', 'pinterest.', 'whatsapp.', 'tiktok.', 'telegram.'];
const PAID_MEDIUMS = ['cpc', 'ppc', 'paid', 'paidsearch', 'paidsocial', 'display', 'cpm'];
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|uptime|monitor|preview|facebookexternalhit|curl|wget|python-requests|httpclient/i;

export interface Attribution {
  channel: TrafficChannel;
  source: string | null;
}

export function classifyTraffic(input: { referrerHost?: string; utmSource?: string; utmMedium?: string }): Attribution {
  const host = input.referrerHost?.toLowerCase().replace(/^www\./, '') ?? '';
  const medium = input.utmMedium?.toLowerCase() ?? '';
  const utmSource = input.utmSource?.toLowerCase() ?? '';
  const probe = `${host} ${utmSource}`;
  const source = utmSource || host || null;

  if (PAID_MEDIUMS.includes(medium)) return { channel: 'PAID', source };
  if (medium === 'social' || SOCIAL_HOSTS.some((h) => probe.includes(h.replace(/\.$/, '')))) return { channel: 'SOCIAL', source };
  if (medium === 'organic' || SEARCH_HOSTS.some((h) => probe.includes(h.replace(/\.$/, '')))) return { channel: 'ORGANIC_SEARCH', source };
  if (host) return { channel: 'REFERRAL', source };
  if (utmSource || medium) return { channel: 'UNKNOWN', source };
  return { channel: 'DIRECT', source: null };
}

interface EntityRef {
  field: 'demoId' | 'serviceId' | 'solutionId' | 'caseStudyId' | 'articleId';
  id: string;
  name: string;
}

export interface InternalEvent {
  type: AnalyticsEventType;
  sessionId?: string | null;
  path?: string;
  platform?: string;
  estimatorSubmissionId?: string;
  leadId?: string;
  demoId?: string | null;
  serviceId?: string | null;
  entityName?: string | null;
  metadata?: Prisma.InputJsonObject;
}

@Injectable()
export class AnalyticsService implements OnModuleInit {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly entityCache = new Map<string, { value: EntityRef | null; expires: number }>();

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit(): void {
    const timer = setInterval(() => void this.cleanup(), 6 * 60 * 60 * 1000);
    timer.unref();
    void this.cleanup();
  }

  getSettings(): Promise<AnalyticsSettings> {
    return this.prisma.analyticsSettings.upsert({ where: { id: 'analytics' }, update: {}, create: { id: 'analytics' } });
  }

  isBot(userAgent: string | undefined): boolean {
    return !userAgent || BOT.test(userAgent);
  }

  /** Deletes raw events and idle sessions older than the configured retention window. */
  async cleanup(): Promise<void> {
    try {
      const { retentionDays } = await this.getSettings();
      const cutoff = new Date(Date.now() - retentionDays * 86_400_000);
      await this.prisma.analyticsEvent.deleteMany({ where: { createdAt: { lt: cutoff } } });
      await this.prisma.analyticsSession.deleteMany({ where: { lastSeenAt: { lt: cutoff } } });
    } catch (error) {
      this.logger.warn(`Analytics cleanup failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  private async resolvePath(path: string | undefined): Promise<EntityRef | null> {
    const match = path ? /^\/(demos|services|solutions|case-studies|insights)\/([a-z0-9-]{1,80})$/.exec(path) : null;
    if (!match) return null;
    const cached = this.entityCache.get(path as string);
    if (cached && cached.expires > Date.now()) return cached.value;

    const [, section, slug] = match;
    let value: EntityRef | null = null;
    switch (section) {
      case 'demos': {
        const row = await this.prisma.demo.findUnique({ where: { slug }, select: { id: true, name: true } });
        value = row && { field: 'demoId', id: row.id, name: row.name };
        break;
      }
      case 'services': {
        const row = await this.prisma.service.findUnique({ where: { slug }, select: { id: true, title: true } });
        value = row && { field: 'serviceId', id: row.id, name: row.title };
        break;
      }
      case 'solutions': {
        const row = await this.prisma.industry.findUnique({ where: { slug }, select: { id: true, name: true } });
        value = row && { field: 'solutionId', id: row.id, name: row.name };
        break;
      }
      case 'case-studies': {
        const row = await this.prisma.caseStudy.findUnique({ where: { slug }, select: { id: true, title: true } });
        value = row && { field: 'caseStudyId', id: row.id, name: row.title };
        break;
      }
      default: {
        const row = await this.prisma.article.findUnique({ where: { slug }, select: { id: true, title: true } });
        value = row && { field: 'articleId', id: row.id, name: row.title };
      }
    }
    if (this.entityCache.size > 500) this.entityCache.clear();
    this.entityCache.set(path as string, { value, expires: Date.now() + 60_000 });
    return value;
  }

  /** Public, browser-originated events. Entities are resolved server-side from the path. */
  async collect(input: CollectInput): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.enabled) return;

    const attr = input.attr ?? {};
    const attribution = classifyTraffic({ referrerHost: attr.ref, utmSource: attr.utmSource, utmMedium: attr.utmMedium });
    const views = input.events.filter((e) => e.type === 'PAGE_VIEW').length;

    const session = await this.prisma.analyticsSession.upsert({
      where: { id: input.sessionId },
      update: { lastSeenAt: new Date(), ...(views ? { pageCount: { increment: views } } : {}) },
      create: {
        id: input.sessionId,
        channel: attribution.channel,
        source: attribution.source,
        medium: attr.utmMedium,
        campaign: attr.utmCampaign,
        content: attr.utmContent,
        term: attr.utmTerm,
        referrerHost: attr.ref,
        landingPath: input.events.find((e) => e.path)?.path,
        pageCount: views,
      },
      select: { channel: true, source: true },
    });

    const rows: Prisma.AnalyticsEventCreateManyInput[] = [];
    for (const event of input.events) {
      if (event.type === 'ARTICLE_VIEW' && !settings.trackArticles) continue;
      if ((event.type === 'ESTIMATOR_START' || event.type === 'ESTIMATOR_STEP_COMPLETE') && !settings.trackEstimator) continue;
      const entity = await this.resolvePath(event.path);
      const required: Partial<Record<AnalyticsEventType, EntityRef['field']>> = {
        DEMO_VIEW: 'demoId',
        DEMO_PLATFORM_SELECT: 'demoId',
        SERVICE_VIEW: 'serviceId',
        SOLUTION_VIEW: 'solutionId',
        CASE_STUDY_VIEW: 'caseStudyId',
        ARTICLE_VIEW: 'articleId',
      };
      const needs = required[event.type];
      if (needs && entity?.field !== needs) continue;

      const metadata: Record<string, string> = {};
      if (event.step) metadata.step = event.step;
      if (event.cta) metadata.cta = event.cta;
      rows.push({
        type: event.type,
        sessionId: input.sessionId,
        path: event.path,
        platform: event.platform,
        entityName: entity?.name,
        ...(entity ? { [entity.field]: entity.id } : {}),
        channel: session.channel,
        source: session.source,
        metadata: Object.keys(metadata).length ? metadata : undefined,
      });
    }
    if (rows.length) await this.prisma.analyticsEvent.createMany({ data: rows });
  }

  /** Trusted server-side business events. Never throws: analytics must not break a business flow. */
  async record(event: InternalEvent): Promise<void> {
    try {
      const settings = await this.getSettings();
      if (!settings.enabled) return;
      const sessionId = event.sessionId ?? 'server';
      const session = event.sessionId ? await this.prisma.analyticsSession.findUnique({ where: { id: event.sessionId }, select: { channel: true, source: true } }) : null;
      await this.prisma.analyticsEvent.create({
        data: {
          type: event.type,
          sessionId,
          path: event.path,
          platform: event.platform,
          estimatorSubmissionId: event.estimatorSubmissionId,
          leadId: event.leadId,
          demoId: event.demoId,
          serviceId: event.serviceId,
          entityName: event.entityName,
          channel: session?.channel,
          source: session?.source,
          metadata: event.metadata,
        },
      });
    } catch (error) {
      this.logger.warn(`Analytics record failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  /** First-touch attribution for a session, used to stamp leads. */
  async attributionFor(sessionId: string | undefined | null) {
    if (!sessionId) return null;
    return this.prisma.analyticsSession.findUnique({ where: { id: sessionId }, select: { channel: true, source: true, medium: true, campaign: true } });
  }
}
