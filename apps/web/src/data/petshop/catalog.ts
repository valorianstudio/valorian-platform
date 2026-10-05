/**
 * Dummy data for the pet shop: pets, owners, products, orders, appointments, stock and sales. Everything is invented and nothing is
 * fetched or stored. One shared source keeps the dashboard, the staff app, the customer app and the landing page consistent.
 */

export type Species = 'Dog' | 'Cat' | 'Bird' | 'Rabbit';
export type Category = 'Dogs' | 'Cats' | 'Birds' | 'Accessories';
export type AppointmentKind = 'Grooming' | 'Vet checkup' | 'Training' | 'Vaccination';
export type AppointmentStatus = 'Booked' | 'Checked in' | 'In progress' | 'Done';
export type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Delivered';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: number;
  weight: number;
  owner: string;
  vaccinated: boolean;
  allergies: string[];
  visits: { date: string; note: string }[];
  next: string;
}

export const PETS: Pet[] = [
  { id: 'p1', name: 'Biscuit', species: 'Dog', breed: 'Golden retriever', age: 4, weight: 31.5, owner: 'Hannah Lindqvist', vaccinated: true, allergies: ['Chicken'], visits: [{ date: '28 Sep', note: 'Grooming, full coat trim.' }, { date: '14 Jul', note: 'Annual checkup, healthy.' }], next: '12 Oct · Grooming' },
  { id: 'p2', name: 'Luna', species: 'Cat', breed: 'British shorthair', age: 2, weight: 4.6, owner: 'Marcus Reed', vaccinated: true, allergies: [], visits: [{ date: '2 Oct', note: 'Dental cleaning.' }], next: '19 Oct · Vet checkup' },
  { id: 'p3', name: 'Pepper', species: 'Dog', breed: 'French bulldog', age: 6, weight: 12.1, owner: 'Sofia Alvarez', vaccinated: false, allergies: ['Pollen'], visits: [{ date: '5 Sep', note: 'Booster due.' }], next: '9 Oct · Vaccination' },
  { id: 'p4', name: 'Kiwi', species: 'Bird', breed: 'Budgerigar', age: 1, weight: 0.04, owner: 'Daniel Osei', vaccinated: true, allergies: [], visits: [{ date: '30 Aug', note: 'Wing trim.' }], next: '16 Oct · Checkup' },
  { id: 'p5', name: 'Mochi', species: 'Rabbit', breed: 'Holland lop', age: 3, weight: 1.8, owner: 'Grace Whitmore', vaccinated: true, allergies: ['Timothy hay'], visits: [{ date: '11 Sep', note: 'Nail trim, diet review.' }], next: '23 Oct · Checkup' },
  { id: 'p6', name: 'Milo', species: 'Dog', breed: 'Beagle', age: 9, weight: 13.4, owner: 'Oliver Grant', vaccinated: true, allergies: [], visits: [{ date: '20 Sep', note: 'Senior checkup, joints good.' }], next: '25 Oct · Training' },
];

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  reorderAt: number;
  rating: number;
  reviews: number;
  tag?: 'New' | 'Bestseller' | 'Vet recommended';
  kind: 'food' | 'toy' | 'care' | 'bed' | 'bird' | 'cat-litter';
  description: string;
}

export const PRODUCTS: Product[] = [
  { id: 'pr1', name: 'Salmon & Rice Dog Food, 5 kg', category: 'Dogs', price: 48, stock: 42, reorderAt: 15, rating: 4.8, reviews: 214, tag: 'Vet recommended', kind: 'food', description: 'Complete adult recipe with omega-3s for a shiny coat and sensitive skin.' },
  { id: 'pr2', name: 'Dental Chew Sticks', category: 'Dogs', price: 14, stock: 9, reorderAt: 20, rating: 4.7, reviews: 96, tag: 'Bestseller', kind: 'toy', description: 'Clinically tested to reduce tartar with every chew.' },
  { id: 'pr3', name: 'Orthopaedic Memory Bed', category: 'Dogs', price: 92, stock: 11, reorderAt: 8, rating: 4.9, reviews: 63, kind: 'bed', description: 'Supportive foam bed with a washable, removable cover.' },
  { id: 'pr4', name: 'Grain-Free Cat Food, 2 kg', category: 'Cats', price: 36, stock: 27, reorderAt: 12, rating: 4.7, reviews: 158, tag: 'Bestseller', kind: 'food', description: 'High-protein recipe with real chicken and no grain fillers.' },
  { id: 'pr5', name: 'Clumping Cat Litter, Unscented', category: 'Cats', price: 22, stock: 4, reorderAt: 15, rating: 4.5, reviews: 121, kind: 'cat-litter', description: 'Fast-clumping, low-dust litter that lasts a full month.' },
  { id: 'pr6', name: 'Feather Wand Toy', category: 'Cats', price: 9, stock: 38, reorderAt: 10, rating: 4.6, reviews: 74, tag: 'New', kind: 'toy', description: 'Interactive wand with replaceable feathers for active play.' },
  { id: 'pr7', name: 'Millet & Seed Mix, 1 kg', category: 'Birds', price: 11, stock: 30, reorderAt: 10, rating: 4.6, reviews: 52, kind: 'bird', description: 'A balanced seed blend with added vitamins for daily feeding.' },
  { id: 'pr8', name: 'Cuttlebone Pack', category: 'Birds', price: 6, stock: 18, reorderAt: 10, rating: 4.4, reviews: 33, kind: 'bird', description: 'Natural calcium source that also keeps beaks trimmed.' },
  { id: 'pr9', name: 'Stainless Bowl Set', category: 'Accessories', price: 24, stock: 22, reorderAt: 8, rating: 4.8, reviews: 88, tag: 'Bestseller', kind: 'care', description: 'Non-slip, rust-proof bowls in three sizes.' },
  { id: 'pr10', name: 'Reflective Walking Harness', category: 'Accessories', price: 34, stock: 16, reorderAt: 8, rating: 4.7, reviews: 105, kind: 'care', description: 'Padded, adjustable harness with reflective stitching for night walks.' },
];

export interface Customer {
  id: string;
  name: string;
  pets: number;
  orders: number;
  spend: number;
  tier: 'Gold' | 'Regular' | 'New';
  last: string;
}

export const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Hannah Lindqvist', pets: 1, orders: 26, spend: 1840, tier: 'Gold', last: '28 Sep' },
  { id: 'c2', name: 'Marcus Reed', pets: 1, orders: 14, spend: 690, tier: 'Regular', last: '2 Oct' },
  { id: 'c3', name: 'Sofia Alvarez', pets: 1, orders: 9, spend: 412, tier: 'Regular', last: '5 Sep' },
  { id: 'c4', name: 'Daniel Osei', pets: 1, orders: 4, spend: 136, tier: 'New', last: '30 Aug' },
  { id: 'c5', name: 'Grace Whitmore', pets: 2, orders: 31, spend: 2460, tier: 'Gold', last: '11 Sep' },
];

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
  delivery: 'Pickup' | 'Delivery';
  date: string;
}

export const ORDERS: Order[] = [
  { id: '#2201', customer: 'Hannah Lindqvist', items: 2, total: 62, status: 'Placed', delivery: 'Delivery', date: '5 Oct' },
  { id: '#2202', customer: 'Marcus Reed', items: 1, total: 36, status: 'Packed', delivery: 'Pickup', date: '5 Oct' },
  { id: '#2203', customer: 'Grace Whitmore', items: 3, total: 88, status: 'Shipped', delivery: 'Delivery', date: '4 Oct' },
  { id: '#2204', customer: 'Sofia Alvarez', items: 1, total: 92, status: 'Delivered', delivery: 'Pickup', date: '3 Oct' },
];

export interface Appointment {
  id: string;
  time: string;
  pet: string;
  species: Species;
  owner: string;
  kind: AppointmentKind;
  staff: string;
  minutes: number;
  status: AppointmentStatus;
}

export const APPOINTMENTS: Appointment[] = [
  { id: 'a1', time: '09:00', pet: 'Biscuit', species: 'Dog', owner: 'Hannah Lindqvist', kind: 'Grooming', staff: 'Ana Ruiz', minutes: 90, status: 'Done' },
  { id: 'a2', time: '10:30', pet: 'Luna', species: 'Cat', owner: 'Marcus Reed', kind: 'Vet checkup', staff: 'Dr. Ines Costa', minutes: 30, status: 'In progress' },
  { id: 'a3', time: '11:30', pet: 'Pepper', species: 'Dog', owner: 'Sofia Alvarez', kind: 'Vaccination', staff: 'Dr. Ines Costa', minutes: 20, status: 'Checked in' },
  { id: 'a4', time: '13:00', pet: 'Milo', species: 'Dog', owner: 'Oliver Grant', kind: 'Training', staff: 'Tomas Berg', minutes: 60, status: 'Booked' },
  { id: 'a5', time: '14:30', pet: 'Mochi', species: 'Rabbit', owner: 'Grace Whitmore', kind: 'Vet checkup', staff: 'Dr. Ines Costa', minutes: 30, status: 'Booked' },
  { id: 'a6', time: '16:00', pet: 'Kiwi', species: 'Bird', owner: 'Daniel Osei', kind: 'Grooming', staff: 'Ana Ruiz', minutes: 30, status: 'Booked' },
];

export const STOCK_MIX = [
  { label: 'Dogs', value: 38, tone: 'blue' as const },
  { label: 'Cats', value: 29, tone: 'emerald' as const },
  { label: 'Birds', value: 11, tone: 'amber' as const },
  { label: 'Accessories', value: 22, tone: 'slate' as const },
];

export const SALES_WEEK = [
  { label: 'Mon', value: 1.9 },
  { label: 'Tue', value: 2.2 },
  { label: 'Wed', value: 2.0 },
  { label: 'Thu', value: 2.6 },
  { label: 'Fri', value: 3.1 },
  { label: 'Sat', value: 3.8 },
  { label: 'Sun', value: 2.4 },
];

export const CUSTOMER_GROWTH = [
  { label: 'Apr', value: 410 },
  { label: 'May', value: 438 },
  { label: 'Jun', value: 470 },
  { label: 'Jul', value: 496 },
  { label: 'Aug', value: 528 },
  { label: 'Sep', value: 561 },
  { label: 'Oct', value: 590 },
];

export const DASHBOARD_STATS = { customers: 1420, products: 186, appointmentsToday: 14, orders: 92, revenue: 38420 };

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Low stock: cat litter is down to 4 bags', date: 'Just now' },
  { id: 'n2', title: 'Luna checked in for her vet appointment', date: '10 min ago' },
  { id: 'n3', title: 'Order #2201 is ready to ship', date: '1 h ago' },
];

export const TRACK = [
  { label: 'Order placed', note: 'Mon 5 Oct, 09:14', done: true },
  { label: 'Packed', note: 'Mon 5 Oct, 13:20', done: true },
  { label: 'Out for delivery', note: 'Expected today', done: false },
  { label: 'Delivered', note: 'Expected by Tue 6 Oct', done: false },
];
