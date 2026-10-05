/**
 * Marketing copy for the Bike Delivery landing page demo. Static, fictional content: the company "Swiftwheel" is a sample brand, and its
 * riders, partners and figures are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const DELIVERY_BRAND = { name: 'SWIFTWHEEL', tagline: 'Fast, reliable delivery' } as const;

export const LANDING_NAV = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Partners', href: '#partners' },
  { label: 'Order now', href: '#book' },
] as const;

export type FeatureIcon = 'booking' | 'tracking' | 'riders' | 'route' | 'payments' | 'analytics';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'booking', title: 'Instant Delivery Booking', description: 'Book in under a minute. We match the nearest available rider and confirm the time.' },
  { icon: 'tracking', title: 'Real-time Tracking', description: 'Follow your rider on the map, with a live ETA and a message when they arrive.' },
  { icon: 'riders', title: 'Rider Management', description: 'Vetted riders, clear availability and a rating on every delivery, so quality stays high.' },
  { icon: 'route', title: 'Route Optimization', description: 'Routes are re-planned as orders come in, cutting distance and waiting time.' },
  { icon: 'payments', title: 'Secure Payments', description: 'Card, wallet and business invoicing, with a receipt for every delivery.' },
  { icon: 'analytics', title: 'Delivery Analytics', description: 'On-time rates, costs per drop and demand by hour for businesses that deliver often.' },
];

export const SERVICES_PUBLIC: { name: string; blurb: string; from: string; tone: string }[] = [
  { name: 'Food Delivery', blurb: 'Hot from the kitchen to the door in 20–30 minutes.', from: 'From $4.90', tone: 'bg-[#fff3e8]' },
  { name: 'Parcel Delivery', blurb: 'Documents and packages collected and delivered the same day.', from: 'From $6.90', tone: 'bg-[#eaf1ff]' },
  { name: 'Business Delivery', blurb: 'Scheduled runs, invoicing and a dedicated account manager.', from: 'Custom pricing', tone: 'bg-[#eefbf3]' },
];

export const HOW_IT_WORKS: { title: string; description: string }[] = [
  { title: 'Place order', description: 'Choose pickup and drop-off, add notes and pay in one tap.' },
  { title: 'Rider pickup', description: 'The nearest rider accepts and collects your order within minutes.' },
  { title: 'Live tracking', description: 'Watch the route on the map and get a message before arrival.' },
  { title: 'Delivery completed', description: 'Proof of delivery is sent to you, with a receipt and rating.' },
];

export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  { quote: 'Our kitchen used to lose half an hour every lunch to couriers. With Swiftwheel, the food is at the door before it cools.', name: 'Elena Marchetti', role: 'Owner, Osteria Elena' },
  { quote: 'We send 40 parcels a day. The live map means our customers stop calling us to ask where things are.', name: 'Ryan Walsh', role: 'Operations, Northwind Logistics' },
  { quote: 'As a rider I see my route, my earnings and the next order in one app. It is the smoothest shift I have worked.', name: 'Marco Rossi', role: 'Rider, Harbour zone' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '28 min', label: 'Average food delivery' },
  { value: '96%', label: 'On-time deliveries' },
  { value: '1,200+', label: 'Partner restaurants and shops' },
  { value: '4.8', label: 'Customer rating' },
];

export const PARTNERS = ['Ember & Oak', 'Sushi Kaze', 'Green Bowl', 'Post Hub', 'Studio Print Co.', 'Harbour Pharmacy'] as const;

export const PLANS_PUBLIC: { name: string; monthly: number | null; annual: number | null; blurb: string; featured?: boolean; features: string[]; cta: string }[] = [
  { name: 'Pay as you go', monthly: 0, annual: 0, blurb: 'No subscription. Pay for each delivery.', features: ['Food and parcel delivery', 'Live tracking', 'Standard priority', 'Receipts and history'], cta: 'Book a delivery' },
  { name: 'Business', monthly: 99, annual: 79, blurb: 'For shops and companies that deliver every day.', featured: true, features: ['Everything in pay as you go', 'Discounted per-drop rates', 'Scheduled runs and invoicing', 'Priority riders', 'Delivery analytics'], cta: 'Start a business trial' },
  { name: 'Enterprise', monthly: null, annual: null, blurb: 'For fleets, chains and logistics teams.', features: ['Dedicated dispatch team', 'API and system integration', 'Custom service levels', 'Account manager'], cta: 'Talk to sales' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Services', links: ['Food delivery', 'Parcel delivery', 'Business', 'Pricing'] },
  { title: 'Riders', links: ['Become a rider', 'Rider app', 'Safety', 'Earnings'] },
  { title: 'Company', links: ['About', 'Partners', 'Careers', 'Contact'] },
];
