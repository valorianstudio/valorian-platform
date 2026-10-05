/**
 * Marketing copy for the Restaurant Management landing page demo. Static, fictional content: the brand "TableFlow", its numbers,
 * restaurants, team and testimonials are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const RESTAURANT_BRAND = { name: 'TableFlow', tagline: 'Restaurant management platform' } as const;

export const LANDING_NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Menu', href: '#menu' },
  { label: 'Team', href: '#team' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Book a demo', href: '#contact' },
] as const;

export type FeatureIcon = 'ordering' | 'tables' | 'menu' | 'reservations' | 'pos' | 'inventory' | 'customers';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'ordering', title: 'Online Ordering', description: 'Pickup and delivery orders flow straight into the kitchen, with no commission and no re-typing.' },
  { icon: 'tables', title: 'Table Management', description: 'A live floor plan that shows who is seated, who is waiting and which tables are ready.' },
  { icon: 'menu', title: 'Menu Management', description: 'Edit dishes, prices and availability once. Website, app and POS update instantly.' },
  { icon: 'reservations', title: 'Reservation System', description: 'Online booking with reminders, notes and table assignment that prevents double bookings.' },
  { icon: 'pos', title: 'POS Integration', description: 'Take payments, split bills and close the day with one connected point of sale.' },
  { icon: 'inventory', title: 'Inventory Tracking', description: 'Stock against par levels, with alerts and one-tap reordering from your suppliers.' },
  { icon: 'customers', title: 'Customer Management', description: 'Know your regulars, their favourites and their celebrations, and bring them back.' },
];

export const SHOWCASE_INTRO = {
  eyebrow: 'Digital menu',
  title: 'A menu that sells for you',
  description: 'Every dish is a card guests can browse on their phone, with prices, tags and availability that always match the kitchen.',
};

export const SHOWCASE: { name: string; description: string; price: number; tag: string; art: 'steak' | 'pasta' | 'salad' | 'dessert' | 'fish' | 'burger' }[] = [
  { name: 'Dry-Aged Ribeye', description: '300 g ribeye, charred asparagus and peppercorn jus.', price: 42, tag: "Chef's pick", art: 'steak' },
  { name: 'Tagliatelle al Ragù', description: 'Fresh egg pasta, slow-cooked beef ragù and parmesan.', price: 24, tag: 'Popular', art: 'pasta' },
  { name: 'Burrata & Heirloom Tomato', description: 'Creamy burrata, basil oil and ripe heirloom tomatoes.', price: 14, tag: 'Vegetarian', art: 'salad' },
  { name: 'Pan-Seared Salmon', description: 'Crisp-skin salmon, lemon butter and garden greens.', price: 29, tag: 'Popular', art: 'fish' },
  { name: 'Oak House Burger', description: 'Aged beef, smoked cheddar, pickles and brioche.', price: 21, tag: 'Guest favourite', art: 'burger' },
  { name: 'Dark Chocolate Tart', description: 'Valrhona chocolate, sea salt and vanilla cream.', price: 12, tag: "Chef's pick", art: 'dessert' },
];

export const TEAM: { name: string; role: string; quote: string }[] = [
  { name: 'Antoine Roux', role: 'Executive Chef', quote: 'Tickets reach the pass the second they are fired. My kitchen finally runs in rhythm.' },
  { name: 'Isabella Conti', role: 'General Manager', quote: 'I see sales, covers and stock on one screen. Closing the night takes minutes.' },
  { name: 'Marco Bellini', role: 'Head Waiter', quote: 'The floor plan tells me exactly which table needs me. Guests notice the difference.' },
  { name: 'Hana Sato', role: 'Pastry Chef', quote: 'When I run low on chocolate, the reorder is already in my inbox.' },
];

export const TESTIMONIALS: { quote: string; name: string; role: string; place: string }[] = [
  { quote: 'Online orders used to be a second iPad and a lot of shouting. Now they land in the kitchen on their own.', name: 'Elena Marchetti', role: 'Owner', place: 'Osteria Elena' },
  { quote: 'Our no-shows dropped by a third once guests could book and get reminders. The floor plan is a joy to use.', name: 'James Whitfield', role: 'Restaurateur', place: 'The Copper Table' },
  { quote: 'We cut food waste noticeably in the first quarter. Seeing stock against par changed how we order.', name: 'Aiko Tanaka', role: 'Chef-Owner', place: 'Kita Kitchen' },
];

export const PRICING = [
  { name: 'Starter', monthly: 79, annual: 63, blurb: 'For a single, independent restaurant.', features: ['Menu and table management', 'Online reservations', 'Up to 3 staff accounts', 'Email support'], cta: 'Start with Starter' },
  { name: 'Pro', monthly: 189, annual: 151, blurb: 'For busy restaurants that want every module.', featured: true, features: ['Everything in Starter', 'Online ordering and POS', 'Inventory and supplier reorders', 'Guest and staff mobile apps', 'Priority support'], cta: 'Choose Pro' },
  { name: 'Group', monthly: null, annual: null, blurb: 'For multi-site groups and franchises.', features: ['Unlimited locations', 'Central menu and reporting', 'Custom integrations', 'Dedicated success manager'], cta: 'Talk to sales' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Product', links: ['Features', 'Digital menu', 'Mobile apps', 'Integrations'] },
  { title: 'Company', links: ['About', 'Customers', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Help centre', 'Guides', 'Release notes', 'Status'] },
];
