/**
 * Dummy data for the pharmacy: medicines, batches, prescriptions, orders, customers, suppliers and sales. Everything is invented and
 * nothing is fetched or stored. One shared source keeps the dashboard, staff app, customer app and landing page consistent.
 */

export type MedicineCategory = 'Prescription' | 'Healthcare' | 'Personal care' | 'Supplements';
export type MedicineForm = 'Tablet' | 'Capsule' | 'Syrup' | 'Cream' | 'Inhaler' | 'Sachet';
export type PrescriptionStatus = 'Pending' | 'Verified' | 'Dispensed';
export type OrderStatus = 'Placed' | 'Packed' | 'Out for delivery' | 'Delivered';

export interface Medicine {
  id: string;
  name: string;
  generic: string;
  category: MedicineCategory;
  form: MedicineForm;
  strength: string;
  price: number;
  stock: number;
  reorderAt: number;
  batch: string;
  expiry: string;
  rx: boolean;
  supplier: string;
  tag?: string;
}

export const MEDICINES: Medicine[] = [
  { id: 'm1', name: 'Amoxil 500', generic: 'Amoxicillin', category: 'Prescription', form: 'Capsule', strength: '500 mg · 21 caps', price: 14.5, stock: 240, reorderAt: 80, batch: 'AM-2291', expiry: 'Mar 2027', rx: true, supplier: 'Meridian Pharma', tag: 'Best seller' },
  { id: 'm2', name: 'Lisinopril Plus', generic: 'Lisinopril', category: 'Prescription', form: 'Tablet', strength: '10 mg · 30 tabs', price: 11.2, stock: 6, reorderAt: 30, batch: 'LS-7710', expiry: 'Nov 2026', rx: true, supplier: 'Meridian Pharma' },
  { id: 'm3', name: 'Ventolin Inhaler', generic: 'Salbutamol', category: 'Prescription', form: 'Inhaler', strength: '100 mcg · 200 doses', price: 18.9, stock: 58, reorderAt: 25, batch: 'VN-4012', expiry: 'Jun 2027', rx: true, supplier: 'Northline Health' },
  { id: 'm4', name: 'Paracetamol Forte', generic: 'Paracetamol', category: 'Healthcare', form: 'Tablet', strength: '500 mg · 16 tabs', price: 3.4, stock: 410, reorderAt: 120, batch: 'PC-1186', expiry: 'Aug 2027', rx: false, supplier: 'Northline Health', tag: 'Everyday' },
  { id: 'm5', name: 'Cetirizine Relief', generic: 'Cetirizine', category: 'Healthcare', form: 'Tablet', strength: '10 mg · 14 tabs', price: 4.8, stock: 9, reorderAt: 40, batch: 'CT-0934', expiry: 'Dec 2026', rx: false, supplier: 'Harbour Supply' },
  { id: 'm6', name: 'Derma Soothe Cream', generic: 'Hydrocortisone', category: 'Personal care', form: 'Cream', strength: '1% · 30 g', price: 9.6, stock: 73, reorderAt: 20, batch: 'DS-5520', expiry: 'Feb 2028', rx: false, supplier: 'Bloom Care' },
  { id: 'm7', name: 'Vitamin D3 Daily', generic: 'Cholecalciferol', category: 'Supplements', form: 'Capsule', strength: '2000 IU · 90 caps', price: 16.0, stock: 132, reorderAt: 40, batch: 'VD-3340', expiry: 'Oct 2027', rx: false, supplier: 'Bloom Care', tag: 'New' },
  { id: 'm8', name: 'Omega Heart Plus', generic: 'Fish oil', category: 'Supplements', form: 'Capsule', strength: '1000 mg · 60 caps', price: 21.5, stock: 44, reorderAt: 30, batch: 'OM-8801', expiry: 'Jan 2027', rx: false, supplier: 'Harbour Supply' },
  { id: 'm9', name: 'Children’s Syrup', generic: 'Ibuprofen', category: 'Healthcare', form: 'Syrup', strength: '100 mg/5 ml · 100 ml', price: 6.7, stock: 3, reorderAt: 25, batch: 'CS-2046', expiry: 'Oct 2026', rx: false, supplier: 'Northline Health' },
  { id: 'm10', name: 'Sensitive Care Wipes', generic: 'Personal hygiene', category: 'Personal care', form: 'Sachet', strength: 'Pack of 40', price: 5.2, stock: 188, reorderAt: 60, batch: 'SW-6612', expiry: 'Sep 2028', rx: false, supplier: 'Bloom Care' },
];

export interface Prescription {
  id: string;
  patient: string;
  age: number;
  doctor: string;
  clinic: string;
  date: string;
  items: string[];
  status: PrescriptionStatus;
  refillsLeft: number;
}

export const PRESCRIPTIONS: Prescription[] = [
  { id: 'RX-4411', patient: 'Hannah Lindqvist', age: 34, doctor: 'Dr. Ines Costa', clinic: 'Riverside Clinic', date: '5 Oct', items: ['Amoxil 500 · 1 × 21 caps'], status: 'Pending', refillsLeft: 0 },
  { id: 'RX-4409', patient: 'Marcus Reed', age: 58, doctor: 'Dr. Adrian Holt', clinic: 'Hillcrest Medical', date: '5 Oct', items: ['Lisinopril Plus 10 mg · 1 × 30 tabs', 'Omega Heart Plus · 1 × 60 caps'], status: 'Verified', refillsLeft: 3 },
  { id: 'RX-4402', patient: 'Sofia Alvarez', age: 41, doctor: 'Dr. Mei Tan', clinic: 'Lakeview Family Care', date: '4 Oct', items: ['Ventolin Inhaler · 1 unit'], status: 'Dispensed', refillsLeft: 2 },
  { id: 'RX-4397', patient: 'Daniel Osei', age: 9, doctor: 'Dr. Leon Park', clinic: 'Northgate Pediatrics', date: '3 Oct', items: ['Children’s Syrup · 1 × 100 ml'], status: 'Verified', refillsLeft: 0 },
];

export interface Customer {
  id: string;
  name: string;
  city: string;
  tier: 'Gold' | 'Silver' | 'New';
  orders: number;
  spent: number;
  lastOrder: string;
  refills: number;
}

export const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Hannah Lindqvist', city: 'Riverside', tier: 'Gold', orders: 38, spent: 1240, lastOrder: '5 Oct', refills: 2 },
  { id: 'c2', name: 'Marcus Reed', city: 'Hillcrest', tier: 'Gold', orders: 52, spent: 1985, lastOrder: '5 Oct', refills: 3 },
  { id: 'c3', name: 'Sofia Alvarez', city: 'Lakeview', tier: 'Silver', orders: 17, spent: 412, lastOrder: '4 Oct', refills: 1 },
  { id: 'c4', name: 'Daniel Osei', city: 'Northgate', tier: 'Silver', orders: 9, spent: 186, lastOrder: '3 Oct', refills: 0 },
  { id: 'c5', name: 'Priya Nair', city: 'Riverside', tier: 'New', orders: 1, spent: 38, lastOrder: 'Today', refills: 0 },
];

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  method: 'Delivery' | 'Pickup';
  status: OrderStatus;
  eta: string;
}

export const ORDERS: Order[] = [
  { id: '#7741', customer: 'Hannah Lindqvist', items: 3, total: 42.6, method: 'Delivery', status: 'Out for delivery', eta: 'Today, 15:40' },
  { id: '#7740', customer: 'Marcus Reed', items: 2, total: 33.1, method: 'Delivery', status: 'Packed', eta: 'Today, 17:00' },
  { id: '#7738', customer: 'Priya Nair', items: 1, total: 38.0, method: 'Pickup', status: 'Placed', eta: 'Today, 18:30' },
  { id: '#7735', customer: 'Sofia Alvarez', items: 4, total: 61.8, method: 'Delivery', status: 'Delivered', eta: 'Yesterday' },
  { id: '#7732', customer: 'Daniel Osei', items: 2, total: 13.4, method: 'Pickup', status: 'Delivered', eta: 'Yesterday' },
];

export interface Supplier {
  name: string;
  category: string;
  leadDays: number;
  lastDelivery: string;
  status: 'Active' | 'On hold';
}

export const SUPPLIERS: Supplier[] = [
  { name: 'Meridian Pharma', category: 'Prescription medicines', leadDays: 2, lastDelivery: '3 Oct', status: 'Active' },
  { name: 'Northline Health', category: 'Healthcare products', leadDays: 1, lastDelivery: '4 Oct', status: 'Active' },
  { name: 'Bloom Care', category: 'Personal care & supplements', leadDays: 3, lastDelivery: '30 Sep', status: 'Active' },
  { name: 'Harbour Supply', category: 'Supplements', leadDays: 4, lastDelivery: '26 Sep', status: 'On hold' },
];

export const DASHBOARD_STATS = { medicines: 428, ordersToday: 64, lowStock: 12, revenue: 52380, customers: 3210 };

export const SALES_WEEK = [
  { label: 'Mon', value: 6.2 },
  { label: 'Tue', value: 7.1 },
  { label: 'Wed', value: 6.8 },
  { label: 'Thu', value: 7.9 },
  { label: 'Fri', value: 8.6 },
  { label: 'Sat', value: 9.4 },
  { label: 'Sun', value: 6.4 },
];

export const CUSTOMER_GROWTH = [
  { label: 'Apr', value: 2510 },
  { label: 'May', value: 2630 },
  { label: 'Jun', value: 2748 },
  { label: 'Jul', value: 2870 },
  { label: 'Aug', value: 3010 },
  { label: 'Sep', value: 3120 },
  { label: 'Oct', value: 3210 },
];

export const STOCK_MIX = [
  { label: 'Prescription', value: 36, tone: 'blue' as const },
  { label: 'Healthcare', value: 28, tone: 'emerald' as const },
  { label: 'Personal care', value: 16, tone: 'amber' as const },
  { label: 'Supplements', value: 20, tone: 'slate' as const },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Children’s Syrup is down to 3 bottles', date: 'Just now' },
  { id: 'n2', title: 'Prescription RX-4411 needs pharmacist review', date: '12 min ago' },
  { id: 'n3', title: 'Batch LS-7710 expires in 60 days', date: '1 h ago' },
];

export const TRACK = [
  { label: 'Order placed', note: 'Mon 5 Oct, 09:14', done: true },
  { label: 'Pharmacist checked', note: 'Mon 5 Oct, 09:40', done: true },
  { label: 'Packed', note: 'Mon 5 Oct, 13:20', done: true },
  { label: 'Out for delivery', note: 'Expected by 15:40', done: false },
];

export const REMINDERS = [
  { medicine: 'Amoxil 500', dose: '1 capsule, 3 times a day', time: '08:00 · 14:00 · 20:00', left: 'Course ends in 4 days' },
  { medicine: 'Vitamin D3 Daily', dose: '1 capsule with breakfast', time: '08:30', left: '62 capsules left' },
];
