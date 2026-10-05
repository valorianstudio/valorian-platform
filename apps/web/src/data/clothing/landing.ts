/**
 * Marketing copy for the Clothing E-commerce landing page demo. Static, fictional content: the brand "Maison Vale" is a sample label,
 * and its collections, customers and reviews are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const CLOTHING_BRAND = { name: 'MAISON VALE', tagline: 'Fashion for the way you live' } as const;

export const LANDING_NAV = [
  { label: 'New in', href: '#collections' },
  { label: 'Men', href: '#categories' },
  { label: 'Women', href: '#categories' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Contact', href: '#newsletter' },
] as const;

export type FeatureIcon = 'collections' | 'showcase' | 'shopping' | 'secure' | 'delivery' | 'reviews';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'collections', title: 'New Collections', description: 'Seasonal edits released every few weeks, with pieces designed to layer and last.' },
  { icon: 'showcase', title: 'Product Showcase', description: 'Every garment shown in detail: fabric close-ups, fit notes and styling ideas.' },
  { icon: 'shopping', title: 'Easy Shopping', description: 'Size guides, saved favourites and a bag that remembers you across every device.' },
  { icon: 'secure', title: 'Secure Checkout', description: 'Encrypted payments and one-tap wallets, with clear pricing before you confirm.' },
  { icon: 'delivery', title: 'Fast Delivery', description: 'Free express shipping on orders over $200, and tracked delivery to your door.' },
  { icon: 'reviews', title: 'Customer Reviews', description: 'Verified reviews with fit feedback, so you know exactly how a piece will wear.' },
];

export const CATEGORIES_PUBLIC: { name: string; blurb: string; tone: string }[] = [
  { name: 'Men', blurb: 'Tailoring, knitwear and everyday staples', tone: 'bg-[#eee9df]' },
  { name: 'Women', blurb: 'Dresses, outerwear and considered basics', tone: 'bg-[#f3efe8]' },
  { name: 'Accessories', blurb: 'Leather goods, scarves and finishing touches', tone: 'bg-[#e9e3d7]' },
];

export const TESTIMONIALS: { quote: string; name: string; city: string }[] = [
  { quote: 'The coat looks better every season. The fabric is exactly as described, and delivery was faster than promised.', name: 'Hannah Lindqvist', city: 'Stockholm' },
  { quote: 'Sizing is accurate and returns are effortless. It is the first online store I trust with my wardrobe.', name: 'Marcus Reed', city: 'Chicago' },
  { quote: 'I bought the slip dress for a wedding and it photographed beautifully. I have worn it three times since.', name: 'Sofia Alvarez', city: 'Madrid' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '4.8', label: 'Average review rating' },
  { value: '48h', label: 'Average dispatch time' },
  { value: '92%', label: 'Customers who return' },
  { value: '60', label: 'Countries delivered to' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Shop', links: ['New in', 'Men', 'Women', 'Accessories'] },
  { title: 'Help', links: ['Size guide', 'Delivery', 'Returns', 'Contact'] },
  { title: 'Company', links: ['About', 'Sustainability', 'Careers', 'Press'] },
];

export const NEWSLETTER_COPY = {
  title: 'Be the first to see new arrivals',
  description: 'Early access to collections, private sales and style notes, once a fortnight. Unsubscribe at any time.',
};
