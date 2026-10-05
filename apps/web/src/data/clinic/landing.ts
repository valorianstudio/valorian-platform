/**
 * Marketing copy for the Clinic Management landing page demo. Static, fictional content: the brand "ClinicOS", its numbers,
 * clinics, doctors and testimonials are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const CLINIC_BRAND = { name: 'ClinicOS', tagline: 'Clinic and dental care management' } as const;

export const LANDING_NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Dental care', href: '#dental' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Results', href: '#results' },
  { label: 'Book a demo', href: '#contact' },
] as const;

export type FeatureIcon = 'patients' | 'appointments' | 'doctors' | 'prescription' | 'records' | 'billing' | 'reports';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'patients', title: 'Patient Management', description: 'Every patient in one calm profile: contact details, insurance, history and balance.' },
  { icon: 'appointments', title: 'Appointment Booking', description: 'A shared calendar with online booking, automatic reminders and no double bookings.' },
  { icon: 'doctors', title: 'Doctor Management', description: 'Schedules, rooms and availability for every dentist, hygienist and specialist.' },
  { icon: 'prescription', title: 'Digital Prescription', description: 'Write, send and renew prescriptions in seconds, with allergy checks built in.' },
  { icon: 'records', title: 'Medical Records', description: 'Notes, X-rays, dental charts and treatment plans, securely stored and instantly searchable.' },
  { icon: 'billing', title: 'Billing', description: 'Itemised invoices, insurance claims and online payments, with clear payment status.' },
  { icon: 'reports', title: 'Reports', description: 'Revenue, patient growth and treatment mix, ready for the owner and the accountant.' },
];

export const DENTAL_POINTS: string[] = ['Interactive 32-tooth chart with FDI numbering', 'Treatment plans linked to each tooth', 'Visit history and X-rays on one timeline', 'Estimates patients can approve from their phone'];

export const DOCTORS: { name: string; role: string; focus: string; quote: string }[] = [
  { name: 'Dr. Amara Okoye', role: 'Lead Dentist', focus: 'Restorative & cosmetic', quote: 'I see my whole day, every chart and every note, before the first patient sits down.' },
  { name: 'Dr. Leo Hartmann', role: 'Orthodontist', focus: 'Braces & aligners', quote: 'Treatment plans and progress photos live in one place, so follow-ups take minutes.' },
  { name: 'Dr. Mei Tanaka', role: 'Paediatric Dentist', focus: 'Children & families', quote: 'Parents confirm and reschedule from their phone. No-shows have almost disappeared.' },
  { name: 'Dr. Rafael Costa', role: 'GP & Clinic Director', focus: 'Family medicine', quote: 'Billing, prescriptions and reports finally agree with each other.' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '120+', label: 'Clinics served' },
  { value: '48,000', label: 'Patients managed' },
  { value: '35%', label: 'Fewer no-shows' },
  { value: '4.9/5', label: 'Average rating' },
];

export const TESTIMONIALS: { quote: string; name: string; role: string; clinic: string }[] = [
  { quote: 'Our front desk used to juggle three systems. Now booking, billing and records are one screen, and patients notice the difference.', name: 'Dr. Priya Nair', role: 'Owner', clinic: 'Brightsmile Dental' },
  { quote: 'The dental chart and treatment plans alone were worth switching. Case acceptance went up within two months.', name: 'Dr. Marcus Webb', role: 'Principal Dentist', clinic: 'Webb & Partners Dental' },
  { quote: 'I booked my check-up, got a reminder and paid online. I never called the clinic once.', name: 'Hannah Lindqvist', role: 'Patient', clinic: 'Brightsmile Dental' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Product', links: ['Features', 'Dental chart', 'Mobile apps', 'Security'] },
  { title: 'Company', links: ['About', 'Customers', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Help centre', 'Guides', 'Release notes', 'Status'] },
];
