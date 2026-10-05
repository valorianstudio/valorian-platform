/**
 * Marketing copy for the Course LMS landing page demo. Static, fictional content: the platform "Learnova" is a sample brand, and its
 * instructors, learners and figures are invented for the showcase. Server-only: nothing here ships to the browser.
 */

export const COURSE_BRAND = { name: 'Learnova', tagline: 'Online learning platform' } as const;

export const LANDING_NAV = [
  { label: 'Courses', href: '#categories' },
  { label: 'Features', href: '#features' },
  { label: 'Instructors', href: '#instructors' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Start learning', href: '#contact' },
] as const;

export type FeatureIcon = 'courses' | 'dashboard' | 'instructor' | 'live' | 'certificate' | 'progress' | 'assessment' | 'community';

export const FEATURES: { icon: FeatureIcon; title: string; description: string }[] = [
  { icon: 'courses', title: 'Online Courses', description: 'Video lessons, readings and downloads organised into clear paths from first lesson to last.' },
  { icon: 'dashboard', title: 'Student Dashboard', description: 'Everything due, in progress and recommended, on one screen that is easy to pick up each day.' },
  { icon: 'instructor', title: 'Instructor Management', description: 'Publish courses, manage cohorts and see earnings and engagement in one place.' },
  { icon: 'live', title: 'Live Classes', description: 'Scheduled sessions with recordings, chat and attendance tracked automatically.' },
  { icon: 'certificate', title: 'Certificates', description: 'Verifiable certificates issued on completion, shareable on profiles and résumés.' },
  { icon: 'progress', title: 'Progress Tracking', description: 'Lesson completion, streaks and goals, so learners always know what is next.' },
  { icon: 'assessment', title: 'Assessments', description: 'Quizzes, assignments and proctored exams with instant feedback and clear results.' },
  { icon: 'community', title: 'Community Learning', description: 'Discussion threads and study groups keep learners motivated and answering each other.' },
];

export const CATEGORIES_PUBLIC: { name: string; courses: number; tone: string }[] = [
  { name: 'Development', courses: 186, tone: 'bg-indigo-50 text-indigo-700' },
  { name: 'Design', courses: 112, tone: 'bg-blue-50 text-blue-700' },
  { name: 'Data & AI', courses: 98, tone: 'bg-emerald-50 text-emerald-700' },
  { name: 'Business', courses: 134, tone: 'bg-amber-50 text-amber-800' },
  { name: 'Marketing', courses: 76, tone: 'bg-slate-100 text-slate-700' },
  { name: 'Personal growth', courses: 59, tone: 'bg-violet-50 text-violet-700' },
];

export const INSTRUCTORS_PUBLIC: { name: string; specialty: string; students: string; quote: string }[] = [
  { name: 'Dr. Ada Kim', specialty: 'Software engineering', students: '2,800+ learners', quote: 'My students build real projects in week one. That changes everything about how they learn.' },
  { name: 'Lena Morales', specialty: 'Product design', students: '1,200+ learners', quote: 'Feedback on assignments happens in the lesson, so learners improve before they move on.' },
  { name: 'Omar Haddad', specialty: 'Data science', students: '2,000+ learners', quote: 'Live sessions and recordings sit side by side. Nobody misses a class and nobody falls behind.' },
  { name: 'Priya Nair', specialty: 'Business strategy', students: '860+ learners', quote: 'Publishing a course took an afternoon. Pricing, cohorts and certificates were already there.' },
];

export const TESTIMONIALS: { quote: string; name: string; role: string; org: string }[] = [
  { quote: 'I changed careers in eight months. The paths were clear, the feedback was fast and the certificate opened my first interview.', name: 'Hannah Lindqvist', role: 'Front-end developer', org: 'Career switcher' },
  { quote: 'We moved our whole staff onboarding to Learnova. Completion went up and managers can see exactly where people are stuck.', name: 'Ryan Walsh', role: 'L&D Manager', org: 'Northwind Logistics' },
  { quote: 'As an instructor I finally see who is engaged. The analytics tell me which lesson to rework next.', name: 'Omar Haddad', role: 'Lead instructor', org: 'Data Academy' },
];

export const PLANS_PUBLIC: { name: string; monthly: number | null; annual: number | null; blurb: string; featured?: boolean; features: string[]; cta: string }[] = [
  { name: 'Learner', monthly: 19, annual: 15, blurb: 'For individuals learning at their own pace.', features: ['Access to 500+ courses', 'Progress tracking', 'Certificates of completion', 'Mobile app'], cta: 'Start learning' },
  { name: 'Teams', monthly: 49, annual: 39, blurb: 'For teams that learn together.', featured: true, features: ['Everything in Learner', 'Team dashboards and reports', 'Assignments and exams', 'Live classes', 'Priority support'], cta: 'Start a team trial' },
  { name: 'Academy', monthly: null, annual: null, blurb: 'For schools, universities and academies.', features: ['Unlimited learners', 'Custom branding and domain', 'Course authoring tools', 'Integrations and SSO'], cta: 'Talk to sales' },
];

export const STATS: { value: string; label: string }[] = [
  { value: '2.4M', label: 'Learners worldwide' },
  { value: '1,200+', label: 'Expert instructors' },
  { value: '62%', label: 'Average course completion' },
  { value: '4.8', label: 'Learner rating' },
];

export const FOOTER_LINKS: { title: string; links: string[] }[] = [
  { title: 'Product', links: ['Courses', 'Features', 'Mobile apps', 'Pricing'] },
  { title: 'Company', links: ['About', 'Instructors', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Help centre', 'Guides', 'Release notes', 'Status'] },
];
