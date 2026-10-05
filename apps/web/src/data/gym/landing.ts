/**
 * Marketing copy for the Gym Management landing page demo. Static, fictional content: the brand "PowerHouse Fitness" (a sample gym),
 * its figures, trainers and testimonials are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const GYM_BRAND = { name: 'FORGE', tagline: 'Smart gym management' } as const;

export const LANDING_NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'Plans', href: '#pricing' },
  { label: 'Results', href: '#results' },
  { label: 'Start free', href: '#contact' },
] as const;

export type FeatureIcon = 'members' | 'workouts' | 'trainers' | 'classes' | 'attendance' | 'payments' | 'progress' | 'booking';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'members', title: 'Membership Management', description: 'Sign-ups, renewals, freezes and cancellations, with every member on one clear status.' },
  { icon: 'workouts', title: 'Workout Plans', description: 'Build programmes from an exercise library and send them to members in one tap.' },
  { icon: 'trainers', title: 'Trainer Management', description: 'Assign clients, track sessions and see each trainer’s schedule and workload.' },
  { icon: 'classes', title: 'Class Scheduling', description: 'A timetable with capacity limits, waitlists and automatic reminders for every class.' },
  { icon: 'attendance', title: 'Attendance Tracking', description: 'QR or card check-in at the door, with live counts for every class and the floor.' },
  { icon: 'payments', title: 'Payment Management', description: 'Automatic direct debits, failed-payment retries and clear invoices for every member.' },
  { icon: 'progress', title: 'Progress Tracking', description: 'Weight, lifts and streaks in one timeline, so members see how far they have come.' },
  { icon: 'booking', title: 'Online Booking', description: 'Members book classes and PT sessions from the website or app in seconds.' },
];

export const TRAINERS_PUBLIC: { name: string; specialty: string; quote: string }[] = [
  { name: 'Jordan Blake', specialty: 'Strength & conditioning', quote: 'I plan a member’s week in the app and they know exactly what to do before they arrive.' },
  { name: 'Priya Shah', specialty: 'Mobility & rehab', quote: 'Progress photos and notes live beside the programme. Check-ins take minutes, not hours.' },
  { name: 'Marco Rossi', specialty: 'Endurance & running', quote: 'Run Club fills up in minutes now, and every runner sees their split times.' },
  { name: 'Aisha Bello', specialty: 'HIIT & group classes', quote: 'Booking, waitlists and reminders run themselves. I can focus on coaching.' },
];

export const PLANS_PUBLIC: { name: string; monthly: number | null; annual: number | null; blurb: string; featured?: boolean; features: string[]; cta: string }[] = [
  { name: 'Basic', monthly: 39, annual: 31, blurb: 'Gym floor access, every day.', features: ['Gym floor access', 'Off-peak classes', 'Locker and shower', 'Online booking'], cta: 'Start Basic' },
  { name: 'Standard', monthly: 69, annual: 55, blurb: 'Our most popular membership.', featured: true, features: ['24/7 access', 'All group classes', 'Workout plan included', 'One PT check-in a month', 'Progress tracking'], cta: 'Choose Standard' },
  { name: 'Premium', monthly: 109, annual: 87, blurb: 'Coaching built around you.', features: ['Everything in Standard', 'Unlimited PT sessions', 'Recovery suite access', 'Trainer chat', 'Guest passes'], cta: 'Go Premium' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '1,140', label: 'Active members' },
  { value: '78%', label: 'Average attendance' },
  { value: '18', label: 'Certified trainers' },
  { value: '4.9', label: 'Member rating' },
];

export const TESTIMONIALS: { quote: string; name: string; role: string; gym: string }[] = [
  { quote: 'Our front desk used to chase payments every week. Now the software does it, and members renew before they even think about it.', name: 'Ryan Walsh', role: 'Owner', gym: 'Iron Parish Gym' },
  { quote: 'The app is the best thing we launched this year. Members book classes, track progress and message their coach all in one place.', name: 'Nina Kowalski', role: 'Studio Director', gym: 'Flow & Form Studio' },
  { quote: 'I went from a clipboard to a live dashboard in a weekend. The class reports alone paid for the system.', name: 'Ben Okafor', role: 'Head Coach', gym: 'Northside Athletic Club' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Product', links: ['Features', 'Member app', 'Trainer app', 'Pricing'] },
  { title: 'Company', links: ['About', 'Gyms we serve', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Help centre', 'Guides', 'Release notes', 'Status'] },
];

export const SHOWCASE = {
  eyebrow: 'Member experience',
  title: 'Every member, every class, one login',
  description: 'Members book, check in and track progress from a single app. Trainers see who is coming and what to coach next.',
};
