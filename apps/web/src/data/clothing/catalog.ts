/**
 * Dummy data for the clothing store: the catalogue, orders, customers, stock and discounts. Everything is invented and nothing is
 * fetched or stored. One shared source keeps the storefront, the admin dashboard, the mobile app and the landing page consistent.
 */

export type Department = 'Men' | 'Women' | 'Accessories';
export type ProductArt = 'shirt' | 'knit' | 'coat' | 'dress' | 'trouser' | 'bag';

export interface Colour {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  department: Department;
  type: string;
  price: number;
  was?: number;
  rating: number;
  reviews: number;
  colours: Colour[];
  sizes: string[];
  art: ProductArt;
  tag?: 'New' | 'Bestseller' | 'Limited' | 'Sale';
  description: string;
  stock: number;
  collection: string;
}

const APPAREL = ['XS', 'S', 'M', 'L', 'XL'];
const BLACK = { name: 'Black', hex: '#111111' };
const IVORY = { name: 'Ivory', hex: '#F5F1EB' };
const CAMEL = { name: 'Camel', hex: '#C19A6B' };
const NAVY = { name: 'Navy', hex: '#1E2A44' };
const OLIVE = { name: 'Olive', hex: '#6B6B3A' };
const CHARCOAL = { name: 'Charcoal', hex: '#4A4A4A' };

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Merino Crew Knit', department: 'Men', type: 'Knitwear', price: 148, rating: 4.8, reviews: 214, colours: [IVORY, NAVY, BLACK], sizes: APPAREL, art: 'knit', tag: 'Bestseller', description: 'Extra-fine merino in a relaxed crew cut. Breathable, soft and built to last a decade.', stock: 42, collection: 'Autumn Edit' },
  { id: 'p2', name: 'Tailored Wool Coat', department: 'Men', type: 'Outerwear', price: 395, was: 460, rating: 4.9, reviews: 97, colours: [CAMEL, CHARCOAL], sizes: APPAREL, art: 'coat', tag: 'Sale', description: 'A single-breasted coat in Italian wool with a clean notch lapel and a tonal lining.', stock: 9, collection: 'Autumn Edit' },
  { id: 'p3', name: 'Oxford Button-Down', department: 'Men', type: 'Shirts', price: 98, rating: 4.6, reviews: 352, colours: [IVORY, NAVY], sizes: APPAREL, art: 'shirt', description: 'A crisp cotton Oxford with a soft roll collar, made for everyday and occasion alike.', stock: 66, collection: 'Essentials' },
  { id: 'p4', name: 'Pleated Wide Trouser', department: 'Men', type: 'Trousers', price: 175, rating: 4.7, reviews: 88, colours: [CHARCOAL, OLIVE], sizes: ['28', '30', '32', '34', '36'], art: 'trouser', tag: 'New', description: 'Fluid wide-leg trousers with front pleats and a high rise. Cut to drape, not cling.', stock: 27, collection: 'Autumn Edit' },
  { id: 'p5', name: 'Silk Slip Dress', department: 'Women', type: 'Dresses', price: 265, rating: 4.9, reviews: 176, colours: [BLACK, IVORY], sizes: APPAREL, art: 'dress', tag: 'Bestseller', description: 'Bias-cut silk with delicate straps and a fluid midi length. Effortless for evenings.', stock: 31, collection: 'Evening Edit' },
  { id: 'p6', name: 'Relaxed Linen Shirt', department: 'Women', type: 'Shirts', price: 124, rating: 4.5, reviews: 129, colours: [IVORY, OLIVE], sizes: APPAREL, art: 'shirt', description: 'Garment-washed European linen with a relaxed fit and a deep, easy collar.', stock: 58, collection: 'Summer Linen' },
  { id: 'p7', name: 'Cashmere Cardigan', department: 'Women', type: 'Knitwear', price: 320, rating: 4.8, reviews: 143, colours: [CAMEL, BLACK, IVORY], sizes: APPAREL, art: 'knit', tag: 'Limited', description: 'Pure cashmere in a boxy, wrap-ready shape with mother-of-pearl buttons.', stock: 12, collection: 'Autumn Edit' },
  { id: 'p8', name: 'Structured Trench', department: 'Women', type: 'Outerwear', price: 485, rating: 4.9, reviews: 61, colours: [CAMEL, BLACK], sizes: APPAREL, art: 'coat', tag: 'New', description: 'A double-breasted trench in water-repellent cotton, belted and finished with brass hardware.', stock: 14, collection: 'Autumn Edit' },
  { id: 'p9', name: 'High-Waist Tailored Trouser', department: 'Women', type: 'Trousers', price: 188, rating: 4.6, reviews: 109, colours: [BLACK, NAVY], sizes: ['24', '26', '28', '30', '32'], art: 'trouser', description: 'A sharp high-waist trouser with a straight leg and a discreet side zip.', stock: 37, collection: 'Essentials' },
  { id: 'p10', name: 'Leather Tote', department: 'Accessories', type: 'Bags', price: 362, rating: 4.9, reviews: 188, colours: [BLACK, CAMEL], sizes: ['One size'], art: 'bag', tag: 'Bestseller', description: 'Full-grain Italian leather with an open top, interior pocket and a suede lining.', stock: 19, collection: 'Signature' },
  { id: 'p11', name: 'Mini Crossbody', department: 'Accessories', type: 'Bags', price: 228, rating: 4.7, reviews: 74, colours: [IVORY, NAVY], sizes: ['One size'], art: 'bag', tag: 'New', description: 'A compact everyday crossbody with a magnetic flap and an adjustable strap.', stock: 24, collection: 'Signature' },
  { id: 'p12', name: 'Cashmere Scarf', department: 'Accessories', type: 'Scarves', price: 135, was: 165, rating: 4.8, reviews: 92, colours: [CHARCOAL, IVORY, CAMEL], sizes: ['One size'], art: 'knit', tag: 'Sale', description: 'A generous 200 cm scarf in soft cashmere with a hand-rolled finish.', stock: 45, collection: 'Autumn Edit' },
];

export const DEPARTMENTS: Department[] = ['Men', 'Women', 'Accessories'];
export const COLLECTIONS = ['Autumn Edit', 'Evening Edit', 'Summer Linen', 'Signature', 'Essentials'] as const;

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
export const formatPrice = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const REVIEWS: { id: string; product: string; name: string; rating: number; text: string; date: string }[] = [
  { id: 'r1', product: 'p1', name: 'Hannah L.', rating: 5, text: 'Softer than I expected and it keeps its shape after months of wear.', date: '2 Oct' },
  { id: 'r2', product: 'p1', name: 'Marcus R.', rating: 4, text: 'Great fit. The navy is richer in person than in the photos.', date: '28 Sep' },
  { id: 'r3', product: 'p2', name: 'Oliver G.', rating: 5, text: 'The tailoring is exceptional. Worth every pound of the price.', date: '25 Sep' },
  { id: 'r4', product: 'p5', name: 'Sofia A.', rating: 5, text: 'Wore it to a wedding and got three compliments before dinner.', date: '24 Sep' },
];

export interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'Returned';
  date: string;
  channel: 'Website' | 'App';
}

export const ORDERS: Order[] = [
  { id: '#10482', customer: 'Hannah Lindqvist', items: 2, total: 413, status: 'Placed', date: '5 Oct', channel: 'Website' },
  { id: '#10481', customer: 'Marcus Reed', items: 1, total: 395, status: 'Packed', date: '5 Oct', channel: 'App' },
  { id: '#10480', customer: 'Sofia Alvarez', items: 3, total: 572, status: 'Shipped', date: '4 Oct', channel: 'Website' },
  { id: '#10479', customer: 'Daniel Osei', items: 1, total: 98, status: 'Delivered', date: '3 Oct', channel: 'Website' },
  { id: '#10478', customer: 'Grace Whitmore', items: 2, total: 265, status: 'Delivered', date: '2 Oct', channel: 'App' },
  { id: '#10477', customer: 'Oliver Grant', items: 1, total: 362, status: 'Returned', date: '1 Oct', channel: 'Website' },
];

export const CUSTOMERS = [
  { id: 'c1', name: 'Hannah Lindqvist', orders: 14, spend: 3920, tier: 'VIP', city: 'Stockholm' },
  { id: 'c2', name: 'Marcus Reed', orders: 9, spend: 2480, tier: 'Loyal', city: 'Chicago' },
  { id: 'c3', name: 'Sofia Alvarez', orders: 5, spend: 1260, tier: 'New', city: 'Madrid' },
  { id: 'c4', name: 'Daniel Osei', orders: 3, spend: 610, tier: 'New', city: 'London' },
  { id: 'c5', name: 'Grace Whitmore', orders: 22, spend: 6840, tier: 'VIP', city: 'Dublin' },
];

export const STOCK = PRODUCTS.map((p) => ({ id: p.id, name: p.name, sku: `VS-${p.id.toUpperCase()}`, stock: p.stock, reorderAt: 15 }));

export interface Discount {
  code: string;
  label: string;
  value: string;
  uses: number;
  active: boolean;
  ends: string;
}

export const DISCOUNTS: Discount[] = [
  { code: 'AUTUMN15', label: '15% off the Autumn Edit', value: '15%', uses: 412, active: true, ends: '31 Oct' },
  { code: 'WELCOME10', label: '10% off a first order', value: '10%', uses: 1280, active: true, ends: 'Ongoing' },
  { code: 'FREESHIP', label: 'Free delivery over $200', value: 'Free delivery', uses: 690, active: true, ends: 'Ongoing' },
  { code: 'SUMMER25', label: '25% off summer linen', value: '25%', uses: 230, active: false, ends: 'Ended 1 Sep' },
];

export const SALES_WEEK = [
  { label: 'Mon', value: 9.2 },
  { label: 'Tue', value: 11.4 },
  { label: 'Wed', value: 10.1 },
  { label: 'Thu', value: 13.8 },
  { label: 'Fri', value: 17.6 },
  { label: 'Sat', value: 21.9 },
  { label: 'Sun', value: 14.3 },
];

export const REVENUE_MONTHS = [
  { label: 'May', value: 186 },
  { label: 'Jun', value: 204 },
  { label: 'Jul', value: 221 },
  { label: 'Aug', value: 238 },
  { label: 'Sep', value: 262 },
  { label: 'Oct', value: 284 },
];

export const CATEGORY_MIX = [
  { label: 'Women', value: 46, tone: 'blue' as const },
  { label: 'Men', value: 32, tone: 'emerald' as const },
  { label: 'Accessories', value: 22, tone: 'amber' as const },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'New order #10482 from Hannah Lindqvist', date: 'Just now' },
  { id: 'n2', title: 'Tailored Wool Coat is down to 9 units', date: '1 h ago' },
  { id: 'n3', title: 'AUTUMN15 passed 400 uses', date: 'Yesterday' },
];

export const LOOKBOOK = [
  { id: 'l1', title: 'The Autumn Walk', caption: 'Wool, cashmere and a camel palette' },
  { id: 'l2', title: 'Evening, Simplified', caption: 'Silk and clean black tailoring' },
  { id: 'l3', title: 'Linen, Lived In', caption: 'Summer textures, relaxed shapes' },
];

export const TRACKING = [
  { label: 'Order placed', note: 'Mon 5 Oct, 09:14', done: true },
  { label: 'Packed in our studio', note: 'Mon 5 Oct, 15:40', done: true },
  { label: 'With courier', note: 'Estimated Wed 7 Oct', done: false },
  { label: 'Delivered', note: 'Expected by Thu 8 Oct', done: false },
];
