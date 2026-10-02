export interface Range {
  key: string;
  from: string;
  to: string;
  prevFrom: string;
  prevTo: string;
}

export interface MoneyTotal {
  currency: string | null;
  total: number;
}

export interface Core {
  visitors: number;
  pageViews: number;
  leads: number;
  estimatorStarts: number;
  estimatorCompletions: number;
}

export interface FollowUps {
  overdue: number;
  dueToday: number;
  thisWeek: number;
  withoutFollowUp: number;
  idle: number;
  idleDays: number;
}

export interface Pipeline {
  total: MoneyTotal[];
  stages: { status: string; count: number; totals: MoneyTotal[] }[];
}

export interface WonSummary {
  count: number;
  values: { currency: string; total: number; average: number; deals: number }[];
}

export interface OverviewData {
  range: Range;
  current: Core;
  previous: Core;
  series: { date: string; pageViews: number; visitors: number }[];
  pipeline: Pipeline;
  won: WonSummary;
  followUps: FollowUps;
}

export interface EntityRow {
  id: string;
  name: string;
  views: number;
  sessions: number;
  clicks?: number;
  estimates?: number;
  website?: number;
  mobile?: number;
  leads?: number;
}

export interface ContentData {
  range: Range;
  pages: { path: string; views: number; sessions: number }[];
  demos: EntityRow[];
  services: EntityRow[];
  solutions: EntityRow[];
  caseStudies: EntityRow[];
  articles: EntityRow[];
  platformInterest: { website: number; mobile: number };
}

export interface AcquisitionData {
  range: Range;
  totalSessions: number;
  channels: { channel: string; sessions: number; leads: number }[];
  unattributedLeads: number;
  sources: { source: string; channel: string; sessions: number }[];
  campaigns: { campaign: string; source: string; medium: string; sessions: number }[];
  referrers: { host: string; sessions: number }[];
}

interface Counted {
  label: string;
  count: number;
}
interface Valued {
  label: string;
  currency: string;
  count: number;
  average: number;
}

export interface EstimatorData {
  range: Range;
  funnel: { key: string; label: string; count: number; fromPrevious: number | null; fromStart: number | null }[];
  completionRate: number | null;
  leadConversion: number | null;
  projectTypes: Counted[];
  platforms: Counted[];
  complexity: Counted[];
  scale: Counted[];
  urgency: Counted[];
  features: Counted[];
  integrations: Counted[];
  values: { currency: string; count: number; average: number; median: number; total: number }[];
  valueByType: Valued[];
  valueByIndustry: Valued[];
  valueBySource: Valued[];
}

export interface SalesData {
  range: Range;
  totalLeads: number;
  stages: { status: string; count: number }[];
  rates: { qualified: number | null; proposal: number | null; won: number | null };
  won: WonSummary;
  lost: number;
  averageDeal: { currency: string; average: number }[];
  pipeline: Pipeline;
  followUps: FollowUps;
  bySource: { label: string; leads: number; won: number; lost: number }[];
  byChannel: { label: string; leads: number; won: number }[];
  byCampaign: { label: string; source: string; leads: number; won: number }[];
  demos: { id: string; name: string; views: number; leads: number; estimateClicks: number; leadRate: number | null }[];
  services: { id: string; name: string; views: number; leads: number; estimateClicks: number; leadRate: number | null }[];
}

export interface SummaryData {
  newLeads: number;
  pipeline: MoneyTotal[];
  won: { currency: string; total: number }[];
  wonCount: number;
  estimatorCompletions: number;
  overdue: number;
  topDemo: { id: string; name: string; views: number } | null;
}
