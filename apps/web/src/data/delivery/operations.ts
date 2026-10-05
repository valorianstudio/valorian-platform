/**
 * Dummy data for the delivery platform: orders, riders, customers, routes, payments and analytics. Everything is invented and nothing
 * is fetched or stored. One shared source keeps the dispatch dashboard, the rider app, the customer app and the landing page consistent.
 */

export type OrderStatus = 'Placed' | 'Picked up' | 'On the way' | 'Delivered' | 'Failed';
export type OrderKind = 'Food' | 'Parcel' | 'Business';
export type RiderStatus = 'Available' | 'On delivery' | 'On break' | 'Offline';

/** Map positions are percentages of the map frame, so the same data draws on every screen size. */
export interface Point {
  x: number;
  y: number;
  label: string;
}

export interface Order {
  id: string;
  customer: string;
  kind: OrderKind;
  pickup: string;
  drop: string;
  status: OrderStatus;
  rider: string;
  eta: number;
  distance: number;
  fee: number;
  placed: string;
  progress: number;
  from: Point;
  to: Point;
  paid: boolean;
}

export const ORDERS: Order[] = [
  { id: 'D-5501', customer: 'Hannah Lindqvist', kind: 'Food', pickup: 'Ember & Oak', drop: '14 Harbour St', status: 'On the way', rider: 'Jordan Blake', eta: 9, distance: 3.2, fee: 6.5, placed: '12:04', progress: 64, from: { x: 28, y: 62, label: 'Ember & Oak' }, to: { x: 74, y: 30, label: 'Drop-off' }, paid: true },
  { id: 'D-5502', customer: 'Marcus Reed', kind: 'Parcel', pickup: 'Post Hub North', drop: '8 Mill Rd', status: 'Picked up', rider: 'Priya Shah', eta: 16, distance: 6.8, fee: 9.9, placed: '12:11', progress: 30, from: { x: 18, y: 22, label: 'Post Hub North' }, to: { x: 58, y: 68, label: 'Drop-off' }, paid: true },
  { id: 'D-5503', customer: 'Northwind Logistics', kind: 'Business', pickup: 'Warehouse 4', drop: 'Harbour Office Park', status: 'Placed', rider: 'Unassigned', eta: 24, distance: 11.4, fee: 24, placed: '12:19', progress: 0, from: { x: 40, y: 80, label: 'Warehouse 4' }, to: { x: 82, y: 46, label: 'Drop-off' }, paid: false },
  { id: 'D-5504', customer: 'Sofia Alvarez', kind: 'Food', pickup: 'Sushi Kaze', drop: '3 Quay Lane', status: 'Delivered', rider: 'Marco Rossi', eta: 0, distance: 2.1, fee: 5.2, placed: '11:40', progress: 100, from: { x: 30, y: 40, label: 'Sushi Kaze' }, to: { x: 46, y: 58, label: 'Delivered' }, paid: true },
  { id: 'D-5505', customer: 'Daniel Osei', kind: 'Parcel', pickup: 'Studio Print Co.', drop: '22 Orchard Way', status: 'On the way', rider: 'Aisha Bello', eta: 12, distance: 5.0, fee: 8.4, placed: '12:08', progress: 52, from: { x: 64, y: 18, label: 'Studio Print Co.' }, to: { x: 22, y: 74, label: 'Drop-off' }, paid: true },
  { id: 'D-5506', customer: 'Layla Hassan', kind: 'Food', pickup: 'Green Bowl', drop: '61 Market Sq', status: 'Failed', rider: 'Tomas Novak', eta: 0, distance: 1.7, fee: 4.8, placed: '11:22', progress: 40, from: { x: 56, y: 56, label: 'Green Bowl' }, to: { x: 36, y: 34, label: 'Failed' }, paid: false },
];

export interface Rider {
  id: string;
  name: string;
  vehicle: 'Bike' | 'E-bike' | 'Cargo bike';
  status: RiderStatus;
  deliveries: number;
  rating: number;
  onTime: number;
  zone: string;
  earnings: number;
}

export const RIDERS: Rider[] = [
  { id: 'R1', name: 'Jordan Blake', vehicle: 'E-bike', status: 'On delivery', deliveries: 1284, rating: 4.9, onTime: 97, zone: 'Old Town', earnings: 842 },
  { id: 'R2', name: 'Priya Shah', vehicle: 'Bike', status: 'On delivery', deliveries: 960, rating: 4.8, onTime: 95, zone: 'North', earnings: 611 },
  { id: 'R3', name: 'Marco Rossi', vehicle: 'Cargo bike', status: 'Available', deliveries: 742, rating: 4.7, onTime: 93, zone: 'Harbour', earnings: 527 },
  { id: 'R4', name: 'Aisha Bello', vehicle: 'E-bike', status: 'Available', deliveries: 612, rating: 4.8, onTime: 96, zone: 'Old Town', earnings: 468 },
  { id: 'R5', name: 'Tomas Novak', vehicle: 'Bike', status: 'On break', deliveries: 388, rating: 4.6, onTime: 91, zone: 'Quay', earnings: 290 },
  { id: 'R6', name: 'Lena Fischer', vehicle: 'Bike', status: 'Offline', deliveries: 221, rating: 4.7, onTime: 94, zone: 'North', earnings: 0 },
];

export const CUSTOMERS = [
  { id: 'c1', name: 'Hannah Lindqvist', orders: 48, spend: 1640, tier: 'Plus', last: '12:04' },
  { id: 'c2', name: 'Marcus Reed', orders: 22, spend: 980, tier: 'Standard', last: '12:11' },
  { id: 'c3', name: 'Northwind Logistics', orders: 130, spend: 9420, tier: 'Business', last: '12:19' },
  { id: 'c4', name: 'Sofia Alvarez', orders: 9, spend: 214, tier: 'Standard', last: '11:40' },
  { id: 'c5', name: 'Daniel Osei', orders: 5, spend: 96, tier: 'New', last: '12:08' },
];

export interface Route {
  id: string;
  name: string;
  rider: string;
  stops: number;
  km: number;
  minutes: number;
  done: number;
}

export const ROUTES: Route[] = [
  { id: 'rt1', name: 'Old Town loop', rider: 'Jordan Blake', stops: 6, km: 14.2, minutes: 52, done: 4 },
  { id: 'rt2', name: 'North parcels', rider: 'Priya Shah', stops: 5, km: 18.6, minutes: 66, done: 2 },
  { id: 'rt3', name: 'Harbour business run', rider: 'Marco Rossi', stops: 3, km: 9.4, minutes: 35, done: 0 },
];

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Refunded';
  method: 'Card' | 'Wallet' | 'Invoice';
}

export const TRANSACTIONS: Transaction[] = [
  { id: 'T-9001', label: 'Food delivery D-5501', amount: 6.5, date: '5 Oct 12:04', status: 'Paid', method: 'Wallet' },
  { id: 'T-9002', label: 'Parcel delivery D-5502', amount: 9.9, date: '5 Oct 12:11', status: 'Paid', method: 'Card' },
  { id: 'T-9003', label: 'Business invoice INV-204', amount: 412, date: '5 Oct 09:30', status: 'Pending', method: 'Invoice' },
  { id: 'T-9004', label: 'Refund D-5506 (failed)', amount: 4.8, date: '5 Oct 11:30', status: 'Refunded', method: 'Card' },
];

export const DASHBOARD_STATS = { active: 38, total: 1642, riders: 14, revenue: 28640, success: 96.4 };

export const DELIVERIES_HOUR = [
  { label: '10', value: 42 },
  { label: '11', value: 58 },
  { label: '12', value: 81 },
  { label: '13', value: 64 },
  { label: '14', value: 47 },
  { label: '17', value: 72 },
  { label: '18', value: 96 },
  { label: '19', value: 88 },
];

export const SUCCESS_WEEK = [
  { label: 'Mon', value: 95 },
  { label: 'Tue', value: 96 },
  { label: 'Wed', value: 94 },
  { label: 'Thu', value: 97 },
  { label: 'Fri', value: 96 },
  { label: 'Sat', value: 98 },
  { label: 'Sun', value: 97 },
];

export const REVENUE_MONTHS = [
  { label: 'May', value: 18 },
  { label: 'Jun', value: 20 },
  { label: 'Jul', value: 22 },
  { label: 'Aug', value: 24 },
  { label: 'Sep', value: 26 },
  { label: 'Oct', value: 28.6 },
];

export const KIND_MIX = [
  { label: 'Food', value: 52, tone: 'blue' as const },
  { label: 'Parcel', value: 33, tone: 'emerald' as const },
  { label: 'Business', value: 15, tone: 'amber' as const },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'D-5506 failed: customer unreachable', date: 'Just now' },
  { id: 'n2', title: 'Business order D-5503 is waiting for a rider', date: '3 min ago' },
  { id: 'n3', title: 'Lena Fischer started a break', date: '20 min ago' },
];

/** Mobile: the customer's tracked delivery and booking options. */
export const TRACK_STEPS = [
  { label: 'Order placed', note: '12:04', done: true },
  { label: 'Picked up', note: '12:09', done: true },
  { label: 'On the way', note: 'ETA 9 min', done: true },
  { label: 'Delivered', note: 'Expected 12:21', done: false },
];

export const ADDRESSES = ['14 Harbour St', '8 Mill Rd', '22 Orchard Way', 'Office, Harbour Park'] as const;
export const SERVICES = [
  { id: 'food', label: 'Food', eta: '20–30 min', price: 6.5 },
  { id: 'parcel', label: 'Parcel', eta: '45–60 min', price: 9.9 },
  { id: 'express', label: 'Express', eta: '15–20 min', price: 14.5 },
] as const;
