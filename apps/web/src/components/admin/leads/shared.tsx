import { Badge } from '@/components/ui/badge';
import type { LeadPriority, LeadStatus } from '@/lib/types';

export interface LeadRow {
  id: string;
  referenceCode: string;
  name: string;
  companyName: string | null;
  email: string;
  source: string;
  projectType: string | null;
  platform: string | null;
  estimatedMin: number | null;
  estimatedMax: number | null;
  currency: 'BDT' | 'USD' | null;
  finalProjectValue: number | null;
  finalCurrency: 'BDT' | 'USD' | null;
  status: LeadStatus;
  priority: LeadPriority;
  followUpAt: string | null;
  createdAt: string;
  archivedAt: string | null;
  demo: { name: string } | null;
  service: { title: string } | null;
}

export interface LeadStats {
  byStatus: Record<string, number>;
  total: number;
  activeCount: number;
  followUps: { overdue: number; today: number; upcoming: number };
  wonValue: { currency: 'BDT' | 'USD' | null; total: number }[];
  recent: LeadRow[];
  upcomingFollowUps: LeadRow[];
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  MEETING: 'Meeting',
  PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation',
  WON: 'Won',
  LOST: 'Lost',
};
const STATUS_TONE: Record<LeadStatus, 'neutral' | 'primary' | 'accent' | 'danger'> = {
  NEW: 'primary',
  CONTACTED: 'neutral',
  QUALIFIED: 'primary',
  MEETING: 'primary',
  PROPOSAL: 'primary',
  NEGOTIATION: 'primary',
  WON: 'accent',
  LOST: 'danger',
};
const PRIORITY_TONE: Record<LeadPriority, 'neutral' | 'primary' | 'accent' | 'danger'> = { LOW: 'neutral', NORMAL: 'neutral', HIGH: 'primary', URGENT: 'danger' };

export const SOURCE_LABEL: Record<string, string> = {
  ESTIMATOR: 'Estimator',
  DEMO: 'Demo page',
  SERVICE: 'Service page',
  CONTACT: 'Contact form',
  HOMEPAGE: 'Homepage',
  DIRECT: 'Direct',
  OTHER: 'Other',
};
export const CONTACT_LABEL: Record<string, string> = { EMAIL: 'Email', WHATSAPP: 'WhatsApp', PHONE: 'Phone', VIDEO_CALL: 'Video call' };
export const PLATFORM_LABEL: Record<string, string> = { WEBSITE: 'Website', MOBILE: 'Mobile App', BOTH: 'Website + Mobile' };

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  return <Badge tone={PRIORITY_TONE[priority]}>{priority.charAt(0) + priority.slice(1).toLowerCase()}</Badge>;
}

const SYMBOL = { BDT: '৳', USD: '$' } as const;
export function money(amount: number, currency: 'BDT' | 'USD' | null): string {
  return `${currency ? SYMBOL[currency] : ''}${amount.toLocaleString('en-US')}`;
}

export function estimateText(lead: Pick<LeadRow, 'estimatedMin' | 'estimatedMax' | 'currency'>): string {
  return lead.estimatedMin === null || lead.estimatedMax === null ? '—' : `${money(lead.estimatedMin, lead.currency)} – ${money(lead.estimatedMax, lead.currency)}`;
}

const dateFmt = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
const dateTimeFmt = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });
export const formatDate = (value: string | null) => (value ? dateFmt.format(new Date(value)) : '—');
export const formatDateTime = (value: string) => dateTimeFmt.format(new Date(value));
