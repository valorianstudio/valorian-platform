/**
 * Dummy data for the hotel: rooms, reservations, guests, staff, housekeeping and billing. Everything is invented and nothing is fetched
 * or stored. One shared source keeps the dashboard, the front desk, the guest app and the landing page consistent with each other.
 */

export type RoomCategory = 'Deluxe' | 'Suite' | 'Family';
export type RoomStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'Maintenance';
export type CleanStatus = 'Clean' | 'Dirty' | 'In progress' | 'Inspected';
export type BookingStatus = 'Confirmed' | 'Checked in' | 'Checked out' | 'Pending' | 'Cancelled';

export interface Room {
  id: string;
  number: string;
  category: RoomCategory;
  floor: number;
  beds: string;
  size: number;
  rate: number;
  view: string;
  status: RoomStatus;
  clean: CleanStatus;
  features: string[];
}

export const ROOMS: Room[] = [
  { id: 'r101', number: '101', category: 'Deluxe', floor: 1, beds: 'King', size: 34, rate: 280, view: 'Garden', status: 'Available', clean: 'Clean', features: ['Rain shower', 'Balcony', 'Espresso'] },
  { id: 'r102', number: '102', category: 'Deluxe', floor: 1, beds: 'Twin', size: 32, rate: 260, view: 'Garden', status: 'Occupied', clean: 'Dirty', features: ['Bath', 'Desk'] },
  { id: 'r201', number: '201', category: 'Deluxe', floor: 2, beds: 'King', size: 36, rate: 310, view: 'City', status: 'Reserved', clean: 'Inspected', features: ['Rain shower', 'Desk', 'Espresso'] },
  { id: 'r202', number: '202', category: 'Deluxe', floor: 2, beds: 'King', size: 36, rate: 310, view: 'City', status: 'Cleaning', clean: 'In progress', features: ['Rain shower', 'Balcony'] },
  { id: 'r301', number: '301', category: 'Suite', floor: 3, beds: 'King + sofa bed', size: 72, rate: 520, view: 'Harbour', status: 'Occupied', clean: 'Clean', features: ['Lounge', 'Terrace', 'Butler'] },
  { id: 'r302', number: '302', category: 'Suite', floor: 3, beds: 'King + sofa bed', size: 68, rate: 540, view: 'Harbour', status: 'Available', clean: 'Clean', features: ['Lounge', 'Terrace'] },
  { id: 'r401', number: '401', category: 'Suite', floor: 4, beds: 'Super king', size: 96, rate: 780, view: 'Panoramic', status: 'Reserved', clean: 'Inspected', features: ['Jacuzzi', 'Lounge', 'Terrace', 'Butler'] },
  { id: 'r501', number: '501', category: 'Family', floor: 5, beds: 'King + 2 twins', size: 58, rate: 420, view: 'Garden', status: 'Available', clean: 'Dirty', features: ['Kids corner', 'Two bathrooms'] },
  { id: 'r502', number: '502', category: 'Family', floor: 5, beds: '2 queens + twin', size: 62, rate: 440, view: 'Garden', status: 'Maintenance', clean: 'Dirty', features: ['Kids corner', 'Balcony'] },
  { id: 'r503', number: '503', category: 'Family', floor: 5, beds: '2 queens', size: 56, rate: 400, view: 'City', status: 'Occupied', clean: 'Clean', features: ['Kids corner', 'Desk'] },
];

export const ROOM_CATEGORIES: { name: RoomCategory; from: number; size: string; blurb: string }[] = [
  { name: 'Deluxe', from: 260, size: '32–36 m²', blurb: 'Refined comfort with a rain shower and a garden or city view.' },
  { name: 'Suite', from: 520, size: '68–96 m²', blurb: 'Separate lounge, terrace and a dedicated butler for every stay.' },
  { name: 'Family', from: 400, size: '56–62 m²', blurb: 'Space for everyone, with a kids corner and adjoining bathrooms.' },
];

export interface Reservation {
  id: string;
  guest: string;
  room: string;
  roomType: RoomCategory;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  status: BookingStatus;
  total: number;
  channel: 'Direct' | 'Booking platform' | 'Corporate';
}

export const RESERVATIONS: Reservation[] = [
  { id: 'B-2041', guest: 'Hannah Lindqvist', room: '301', roomType: 'Suite', checkIn: '5 Oct', checkOut: '8 Oct', nights: 3, guests: 2, status: 'Checked in', total: 1560, channel: 'Direct' },
  { id: 'B-2042', guest: 'Marcus Reed', room: '201', roomType: 'Deluxe', checkIn: '5 Oct', checkOut: '7 Oct', nights: 2, guests: 2, status: 'Confirmed', total: 620, channel: 'Corporate' },
  { id: 'B-2043', guest: 'Sofia Alvarez', room: '503', roomType: 'Family', checkIn: '5 Oct', checkOut: '9 Oct', nights: 4, guests: 4, status: 'Confirmed', total: 1600, channel: 'Booking platform' },
  { id: 'B-2044', guest: 'Daniel Osei', room: '102', roomType: 'Deluxe', checkIn: '4 Oct', checkOut: '6 Oct', nights: 2, guests: 1, status: 'Checked out', total: 520, channel: 'Direct' },
  { id: 'B-2045', guest: 'Grace Whitmore', room: '401', roomType: 'Suite', checkIn: '6 Oct', checkOut: '12 Oct', nights: 6, guests: 2, status: 'Pending', total: 4680, channel: 'Direct' },
  { id: 'B-2046', guest: 'Oliver Grant', room: '302', roomType: 'Suite', checkIn: '7 Oct', checkOut: '9 Oct', nights: 2, guests: 2, status: 'Confirmed', total: 1080, channel: 'Booking platform' },
];

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  stays: number;
  nights: number;
  spend: number;
  tier: 'Gold' | 'Silver' | 'New';
  preferences: string[];
  history: { date: string; room: string; note: string }[];
}

export const GUESTS: Guest[] = [
  { id: 'g1', name: 'Hannah Lindqvist', email: 'hannah.l@mail.example', phone: '+46 555 0111', stays: 9, nights: 31, spend: 11840, tier: 'Gold', preferences: ['High floor', 'Feather-free pillows', 'Oat milk'], history: [{ date: 'Mar 2026', room: '301 Suite', note: 'Anniversary, champagne on arrival.' }, { date: 'Nov 2025', room: '201 Deluxe', note: 'Early check-in requested.' }] },
  { id: 'g2', name: 'Marcus Reed', email: 'm.reed@mail.example', phone: '+1 555 0122', stays: 6, nights: 14, spend: 4210, tier: 'Silver', preferences: ['Quiet room', 'Late checkout'], history: [{ date: 'Sep 2026', room: '201 Deluxe', note: 'Business trip, invoice to employer.' }] },
  { id: 'g3', name: 'Sofia Alvarez', email: 'sofia.a@mail.example', phone: '+34 555 0133', stays: 2, nights: 6, spend: 1420, tier: 'New', preferences: ['Cot for toddler'], history: [{ date: 'Jul 2026', room: '503 Family', note: 'Family holiday.' }] },
  { id: 'g4', name: 'Grace Whitmore', email: 'g.whitmore@mail.example', phone: '+353 555 0155', stays: 14, nights: 52, spend: 22480, tier: 'Gold', preferences: ['Suite only', 'Vegetarian breakfast'], history: [{ date: 'Aug 2026', room: '401 Suite', note: 'Two-week stay, spa package.' }] },
];

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: 'On shift' | 'On break' | 'Off';
  tasks: number;
}

export const STAFF: StaffMember[] = [
  { id: 's1', name: 'Amelia Stone', role: 'Front desk manager', shift: '07:00 – 15:00', status: 'On shift', tasks: 3 },
  { id: 's2', name: 'Jonah Pierce', role: 'Concierge', shift: '14:00 – 22:00', status: 'On shift', tasks: 5 },
  { id: 's3', name: 'Lena Fischer', role: 'Housekeeping lead', shift: '08:00 – 16:00', status: 'On break', tasks: 6 },
  { id: 's4', name: 'Marco Bellini', role: 'Restaurant supervisor', shift: '16:00 – 00:00', status: 'Off', tasks: 0 },
  { id: 's5', name: 'Priya Nair', role: 'Housekeeper', shift: '08:00 – 16:00', status: 'On shift', tasks: 4 },
];

export interface Task {
  id: string;
  title: string;
  room?: string;
  assignee: string;
  due: string;
  done: boolean;
  priority: 'High' | 'Normal';
}

export const TASKS: Task[] = [
  { id: 't1', title: 'Turn down and restock amenities', room: '301', assignee: 'Priya Nair', due: '18:00', done: false, priority: 'High' },
  { id: 't2', title: 'Deep clean after check-out', room: '102', assignee: 'Lena Fischer', due: '13:00', done: true, priority: 'Normal' },
  { id: 't3', title: 'Repair bathroom tap', room: '502', assignee: 'Maintenance', due: '15:30', done: false, priority: 'High' },
  { id: 't4', title: 'Prepare cot for family arrival', room: '503', assignee: 'Jonah Pierce', due: '15:00', done: false, priority: 'Normal' },
  { id: 't5', title: 'Inspect cleaned room', room: '202', assignee: 'Amelia Stone', due: '16:00', done: false, priority: 'Normal' },
];

export interface Invoice {
  id: string;
  guest: string;
  room: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export const INVOICES: Invoice[] = [
  { id: 'INV-7101', guest: 'Hannah Lindqvist', room: '301', amount: 1560, date: '8 Oct', status: 'Pending' },
  { id: 'INV-7102', guest: 'Daniel Osei', room: '102', amount: 520, date: '6 Oct', status: 'Paid' },
  { id: 'INV-7103', guest: 'Marcus Reed', room: '201', amount: 620, date: '7 Oct', status: 'Pending' },
  { id: 'INV-7104', guest: 'Oliver Grant', room: '302', amount: 1080, date: '2 Oct', status: 'Overdue' },
  { id: 'INV-7105', guest: 'Grace Whitmore', room: '401', amount: 4680, date: '12 Oct', status: 'Pending' },
];

export const DASHBOARD_STATS = { bookings: 1284, availableRooms: 6, checkIns: 12, revenue: 412800, occupancy: 84.6 };

export const OCCUPANCY_WEEK = [
  { label: 'Mon', value: 78 },
  { label: 'Tue', value: 81 },
  { label: 'Wed', value: 74 },
  { label: 'Thu', value: 88 },
  { label: 'Fri', value: 94 },
  { label: 'Sat', value: 97 },
  { label: 'Sun', value: 86 },
];

export const REVENUE_MONTHS = [
  { label: 'May', value: 352 },
  { label: 'Jun', value: 371 },
  { label: 'Jul', value: 398 },
  { label: 'Aug', value: 412 },
  { label: 'Sep', value: 388 },
  { label: 'Oct', value: 413 },
];

export const ROOM_MIX = [
  { label: 'Deluxe', value: 52, tone: 'blue' as const },
  { label: 'Suite', value: 26, tone: 'emerald' as const },
  { label: 'Family', value: 22, tone: 'amber' as const },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Room 301 check-in confirmed for Hannah Lindqvist', date: 'Just now' },
  { id: 'n2', title: 'Room 502 is out of service: plumbing', date: '1 h ago' },
  { id: 'n3', title: 'Penthouse 401 is fully booked for next week', date: 'Yesterday' },
];

export const OFFERS = [
  { id: 'o1', title: 'Stay 3, pay 2', detail: 'Book three nights in any suite and the third is on us.', code: 'STAY3' },
  { id: 'o2', title: 'Spa & dine', detail: 'Free spa access and a three-course dinner for stays over four nights.', code: 'SPADINE' },
  { id: 'o3', title: 'Early booker', detail: '15% off when you book 60 days ahead, direct.', code: 'EARLY15' },
];

export const FACILITIES = ['Infinity pool', 'Spa & wellness', 'Fine dining', 'Rooftop bar', '24-hour concierge', 'Fitness studio', 'Valet parking', 'Meeting rooms'];
