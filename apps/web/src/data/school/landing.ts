/**
 * Marketing copy for the School Management System landing page demo. Static, fictional content: the brand "EduCore", its
 * numbers, schools and testimonials are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const SCHOOL_BRAND = { name: 'EduCore', tagline: 'School management platform' } as const;

export const LANDING_NAV = [
  { label: 'Features', href: '#features' },
  { label: 'Why EduCore', href: '#why' },
  { label: 'Results', href: '#results' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Admissions', href: '#contact' },
] as const;

export type FeatureIcon = 'users' | 'teachers' | 'attendance' | 'results' | 'fees' | 'messages' | 'schedule' | 'exams';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'users', title: 'Student Management', description: 'One complete record per student: admission, guardians, medical notes, documents and history.' },
  { icon: 'teachers', title: 'Teacher Management', description: 'Staff profiles, subject allocation, workload and leave in a single, organised view.' },
  { icon: 'attendance', title: 'Attendance Tracking', description: 'Mark a class in seconds. Parents are notified instantly when a child is absent.' },
  { icon: 'results', title: 'Online Results', description: 'Publish report cards and grade trends securely, with no spreadsheets or printing.' },
  { icon: 'fees', title: 'Fee Management', description: 'Automated invoices, online payments, reminders and clear collection reports.' },
  { icon: 'messages', title: 'Parent Communication', description: 'Announcements, messages and event notices that reach every family on any device.' },
  { icon: 'schedule', title: 'Class Scheduling', description: 'Build timetables without clashes and share changes with staff and students at once.' },
  { icon: 'exams', title: 'Exam Management', description: 'Plan exam calendars, assign invigilators, record marks and moderate results.' },
];

export const WHY: { title: string; description: string }[] = [
  { title: 'Built around how schools actually work', description: 'Admissions, terms, houses, guardians and grading scales are first-class, not afterthoughts.' },
  { title: 'Every role gets its own experience', description: 'Administrators, teachers, students and parents each see exactly what they need, nothing more.' },
  { title: 'Secure and private by design', description: 'Role-based access, audit trails and encrypted records keep student data safe.' },
  { title: 'Live in weeks, not months', description: 'We migrate your existing records and train your staff, so day one feels familiar.' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '5,000+', label: 'Students managed' },
  { value: '250+', label: 'Teachers' },
  { value: '100+', label: 'Schools' },
  { value: '40%', label: 'Less admin time' },
];

export const TESTIMONIALS: { quote: string; name: string; role: string; school: string }[] = [
  { quote: 'Attendance, fees and report cards used to take our office three days every term. Now it is done before the weekend.', name: 'Amelia Hart', role: 'Principal', school: 'Northfield Academy' },
  { quote: 'I mark attendance from my phone in under a minute and parents see it straight away. It has removed so much friction.', name: 'Daniel Okafor', role: 'Class Teacher', school: 'Riverside High School' },
  { quote: 'As a parent I can finally see results, fees and announcements in one place, without chasing the school office.', name: 'Priya Raman', role: 'Parent', school: 'Greenwood International' },
];

export const PRICING: { name: string; monthly: number | null; annual: number | null; blurb: string; featured?: boolean; features: string[]; cta: string }[] = [
  { name: 'Starter', monthly: 149, annual: 119, blurb: 'For small schools getting organised.', features: ['Up to 300 students', 'Student and teacher records', 'Attendance and timetables', 'Parent announcements', 'Email support'], cta: 'Start with Starter' },
  { name: 'Growth', monthly: 349, annual: 279, blurb: 'For schools that want everything connected.', featured: true, features: ['Up to 1,500 students', 'Everything in Starter', 'Online results and exams', 'Fee management and payments', 'Parent and student mobile apps', 'Priority support'], cta: 'Choose Growth' },
  { name: 'Enterprise', monthly: null, annual: null, blurb: 'For groups and multi-campus schools.', features: ['Unlimited students', 'Multiple campuses', 'Custom integrations and SSO', 'Dedicated success manager', 'Data migration included'], cta: 'Talk to sales' },
];

export const FAQS: { question: string; answer: string }[] = [
  { question: 'Can we move our existing records across?', answer: 'Yes. We import students, guardians, classes and fee history from spreadsheets or your current system as part of onboarding.' },
  { question: 'Is there a mobile app for parents and teachers?', answer: 'Yes. Students, parents and teachers each get a simple mobile app for attendance, results, schedules and announcements.' },
  { question: 'How is student data protected?', answer: 'Access is role-based, every change is logged, and records are encrypted in transit and at rest.' },
  { question: 'How long does set-up take?', answer: 'Most schools are live within three to six weeks, including data migration and staff training.' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Product', links: ['Features', 'Pricing', 'Mobile apps', 'Security'] },
  { title: 'Company', links: ['About', 'Customers', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Help centre', 'Guides', 'Release notes', 'Status'] },
];
