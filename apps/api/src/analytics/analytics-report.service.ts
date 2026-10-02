import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsService } from './analytics.service';

export interface RangeQuery {
  range?: string;
  from?: string;
  to?: string;
}

export interface DateRange {
  key: string;
  from: Date;
  to: Date;
  prevFrom: Date;
  prevTo: Date;
}

const DAY = 86_400_000;
const ACTIVE = ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION'] as const;
type Row = Record<string, unknown>;
const num = (value: unknown) => Number(value ?? 0);
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const MID = Prisma.raw('("estimatedMin" + "estimatedMax") / 2.0');

type EntityColumn = 'demoId' | 'serviceId' | 'solutionId' | 'caseStudyId' | 'articleId';
const COLUMN = { demoId: Prisma.raw('"demoId"'), serviceId: Prisma.raw('"serviceId"'), solutionId: Prisma.raw('"solutionId"'), caseStudyId: Prisma.raw('"caseStudyId"'), articleId: Prisma.raw('"articleId"') } satisfies Record<EntityColumn, Prisma.Sql>;

@Injectable()
export class AnalyticsReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: AnalyticsService,
  ) {}

  async resolveRange(query: RangeQuery): Promise<DateRange> {
    const settings = await this.analytics.getSettings();
    const tomorrow = new Date(startOfDay(new Date()).getTime() + DAY);
    let key = query.range ?? `${settings.defaultRangeDays}d`;
    let from: Date;
    let to = tomorrow;

    if (key === 'today' || key === '1d') {
      key = 'today';
      from = startOfDay(new Date());
    } else if (key === 'year') {
      from = new Date(new Date().getFullYear(), 0, 1);
    } else if (key === 'custom' && query.from && query.to && !Number.isNaN(Date.parse(query.from)) && !Number.isNaN(Date.parse(query.to))) {
      from = startOfDay(new Date(query.from));
      to = new Date(startOfDay(new Date(query.to)).getTime() + DAY);
      if (to <= from) to = new Date(from.getTime() + DAY);
      if (to.getTime() - from.getTime() > 366 * DAY) from = new Date(to.getTime() - 366 * DAY);
    } else {
      const days = ({ '7d': 7, '30d': 30, '90d': 90, '365d': 365 } as Record<string, number>)[key] ?? 30;
      if (!(key in { '7d': 1, '30d': 1, '90d': 1, '365d': 1 })) key = '30d';
      from = new Date(tomorrow.getTime() - days * DAY);
    }
    const length = to.getTime() - from.getTime();
    return { key, from, to, prevFrom: new Date(from.getTime() - length), prevTo: from };
  }

  /* ---------- shared helpers ---------- */

  private events(type: string, from: Date, to: Date) {
    return this.prisma.analyticsEvent.count({ where: { type: type as never, createdAt: { gte: from, lt: to } } });
  }

  private async core(from: Date, to: Date) {
    const [visitors, pageViews, leads, starts, completions] = await Promise.all([
      this.prisma.analyticsSession.count({ where: { firstSeenAt: { gte: from, lt: to } } }),
      this.events('PAGE_VIEW', from, to),
      this.prisma.lead.count({ where: { createdAt: { gte: from, lt: to }, archivedAt: null } }),
      this.events('ESTIMATOR_START', from, to),
      this.events('ESTIMATOR_COMPLETE', from, to),
    ]);
    return { visitors, pageViews, leads, estimatorStarts: starts, estimatorCompletions: completions };
  }

  private async pipeline() {
    const rows = await this.prisma.$queryRaw<Row[]>`
      SELECT "status"::text AS status, "currency"::text AS currency, COUNT(*)::int AS n, COALESCE(SUM(${MID}), 0)::float AS total
      FROM "Lead"
      WHERE "archivedAt" IS NULL AND "status" IN ('NEW','CONTACTED','QUALIFIED','MEETING','PROPOSAL','NEGOTIATION') AND "estimatedMin" IS NOT NULL
      GROUP BY 1, 2`;
    const byCurrency = new Map<string, number>();
    const byStage = new Map<string, { n: number; totals: Record<string, number> }>();
    for (const row of rows) {
      const currency = String(row.currency ?? 'BDT');
      byCurrency.set(currency, (byCurrency.get(currency) ?? 0) + num(row.total));
      const stage = byStage.get(String(row.status)) ?? { n: 0, totals: {} };
      stage.n += num(row.n);
      stage.totals[currency] = (stage.totals[currency] ?? 0) + num(row.total);
      byStage.set(String(row.status), stage);
    }
    return {
      total: [...byCurrency].map(([currency, total]) => ({ currency, total: Math.round(total) })),
      stages: [...byStage].map(([status, v]) => ({ status, count: v.n, totals: Object.entries(v.totals).map(([currency, total]) => ({ currency, total: Math.round(total) })) })),
    };
  }

  private async won(from: Date, to: Date) {
    const rows = await this.prisma.$queryRaw<Row[]>`
      SELECT COALESCE("finalCurrency", "currency")::text AS currency, COUNT(*)::int AS n,
             COALESCE(SUM("finalProjectValue"), 0)::float AS total, COALESCE(AVG("finalProjectValue"), 0)::float AS avg
      FROM "Lead" WHERE "status" = 'WON' AND "archivedAt" IS NULL AND "wonAt" >= ${from} AND "wonAt" < ${to} AND "finalProjectValue" IS NOT NULL
      GROUP BY 1`;
    const count = await this.prisma.lead.count({ where: { status: 'WON', archivedAt: null, wonAt: { gte: from, lt: to } } });
    return { count, values: rows.map((r) => ({ currency: String(r.currency ?? 'BDT'), total: Math.round(num(r.total)), average: Math.round(num(r.avg)), deals: num(r.n) })) };
  }

  private async followUps() {
    const today = startOfDay(new Date());
    const settings = await this.analytics.getSettings();
    const active = { status: { in: [...ACTIVE] }, archivedAt: null };
    const [overdue, dueToday, thisWeek, none, idle] = await Promise.all([
      this.prisma.lead.count({ where: { ...active, followUpAt: { lt: today } } }),
      this.prisma.lead.count({ where: { ...active, followUpAt: { gte: today, lt: new Date(today.getTime() + DAY) } } }),
      this.prisma.lead.count({ where: { ...active, followUpAt: { gte: new Date(today.getTime() + DAY), lt: new Date(today.getTime() + 8 * DAY) } } }),
      this.prisma.lead.count({ where: { ...active, followUpAt: null } }),
      this.prisma.lead.count({ where: { ...active, updatedAt: { lt: new Date(Date.now() - settings.idleLeadDays * DAY) } } }),
    ]);
    return { overdue, dueToday, thisWeek, withoutFollowUp: none, idle, idleDays: settings.idleLeadDays };
  }

  private async series(from: Date, to: Date) {
    const [views, sessions] = await Promise.all([
      this.prisma.$queryRaw<Row[]>`SELECT date_trunc('day', "createdAt") AS d, COUNT(*)::int AS n FROM "AnalyticsEvent" WHERE "type" = 'PAGE_VIEW' AND "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY 1`,
      this.prisma.$queryRaw<Row[]>`SELECT date_trunc('day', "firstSeenAt") AS d, COUNT(*)::int AS n FROM "AnalyticsSession" WHERE "firstSeenAt" >= ${from} AND "firstSeenAt" < ${to} GROUP BY 1`,
    ]);
    const key = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const v = new Map(views.map((r) => [key(new Date(r.d as Date)), num(r.n)]));
    const s = new Map(sessions.map((r) => [key(new Date(r.d as Date)), num(r.n)]));
    const out: { date: string; pageViews: number; visitors: number }[] = [];
    for (let t = from.getTime(); t < to.getTime(); t += DAY) {
      const day = new Date(t);
      out.push({ date: `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`, pageViews: v.get(key(day)) ?? 0, visitors: s.get(key(day)) ?? 0 });
    }
    return out;
  }

  /* ---------- endpoints ---------- */

  async overview(range: DateRange) {
    const [current, previous, series, pipeline, won, followUps] = await Promise.all([
      this.core(range.from, range.to),
      this.core(range.prevFrom, range.prevTo),
      this.series(range.from, range.to),
      this.pipeline(),
      this.won(range.from, range.to),
      this.followUps(),
    ]);
    return { range, current, previous, series, pipeline, won, followUps };
  }

  async summary() {
    const today = startOfDay(new Date());
    const from = new Date(today.getTime() + DAY - 30 * DAY);
    const to = new Date(today.getTime() + DAY);
    const [newLeads, pipeline, won, completions, followUps, topDemo] = await Promise.all([
      this.prisma.lead.count({ where: { status: 'NEW', archivedAt: null } }),
      this.pipeline(),
      this.won(from, to),
      this.events('ESTIMATOR_COMPLETE', from, to),
      this.followUps(),
      this.topEntities('demoId', 'DEMO_VIEW', from, to, 1),
    ]);
    return { newLeads, pipeline: pipeline.total, won: won.values, wonCount: won.count, estimatorCompletions: completions, overdue: followUps.overdue, topDemo: topDemo[0] ?? null };
  }

  private async topEntities(field: EntityColumn, type: string, from: Date, to: Date, limit = 10) {
    const column = COLUMN[field];
    const rows = await this.prisma.$queryRaw<Row[]>`
      SELECT ${column} AS id, MAX("entityName") AS name, COUNT(*)::int AS views, COUNT(DISTINCT "sessionId")::int AS sessions
      FROM "AnalyticsEvent" WHERE "type" = ${type}::"AnalyticsEventType" AND "createdAt" >= ${from} AND "createdAt" < ${to} AND ${column} IS NOT NULL
      GROUP BY 1 ORDER BY 3 DESC LIMIT ${limit}`;
    return rows.map((r) => ({ id: String(r.id), name: String(r.name ?? 'Unknown'), views: num(r.views), sessions: num(r.sessions) }));
  }

  private async clicksByEntity(field: EntityColumn, from: Date, to: Date) {
    const column = COLUMN[field];
    const rows = await this.prisma.$queryRaw<Row[]>`
      SELECT ${column} AS id,
             COUNT(*) FILTER (WHERE "type" IN ('CTA_CLICK','WHATSAPP_CLICK'))::int AS clicks,
             COUNT(*) FILTER (WHERE "type" = 'CTA_CLICK' AND "metadata"->>'cta' = 'estimate')::int AS estimates,
             COUNT(*) FILTER (WHERE "type" = 'DEMO_PLATFORM_SELECT' AND "platform" = 'WEBSITE')::int AS website,
             COUNT(*) FILTER (WHERE "type" = 'DEMO_PLATFORM_SELECT' AND "platform" = 'MOBILE')::int AS mobile
      FROM "AnalyticsEvent" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND ${column} IS NOT NULL GROUP BY 1`;
    return new Map(rows.map((r) => [String(r.id), { clicks: num(r.clicks), estimates: num(r.estimates), website: num(r.website), mobile: num(r.mobile) }]));
  }

  private async leadsBy(field: 'demoId' | 'serviceId', from: Date, to: Date) {
    const column = Prisma.raw(`"${field}"`);
    const rows = await this.prisma.$queryRaw<Row[]>`SELECT ${column} AS id, COUNT(*)::int AS n FROM "Lead" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND "archivedAt" IS NULL AND ${column} IS NOT NULL GROUP BY 1`;
    return new Map(rows.map((r) => [String(r.id), num(r.n)]));
  }

  async content(range: DateRange) {
    const { from, to } = range;
    const [pages, demos, services, solutions, cases, articles, demoClicks, serviceClicks, caseClicks, articleClicks, demoLeads, serviceLeads, industryLeads, platformRows] = await Promise.all([
      this.prisma.$queryRaw<Row[]>`SELECT "path", COUNT(*)::int AS views, COUNT(DISTINCT "sessionId")::int AS sessions FROM "AnalyticsEvent" WHERE "type" = 'PAGE_VIEW' AND "createdAt" >= ${from} AND "createdAt" < ${to} AND "path" IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 12`,
      this.topEntities('demoId', 'DEMO_VIEW', from, to),
      this.topEntities('serviceId', 'SERVICE_VIEW', from, to),
      this.topEntities('solutionId', 'SOLUTION_VIEW', from, to),
      this.topEntities('caseStudyId', 'CASE_STUDY_VIEW', from, to),
      this.topEntities('articleId', 'ARTICLE_VIEW', from, to),
      this.clicksByEntity('demoId', from, to),
      this.clicksByEntity('serviceId', from, to),
      this.clicksByEntity('caseStudyId', from, to),
      this.clicksByEntity('articleId', from, to),
      this.leadsBy('demoId', from, to),
      this.leadsBy('serviceId', from, to),
      this.prisma.$queryRaw<Row[]>`SELECT d."industryId" AS id, COUNT(*)::int AS n FROM "Lead" l JOIN "Demo" d ON d."id" = l."demoId" WHERE l."createdAt" >= ${from} AND l."createdAt" < ${to} AND l."archivedAt" IS NULL AND d."industryId" IS NOT NULL GROUP BY 1`,
      this.prisma.$queryRaw<Row[]>`SELECT "platform", COUNT(*)::int AS n FROM "AnalyticsEvent" WHERE "type" = 'DEMO_PLATFORM_SELECT' AND "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY 1`,
    ]);
    const industryMap = new Map(industryLeads.map((r) => [String(r.id), num(r.n)]));
    const withRates = (rows: { id: string; name: string; views: number; sessions: number }[], clicks: Map<string, { clicks: number; estimates: number; website: number; mobile: number }>, leads: Map<string, number>) =>
      rows.map((r) => ({ ...r, ...(clicks.get(r.id) ?? { clicks: 0, estimates: 0, website: 0, mobile: 0 }), leads: leads.get(r.id) ?? 0 }));

    return {
      range,
      pages: pages.map((r) => ({ path: String(r.path), views: num(r.views), sessions: num(r.sessions) })),
      demos: withRates(demos, demoClicks, demoLeads),
      services: withRates(services, serviceClicks, serviceLeads),
      solutions: solutions.map((r) => ({ ...r, leads: industryMap.get(r.id) ?? 0 })),
      caseStudies: withRates(cases, caseClicks, new Map()),
      articles: withRates(articles, articleClicks, new Map()),
      platformInterest: { website: num(platformRows.find((r) => r.platform === 'WEBSITE')?.n), mobile: num(platformRows.find((r) => r.platform === 'MOBILE')?.n) },
    };
  }

  async acquisition(range: DateRange) {
    const { from, to } = range;
    const [channels, sources, campaigns, referrers, leadChannels] = await Promise.all([
      this.prisma.analyticsSession.groupBy({ by: ['channel'], where: { firstSeenAt: { gte: from, lt: to } }, _count: { _all: true } }),
      this.prisma.$queryRaw<Row[]>`SELECT COALESCE("source", 'direct') AS source, "channel"::text AS channel, COUNT(*)::int AS n FROM "AnalyticsSession" WHERE "firstSeenAt" >= ${from} AND "firstSeenAt" < ${to} GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 12`,
      this.prisma.$queryRaw<Row[]>`SELECT "campaign", COALESCE("source", '') AS source, COALESCE("medium", '') AS medium, COUNT(*)::int AS n FROM "AnalyticsSession" WHERE "firstSeenAt" >= ${from} AND "firstSeenAt" < ${to} AND "campaign" IS NOT NULL GROUP BY 1, 2, 3 ORDER BY 4 DESC LIMIT 10`,
      this.prisma.$queryRaw<Row[]>`SELECT "referrerHost" AS host, COUNT(*)::int AS n FROM "AnalyticsSession" WHERE "firstSeenAt" >= ${from} AND "firstSeenAt" < ${to} AND "referrerHost" IS NOT NULL GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      this.prisma.lead.groupBy({ by: ['trafficChannel'], where: { createdAt: { gte: from, lt: to }, archivedAt: null }, _count: { _all: true } }),
    ]);
    const leadMap = new Map(leadChannels.map((l) => [l.trafficChannel ?? 'UNATTRIBUTED', l._count._all]));
    const total = channels.reduce((sum, c) => sum + c._count._all, 0);
    return {
      range,
      totalSessions: total,
      channels: channels.map((c) => ({ channel: c.channel, sessions: c._count._all, leads: leadMap.get(c.channel) ?? 0 })).sort((a, b) => b.sessions - a.sessions),
      unattributedLeads: leadMap.get('UNATTRIBUTED') ?? 0,
      sources: sources.map((r) => ({ source: String(r.source), channel: String(r.channel), sessions: num(r.n) })),
      campaigns: campaigns.map((r) => ({ campaign: String(r.campaign), source: String(r.source), medium: String(r.medium), sessions: num(r.n) })),
      referrers: referrers.map((r) => ({ host: String(r.host), sessions: num(r.n) })),
    };
  }

  async estimator(range: DateRange) {
    const { from, to } = range;
    const submissions = Prisma.sql`FROM "EstimatorSubmission" s WHERE s."createdAt" >= ${from} AND s."createdAt" < ${to}`;
    const [funnelRows, leadsFromEstimates, projectTypes, platforms, complexity, scale, urgency, features, integrations, values, valueByType, valueByIndustry, valueBySource] = await Promise.all([
      this.prisma.$queryRaw<Row[]>`SELECT "type"::text AS type, "metadata"->>'step' AS step, COUNT(DISTINCT "sessionId")::int AS n FROM "AnalyticsEvent" WHERE "type" IN ('ESTIMATOR_START','ESTIMATOR_STEP_COMPLETE','ESTIMATOR_COMPLETE') AND "createdAt" >= ${from} AND "createdAt" < ${to} GROUP BY 1, 2`,
      this.prisma.analyticsEvent.findMany({ where: { type: 'LEAD_CREATED', estimatorSubmissionId: { not: null }, sessionId: { not: 'server' }, createdAt: { gte: from, lt: to } }, distinct: ['sessionId'], select: { sessionId: true } }).then((rows) => rows.length),
      this.prisma.estimatorSubmission.groupBy({ by: ['projectTypeName'], where: { createdAt: { gte: from, lt: to } }, _count: { _all: true }, orderBy: { _count: { projectTypeName: 'desc' } }, take: 8 }),
      this.prisma.estimatorSubmission.groupBy({ by: ['platform'], where: { createdAt: { gte: from, lt: to } }, _count: { _all: true } }),
      this.prisma.estimatorSubmission.groupBy({ by: ['complexity'], where: { createdAt: { gte: from, lt: to } }, _count: { _all: true }, orderBy: { _count: { complexity: 'desc' } } }),
      this.prisma.estimatorSubmission.groupBy({ by: ['scale'], where: { createdAt: { gte: from, lt: to } }, _count: { _all: true }, orderBy: { _count: { scale: 'desc' } } }),
      this.prisma.estimatorSubmission.groupBy({ by: ['urgency'], where: { createdAt: { gte: from, lt: to } }, _count: { _all: true }, orderBy: { _count: { urgency: 'desc' } } }),
      this.prisma.$queryRaw<Row[]>`SELECT f->>'name' AS name, COUNT(*)::int AS n FROM "EstimatorSubmission" s, jsonb_array_elements(s."breakdown"->'snapshot'->'features') f WHERE s."createdAt" >= ${from} AND s."createdAt" < ${to} AND f->>'id' NOT IN (SELECT "id" FROM "EstimatorFeature" WHERE "required" = true) GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      this.prisma.$queryRaw<Row[]>`SELECT i->>'name' AS name, COUNT(*)::int AS n FROM "EstimatorSubmission" s, jsonb_array_elements(s."breakdown"->'snapshot'->'integrations') i WHERE s."createdAt" >= ${from} AND s."createdAt" < ${to} GROUP BY 1 ORDER BY 2 DESC LIMIT 10`,
      this.prisma.$queryRaw<Row[]>`SELECT s."currency"::text AS currency, COUNT(*)::int AS n, AVG((s."minAmount" + s."maxAmount") / 2.0)::float AS avg, percentile_cont(0.5) WITHIN GROUP (ORDER BY (s."minAmount" + s."maxAmount") / 2.0)::float AS median, SUM((s."minAmount" + s."maxAmount") / 2.0)::float AS total ${submissions} GROUP BY 1`,
      this.prisma.$queryRaw<Row[]>`SELECT s."projectTypeName" AS label, s."currency"::text AS currency, COUNT(*)::int AS n, AVG((s."minAmount" + s."maxAmount") / 2.0)::float AS avg ${submissions} GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 8`,
      this.prisma.$queryRaw<Row[]>`SELECT COALESCE(i."name", s."industrySlug") AS label, s."currency"::text AS currency, COUNT(*)::int AS n, AVG((s."minAmount" + s."maxAmount") / 2.0)::float AS avg FROM "EstimatorSubmission" s LEFT JOIN "Industry" i ON i."slug" = s."industrySlug" WHERE s."createdAt" >= ${from} AND s."createdAt" < ${to} AND s."industrySlug" IS NOT NULL GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 8`,
      this.prisma.$queryRaw<Row[]>`SELECT COALESCE(l."trafficChannel"::text, 'UNATTRIBUTED') AS label, s."currency"::text AS currency, COUNT(*)::int AS n, AVG((s."minAmount" + s."maxAmount") / 2.0)::float AS avg FROM "Lead" l JOIN "EstimatorSubmission" s ON s."id" = l."estimatorSubmissionId" WHERE l."createdAt" >= ${from} AND l."createdAt" < ${to} AND l."archivedAt" IS NULL GROUP BY 1, 2 ORDER BY 3 DESC`,
    ]);

    const funnelMap = new Map(funnelRows.map((r) => [`${r.type}:${r.step ?? ''}`, num(r.n)]));
    const stages = [
      { key: 'started', label: 'Estimator started', count: funnelMap.get('ESTIMATOR_START:') ?? 0 },
      { key: 'features', label: 'Reached feature selection', count: funnelMap.get('ESTIMATOR_STEP_COMPLETE:industry') ?? 0 },
      { key: 'configured', label: 'Configuration completed', count: funnelMap.get('ESTIMATOR_STEP_COMPLETE:integrations') ?? 0 },
      { key: 'generated', label: 'Estimate generated', count: funnelMap.get('ESTIMATOR_COMPLETE:') ?? 0 },
      { key: 'lead', label: 'Lead submitted', count: leadsFromEstimates },
    ];
    const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 10 : null);
    const money = (r: Row) => ({ currency: String(r.currency), count: num(r.n), average: Math.round(num(r.avg)) });

    return {
      range,
      funnel: stages.map((s, i) => ({ ...s, fromPrevious: i === 0 ? null : pct(s.count, stages[i - 1].count), fromStart: i === 0 ? null : pct(s.count, stages[0].count) })),
      completionRate: pct(stages[3].count, stages[0].count),
      leadConversion: pct(stages[4].count, stages[3].count),
      projectTypes: projectTypes.map((r) => ({ label: r.projectTypeName, count: r._count._all })),
      platforms: platforms.map((r) => ({ label: r.platform, count: r._count._all })),
      complexity: complexity.map((r) => ({ label: r.complexity, count: r._count._all })),
      scale: scale.map((r) => ({ label: r.scale, count: r._count._all })),
      urgency: urgency.map((r) => ({ label: r.urgency, count: r._count._all })),
      features: features.map((r) => ({ label: String(r.name), count: num(r.n) })),
      integrations: integrations.map((r) => ({ label: String(r.name), count: num(r.n) })),
      values: values.map((r) => ({ currency: String(r.currency), count: num(r.n), average: Math.round(num(r.avg)), median: Math.round(num(r.median)), total: Math.round(num(r.total)) })),
      valueByType: valueByType.map((r) => ({ label: String(r.label), ...money(r) })),
      valueByIndustry: valueByIndustry.map((r) => ({ label: String(r.label), ...money(r) })),
      valueBySource: valueBySource.map((r) => ({ label: String(r.label), ...money(r) })),
    };
  }

  async sales(range: DateRange) {
    const { from, to } = range;
    const where = { createdAt: { gte: from, lt: to }, archivedAt: null };
    const [byStatus, bySource, byChannel, byCampaign, pipeline, won, lost, followUps, demoLeads, serviceLeads, demoViews, serviceViews, demoNames, serviceNames, estimatorStarts, avgFinal] = await Promise.all([
      this.prisma.lead.groupBy({ by: ['status'], where, _count: { _all: true } }),
      this.prisma.$queryRaw<Row[]>`SELECT "source"::text AS label, COUNT(*)::int AS n, COUNT(*) FILTER (WHERE "status" = 'WON')::int AS won, COUNT(*) FILTER (WHERE "status" = 'LOST')::int AS lost FROM "Lead" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND "archivedAt" IS NULL GROUP BY 1 ORDER BY 2 DESC`,
      this.prisma.$queryRaw<Row[]>`SELECT COALESCE("trafficChannel"::text, 'UNATTRIBUTED') AS label, COUNT(*)::int AS n, COUNT(*) FILTER (WHERE "status" = 'WON')::int AS won FROM "Lead" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND "archivedAt" IS NULL GROUP BY 1 ORDER BY 2 DESC`,
      this.prisma.$queryRaw<Row[]>`SELECT "utmCampaign" AS label, COALESCE("utmSource", '') AS source, COUNT(*)::int AS n, COUNT(*) FILTER (WHERE "status" = 'WON')::int AS won FROM "Lead" WHERE "createdAt" >= ${from} AND "createdAt" < ${to} AND "archivedAt" IS NULL AND "utmCampaign" IS NOT NULL GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 10`,
      this.pipeline(),
      this.won(from, to),
      this.prisma.lead.count({ where: { status: 'LOST', archivedAt: null, lostAt: { gte: from, lt: to } } }),
      this.followUps(),
      this.leadsBy('demoId', from, to),
      this.leadsBy('serviceId', from, to),
      this.topEntities('demoId', 'DEMO_VIEW', from, to, 50),
      this.topEntities('serviceId', 'SERVICE_VIEW', from, to, 50),
      this.prisma.demo.findMany({ select: { id: true, name: true } }),
      this.prisma.service.findMany({ select: { id: true, title: true } }),
      this.clicksByEntity('demoId', from, to),
      this.prisma.$queryRaw<Row[]>`SELECT COALESCE("finalCurrency", "currency")::text AS currency, AVG("finalProjectValue")::float AS avg FROM "Lead" WHERE "status" = 'WON' AND "archivedAt" IS NULL AND "finalProjectValue" IS NOT NULL AND "wonAt" >= ${from} AND "wonAt" < ${to} GROUP BY 1`,
    ]);

    const counts = Object.fromEntries(byStatus.map((s) => [s.status, s._count._all])) as Record<string, number>;
    const total = byStatus.reduce((sum, s) => sum + s._count._all, 0);
    const reached = (...statuses: string[]) => statuses.reduce((sum, s) => sum + (counts[s] ?? 0), 0);
    const pct = (a: number) => (total > 0 ? Math.round((a / total) * 1000) / 10 : null);

    const conversion = (leads: Map<string, number>, views: { id: string; name: string; views: number }[], names: Map<string, string>, starts?: Map<string, { estimates: number }>) => {
      const viewMap = new Map(views.map((v) => [v.id, v.views]));
      const ids = new Set([...leads.keys(), ...viewMap.keys()]);
      return [...ids]
        .map((id) => ({
          id,
          name: names.get(id) ?? views.find((v) => v.id === id)?.name ?? 'Deleted',
          views: viewMap.get(id) ?? 0,
          leads: leads.get(id) ?? 0,
          estimateClicks: starts?.get(id)?.estimates ?? 0,
          leadRate: (viewMap.get(id) ?? 0) > 0 ? Math.round(((leads.get(id) ?? 0) / (viewMap.get(id) ?? 1)) * 1000) / 10 : null,
        }))
        .sort((a, b) => b.leads - a.leads || b.views - a.views)
        .slice(0, 10);
    };

    return {
      range,
      totalLeads: total,
      stages: ['NEW', 'CONTACTED', 'QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'].map((status) => ({ status, count: counts[status] ?? 0 })),
      rates: {
        qualified: pct(reached('QUALIFIED', 'MEETING', 'PROPOSAL', 'NEGOTIATION', 'WON')),
        proposal: pct(reached('PROPOSAL', 'NEGOTIATION', 'WON')),
        won: pct(reached('WON')),
      },
      won,
      lost,
      averageDeal: avgFinal.map((r) => ({ currency: String(r.currency), average: Math.round(num(r.avg)) })),
      pipeline,
      followUps,
      bySource: bySource.map((r) => ({ label: String(r.label), leads: num(r.n), won: num(r.won), lost: num(r.lost) })),
      byChannel: byChannel.map((r) => ({ label: String(r.label), leads: num(r.n), won: num(r.won) })),
      byCampaign: byCampaign.map((r) => ({ label: String(r.label), source: String(r.source), leads: num(r.n), won: num(r.won) })),
      demos: conversion(demoLeads, demoViews, new Map(demoNames.map((d) => [d.id, d.name])), estimatorStarts),
      services: conversion(serviceLeads, serviceViews, new Map(serviceNames.map((s) => [s.id, s.title]))),
    };
  }
}
