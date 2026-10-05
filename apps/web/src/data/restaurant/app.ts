/**
 * Dummy data for the interactive Restaurant Management website and mobile app demos. Everything is invented; nothing is fetched or
 * stored. One shared source keeps the dashboard, the staff app, the guest app and the landing page consistent with each other.
 */

export type DishArtKey = 'pasta' | 'steak' | 'salad' | 'burger' | 'dessert' | 'fish' | 'soup' | 'drink';
export type MenuCategory = 'Starters' | 'Mains' | 'Pasta' | 'Desserts' | 'Drinks';
export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Served';
export type OrderType = 'Dine-in' | 'Takeaway' | 'Delivery';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  art: DishArtKey;
  tag?: "Chef's pick" | 'Vegetarian' | 'New' | 'Popular';
  rating: number;
  prep: number;
  available: boolean;
}

export const MENU: MenuItem[] = [
  { id: 'm1', name: 'Burrata & Heirloom Tomato', category: 'Starters', price: 14, description: 'Creamy burrata, basil oil and sun-ripened heirloom tomatoes.', art: 'salad', tag: 'Vegetarian', rating: 4.8, prep: 8, available: true },
  { id: 'm2', name: 'Roasted Pumpkin Soup', category: 'Starters', price: 11, description: 'Velvety pumpkin, toasted seeds and a swirl of crème fraîche.', art: 'soup', rating: 4.6, prep: 6, available: true },
  { id: 'm3', name: 'Dry-Aged Ribeye', category: 'Mains', price: 42, description: '300 g ribeye, charred asparagus and peppercorn jus.', art: 'steak', tag: "Chef's pick", rating: 4.9, prep: 22, available: true },
  { id: 'm4', name: 'Pan-Seared Salmon', category: 'Mains', price: 29, description: 'Crisp-skin salmon, lemon butter and garden greens.', art: 'fish', tag: 'Popular', rating: 4.7, prep: 16, available: true },
  { id: 'm5', name: 'Oak House Burger', category: 'Mains', price: 21, description: 'Aged beef, smoked cheddar, pickles and brioche bun.', art: 'burger', tag: 'Popular', rating: 4.8, prep: 14, available: true },
  { id: 'm6', name: 'Tagliatelle al Ragù', category: 'Pasta', price: 24, description: 'Fresh egg pasta, slow-cooked beef ragù and parmesan.', art: 'pasta', rating: 4.7, prep: 15, available: true },
  { id: 'm7', name: 'Wild Mushroom Linguine', category: 'Pasta', price: 22, description: 'Chestnut mushrooms, garlic, thyme and a touch of cream.', art: 'pasta', tag: 'Vegetarian', rating: 4.6, prep: 14, available: false },
  { id: 'm8', name: 'Dark Chocolate Tart', category: 'Desserts', price: 12, description: 'Valrhona chocolate, sea salt and vanilla cream.', art: 'dessert', tag: "Chef's pick", rating: 4.9, prep: 5, available: true },
  { id: 'm9', name: 'Vanilla Panna Cotta', category: 'Desserts', price: 10, description: 'Silky panna cotta with macerated seasonal berries.', art: 'dessert', tag: 'New', rating: 4.5, prep: 4, available: true },
  { id: 'm10', name: 'Citrus Spritz', category: 'Drinks', price: 9, description: 'Sparkling citrus, rosemary and a splash of bitters.', art: 'drink', tag: 'New', rating: 4.4, prep: 3, available: true },
  { id: 'm11', name: 'Cold-Brew Tonic', category: 'Drinks', price: 7, description: 'Cold-brew coffee over tonic and orange peel.', art: 'drink', rating: 4.3, prep: 3, available: true },
];

export const MENU_CATEGORIES = ['All', 'Starters', 'Mains', 'Pasta', 'Desserts', 'Drinks'] as const;

export interface Order {
  id: string;
  table: string;
  type: OrderType;
  items: { name: string; qty: number }[];
  total: number;
  minutes: number;
  status: OrderStatus;
  server: string;
}

export const ORDERS: Order[] = [
  { id: '#1048', table: 'Table 7', type: 'Dine-in', items: [{ name: 'Dry-Aged Ribeye', qty: 2 }, { name: 'Citrus Spritz', qty: 2 }], total: 102, minutes: 3, status: 'New', server: 'Sofia' },
  { id: '#1047', table: 'Takeaway', type: 'Takeaway', items: [{ name: 'Oak House Burger', qty: 3 }], total: 63, minutes: 6, status: 'New', server: 'Counter' },
  { id: '#1046', table: 'Table 3', type: 'Dine-in', items: [{ name: 'Tagliatelle al Ragù', qty: 1 }, { name: 'Pan-Seared Salmon', qty: 1 }, { name: 'Burrata & Heirloom Tomato', qty: 1 }], total: 67, minutes: 11, status: 'Preparing', server: 'Marco' },
  { id: '#1045', table: 'Delivery', type: 'Delivery', items: [{ name: 'Wild Mushroom Linguine', qty: 2 }, { name: 'Vanilla Panna Cotta', qty: 2 }], total: 64, minutes: 14, status: 'Preparing', server: 'Courier' },
  { id: '#1044', table: 'Table 11', type: 'Dine-in', items: [{ name: 'Dark Chocolate Tart', qty: 2 }, { name: 'Cold-Brew Tonic', qty: 2 }], total: 38, minutes: 18, status: 'Ready', server: 'Sofia' },
  { id: '#1043', table: 'Table 5', type: 'Dine-in', items: [{ name: 'Roasted Pumpkin Soup', qty: 2 }, { name: 'Oak House Burger', qty: 2 }], total: 64, minutes: 26, status: 'Served', server: 'Marco' },
  { id: '#1042', table: 'Table 9', type: 'Dine-in', items: [{ name: 'Dry-Aged Ribeye', qty: 1 }, { name: 'Pan-Seared Salmon', qty: 1 }], total: 71, minutes: 34, status: 'Served', server: 'Lena' },
];

export const ORDER_FLOW: Record<OrderStatus, { to: OrderStatus; label: string } | null> = {
  New: { to: 'Preparing', label: 'Start cooking' },
  Preparing: { to: 'Ready', label: 'Mark ready' },
  Ready: { to: 'Served', label: 'Mark served' },
  Served: null,
};

export type TableStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning';
export interface DiningTable {
  id: string;
  seats: number;
  area: 'Main hall' | 'Terrace' | 'Bar';
  status: TableStatus;
  guests: number;
  server?: string;
  since?: string;
}

export const TABLES: DiningTable[] = [
  { id: 'T1', seats: 2, area: 'Main hall', status: 'Available', guests: 0 },
  { id: 'T2', seats: 4, area: 'Main hall', status: 'Occupied', guests: 4, server: 'Marco', since: '18:40' },
  { id: 'T3', seats: 4, area: 'Main hall', status: 'Occupied', guests: 3, server: 'Marco', since: '19:05' },
  { id: 'T4', seats: 6, area: 'Main hall', status: 'Reserved', guests: 0, since: '20:00' },
  { id: 'T5', seats: 2, area: 'Main hall', status: 'Occupied', guests: 2, server: 'Sofia', since: '19:20' },
  { id: 'T6', seats: 4, area: 'Main hall', status: 'Cleaning', guests: 0 },
  { id: 'T7', seats: 4, area: 'Main hall', status: 'Occupied', guests: 4, server: 'Sofia', since: '19:45' },
  { id: 'T8', seats: 8, area: 'Main hall', status: 'Reserved', guests: 0, since: '20:30' },
  { id: 'T9', seats: 2, area: 'Terrace', status: 'Occupied', guests: 2, server: 'Lena', since: '19:10' },
  { id: 'T10', seats: 4, area: 'Terrace', status: 'Available', guests: 0 },
  { id: 'T11', seats: 4, area: 'Terrace', status: 'Occupied', guests: 4, server: 'Lena', since: '19:30' },
  { id: 'T12', seats: 2, area: 'Terrace', status: 'Available', guests: 0 },
  { id: 'B1', seats: 2, area: 'Bar', status: 'Occupied', guests: 2, server: 'Dev', since: '19:50' },
  { id: 'B2', seats: 2, area: 'Bar', status: 'Available', guests: 0 },
];

export interface Reservation {
  id: string;
  time: string;
  name: string;
  party: number;
  table: string;
  status: 'Confirmed' | 'Pending' | 'Seated';
  note?: string;
}

export const RESERVATIONS: Reservation[] = [
  { id: 'r1', time: '12:30', name: 'Hannah Lindqvist', party: 2, table: 'T1', status: 'Seated' },
  { id: 'r2', time: '13:00', name: 'Marcus Reed', party: 4, table: 'T2', status: 'Confirmed', note: 'Business lunch' },
  { id: 'r3', time: '18:30', name: 'Sofia Alvarez', party: 3, table: 'T3', status: 'Confirmed', note: 'Nut allergy' },
  { id: 'r4', time: '19:00', name: 'Daniel Osei', party: 2, table: 'T5', status: 'Pending' },
  { id: 'r5', time: '20:00', name: 'Grace Whitmore', party: 6, table: 'T4', status: 'Confirmed', note: 'Birthday, cake at 21:00' },
  { id: 'r6', time: '20:30', name: 'Oliver Grant', party: 8, table: 'T8', status: 'Confirmed', note: 'Company dinner' },
  { id: 'r7', time: '21:00', name: 'Layla Hassan', party: 2, table: 'T12', status: 'Pending', note: 'Anniversary' },
];

export interface Customer {
  id: string;
  name: string;
  visits: number;
  spend: number;
  tier: 'VIP' | 'Regular' | 'New';
  last: string;
  favourite: string;
}

export const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Grace Whitmore', visits: 42, spend: 4820, tier: 'VIP', last: '3 Oct', favourite: 'Dry-Aged Ribeye' },
  { id: 'c2', name: 'Marcus Reed', visits: 31, spend: 3110, tier: 'VIP', last: '5 Oct', favourite: 'Pan-Seared Salmon' },
  { id: 'c3', name: 'Hannah Lindqvist', visits: 18, spend: 1460, tier: 'Regular', last: '5 Oct', favourite: 'Burrata & Heirloom Tomato' },
  { id: 'c4', name: 'Sofia Alvarez', visits: 12, spend: 980, tier: 'Regular', last: '29 Sep', favourite: 'Tagliatelle al Ragù' },
  { id: 'c5', name: 'Oliver Grant', visits: 9, spend: 1240, tier: 'Regular', last: '1 Oct', favourite: 'Oak House Burger' },
  { id: 'c6', name: 'Daniel Osei', visits: 2, spend: 126, tier: 'New', last: '2 Oct', favourite: 'Dark Chocolate Tart' },
  { id: 'c7', name: 'Layla Hassan', visits: 1, spend: 74, tier: 'New', last: '4 Oct', favourite: 'Vanilla Panna Cotta' },
];

export type StockLevel = 'OK' | 'Low' | 'Critical';
export interface StockItem {
  id: string;
  name: string;
  category: 'Produce' | 'Meat & fish' | 'Dairy' | 'Dry goods' | 'Bar';
  stock: number;
  par: number;
  unit: string;
  supplier: string;
}

export const INVENTORY: StockItem[] = [
  { id: 'i1', name: 'Dry-aged ribeye', category: 'Meat & fish', stock: 6, par: 30, unit: 'kg', supplier: 'Harlow Butchers' },
  { id: 'i2', name: 'Atlantic salmon', category: 'Meat & fish', stock: 14, par: 25, unit: 'kg', supplier: 'Coastline Fish' },
  { id: 'i3', name: 'Heirloom tomatoes', category: 'Produce', stock: 18, par: 20, unit: 'kg', supplier: 'Greenfield Farm' },
  { id: 'i4', name: 'Burrata', category: 'Dairy', stock: 9, par: 24, unit: 'pcs', supplier: 'Latteria Rossi' },
  { id: 'i5', name: 'Fresh egg pasta', category: 'Dry goods', stock: 22, par: 25, unit: 'kg', supplier: 'Pasta Nonna' },
  { id: 'i6', name: 'Dark chocolate', category: 'Dry goods', stock: 3, par: 10, unit: 'kg', supplier: 'Valrhona Imports' },
  { id: 'i7', name: 'Sparkling water', category: 'Bar', stock: 64, par: 60, unit: 'btl', supplier: 'Alpine Drinks' },
  { id: 'i8', name: 'Brioche buns', category: 'Dry goods', stock: 38, par: 60, unit: 'pcs', supplier: 'Maison Bakery' },
];

export const stockLevel = (item: StockItem): StockLevel => (item.stock / item.par < 0.25 ? 'Critical' : item.stock / item.par < 0.6 ? 'Low' : 'OK');

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: 'On shift' | 'On break' | 'Off';
  rating: number;
}

export const STAFF: StaffMember[] = [
  { id: 's1', name: 'Marco Bellini', role: 'Head waiter', shift: '16:00 – 00:00', status: 'On shift', rating: 4.9 },
  { id: 's2', name: 'Sofia Reyes', role: 'Waiter', shift: '16:00 – 00:00', status: 'On shift', rating: 4.8 },
  { id: 's3', name: 'Lena Fischer', role: 'Waiter', shift: '17:00 – 01:00', status: 'On break', rating: 4.7 },
  { id: 's4', name: 'Chef Antoine Roux', role: 'Executive chef', shift: '14:00 – 23:00', status: 'On shift', rating: 5 },
  { id: 's5', name: 'Priya Nair', role: 'Sous chef', shift: '14:00 – 23:00', status: 'On shift', rating: 4.8 },
  { id: 's6', name: 'Dev Patel', role: 'Bartender', shift: '17:00 – 01:00', status: 'On shift', rating: 4.7 },
  { id: 's7', name: 'Hana Sato', role: 'Host', shift: '16:00 – 00:00', status: 'Off', rating: 4.9 },
];

export const DASHBOARD_STATS = { sales: 4862, orders: 128, activeTables: 9, tablesTotal: 14, revenue: 86420 };

export const HOURLY_SALES = [
  { label: '12', value: 380 },
  { label: '13', value: 520 },
  { label: '14', value: 340 },
  { label: '17', value: 290 },
  { label: '18', value: 610 },
  { label: '19', value: 880 },
  { label: '20', value: 960 },
  { label: '21', value: 640 },
];

export const CUSTOMER_GROWTH = [
  { label: 'Apr', value: 820 },
  { label: 'May', value: 870 },
  { label: 'Jun', value: 940 },
  { label: 'Jul', value: 1010 },
  { label: 'Aug', value: 1130 },
  { label: 'Sep', value: 1240 },
  { label: 'Oct', value: 1310 },
];

export const REVENUE_WEEK = [
  { label: 'Mon', value: 3.2 },
  { label: 'Tue', value: 3.6 },
  { label: 'Wed', value: 4.1 },
  { label: 'Thu', value: 4.4 },
  { label: 'Fri', value: 6.8 },
  { label: 'Sat', value: 8.1 },
  { label: 'Sun', value: 5.9 },
];

export const CATEGORY_MIX = [
  { label: 'Mains', value: 38, tone: 'blue' as const },
  { label: 'Starters', value: 22, tone: 'emerald' as const },
  { label: 'Desserts', value: 18, tone: 'amber' as const },
  { label: 'Drinks', value: 22, tone: 'slate' as const },
];

export const POPULAR = [
  { name: 'Oak House Burger', sold: 46 },
  { name: 'Dry-Aged Ribeye', sold: 38 },
  { name: 'Pan-Seared Salmon', sold: 31 },
  { name: 'Dark Chocolate Tart', sold: 27 },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Order #1048 placed at Table 7', date: 'Just now' },
  { id: 'n2', title: 'Dry-aged ribeye is critically low', date: '12 min ago' },
  { id: 'n3', title: 'Table 4 reservation at 20:00', date: '1 h ago' },
];

export const AREAS = ['All areas', 'Main hall', 'Terrace', 'Bar'] as const;
export const ORDER_TYPES = ['All types', 'Dine-in', 'Takeaway', 'Delivery'] as const;
