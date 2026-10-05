/**
 * Dummy data for the interactive School Management website and mobile app demos. Everything is invented; nothing is fetched or stored.
 * One shared source keeps the website, the mobile app and the landing preview consistent with each other.
 */

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';
export type FeeStatus = 'Paid' | 'Due' | 'Overdue';

export interface Student {
  id: string;
  name: string;
  className: string;
  roll: number;
  guardian: string;
  phone: string;
  attendance: number;
  average: number;
  today: AttendanceStatus;
  fees: FeeStatus;
}

export const STUDENTS: Student[] = [
  { id: 's1', name: 'Olivia Bennett', className: 'Grade 8-A', roll: 1, guardian: 'Mark Bennett', phone: '+1 555 0142', attendance: 98, average: 91, today: 'Present', fees: 'Paid' },
  { id: 's2', name: 'Ethan Walker', className: 'Grade 8-A', roll: 2, guardian: 'Laura Walker', phone: '+1 555 0177', attendance: 94, average: 84, today: 'Present', fees: 'Paid' },
  { id: 's3', name: 'Sophia Nguyen', className: 'Grade 8-B', roll: 3, guardian: 'Minh Nguyen', phone: '+1 555 0119', attendance: 89, average: 88, today: 'Late', fees: 'Due' },
  { id: 's4', name: 'Liam Carter', className: 'Grade 9-A', roll: 4, guardian: 'Janet Carter', phone: '+1 555 0165', attendance: 76, average: 69, today: 'Absent', fees: 'Overdue' },
  { id: 's5', name: 'Ava Martinez', className: 'Grade 9-A', roll: 5, guardian: 'Carlos Martinez', phone: '+1 555 0108', attendance: 97, average: 93, today: 'Present', fees: 'Paid' },
  { id: 's6', name: 'Noah Patel', className: 'Grade 9-B', roll: 6, guardian: 'Anita Patel', phone: '+1 555 0133', attendance: 92, average: 79, today: 'Present', fees: 'Paid' },
  { id: 's7', name: 'Mia Johansson', className: 'Grade 10-A', roll: 7, guardian: 'Erik Johansson', phone: '+1 555 0151', attendance: 95, average: 87, today: 'Present', fees: 'Due' },
  { id: 's8', name: 'Lucas Adeyemi', className: 'Grade 10-A', roll: 8, guardian: 'Grace Adeyemi', phone: '+1 555 0184', attendance: 83, average: 72, today: 'Late', fees: 'Paid' },
  { id: 's9', name: 'Isla Fraser', className: 'Grade 10-B', roll: 9, guardian: 'Callum Fraser', phone: '+1 555 0126', attendance: 99, average: 95, today: 'Present', fees: 'Paid' },
  { id: 's10', name: 'Zayn Rahman', className: 'Grade 8-B', roll: 10, guardian: 'Nadia Rahman', phone: '+1 555 0190', attendance: 91, average: 81, today: 'Present', fees: 'Paid' },
];

export const CLASS_NAMES = ['All classes', 'Grade 8-A', 'Grade 8-B', 'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B'] as const;

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  experience: string;
  rating: number;
  status: 'In class' | 'Free' | 'On leave';
}

export const TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Helen Brooks', subject: 'Mathematics', classes: ['8-A', '9-A', '10-A'], experience: '14 years', rating: 4.9, status: 'In class' },
  { id: 't2', name: 'Samuel Rivera', subject: 'Physics', classes: ['9-A', '9-B', '10-B'], experience: '9 years', rating: 4.7, status: 'Free' },
  { id: 't3', name: 'Grace Whitfield', subject: 'English', classes: ['8-A', '8-B'], experience: '11 years', rating: 4.8, status: 'In class' },
  { id: 't4', name: 'Arjun Mehta', subject: 'Chemistry', classes: ['10-A', '10-B'], experience: '7 years', rating: 4.6, status: 'On leave' },
  { id: 't5', name: 'Claire Dubois', subject: 'History', classes: ['8-B', '9-B'], experience: '12 years', rating: 4.7, status: 'Free' },
  { id: 't6', name: 'Tobias Klein', subject: 'Computer Science', classes: ['9-A', '10-A', '10-B'], experience: '6 years', rating: 4.9, status: 'In class' },
];

export interface ClassGroup {
  name: string;
  teacher: string;
  students: number;
  room: string;
  average: number;
}

export const CLASSES: ClassGroup[] = [
  { name: 'Grade 8-A', teacher: 'Grace Whitfield', students: 32, room: 'Room 101', average: 86 },
  { name: 'Grade 8-B', teacher: 'Claire Dubois', students: 30, room: 'Room 102', average: 82 },
  { name: 'Grade 9-A', teacher: 'Dr. Helen Brooks', students: 34, room: 'Room 201', average: 84 },
  { name: 'Grade 9-B', teacher: 'Samuel Rivera', students: 31, room: 'Room 202', average: 79 },
  { name: 'Grade 10-A', teacher: 'Tobias Klein', students: 33, room: 'Room 301', average: 88 },
  { name: 'Grade 10-B', teacher: 'Arjun Mehta', students: 29, room: 'Room 302', average: 81 },
];

export const DASHBOARD_STATS = {
  students: 1284,
  teachers: 86,
  classes: 42,
  attendance: 94.6,
  collected: 482600,
  target: 560000,
};

/** Weekly attendance for the dashboard chart (percent present). */
export const WEEK_ATTENDANCE = [
  { label: 'Mon', value: 95 },
  { label: 'Tue', value: 96 },
  { label: 'Wed', value: 93 },
  { label: 'Thu', value: 94 },
  { label: 'Fri', value: 91 },
];

/** Fee collection by month, in thousands of dollars. */
export const FEE_MONTHS = [
  { label: 'May', value: 62 },
  { label: 'Jun', value: 71 },
  { label: 'Jul', value: 58 },
  { label: 'Aug', value: 84 },
  { label: 'Sep', value: 96 },
  { label: 'Oct', value: 78 },
];

export const FEE_BREAKDOWN = [
  { label: 'Paid', value: 78, tone: 'emerald' as const },
  { label: 'Due', value: 15, tone: 'blue' as const },
  { label: 'Overdue', value: 7, tone: 'amber' as const },
];

export const SUBJECT_SCORES = [
  { label: 'Maths', value: 92 },
  { label: 'English', value: 88 },
  { label: 'Science', value: 94 },
  { label: 'History', value: 81 },
  { label: 'Computing', value: 97 },
  { label: 'Art', value: 86 },
];

export const TERM_TREND = [
  { label: 'T1', value: 78 },
  { label: 'T2', value: 83 },
  { label: 'T3', value: 86 },
  { label: 'T4', value: 91 },
];

export interface Exam {
  subject: string;
  className: string;
  date: string;
  time: string;
  room: string;
  status: 'Scheduled' | 'Marking' | 'Published';
}

export const EXAMS: Exam[] = [
  { subject: 'Mathematics', className: 'Grade 9-A', date: 'Mon 12 Oct', time: '09:00', room: 'Hall A', status: 'Scheduled' },
  { subject: 'Physics', className: 'Grade 9-B', date: 'Tue 13 Oct', time: '10:30', room: 'Lab 2', status: 'Scheduled' },
  { subject: 'English Literature', className: 'Grade 8-A', date: 'Wed 14 Oct', time: '09:00', room: 'Hall B', status: 'Scheduled' },
  { subject: 'Chemistry', className: 'Grade 10-A', date: 'Fri 2 Oct', time: '09:00', room: 'Lab 1', status: 'Marking' },
  { subject: 'History', className: 'Grade 8-B', date: 'Thu 1 Oct', time: '13:00', room: 'Room 102', status: 'Published' },
];

export interface ResultRow {
  subject: string;
  score: number;
  grade: string;
  teacher: string;
}

export const RESULTS: ResultRow[] = [
  { subject: 'Mathematics', score: 92, grade: 'A', teacher: 'Dr. Helen Brooks' },
  { subject: 'English', score: 88, grade: 'A-', teacher: 'Grace Whitfield' },
  { subject: 'Science', score: 94, grade: 'A', teacher: 'Samuel Rivera' },
  { subject: 'History', score: 81, grade: 'B+', teacher: 'Claire Dubois' },
  { subject: 'Computing', score: 97, grade: 'A+', teacher: 'Tobias Klein' },
  { subject: 'Art', score: 86, grade: 'A-', teacher: 'Nina Alvarez' },
];

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  tag: 'Event' | 'Notice' | 'Academic';
}

export const ANNOUNCEMENTS: Announcement[] = [
  { id: 'a1', title: 'Parent-teacher meetings', body: 'Meetings run on Friday 16 October from 2 pm. Book a slot from the parent portal.', date: '5 Oct', tag: 'Event' },
  { id: 'a2', title: 'Mid-term exam timetable published', body: 'Exams begin Monday 12 October. Please check the schedule and room allocations.', date: '3 Oct', tag: 'Academic' },
  { id: 'a3', title: 'School closed for staff training', body: 'The school will be closed on Monday 19 October. Classes resume on Tuesday.', date: '2 Oct', tag: 'Notice' },
  { id: 'a4', title: 'Science fair registration open', body: 'Students can register projects until 23 October. Teams of up to three are welcome.', date: '30 Sep', tag: 'Event' },
];

export interface Period {
  time: string;
  subject: string;
  className: string;
  room: string;
}

export const TEACHER_SCHEDULE: Period[] = [
  { time: '08:30', subject: 'Mathematics', className: 'Grade 8-A', room: 'Room 101' },
  { time: '09:30', subject: 'Mathematics', className: 'Grade 9-A', room: 'Room 201' },
  { time: '11:00', subject: 'Free period', className: 'Marking and planning', room: 'Staff room' },
  { time: '12:00', subject: 'Mathematics', className: 'Grade 10-A', room: 'Room 301' },
  { time: '14:00', subject: 'Maths clinic', className: 'Open session', room: 'Room 101' },
];

export const STUDENT_SCHEDULE: Period[] = [
  { time: '08:30', subject: 'Mathematics', className: 'Dr. Brooks', room: 'Room 101' },
  { time: '09:30', subject: 'English', className: 'Ms. Whitfield', room: 'Room 101' },
  { time: '11:00', subject: 'Science', className: 'Mr. Rivera', room: 'Lab 2' },
  { time: '12:00', subject: 'Computing', className: 'Mr. Klein', room: 'IT Suite' },
  { time: '14:00', subject: 'Art', className: 'Ms. Alvarez', room: 'Studio' },
];

export const PARENT_CHILD = {
  name: 'Olivia Bennett',
  className: 'Grade 8-A',
  roll: 1,
  homeroom: 'Ms. Whitfield',
  attendance: 98,
  average: 91,
  rank: 3,
};

/** Month attendance grid for the parent portal and student app: one status per school day. */
export const MONTH_ATTENDANCE: AttendanceStatus[] = [
  'Present', 'Present', 'Present', 'Late', 'Present',
  'Present', 'Present', 'Absent', 'Present', 'Present',
  'Present', 'Present', 'Present', 'Present', 'Present',
  'Present', 'Late', 'Present', 'Present', 'Present',
];

export const SPARK_ATTENDANCE = [91, 94, 93, 96, 95, 98];
