/**
 * Dummy data for the property portfolio: buildings, units, tenants, maintenance tickets, rent payments, visitors, staff tasks and analytics.
 * Everything is invented and nothing is fetched or stored. One shared source keeps the dashboard, manager app, resident app and landing
 * page consistent.
 */

export type PropertyType = 'Apartments' | 'Residential' | 'Commercial';
export type UnitStatus = 'Occupied' | 'Vacant' | 'Notice given';
export type RequestPriority = 'Urgent' | 'High' | 'Normal' | 'Low';
export type RequestStatus = 'Open' | 'In progress' | 'Resolved';
export type RentStatus = 'Paid' | 'Pending' | 'Overdue';
export type VisitorStatus = 'Expected' | 'Checked in' | 'Left';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  address: string;
  units: number;
  occupied: number;
  floors: number;
  built: number;
  manager: string;
  tone: string;
}

export const PROPERTIES: Property[] = [
  { id: 'pr1', name: 'Harbor View Residences', type: 'Apartments', address: '14 Marina Way, Riverside', units: 72, occupied: 68, floors: 9, built: 2014, manager: 'Priya Shah', tone: 'bg-[#e2e8f0]' },
  { id: 'pr2', name: 'Maple Court', type: 'Residential', address: '32 Maple Street, Hillcrest', units: 36, occupied: 33, floors: 3, built: 2009, manager: 'Leon Park', tone: 'bg-[#d1fae5]' },
  { id: 'pr3', name: 'Lumen Tower', type: 'Commercial', address: '8 Central Plaza, Downtown', units: 24, occupied: 19, floors: 12, built: 2018, manager: 'Priya Shah', tone: 'bg-[#fef3c7]' },
  { id: 'pr4', name: 'Oakline Gardens', type: 'Residential', address: '200 Oak Avenue, Lakeview', units: 48, occupied: 45, floors: 4, built: 2021, manager: 'Ana Ruiz', tone: 'bg-[#f1f5f9]' },
];

export interface Unit {
  id: string;
  property: string;
  number: string;
  bedrooms: number;
  sqft: number;
  rent: number;
  status: UnitStatus;
  tenant?: string;
}

export const UNITS: Unit[] = [
  { id: 'u1', property: 'Harbor View Residences', number: '4B', bedrooms: 2, sqft: 980, rent: 2350, status: 'Occupied', tenant: 'Hannah Lindqvist' },
  { id: 'u2', property: 'Harbor View Residences', number: '7A', bedrooms: 1, sqft: 640, rent: 1780, status: 'Vacant' },
  { id: 'u3', property: 'Maple Court', number: '2C', bedrooms: 3, sqft: 1220, rent: 2890, status: 'Notice given', tenant: 'Marcus Reed' },
  { id: 'u4', property: 'Oakline Gardens', number: '1D', bedrooms: 2, sqft: 905, rent: 2140, status: 'Occupied', tenant: 'Sofia Alvarez' },
  { id: 'u5', property: 'Lumen Tower', number: 'Suite 1204', bedrooms: 0, sqft: 1560, rent: 5400, status: 'Vacant' },
  { id: 'u6', property: 'Maple Court', number: '1A', bedrooms: 2, sqft: 880, rent: 2010, status: 'Occupied', tenant: 'Daniel Osei' },
];

export interface Tenant {
  id: string;
  name: string;
  unit: string;
  property: string;
  leaseEnd: string;
  rent: number;
  balance: number;
  status: RentStatus;
  phone: string;
  email: string;
}

export const TENANTS: Tenant[] = [
  { id: 't1', name: 'Hannah Lindqvist', unit: '4B', property: 'Harbor View Residences', leaseEnd: '31 Mar 2027', rent: 2350, balance: 0, status: 'Paid', phone: '+1 555 0142', email: 'hannah.l@mail.example' },
  { id: 't2', name: 'Marcus Reed', unit: '2C', property: 'Maple Court', leaseEnd: '30 Sep 2026', rent: 2890, balance: 2890, status: 'Overdue', phone: '+1 555 0177', email: 'marcus.r@mail.example' },
  { id: 't3', name: 'Sofia Alvarez', unit: '1D', property: 'Oakline Gardens', leaseEnd: '15 Jan 2027', rent: 2140, balance: 0, status: 'Paid', phone: '+1 555 0193', email: 'sofia.a@mail.example' },
  { id: 't4', name: 'Daniel Osei', unit: '1A', property: 'Maple Court', leaseEnd: '28 Feb 2027', rent: 2010, balance: 2010, status: 'Pending', phone: '+1 555 0108', email: 'daniel.o@mail.example' },
  { id: 't5', name: 'Priya Nair', unit: '9F', property: 'Harbor View Residences', leaseEnd: '31 Aug 2027', rent: 2480, balance: 0, status: 'Paid', phone: '+1 555 0156', email: 'priya.n@mail.example' },
];

export interface MaintenanceRequest {
  id: string;
  unit: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Common area';
  priority: RequestPriority;
  status: RequestStatus;
  created: string;
  assignee: string;
}

export const MAINTENANCE: MaintenanceRequest[] = [
  { id: 'MR-2208', unit: '4B', title: 'Kitchen tap is leaking', category: 'Plumbing', priority: 'High', status: 'In progress', created: '4 Oct', assignee: 'Tomas Berg' },
  { id: 'MR-2206', unit: 'Lobby', title: 'Entrance light flickering', category: 'Electrical', priority: 'Normal', status: 'Open', created: '3 Oct', assignee: 'Unassigned' },
  { id: 'MR-2203', unit: '2C', title: 'No hot water in bathroom', category: 'HVAC', priority: 'Urgent', status: 'In progress', created: '5 Oct', assignee: 'Tomas Berg' },
  { id: 'MR-2199', unit: '1A', title: 'Dishwasher not draining', category: 'Appliance', priority: 'Low', status: 'Open', created: '2 Oct', assignee: 'Unassigned' },
  { id: 'MR-2190', unit: 'Rooftop', title: 'Gutter cleaning before winter', category: 'Common area', priority: 'Normal', status: 'Resolved', created: '28 Sep', assignee: 'Crew B' },
];

export interface RentPayment {
  id: string;
  tenant: string;
  unit: string;
  amount: number;
  method: 'Card' | 'Bank transfer' | 'Direct debit';
  date: string;
  status: RentStatus;
}

export const PAYMENTS: RentPayment[] = [
  { id: 'P-9120', tenant: 'Hannah Lindqvist', unit: '4B', amount: 2350, method: 'Direct debit', date: '1 Oct', status: 'Paid' },
  { id: 'P-9118', tenant: 'Sofia Alvarez', unit: '1D', amount: 2140, method: 'Card', date: '1 Oct', status: 'Paid' },
  { id: 'P-9115', tenant: 'Daniel Osei', unit: '1A', amount: 2010, method: 'Bank transfer', date: '5 Oct', status: 'Pending' },
  { id: 'P-9110', tenant: 'Marcus Reed', unit: '2C', amount: 2890, method: 'Bank transfer', date: 'Due 1 Oct', status: 'Overdue' },
  { id: 'P-9107', tenant: 'Priya Nair', unit: '9F', amount: 2480, method: 'Card', date: '1 Oct', status: 'Paid' },
];

export interface Visitor {
  id: string;
  name: string;
  host: string;
  unit: string;
  time: string;
  purpose: string;
  status: VisitorStatus;
}

export const VISITORS: Visitor[] = [
  { id: 'v1', name: 'Jordan Blake', host: 'Hannah Lindqvist', unit: '4B', time: '10:30', purpose: 'Delivery', status: 'Checked in' },
  { id: 'v2', name: 'Electrical contractor', host: 'Building operations', unit: 'Lobby', time: '11:00', purpose: 'Maintenance', status: 'Expected' },
  { id: 'v3', name: 'Mei Tan', host: 'Daniel Osei', unit: '1A', time: '09:15', purpose: 'Family visit', status: 'Left' },
  { id: 'v4', name: 'Removal crew', host: 'Priya Nair', unit: '9F', time: '14:00', purpose: 'Moving in', status: 'Expected' },
];

export interface StaffTask {
  id: string;
  task: string;
  property: string;
  assignee: string;
  due: string;
  done: boolean;
}

export const STAFF_TASKS: StaffTask[] = [
  { id: 'T1', task: 'Inspect fire exits on floors 1–4', property: 'Harbor View Residences', assignee: 'Tomas Berg', due: 'Today', done: false },
  { id: 'T2', task: 'Replace lobby light tubes', property: 'Lumen Tower', assignee: 'Crew B', due: 'Tomorrow', done: false },
  { id: 'T3', task: 'Pool filter service', property: 'Oakline Gardens', assignee: 'Ana Ruiz', due: 'Today', done: true },
  { id: 'T4', task: 'Check smoke alarm batteries', property: 'Maple Court', assignee: 'Leon Park', due: 'Fri', done: false },
];

export const ANNOUNCEMENTS = [
  { id: 'a1', title: 'Water shut-off on Thursday, 9:00–12:00', body: 'Maple Court will have planned maintenance on the main supply.', date: 'Today' },
  { id: 'a2', title: 'Winter parking permits open', body: 'Renew your permit in the resident app before 31 October.', date: '2 Oct' },
];

export const DASHBOARD_STATS = { properties: 12, occupiedUnits: 318, totalUnits: 344, monthlyRevenue: 286400, pendingRequests: 17, activeTenants: 402 };

export const REVENUE_MONTHS = [
  { label: 'May', value: 248 },
  { label: 'Jun', value: 259 },
  { label: 'Jul', value: 266 },
  { label: 'Aug', value: 271 },
  { label: 'Sep', value: 279 },
  { label: 'Oct', value: 286 },
];

export const OCCUPANCY_MONTHS = [
  { label: 'May', value: 88 },
  { label: 'Jun', value: 89 },
  { label: 'Jul', value: 91 },
  { label: 'Aug', value: 90 },
  { label: 'Sep', value: 92 },
  { label: 'Oct', value: 92 },
];

export const UNIT_MIX = [
  { label: 'Occupied', value: 92, tone: 'emerald' as const },
  { label: 'Notice given', value: 4, tone: 'amber' as const },
  { label: 'Vacant', value: 4, tone: 'slate' as const },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Urgent: no hot water in Maple Court 2C', date: 'Just now' },
  { id: 'n2', title: 'Marcus Reed’s rent is 3 days overdue', date: '20 min ago' },
  { id: 'n3', title: 'Visitor Jordan Blake checked in at Harbor View', date: '1 h ago' },
];

export const TRACK = [
  { label: 'Request received', note: 'Mon 5 Oct, 08:10', done: true },
  { label: 'Assigned to Tomas Berg', note: 'Mon 5 Oct, 08:40', done: true },
  { label: 'Repair in progress', note: 'Expected today', done: false },
  { label: 'Resolved and confirmed', note: 'Awaiting resident sign-off', done: false },
];
