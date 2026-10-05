/**
 * Dummy data for the interactive Clinic Management website and mobile app demos. Everything is invented; nothing is fetched or stored.
 * One shared source keeps the dashboard, the doctor view, the mobile app and the landing preview consistent with each other.
 */

export type PatientStatus = 'Active' | 'New' | 'Follow-up';
export type AppointmentStatus = 'Confirmed' | 'Checked in' | 'In progress' | 'Pending' | 'Completed';
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface HistoryEntry {
  date: string;
  title: string;
  note: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male';
  phone: string;
  email: string;
  status: PatientStatus;
  doctor: string;
  lastVisit: string;
  nextVisit: string;
  insurance: string;
  balance: number;
  allergies: string[];
  conditions: string[];
  history: HistoryEntry[];
}

export const PATIENTS: Patient[] = [
  { id: 'p1', name: 'Hannah Lindqvist', age: 34, gender: 'Female', phone: '+1 555 0111', email: 'hannah.l@mail.example', status: 'Active', doctor: 'Dr. Amara Okoye', lastVisit: '28 Sep 2026', nextVisit: '12 Oct 2026', insurance: 'BlueShield Plus', balance: 0, allergies: ['Penicillin'], conditions: ['Mild gingivitis'], history: [{ date: '28 Sep 2026', title: 'Scale and polish', note: 'Plaque build-up on lower incisors. Advised flossing twice daily.' }, { date: '14 Mar 2026', title: 'Composite filling', note: 'Tooth 16, occlusal. No complications.' }, { date: '02 Oct 2025', title: 'Check-up and X-rays', note: 'Bitewing X-rays taken. Early decay on tooth 16.' }] },
  { id: 'p2', name: 'Marcus Reed', age: 52, gender: 'Male', phone: '+1 555 0122', email: 'm.reed@mail.example', status: 'Follow-up', doctor: 'Dr. Amara Okoye', lastVisit: '30 Sep 2026', nextVisit: '14 Oct 2026', insurance: 'CarePlus', balance: 420, allergies: [], conditions: ['Hypertension', 'Type 2 diabetes'], history: [{ date: '30 Sep 2026', title: 'Crown preparation', note: 'Tooth 36 prepared, temporary crown fitted. Final crown in two weeks.' }, { date: '09 Sep 2026', title: 'Root canal', note: 'Tooth 36, single session. Pain resolved.' }] },
  { id: 'p3', name: 'Sofia Alvarez', age: 9, gender: 'Female', phone: '+1 555 0133', email: 'alvarez.family@mail.example', status: 'Active', doctor: 'Dr. Mei Tanaka', lastVisit: '21 Sep 2026', nextVisit: '19 Oct 2026', insurance: 'Family Health', balance: 0, allergies: ['Latex'], conditions: [], history: [{ date: '21 Sep 2026', title: 'Fluoride treatment', note: 'Routine. Good brushing technique.' }, { date: '05 Apr 2026', title: 'Sealants', note: 'Sealants on first permanent molars.' }] },
  { id: 'p4', name: 'Daniel Osei', age: 41, gender: 'Male', phone: '+1 555 0144', email: 'daniel.osei@mail.example', status: 'New', doctor: 'Dr. Rafael Costa', lastVisit: '02 Oct 2026', nextVisit: '16 Oct 2026', insurance: 'Self-pay', balance: 180, allergies: [], conditions: ['Asthma'], history: [{ date: '02 Oct 2026', title: 'New patient consultation', note: 'Full history taken. Treatment plan agreed.' }] },
  { id: 'p5', name: 'Grace Whitmore', age: 67, gender: 'Female', phone: '+1 555 0155', email: 'g.whitmore@mail.example', status: 'Active', doctor: 'Dr. Amara Okoye', lastVisit: '25 Sep 2026', nextVisit: '23 Oct 2026', insurance: 'Medicare Advantage', balance: 0, allergies: ['Aspirin'], conditions: ['Osteoporosis'], history: [{ date: '25 Sep 2026', title: 'Denture adjustment', note: 'Upper denture relined for comfort.' }] },
  { id: 'p6', name: 'Ethan Brooks', age: 15, gender: 'Male', phone: '+1 555 0166', email: 'brooks.home@mail.example', status: 'Follow-up', doctor: 'Dr. Leo Hartmann', lastVisit: '01 Oct 2026', nextVisit: '15 Oct 2026', insurance: 'CarePlus', balance: 95, allergies: [], conditions: [], history: [{ date: '01 Oct 2026', title: 'Braces adjustment', note: 'Archwire changed. Progress on schedule.' }, { date: '03 Sep 2026', title: 'Braces adjustment', note: 'New elastics fitted.' }] },
  { id: 'p7', name: 'Layla Hassan', age: 29, gender: 'Female', phone: '+1 555 0177', email: 'layla.h@mail.example', status: 'Active', doctor: 'Dr. Rafael Costa', lastVisit: '18 Sep 2026', nextVisit: '20 Oct 2026', insurance: 'BlueShield Plus', balance: 0, allergies: [], conditions: ['Pregnancy (second trimester)'], history: [{ date: '18 Sep 2026', title: 'General check-up', note: 'No concerns. Dental hygiene review advised.' }] },
  { id: 'p8', name: 'Oliver Grant', age: 47, gender: 'Male', phone: '+1 555 0188', email: 'o.grant@mail.example', status: 'New', doctor: 'Dr. Amara Okoye', lastVisit: '03 Oct 2026', nextVisit: '17 Oct 2026', insurance: 'CarePlus', balance: 260, allergies: ['Ibuprofen'], conditions: [], history: [{ date: '03 Oct 2026', title: 'Emergency visit', note: 'Cracked molar on tooth 46. Temporary filling placed.' }] },
];

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  room: string;
  rating: number;
  experience: string;
  patientsToday: number;
  status: 'In clinic' | 'In surgery' | 'Off today';
  days: string[];
}

export const DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Amara Okoye', specialty: 'Restorative Dentistry', room: 'Room 1', rating: 4.9, experience: '14 years', patientsToday: 9, status: 'In clinic', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { id: 'd2', name: 'Dr. Leo Hartmann', specialty: 'Orthodontics', room: 'Room 2', rating: 4.8, experience: '11 years', patientsToday: 7, status: 'In clinic', days: ['Mon', 'Wed', 'Thu', 'Sat'] },
  { id: 'd3', name: 'Dr. Mei Tanaka', specialty: 'Paediatric Dentistry', room: 'Room 3', rating: 4.9, experience: '9 years', patientsToday: 8, status: 'In surgery', days: ['Tue', 'Wed', 'Fri', 'Sat'] },
  { id: 'd4', name: 'Dr. Rafael Costa', specialty: 'General Practice', room: 'Room 4', rating: 4.7, experience: '16 years', patientsToday: 6, status: 'In clinic', days: ['Mon', 'Tue', 'Thu', 'Fri'] },
  { id: 'd5', name: 'Dr. Sana Iqbal', specialty: 'Periodontics', room: 'Room 5', rating: 4.8, experience: '8 years', patientsToday: 0, status: 'Off today', days: ['Tue', 'Thu', 'Sat'] },
  { id: 'd6', name: 'Dr. Tomas Novak', specialty: 'Oral Surgery', room: 'Surgery', rating: 4.9, experience: '13 years', patientsToday: 4, status: 'In surgery', days: ['Mon', 'Wed', 'Fri'] },
];

export const DOCTOR_NAMES = ['All doctors', ...DOCTORS.slice(0, 4).map((d) => d.name)] as const;

export interface Appointment {
  id: string;
  time: string;
  patient: string;
  doctor: string;
  type: string;
  minutes: number;
  room: string;
  status: AppointmentStatus;
}

export const APPOINTMENTS: Appointment[] = [
  { id: 'a1', time: '08:30', patient: 'Hannah Lindqvist', doctor: 'Dr. Amara Okoye', type: 'Check-up', minutes: 30, room: 'Room 1', status: 'Completed' },
  { id: 'a2', time: '09:00', patient: 'Ethan Brooks', doctor: 'Dr. Leo Hartmann', type: 'Braces adjustment', minutes: 30, room: 'Room 2', status: 'Completed' },
  { id: 'a3', time: '09:30', patient: 'Marcus Reed', doctor: 'Dr. Amara Okoye', type: 'Crown fitting', minutes: 60, room: 'Room 1', status: 'In progress' },
  { id: 'a4', time: '10:00', patient: 'Sofia Alvarez', doctor: 'Dr. Mei Tanaka', type: 'Fluoride treatment', minutes: 30, room: 'Room 3', status: 'Checked in' },
  { id: 'a5', time: '10:30', patient: 'Daniel Osei', doctor: 'Dr. Rafael Costa', type: 'Treatment plan review', minutes: 30, room: 'Room 4', status: 'Confirmed' },
  { id: 'a6', time: '11:30', patient: 'Grace Whitmore', doctor: 'Dr. Amara Okoye', type: 'Denture review', minutes: 30, room: 'Room 1', status: 'Confirmed' },
  { id: 'a7', time: '13:00', patient: 'Layla Hassan', doctor: 'Dr. Rafael Costa', type: 'Hygiene visit', minutes: 45, room: 'Room 4', status: 'Pending' },
  { id: 'a8', time: '14:00', patient: 'Oliver Grant', doctor: 'Dr. Amara Okoye', type: 'Molar repair', minutes: 60, room: 'Room 1', status: 'Pending' },
];

export interface Invoice {
  id: string;
  patient: string;
  service: string;
  amount: number;
  date: string;
  status: InvoiceStatus;
  insurance?: string;
}

export const INVOICES: Invoice[] = [
  { id: 'INV-2041', patient: 'Hannah Lindqvist', service: 'Scale and polish', amount: 120, date: '28 Sep', status: 'Paid', insurance: 'BlueShield Plus' },
  { id: 'INV-2042', patient: 'Marcus Reed', service: 'Crown preparation', amount: 840, date: '30 Sep', status: 'Pending', insurance: 'CarePlus' },
  { id: 'INV-2043', patient: 'Ethan Brooks', service: 'Braces adjustment', amount: 95, date: '01 Oct', status: 'Overdue' },
  { id: 'INV-2044', patient: 'Daniel Osei', service: 'New patient consultation', amount: 180, date: '02 Oct', status: 'Overdue' },
  { id: 'INV-2045', patient: 'Oliver Grant', service: 'Emergency visit', amount: 260, date: '03 Oct', status: 'Pending' },
  { id: 'INV-2046', patient: 'Grace Whitmore', service: 'Denture adjustment', amount: 150, date: '25 Sep', status: 'Paid', insurance: 'Medicare Advantage' },
  { id: 'INV-2047', patient: 'Sofia Alvarez', service: 'Fluoride treatment', amount: 60, date: '21 Sep', status: 'Paid', insurance: 'Family Health' },
];

export interface Prescription {
  id: string;
  patient: string;
  drug: string;
  dose: string;
  duration: string;
  doctor: string;
  date: string;
  status: 'Active' | 'Completed';
}

export const PRESCRIPTIONS: Prescription[] = [
  { id: 'rx1', patient: 'Marcus Reed', drug: 'Amoxicillin 500 mg', dose: '1 capsule, 3 times daily', duration: '7 days', doctor: 'Dr. Amara Okoye', date: '30 Sep', status: 'Active' },
  { id: 'rx2', patient: 'Oliver Grant', drug: 'Paracetamol 500 mg', dose: '2 tablets every 6 hours', duration: '5 days', doctor: 'Dr. Amara Okoye', date: '03 Oct', status: 'Active' },
  { id: 'rx3', patient: 'Hannah Lindqvist', drug: 'Chlorhexidine mouthwash', dose: '10 ml, twice daily', duration: '14 days', doctor: 'Dr. Amara Okoye', date: '28 Sep', status: 'Active' },
  { id: 'rx4', patient: 'Grace Whitmore', drug: 'Fluoride gel 1.1%', dose: 'Apply nightly', duration: '30 days', doctor: 'Dr. Amara Okoye', date: '25 Sep', status: 'Active' },
  { id: 'rx5', patient: 'Ethan Brooks', drug: 'Orthodontic wax', dose: 'As needed', duration: '30 days', doctor: 'Dr. Leo Hartmann', date: '03 Sep', status: 'Completed' },
  { id: 'rx6', patient: 'Daniel Osei', drug: 'Ibuprofen 400 mg', dose: '1 tablet after meals', duration: '3 days', doctor: 'Dr. Rafael Costa', date: '02 Oct', status: 'Completed' },
];

/** Dental chart: FDI tooth numbers and their state. */
export type ToothState = 'healthy' | 'filled' | 'crown' | 'cavity' | 'implant' | 'missing';

export const TOOTH_STATES: { id: ToothState; label: string }[] = [
  { id: 'healthy', label: 'Healthy' },
  { id: 'filled', label: 'Filled' },
  { id: 'crown', label: 'Crown' },
  { id: 'implant', label: 'Implant' },
  { id: 'cavity', label: 'Needs treatment' },
  { id: 'missing', label: 'Missing' },
];

export const INITIAL_TEETH: Record<number, ToothState> = {
  16: 'filled', 26: 'filled', 36: 'crown', 46: 'cavity', 18: 'missing', 28: 'missing', 38: 'missing', 48: 'missing', 14: 'filled', 21: 'crown', 11: 'healthy', 24: 'implant',
};

export interface Treatment {
  date: string;
  tooth: string;
  procedure: string;
  doctor: string;
  cost: number;
}

export const TREATMENTS: Treatment[] = [
  { date: '30 Sep 2026', tooth: '36', procedure: 'Crown preparation', doctor: 'Dr. Amara Okoye', cost: 840 },
  { date: '09 Sep 2026', tooth: '36', procedure: 'Root canal treatment', doctor: 'Dr. Amara Okoye', cost: 620 },
  { date: '14 Mar 2026', tooth: '16', procedure: 'Composite filling', doctor: 'Dr. Amara Okoye', cost: 180 },
  { date: '11 Jan 2026', tooth: '24', procedure: 'Implant crown fitted', doctor: 'Dr. Tomas Novak', cost: 1450 },
  { date: '02 Oct 2025', tooth: '—', procedure: 'Check-up and X-rays', doctor: 'Dr. Amara Okoye', cost: 95 },
];

export const DASHBOARD_STATS = { patients: 3482, today: 36, doctors: 14, revenue: 48250 };

export const PATIENT_GROWTH = [
  { label: 'Apr', value: 212 },
  { label: 'May', value: 236 },
  { label: 'Jun', value: 251 },
  { label: 'Jul', value: 244 },
  { label: 'Aug', value: 288 },
  { label: 'Sep', value: 319 },
  { label: 'Oct', value: 341 },
];

export const REVENUE_MONTHS = [
  { label: 'May', value: 36 },
  { label: 'Jun', value: 39 },
  { label: 'Jul', value: 37 },
  { label: 'Aug', value: 43 },
  { label: 'Sep', value: 46 },
  { label: 'Oct', value: 48 },
];

export const TREATMENT_MIX = [
  { label: 'Check-ups', value: 34, tone: 'blue' as const },
  { label: 'Hygiene', value: 26, tone: 'emerald' as const },
  { label: 'Restorative', value: 24, tone: 'amber' as const },
  { label: 'Orthodontics', value: 16, tone: 'slate' as const },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Marcus Reed checked in for 09:30', date: 'Just now' },
  { id: 'n2', title: '2 invoices are overdue', date: '1 h ago' },
  { id: 'n3', title: 'Dr. Sana Iqbal is off today', date: 'This morning' },
];

/** Dentists shown in the calendar columns. */
export const CALENDAR_DOCTORS = DOCTORS.slice(0, 3);

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Mobile: bookable time slots and doctor search specialties. */
export const SLOTS = ['09:00', '09:30', '10:30', '11:00', '14:00', '15:30'];
export const SPECIALTIES = ['All', 'Dentistry', 'Orthodontics', 'General'] as const;
export const DOCTOR_SPECIALTY: Record<string, (typeof SPECIALTIES)[number]> = { d1: 'Dentistry', d2: 'Orthodontics', d3: 'Dentistry', d4: 'General', d5: 'Dentistry', d6: 'Dentistry' };
