/**
 * Marketing copy for the Property landing page demo. Static, fictional content: the company "Keystone Property" is a sample business and
 * its buildings, residents and figures are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const PROPERTY_BRAND = { name: 'KEYSTONE', tagline: 'Smart property management for modern living' } as const;

export const LANDING_NAV = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Features', href: '#features' },
  { label: 'Smart living', href: '#smart' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Pricing', href: '#pricing' },
] as const;

export type FeatureIcon = 'property' | 'tenant' | 'maintenance' | 'rent' | 'smart' | 'operations' | 'visitor' | 'analytics';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'property', title: 'Property Management', description: 'Every building, floor and unit on one screen, with availability and building details.' },
  { icon: 'tenant', title: 'Tenant Management', description: 'Lease dates, contacts and payment history, kept in one profile per resident.' },
  { icon: 'maintenance', title: 'Maintenance Requests', description: 'Residents report issues in seconds, and every ticket is tracked to resolution.' },
  { icon: 'rent', title: 'Rent Collection', description: 'Automatic reminders, direct debit and clear receipts for every payment.' },
  { icon: 'smart', title: 'Smart Home Monitoring', description: 'Heating, water leaks and access controls, monitored and alerted from the app.' },
  { icon: 'operations', title: 'Building Operations', description: 'Staff rotas, inspections and planned works, scheduled across every site.' },
  { icon: 'visitor', title: 'Visitor Management', description: 'Pre-approve guests and deliveries, and see every check-in as it happens.' },
  { icon: 'analytics', title: 'Reports & Analytics', description: 'Occupancy, revenue and maintenance trends for owners and managers.' },
];

export const PROPERTY_TYPES: { name: string; blurb: string; tone: string }[] = [
  { name: 'Apartments', blurb: 'Serviced apartment blocks with concierge, shared amenities and flexible leases.', tone: 'bg-[#f1f5f9]' },
  { name: 'Residential Buildings', blurb: 'Family homes and townhouses, with resident portals and planned upkeep.', tone: 'bg-[#ecfdf5]' },
  { name: 'Commercial Spaces', blurb: 'Offices and retail units, with tenant billing and facilities reporting.', tone: 'bg-[#fdf8e4]' },
];

export const SMART_FEATURES: { title: string; description: string }[] = [
  { title: 'Leak sensors', description: 'Water sensors under sinks and near appliances alert the manager and resident at once.' },
  { title: 'Climate schedules', description: 'Heating and cooling follow each home’s routine and save energy when rooms are empty.' },
  { title: 'Keyless entry', description: 'Residents open the door with the app, and visitors get a time-limited code.' },
  { title: 'Air quality', description: 'CO2 and humidity readings flag ventilation issues before residents notice them.' },
];

export const GALLERY: { title: string; place: string; tone: string }[] = [
  { title: 'Harbor View Residences', place: 'Riverside · 72 units', tone: 'from-[#0f172a] to-[#334155]' },
  { title: 'Maple Court', place: 'Hillcrest · 36 homes', tone: 'from-[#047857] to-[#0f172a]' },
  { title: 'Lumen Tower', place: 'Downtown · 24 suites', tone: 'from-[#334155] to-[#d4af37]' },
  { title: 'Oakline Gardens', place: 'Lakeview · 48 homes', tone: 'from-[#0f172a] to-[#10b981]' },
];

export const WHY: { title: string; description: string }[] = [
  { title: 'Fewer empty units', description: 'Smart listings and tenant screening keep average vacancy under 5%.' },
  { title: 'Faster repairs', description: 'Requests route to the right trade in minutes, not days.' },
  { title: 'Clear finances', description: 'Every rent payment, deposit and invoice is reconciled automatically.' },
];

export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  { quote: 'Maintenance used to be a phone-tag nightmare. Now I see every ticket and its status in one place.', name: 'Priya Shah', role: 'Portfolio manager, Harbor View' },
  { quote: 'Paying rent and approving visitors from my phone is genuinely effortless. The building feels well run.', name: 'Hannah Lindqvist', role: 'Resident, Riverside' },
  { quote: 'Our occupancy and revenue reports used to take a week. Now they are ready every Monday morning.', name: 'Leon Park', role: 'Owner, Maple Court' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '1,200+', label: 'Homes and units managed' },
  { value: '96%', label: 'Average occupancy' },
  { value: '< 24 h', label: 'Typical repair response' },
  { value: '4.9', label: 'Resident satisfaction' },
];

export const GALLERY_NOTE = 'Illustrative portfolio. Figures are fictional.';

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Portfolio', links: ['Apartments', 'Residential', 'Commercial', 'Available units'] },
  { title: 'Company', links: ['About us', 'Careers', 'Owners', 'Press'] },
  { title: 'Help', links: ['Contact us', 'Resident portal', 'Maintenance', 'Privacy'] },
];

export const PLANS_PUBLIC: { name: string; monthly: number | null; annual: number | null; blurb: string; featured?: boolean; features: string[]; cta: string }[] = [
  { name: 'Owner Starter', monthly: 79, annual: 66, blurb: 'For small landlords with up to 10 units.', features: ['Unit and tenant records', 'Rent reminders', 'Maintenance tickets'], cta: 'Start free trial' },
  { name: 'Portfolio Pro', monthly: 199, annual: 165, blurb: 'Our most popular plan for growing portfolios.', featured: true, features: ['Everything in Starter', 'Visitor management and access', 'Smart home monitoring', 'Owner and analytics reports'], cta: 'Choose Pro' },
  { name: 'Enterprise', monthly: null, annual: null, blurb: 'For management companies with large portfolios.', features: ['Unlimited properties and staff', 'Custom integrations', 'Dedicated success manager'], cta: 'Talk to sales' },
];
