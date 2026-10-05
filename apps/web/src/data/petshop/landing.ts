/**
 * Marketing copy for the Pet Shop landing page demo. Static, fictional content: the shop "Pawsome Pet Co." is a sample business, and its
 * pets, customers and figures are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const PETSHOP_BRAND = { name: 'PAWSOME', tagline: 'Complete pet care' } as const;

export const LANDING_NAV = [
  { label: 'Shop', href: '#categories' },
  { label: 'Services', href: '#services' },
  { label: 'Offers', href: '#offers' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Book now', href: '#contact' },
] as const;

export type FeatureIcon = 'store' | 'grooming' | 'vet' | 'inventory' | 'customers' | 'records' | 'online' | 'payments';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'store', title: 'Pet Store Management', description: 'Products, prices and promotions in one place, from the shelf to the online shop.' },
  { icon: 'grooming', title: 'Pet Grooming Booking', description: 'Customers book a slot in seconds, with reminders and a groomer schedule that never double-books.' },
  { icon: 'vet', title: 'Veterinary Appointment', description: 'Checkups, vaccinations and follow-ups booked with the clinic, with clear notes for every visit.' },
  { icon: 'inventory', title: 'Inventory Management', description: 'Live stock levels with low-stock alerts, so the shelves stay full and nothing expires unseen.' },
  { icon: 'customers', title: 'Customer Management', description: 'Owner profiles and purchase history, so every visit feels personal.' },
  { icon: 'records', title: 'Pet Records', description: 'Each pet’s history, allergies, vaccinations and weight, shared between staff and owners.' },
  { icon: 'online', title: 'Online Ordering', description: 'Order food and supplies online, with delivery or click and collect.' },
  { icon: 'payments', title: 'Payment Management', description: 'Card, wallet and account payments with receipts for every visit and order.' },
];

export const CATEGORIES_PUBLIC: { name: string; blurb: string; tone: string }[] = [
  { name: 'Dogs', blurb: 'Food, toys, beds and training treats', tone: 'bg-[#fef3c7]' },
  { name: 'Cats', blurb: 'Grain-free food, litter and play', tone: 'bg-[#eef6ff]' },
  { name: 'Birds', blurb: 'Seed mixes, cuttlebone and perches', tone: 'bg-[#f0fdf4]' },
  { name: 'Accessories', blurb: 'Harnesses, bowls and everyday care', tone: 'bg-[#fff7ed]' },
];

export const SERVICES_PUBLIC: { name: string; blurb: string; from: string }[] = [
  { name: 'Grooming', blurb: 'Bath, brush, nails and a full coat trim by certified groomers.', from: 'From $35' },
  { name: 'Health Checkups', blurb: 'Vet-led checkups, vaccinations and dental care in our clinic.', from: 'From $55' },
  { name: 'Training', blurb: 'Positive-reinforcement classes for puppies and adult dogs.', from: 'From $40 / session' },
  { name: 'Pet Products', blurb: 'Vet-recommended food and supplies, in store and online.', from: 'Shop now' },
];

export const TESTIMONIALS: { quote: string; name: string; pet: string }[] = [
  { quote: 'Biscuit comes home looking like a champion every time. The groomers are gentle and always send photos.', name: 'Hannah Lindqvist', pet: 'Owner of Biscuit, golden retriever' },
  { quote: 'The vet team noticed Luna’s dental issue early. Booking follow-ups online makes the whole thing stress-free.', name: 'Marcus Reed', pet: 'Owner of Luna, British shorthair' },
  { quote: 'Everything Pepper needs is here, from the vaccine schedule to the right food for his sensitive tummy.', name: 'Sofia Alvarez', pet: 'Owner of Pepper, French bulldog' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '12,000+', label: 'Happy pets cared for' },
  { value: '4.9', label: 'Average rating' },
  { value: '18', label: 'Certified groomers and vets' },
  { value: '24 h', label: 'Online order turnaround' },
];

export const OFFERS_PUBLIC = [
  { title: 'First groom, 20% off', detail: 'For new pets, on any full grooming package.', code: 'FIRSTWAG' },
  { title: 'Free nail trim', detail: 'Add a nail trim to any checkup this month.', code: 'PAWTRIM' },
  { title: 'Bundle and save', detail: 'Buy food and a bed together, save 15%.', code: 'HOMEBUNDLE' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Shop', links: ['Dogs', 'Cats', 'Birds', 'Accessories'] },
  { title: 'Services', links: ['Grooming', 'Vet clinic', 'Training', 'Book online'] },
  { title: 'Help', links: ['Contact', 'Delivery', 'Returns', 'Pet records'] },
];

export const PLANS_PUBLIC: { name: string; monthly: number | null; annual: number | null; blurb: string; featured?: boolean; features: string[]; cta: string }[] = [
  { name: 'Pet Basics', monthly: 12, annual: 10, blurb: 'Records and reminders for one pet.', features: ['Pet profile and history', 'Vaccination reminders', 'Online booking'], cta: 'Start Basics' },
  { name: 'Pet Plus', monthly: 29, annual: 24, blurb: 'Our most popular plan for active families.', featured: true, features: ['Everything in Basics', 'Discounts on grooming and checkups', 'Free delivery on food', 'Priority appointments'], cta: 'Choose Plus' },
  { name: 'Business', monthly: null, annual: null, blurb: 'For shops, clinics and grooming studios.', features: ['Unlimited staff and pets', 'Inventory and POS', 'Custom integrations'], cta: 'Talk to sales' },
];
