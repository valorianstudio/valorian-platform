/** Types, labels and formatters shared by the client portal and the admin project screens. */

export type ProjectStatus = 'DISCOVERY' | 'DESIGN' | 'DEVELOPMENT' | 'TESTING' | 'REVIEW' | 'DEPLOYMENT' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
export type MilestoneStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
export type FileCategory = 'REQUIREMENT' | 'DESIGN' | 'DOCUMENT' | 'DELIVERABLE' | 'OTHER';
export type RequestType = 'QUESTION' | 'CHANGE_REQUEST' | 'BUG_REPORT' | 'MAINTENANCE';
export type RequestStatus = 'OPEN' | 'REVIEWING' | 'RESOLVED' | 'CLOSED';
export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export const PROJECT_STATUSES: ProjectStatus[] = ['DISCOVERY', 'DESIGN', 'DEVELOPMENT', 'TESTING', 'REVIEW', 'DEPLOYMENT', 'COMPLETED', 'ON_HOLD', 'CANCELLED'];
export const MILESTONE_STATUSES: MilestoneStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED'];
export const FILE_CATEGORIES: FileCategory[] = ['REQUIREMENT', 'DESIGN', 'DOCUMENT', 'DELIVERABLE', 'OTHER'];
export const REQUEST_TYPES: RequestType[] = ['QUESTION', 'CHANGE_REQUEST', 'BUG_REPORT', 'MAINTENANCE'];
export const REQUEST_STATUSES: RequestStatus[] = ['OPEN', 'REVIEWING', 'RESOLVED', 'CLOSED'];

const human = (value: string) => value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, ' ');
export const label = human;

export const REQUEST_TYPE_LABEL: Record<RequestType, string> = { QUESTION: 'Question', CHANGE_REQUEST: 'Change request', BUG_REPORT: 'Bug report', MAINTENANCE: 'Maintenance request' };

export type Tone = 'neutral' | 'primary' | 'accent' | 'danger';
export const statusTone = (status: ProjectStatus): Tone => (status === 'COMPLETED' ? 'accent' : status === 'ON_HOLD' || status === 'CANCELLED' ? 'danger' : 'primary');
export const milestoneTone = (status: MilestoneStatus): Tone => (status === 'COMPLETED' ? 'accent' : status === 'DELAYED' ? 'danger' : status === 'IN_PROGRESS' ? 'primary' : 'neutral');

export interface PortalProject {
  id: string;
  projectCode: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  estimatedEndDate: string | null;
  actualEndDate: string | null;
  progressPercentage: number;
  technologies: string[];
}

export interface PortalMilestone {
  id: string;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  dueDate: string | null;
  completedDate: string | null;
  order: number;
}

export interface PortalFile {
  id: string;
  name: string;
  fileType: string;
  size: number;
  category: FileCategory;
  createdAt: string;
}

export interface PortalMessage {
  id: string;
  senderType: 'CLIENT' | 'TEAM';
  senderName: string;
  message: string;
  createdAt: string;
  visibleToClient?: boolean;
}

export interface PortalRequest {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  priority: Priority;
  status: RequestStatus;
  createdAt: string;
}

export interface ClientSession {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'OWNER' | 'MEMBER';
  organizationId: string;
  companyName: string;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  company: { companyName: string; industry: string | null; website: string | null; contactEmail: string; contactPhone: string | null; logo: string | null } | null;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value));
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** yyyy-mm-dd for <input type="date"> values. */
export const dateInput = (value: string | null | undefined): string => (value ? value.slice(0, 10) : '');
