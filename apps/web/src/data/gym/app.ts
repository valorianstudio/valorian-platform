/**
 * Dummy data for the interactive Gym Management website and mobile app demos. Everything is invented; nothing is fetched or stored.
 * One shared source keeps the dashboard, the trainer view, the member app and the landing page consistent with each other.
 */

export type MembershipStatus = 'Active' | 'Expiring' | 'Expired' | 'Paused';
export type PlanName = 'Basic' | 'Standard' | 'Premium' | 'Student';
export type InvoiceStatus = 'Paid' | 'Due' | 'Overdue';

export interface Member {
  id: string;
  name: string;
  age: number;
  phone: string;
  email: string;
  plan: PlanName;
  status: MembershipStatus;
  trainer: string;
  joined: string;
  renews: string;
  checkIns: number;
  streak: number;
  goal: string;
  progress: number;
  visits: number[];
}

export const MEMBERS: Member[] = [
  { id: 'm1', name: 'Hannah Lindqvist', age: 29, phone: '+1 555 0111', email: 'hannah.l@mail.example', plan: 'Premium', status: 'Active', trainer: 'Jordan Blake', joined: 'Jan 2026', renews: '12 Nov 2026', checkIns: 142, streak: 9, goal: 'Build strength', progress: 72, visits: [1, 0, 1, 1, 0, 1, 1] },
  { id: 'm2', name: 'Marcus Reed', age: 38, phone: '+1 555 0122', email: 'm.reed@mail.example', plan: 'Standard', status: 'Active', trainer: 'Priya Shah', joined: 'Mar 2025', renews: '02 Nov 2026', checkIns: 268, streak: 4, goal: 'Lose 8 kg', progress: 58, visits: [1, 1, 0, 1, 1, 0, 0] },
  { id: 'm3', name: 'Sofia Alvarez', age: 24, phone: '+1 555 0133', email: 'sofia.a@mail.example', plan: 'Student', status: 'Expiring', trainer: 'Jordan Blake', joined: 'Sep 2025', renews: '08 Oct 2026', checkIns: 96, streak: 2, goal: 'Run a 10k', progress: 41, visits: [0, 1, 1, 0, 0, 1, 0] },
  { id: 'm4', name: 'Daniel Osei', age: 33, phone: '+1 555 0144', email: 'daniel.osei@mail.example', plan: 'Basic', status: 'Active', trainer: 'Unassigned', joined: 'Jun 2026', renews: '20 Dec 2026', checkIns: 31, streak: 3, goal: 'Better mobility', progress: 22, visits: [1, 0, 0, 1, 1, 0, 1] },
  { id: 'm5', name: 'Grace Whitmore', age: 61, phone: '+1 555 0155', email: 'g.whitmore@mail.example', plan: 'Standard', status: 'Paused', trainer: 'Priya Shah', joined: 'Feb 2024', renews: 'Paused', checkIns: 311, streak: 0, goal: 'Stay active', progress: 84, visits: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'm6', name: 'Ethan Brooks', age: 19, phone: '+1 555 0166', email: 'brooks.home@mail.example', plan: 'Student', status: 'Expired', trainer: 'Unassigned', joined: 'Apr 2025', renews: 'Expired 28 Sep', checkIns: 74, streak: 0, goal: 'Build muscle', progress: 35, visits: [0, 0, 0, 0, 0, 0, 0] },
  { id: 'm7', name: 'Layla Hassan', age: 31, phone: '+1 555 0177', email: 'layla.h@mail.example', plan: 'Premium', status: 'Active', trainer: 'Marco Rossi', joined: 'Nov 2025', renews: '18 Nov 2026', checkIns: 188, streak: 12, goal: 'Marathon prep', progress: 66, visits: [1, 1, 1, 0, 1, 1, 1] },
  { id: 'm8', name: 'Oliver Grant', age: 45, phone: '+1 555 0188', email: 'o.grant@mail.example', plan: 'Standard', status: 'Active', trainer: 'Marco Rossi', joined: 'Jul 2026', renews: '05 Dec 2026', checkIns: 18, streak: 1, goal: 'Core and posture', progress: 15, visits: [0, 1, 0, 0, 0, 1, 0] },
];

export const PLANS: { name: PlanName; price: number; members: number; perks: string[] }[] = [
  { name: 'Basic', price: 39, members: 318, perks: ['Gym floor access', 'Off-peak classes', 'Locker'] },
  { name: 'Standard', price: 69, members: 512, perks: ['24/7 access', 'All classes', 'One PT check-in a month'] },
  { name: 'Premium', price: 109, members: 214, perks: ['Everything in Standard', 'Unlimited PT sessions', 'Recovery suite'] },
  { name: 'Student', price: 29, members: 96, perks: ['Off-peak access', 'Student-friendly classes'] },
];

export const DASHBOARD_STATS = { activeMembers: 1140, monthlyRevenue: 84250, classesToday: 12, attendanceRate: 78.4, trainers: 18 };

export const WEEK_ATTENDANCE = [
  { label: 'Mon', value: 212 },
  { label: 'Tue', value: 246 },
  { label: 'Wed', value: 231 },
  { label: 'Thu', value: 268 },
  { label: 'Fri', value: 290 },
  { label: 'Sat', value: 341 },
  { label: 'Sun', value: 205 },
];

export const MEMBER_GROWTH = [
  { label: 'Apr', value: 880 },
  { label: 'May', value: 942 },
  { label: 'Jun', value: 998 },
  { label: 'Jul', value: 1041 },
  { label: 'Aug', value: 1079 },
  { label: 'Sep', value: 1112 },
  { label: 'Oct', value: 1140 },
];

export const REVENUE_MONTHS = [
  { label: 'May', value: 71 },
  { label: 'Jun', value: 74 },
  { label: 'Jul', value: 78 },
  { label: 'Aug', value: 80 },
  { label: 'Sep', value: 82 },
  { label: 'Oct', value: 84 },
];

export const PLAN_MIX = [
  { label: 'Standard', value: 45, tone: 'blue' as const },
  { label: 'Premium', value: 19, tone: 'emerald' as const },
  { label: 'Basic', value: 28, tone: 'amber' as const },
  { label: 'Student', value: 8, tone: 'slate' as const },
];

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  clients: number;
  rating: number;
  status: 'In session' | 'Available' | 'Off today';
  rate: number;
}

export const TRAINERS: Trainer[] = [
  { id: 't1', name: 'Jordan Blake', specialty: 'Strength & conditioning', clients: 14, rating: 4.9, status: 'In session', rate: 55 },
  { id: 't2', name: 'Priya Shah', specialty: 'Mobility & rehab', clients: 11, rating: 4.8, status: 'Available', rate: 50 },
  { id: 't3', name: 'Marco Rossi', specialty: 'Endurance & running', clients: 13, rating: 4.7, status: 'In session', rate: 50 },
  { id: 't4', name: 'Aisha Bello', specialty: 'HIIT & group classes', clients: 9, rating: 4.8, status: 'Available', rate: 45 },
  { id: 't5', name: 'Tomas Novak', specialty: 'Boxing & cardio', clients: 10, rating: 4.6, status: 'Off today', rate: 48 },
];

export interface GymClass {
  id: string;
  time: string;
  name: string;
  trainer: string;
  day: number;
  capacity: number;
  booked: number;
  room: string;
  level: 'All levels' | 'Intermediate' | 'Advanced';
}

export const CLASSES: GymClass[] = [
  { id: 'c1', time: '06:30', name: 'Morning HIIT', trainer: 'Aisha Bello', day: 0, capacity: 20, booked: 18, room: 'Studio A', level: 'Intermediate' },
  { id: 'c2', time: '07:30', name: 'Power Yoga', trainer: 'Priya Shah', day: 0, capacity: 16, booked: 12, room: 'Studio B', level: 'All levels' },
  { id: 'c3', time: '09:00', name: 'Strength Foundations', trainer: 'Jordan Blake', day: 0, capacity: 12, booked: 12, room: 'Free weights', level: 'All levels' },
  { id: 'c4', time: '12:15', name: 'Lunch Spin', trainer: 'Tomas Novak', day: 0, capacity: 24, booked: 15, room: 'Cycle room', level: 'Intermediate' },
  { id: 'c5', time: '17:30', name: 'Boxing Basics', trainer: 'Tomas Novak', day: 0, capacity: 14, booked: 9, room: 'Ring', level: 'All levels' },
  { id: 'c6', time: '18:30', name: 'Run Club', trainer: 'Marco Rossi', day: 0, capacity: 30, booked: 22, room: 'Track', level: 'Advanced' },
  { id: 'c7', time: '19:30', name: 'Mobility Reset', trainer: 'Priya Shah', day: 0, capacity: 18, booked: 6, room: 'Studio B', level: 'All levels' },
  { id: 'c8', time: '07:00', name: 'Sunrise Strength', trainer: 'Jordan Blake', day: 1, capacity: 12, booked: 8, room: 'Free weights', level: 'Advanced' },
  { id: 'c9', time: '18:00', name: 'HIIT Circuit', trainer: 'Aisha Bello', day: 2, capacity: 20, booked: 20, room: 'Studio A', level: 'Intermediate' },
];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export interface Invoice {
  id: string;
  member: string;
  item: string;
  amount: number;
  date: string;
  status: InvoiceStatus;
}

export const INVOICES: Invoice[] = [
  { id: 'INV-5101', member: 'Hannah Lindqvist', item: 'Premium · October', amount: 109, date: '01 Oct', status: 'Paid' },
  { id: 'INV-5102', member: 'Marcus Reed', item: 'Standard · October', amount: 69, date: '02 Oct', status: 'Paid' },
  { id: 'INV-5103', member: 'Sofia Alvarez', item: 'Student · October', amount: 29, date: '02 Oct', status: 'Due' },
  { id: 'INV-5104', member: 'Ethan Brooks', item: 'Student · September', amount: 29, date: '01 Sep', status: 'Overdue' },
  { id: 'INV-5105', member: 'Daniel Osei', item: 'Basic · October', amount: 39, date: '03 Oct', status: 'Paid' },
  { id: 'INV-5106', member: 'Layla Hassan', item: 'Premium · October', amount: 109, date: '01 Oct', status: 'Paid' },
  { id: 'INV-5107', member: 'Oliver Grant', item: 'Standard · October', amount: 69, date: '04 Oct', status: 'Due' },
];

export interface Exercise {
  id: string;
  name: string;
  muscle: 'Legs' | 'Chest' | 'Back' | 'Core' | 'Cardio';
  equipment: string;
  sets: string;
}

export const EXERCISES: Exercise[] = [
  { id: 'e1', name: 'Back squat', muscle: 'Legs', equipment: 'Barbell', sets: '4 × 6' },
  { id: 'e2', name: 'Romanian deadlift', muscle: 'Legs', equipment: 'Barbell', sets: '3 × 8' },
  { id: 'e3', name: 'Bench press', muscle: 'Chest', equipment: 'Barbell', sets: '4 × 8' },
  { id: 'e4', name: 'Incline dumbbell press', muscle: 'Chest', equipment: 'Dumbbells', sets: '3 × 10' },
  { id: 'e5', name: 'Pull-up', muscle: 'Back', equipment: 'Bodyweight', sets: '4 × 6' },
  { id: 'e6', name: 'Seated cable row', muscle: 'Back', equipment: 'Cable', sets: '3 × 12' },
  { id: 'e7', name: 'Dead bug', muscle: 'Core', equipment: 'Mat', sets: '3 × 10' },
  { id: 'e8', name: 'Rowing intervals', muscle: 'Cardio', equipment: 'Rower', sets: '6 × 250 m' },
];

export interface WorkoutPlan {
  id: string;
  name: string;
  level: string;
  weeks: number;
  sessions: number;
  members: number;
  exercises: string[];
}

export const PLANS_WORKOUT: WorkoutPlan[] = [
  { id: 'w1', name: 'Strength Foundations', level: 'Beginner', weeks: 8, sessions: 3, members: 42, exercises: ['Back squat', 'Bench press', 'Seated cable row', 'Dead bug'] },
  { id: 'w2', name: 'Lean & Strong', level: 'Intermediate', weeks: 12, sessions: 4, members: 58, exercises: ['Romanian deadlift', 'Incline dumbbell press', 'Pull-up', 'Rowing intervals'] },
  { id: 'w3', name: 'Run Club Build', level: 'All levels', weeks: 10, sessions: 4, members: 27, exercises: ['Rowing intervals', 'Dead bug', 'Back squat'] },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: '12 classes start today', date: 'Today' },
  { id: 'n2', title: 'Sofia Alvarez membership expires in 5 days', date: '1 h ago' },
  { id: 'n3', title: 'Run Club is full (30 / 30)', date: 'Earlier' },
];

/** Mobile: the member's workout today and trainer chat. */
export const TODAY_WORKOUT = [
  { name: 'Back squat', sets: '4 × 6', weight: '60 kg', done: true },
  { name: 'Romanian deadlift', sets: '3 × 8', weight: '40 kg', done: true },
  { name: 'Bench press', sets: '4 × 8', weight: '50 kg', done: false },
  { name: 'Seated cable row', sets: '3 × 12', weight: '35 kg', done: false },
  { name: 'Dead bug', sets: '3 × 10', weight: 'Bodyweight', done: false },
];

export const CHAT: { from: 'trainer' | 'me'; text: string; time: string }[] = [
  { from: 'trainer', text: 'Great work on the squats yesterday. Your depth is much better.', time: '08:12' },
  { from: 'me', text: 'Thanks! My legs are really feeling it today.', time: '08:15' },
  { from: 'trainer', text: 'Expected. Take it easy on the deadlifts, we will go heavier on Thursday.', time: '08:16' },
  { from: 'me', text: 'Can we move our session to 18:00?', time: '08:20' },
  { from: 'trainer', text: 'Yes, 18:00 works. See you then.', time: '08:21' },
];

export const PROGRESS = {
  weight: [82.4, 81.9, 81.2, 80.8, 80.1, 79.6],
  lifts: [
    { name: 'Back squat', value: 60 },
    { name: 'Bench press', value: 50 },
    { name: 'Deadlift', value: 75 },
  ],
};

export const CLASS_TYPES = ['Morning HIIT', 'Power Yoga', 'Strength Foundations', 'Run Club', 'Boxing Basics', 'Mobility Reset'] as const;
