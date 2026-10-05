/**
 * Marketing copy for the Pharmacy landing page demo. Static, fictional content: the pharmacy "Clearwell Pharmacy" is a sample business,
 * and its medicines, pharmacists and figures are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const PHARMACY_BRAND = { name: 'CLEARWELL', tagline: 'Trusted pharmacy care, delivered' } as const;

export const LANDING_NAV = [
  { label: 'Medicines', href: '#categories' },
  { label: 'Services', href: '#services' },
  { label: 'Features', href: '#features' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Delivery', href: '#delivery' },
] as const;

export type FeatureIcon = 'order' | 'prescription' | 'inventory' | 'customers' | 'reminder' | 'delivery' | 'billing' | 'records';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'order', title: 'Online Medicine Ordering', description: 'Search, add to basket and check out in minutes, with pharmacist-checked orders.' },
  { icon: 'prescription', title: 'Prescription Management', description: 'Upload a prescription once and let the pharmacy verify and refill it for you.' },
  { icon: 'inventory', title: 'Inventory Tracking', description: 'Live stock and batch expiry, so every shelf is accurate and nothing expires unseen.' },
  { icon: 'customers', title: 'Customer Management', description: 'Patient profiles and purchase history, so staff can advise with full context.' },
  { icon: 'reminder', title: 'Medicine Reminder', description: 'Dose and refill reminders that keep treatment courses on schedule.' },
  { icon: 'delivery', title: 'Delivery Management', description: 'Same-day delivery with live status, from packed to doorstep.' },
  { icon: 'billing', title: 'Billing System', description: 'Clear receipts, insurance-ready invoices and secure card or wallet payments.' },
  { icon: 'records', title: 'Healthcare Records', description: 'Dispensing history and allergies in one secure record, shared with the patient.' },
];

export const CATEGORIES_PUBLIC: { name: string; blurb: string; tone: string }[] = [
  { name: 'Prescription Medicine', blurb: 'Dispensed by registered pharmacists, with refills on file.', tone: 'bg-[#e6f0f8]' },
  { name: 'Healthcare Products', blurb: 'Pain relief, allergy care, first aid and more.', tone: 'bg-[#f0fdfa]' },
  { name: 'Personal Care', blurb: 'Skin, hygiene and sensitive-care essentials.', tone: 'bg-[#ecfeff]' },
  { name: 'Supplements', blurb: 'Vitamins and daily support from trusted brands.', tone: 'bg-[#f0fdf4]' },
];

export const FEATURED_PRODUCTS: { name: string; detail: string; price: string; tag: string }[] = [
  { name: 'Paracetamol Forte', detail: '500 mg · 16 tablets', price: '$3.40', tag: 'Everyday' },
  { name: 'Vitamin D3 Daily', detail: '2000 IU · 90 capsules', price: '$16.00', tag: 'New' },
  { name: 'Cetirizine Relief', detail: '10 mg · 14 tablets', price: '$4.80', tag: 'Allergy' },
  { name: 'Derma Soothe Cream', detail: '1% · 30 g', price: '$9.60', tag: 'Skin care' },
];

export const SERVICES_PUBLIC: { name: string; blurb: string; from: string }[] = [
  { name: 'Prescription Refills', blurb: 'Request a refill from your phone. We check it and have it ready.', from: 'Free' },
  { name: 'Pharmacist Consultation', blurb: 'Talk to a pharmacist about dosage, interactions and side effects.', from: 'From $10' },
  { name: 'Blood Pressure Checks', blurb: 'Quick screening in store, with results saved to your record.', from: 'Free' },
  { name: 'Vaccination Service', blurb: 'Seasonal flu and travel vaccines by appointment.', from: 'From $25' },
];

export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  { quote: 'My refills are ready before I even ask. The pharmacist explained every change to my dose clearly.', name: 'Hannah Lindqvist', role: 'Patient, Riverside' },
  { quote: 'Managing my father’s prescriptions used to be stressful. Now the reminders and delivery just work.', name: 'Marcus Reed', role: 'Caregiver, Hillcrest' },
  { quote: 'Fast, careful and friendly. The delivery arrived with clear labels and a full receipt.', name: 'Sofia Alvarez', role: 'Patient, Lakeview' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '42,000+', label: 'Prescriptions dispensed' },
  { value: '4.9', label: 'Average rating' },
  { value: '60 min', label: 'Average express delivery' },
  { value: '24/7', label: 'Pharmacist support line' },
];

export const DELIVERY_STEPS: { title: string; description: string }[] = [
  { title: 'Order or upload', description: 'Add medicines to your basket or send a prescription photo.' },
  { title: 'Pharmacist check', description: 'A registered pharmacist verifies every prescription before packing.' },
  { title: 'Secure packing', description: 'Medicines are sealed, labelled and checked against your order.' },
  { title: 'Tracked delivery', description: 'Follow your delivery live, with a signed handover at the door.' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Medicines', links: ['Prescription', 'Healthcare', 'Personal care', 'Supplements'] },
  { title: 'Services', links: ['Refills', 'Consultations', 'Health checks', 'Vaccinations'] },
  { title: 'Help', links: ['Contact pharmacist', 'Delivery information', 'Returns', 'Privacy'] },
];

export const PLANS_PUBLIC: { name: string; monthly: number | null; annual: number | null; blurb: string; featured?: boolean; features: string[]; cta: string }[] = [
  { name: 'Patient Basics', monthly: 0, annual: 0, blurb: 'Ordering, refills and delivery tracking.', features: ['Online ordering', 'Refill requests', 'Delivery tracking'], cta: 'Create account' },
  { name: 'Care Plus', monthly: 9, annual: 7, blurb: 'Our most popular plan for households.', featured: true, features: ['Everything in Basics', 'Free delivery on prescriptions', 'Medicine reminders for the whole family', 'Priority pharmacist line'], cta: 'Choose Care Plus' },
  { name: 'Clinic & Pharmacy', monthly: null, annual: null, blurb: 'For pharmacies and clinics that want the full platform.', features: ['Inventory and POS', 'Prescription workflow', 'Custom integrations'], cta: 'Talk to sales' },
];
