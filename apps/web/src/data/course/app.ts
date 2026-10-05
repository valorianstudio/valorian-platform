/**
 * Dummy data for the interactive LMS website and mobile app demos. Everything is invented; nothing is fetched or stored. One shared
 * source keeps the dashboard, the instructor view, the student app and the landing page consistent with each other.
 */

export type CourseStatus = 'Published' | 'Draft' | 'Archived';
export type Category = 'Development' | 'Design' | 'Business' | 'Data' | 'Marketing';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type EnrolmentStatus = 'On track' | 'Behind' | 'Completed' | 'At risk';

export interface Course {
  id: string;
  title: string;
  category: Category;
  instructor: string;
  level: Level;
  lessons: number;
  students: number;
  rating: number;
  progress: number;
  status: CourseStatus;
  revenue: number;
  updated: string;
  duration: string;
}

export const COURSES: Course[] = [
  { id: 'c1', title: 'Modern React and TypeScript', category: 'Development', instructor: 'Dr. Ada Kim', level: 'Intermediate', lessons: 42, students: 1840, rating: 4.9, progress: 68, status: 'Published', revenue: 38200, updated: '2 Oct', duration: '18 h' },
  { id: 'c2', title: 'UI Design Systems', category: 'Design', instructor: 'Lena Morales', level: 'Beginner', lessons: 28, students: 1215, rating: 4.8, progress: 54, status: 'Published', revenue: 24100, updated: '28 Sep', duration: '11 h' },
  { id: 'c3', title: 'Data Analysis with Python', category: 'Data', instructor: 'Omar Haddad', level: 'Intermediate', lessons: 36, students: 2030, rating: 4.7, progress: 41, status: 'Published', revenue: 44600, updated: '30 Sep', duration: '16 h' },
  { id: 'c4', title: 'Product Strategy Essentials', category: 'Business', instructor: 'Priya Nair', level: 'Beginner', lessons: 18, students: 860, rating: 4.6, progress: 0, status: 'Draft', revenue: 0, updated: '4 Oct', duration: '6 h' },
  { id: 'c5', title: 'Growth Marketing Playbook', category: 'Marketing', instructor: 'Sam Whitfield', level: 'Advanced', lessons: 24, students: 614, rating: 4.7, progress: 0, status: 'Published', revenue: 12900, updated: '25 Sep', duration: '9 h' },
  { id: 'c6', title: 'Advanced Node.js APIs', category: 'Development', instructor: 'Dr. Ada Kim', level: 'Advanced', lessons: 31, students: 972, rating: 4.8, progress: 0, status: 'Archived', revenue: 18400, updated: '1 Aug', duration: '13 h' },
];

export const CATEGORIES: (Category | 'All')[] = ['All', 'Development', 'Design', 'Data', 'Business', 'Marketing'];

export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  score: number;
  status: EnrolmentStatus;
  joined: string;
  lastActive: string;
}

export const STUDENTS: Student[] = [
  { id: 's1', name: 'Hannah Lindqvist', email: 'hannah.l@mail.example', course: 'Modern React and TypeScript', progress: 82, score: 91, status: 'On track', joined: 'Jan 2026', lastActive: 'Today' },
  { id: 's2', name: 'Marcus Reed', email: 'm.reed@mail.example', course: 'Data Analysis with Python', progress: 47, score: 74, status: 'Behind', joined: 'Mar 2026', lastActive: '2 days ago' },
  { id: 's3', name: 'Sofia Alvarez', email: 'sofia.a@mail.example', course: 'UI Design Systems', progress: 100, score: 96, status: 'Completed', joined: 'Feb 2026', lastActive: 'Yesterday' },
  { id: 's4', name: 'Daniel Osei', email: 'daniel.osei@mail.example', course: 'Modern React and TypeScript', progress: 23, score: 58, status: 'At risk', joined: 'Jun 2026', lastActive: '6 days ago' },
  { id: 's5', name: 'Grace Whitmore', email: 'g.whitmore@mail.example', course: 'Growth Marketing Playbook', progress: 66, score: 85, status: 'On track', joined: 'Apr 2026', lastActive: 'Today' },
  { id: 's6', name: 'Ethan Brooks', email: 'brooks.home@mail.example', course: 'Data Analysis with Python', progress: 58, score: 79, status: 'On track', joined: 'May 2026', lastActive: 'Today' },
  { id: 's7', name: 'Layla Hassan', email: 'layla.h@mail.example', course: 'UI Design Systems', progress: 35, score: 88, status: 'Behind', joined: 'Jul 2026', lastActive: '3 days ago' },
  { id: 's8', name: 'Oliver Grant', email: 'o.grant@mail.example', course: 'Modern React and TypeScript', progress: 90, score: 93, status: 'On track', joined: 'Dec 2025', lastActive: 'Today' },
];

export interface Instructor {
  id: string;
  name: string;
  specialty: string;
  courses: number;
  students: number;
  rating: number;
  earnings: number;
  engagement: number;
  status: 'Online' | 'Away' | 'Offline';
}

export const INSTRUCTORS: Instructor[] = [
  { id: 'i1', name: 'Dr. Ada Kim', specialty: 'Software engineering', courses: 3, students: 2812, rating: 4.9, earnings: 38200, engagement: 92, status: 'Online' },
  { id: 'i2', name: 'Lena Morales', specialty: 'Product design', courses: 2, students: 1215, rating: 4.8, earnings: 24100, engagement: 88, status: 'Online' },
  { id: 'i3', name: 'Omar Haddad', specialty: 'Data science', courses: 2, students: 2030, rating: 4.7, earnings: 44600, engagement: 81, status: 'Away' },
  { id: 'i4', name: 'Priya Nair', specialty: 'Business strategy', courses: 1, students: 860, rating: 4.6, earnings: 0, engagement: 64, status: 'Offline' },
  { id: 'i5', name: 'Sam Whitfield', specialty: 'Growth marketing', courses: 1, students: 614, rating: 4.7, earnings: 12900, engagement: 77, status: 'Offline' },
];

export const DASHBOARD_STATS = { students: 12480, activeCourses: 46, completionRate: 62.4, revenue: 138200 };

export const ENROLMENTS_MONTH = [
  { label: 'May', value: 1120 },
  { label: 'Jun', value: 1280 },
  { label: 'Jul', value: 1390 },
  { label: 'Aug', value: 1470 },
  { label: 'Sep', value: 1610 },
  { label: 'Oct', value: 1740 },
];

export const COMPLETION_WEEK = [
  { label: 'W1', value: 48 },
  { label: 'W2', value: 53 },
  { label: 'W3', value: 57 },
  { label: 'W4', value: 61 },
  { label: 'W5', value: 60 },
  { label: 'W6', value: 64 },
];

export const REVENUE_MONTHS = [
  { label: 'May', value: 98 },
  { label: 'Jun', value: 104 },
  { label: 'Jul', value: 112 },
  { label: 'Aug', value: 119 },
  { label: 'Sep', value: 126 },
  { label: 'Oct', value: 138 },
];

export const CATEGORY_MIX = [
  { label: 'Development', value: 34, tone: 'blue' as const },
  { label: 'Data', value: 28, tone: 'emerald' as const },
  { label: 'Design', value: 20, tone: 'amber' as const },
  { label: 'Business', value: 18, tone: 'slate' as const },
];

export interface Assignment {
  id: string;
  title: string;
  course: string;
  due: string;
  submitted: number;
  total: number;
  kind: 'Assignment' | 'Exam' | 'Quiz';
}

export const ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'Build a typed form', course: 'Modern React and TypeScript', due: 'Fri 9 Oct', submitted: 118, total: 150, kind: 'Assignment' },
  { id: 'a2', title: 'Midterm exam', course: 'Data Analysis with Python', due: 'Mon 12 Oct', submitted: 42, total: 210, kind: 'Exam' },
  { id: 'a3', title: 'Component audit', course: 'UI Design Systems', due: 'Wed 14 Oct', submitted: 77, total: 80, kind: 'Assignment' },
  { id: 'a4', title: 'Week 3 quiz', course: 'Growth Marketing Playbook', due: 'Thu 8 Oct', submitted: 300, total: 300, kind: 'Quiz' },
];

export interface ExamResult {
  student: string;
  course: string;
  score: number;
  grade: string;
  date: string;
}

export const RESULTS: ExamResult[] = [
  { student: 'Hannah Lindqvist', course: 'Modern React and TypeScript', score: 91, grade: 'A', date: '28 Sep' },
  { student: 'Sofia Alvarez', course: 'UI Design Systems', score: 96, grade: 'A+', date: '27 Sep' },
  { student: 'Oliver Grant', course: 'Modern React and TypeScript', score: 93, grade: 'A', date: '28 Sep' },
  { student: 'Marcus Reed', course: 'Data Analysis with Python', score: 74, grade: 'B', date: '26 Sep' },
  { student: 'Daniel Osei', course: 'Modern React and TypeScript', score: 58, grade: 'C', date: '25 Sep' },
];

export interface CertificateRow {
  id: string;
  student: string;
  course: string;
  issued: string;
  code: string;
}

export const CERTIFICATES: CertificateRow[] = [
  { id: 'cert1', student: 'Sofia Alvarez', course: 'UI Design Systems', issued: '2 Oct 2026', code: 'VS-7F2K-91' },
  { id: 'cert2', student: 'Oliver Grant', course: 'Modern React and TypeScript', issued: '29 Sep 2026', code: 'VS-3QX8-27' },
  { id: 'cert3', student: 'Grace Whitmore', course: 'Growth Marketing Playbook', issued: '24 Sep 2026', code: 'VS-9LM1-40' },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: '18 students finished a lesson today', date: 'Just now' },
  { id: 'n2', title: 'Midterm exam opens Monday for 210 students', date: '1 h ago' },
  { id: 'n3', title: 'Your React course earned a 4.9 rating', date: 'Yesterday' },
];

/** Mobile student app: the current course lesson and quiz. */
export const LESSONS = [
  { id: 'l1', title: 'Generics in practice', length: '12 min', done: true },
  { id: 'l2', title: 'Typing React components', length: '18 min', done: true },
  { id: 'l3', title: 'Hooks with strict types', length: '15 min', done: false },
  { id: 'l4', title: 'Testing typed components', length: '22 min', done: false },
];

export const QUIZ = {
  question: 'Which TypeScript feature narrows a union type inside an if statement?',
  options: ['Type assertion', 'Type guard', 'Interface merging', 'Mapped types'],
  answer: 1,
};

export const PROGRESS_WEEKS = [
  { label: 'Mon', value: 40 },
  { label: 'Tue', value: 65 },
  { label: 'Wed', value: 55 },
  { label: 'Thu', value: 80 },
  { label: 'Fri', value: 70 },
  { label: 'Sat', value: 30 },
  { label: 'Sun', value: 45 },
];
