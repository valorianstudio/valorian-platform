'use client';

import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { BottomNav } from '@/components/demos/shared/mobile-kit';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import { CLINIC_THEME } from '@/data/clinic/meta';
import { cn } from '@/lib/cn';
import {
  DOCTOR_NAV,
  DoctorHome,
  DoctorNotes,
  DoctorPatients,
  DoctorSchedule,
  PATIENT_NAV,
  PatientBooking,
  PatientDoctors,
  PatientHome,
  PatientLogin,
  PatientPrescriptions,
  PatientProfile,
  PatientRecords,
} from './clinic-mobile-screens';
import type { DoctorScreen, PatientScreen } from './clinic-mobile-screens';

type App = 'patient' | 'doctor';

const PATIENT_SCREENS: { id: PatientScreen; label: string; note: string }[] = [
  { id: 'login', label: 'Login', note: 'Secure sign-in for patients.' },
  { id: 'home', label: 'Home', note: 'Next appointment, quick actions and reminders.' },
  { id: 'book', label: 'Appointment booking', note: 'Pick a doctor, a day and a time in three taps.' },
  { id: 'doctors', label: 'Doctor search', note: 'Search by name and filter by specialty.' },
  { id: 'records', label: 'Medical records', note: 'Visit history and your dental chart.' },
  { id: 'prescription', label: 'Prescription', note: 'Active prescriptions with one-tap refills.' },
  { id: 'profile', label: 'Profile', note: 'Details, insurance and sign out.' },
];

const DOCTOR_SCREENS: { id: DoctorScreen; label: string; note: string }[] = [
  { id: 'home', label: 'Dashboard', note: "Today's numbers and the patient in the chair." },
  { id: 'patients', label: 'Patients', note: 'Your patients and their status.' },
  { id: 'schedule', label: 'Schedule', note: 'Day-by-day appointments.' },
  { id: 'notes', label: 'Notes', note: 'Write and save clinical notes.' },
];

/**
 * Interactive phone preview. A patient app and a doctor app share one phone frame: the bottom navigation, the in-screen buttons
 * and the screen list beside the phone all move between screens, and each change slides in. Dummy data in local state.
 */
export function ClinicMobileApp() {
  const [app, setApp] = useState<App>('patient');
  const [patient, setPatient] = useState<PatientScreen>('login');
  const [doctor, setDoctor] = useState<DoctorScreen>('home');
  const [bookDoctor, setBookDoctor] = useState('d1');

  const screens = app === 'patient' ? PATIENT_SCREENS : DOCTOR_SCREENS;
  const current = app === 'patient' ? patient : doctor;
  const select = (id: string) => (app === 'patient' ? setPatient(id as PatientScreen) : setDoctor(id as DoctorScreen));
  const navValue = patient === 'prescription' ? 'records' : (patient as Exclude<PatientScreen, 'login' | 'prescription'>);

  return (
    <div style={CLINIC_THEME} className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs
          label="App"
          value={app}
          onChange={setApp}
          tabs={[
            { id: 'patient', label: 'Patient app', count: PATIENT_SCREENS.length },
            { id: 'doctor', label: 'Doctor app', count: DOCTOR_SCREENS.length },
          ]}
        />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">{app === 'patient' ? 'The patient app' : 'The doctor app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'patient' ? 'Book visits, find a doctor and keep every record in your pocket.' : 'See the day, open the next patient and write notes between appointments.'}</p>

        <ol aria-label="Screens" className="mt-6 grid gap-2 sm:grid-cols-2">
          {screens.map((screen, index) => {
            const on = screen.id === current;
            return (
              <li key={screen.id}>
                <button type="button" aria-current={on ? 'true' : undefined} onClick={() => select(screen.id)} className={cn('flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent-soft)]' : 'border-slate-200 bg-white hover:border-slate-300')}>
                  <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums', on ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-600')}>{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{screen.label}</span>
                    <span className="block text-xs text-slate-500">{screen.note}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="order-1 w-full lg:sticky lg:top-40 lg:order-2 lg:w-[19rem]">
        <MobileFrame label={`${app === 'patient' ? 'Patient' : 'Doctor'} app preview`}>
          <div key={`${app}-${current}-${current === 'book' ? bookDoctor : ''}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'patient' ? (
              <>
                {patient === 'login' && <PatientLogin onSignIn={() => setPatient('home')} />}
                {patient === 'home' && <PatientHome go={setPatient} />}
                {patient === 'book' && <PatientBooking initialDoctor={bookDoctor} />}
                {patient === 'doctors' && (
                  <PatientDoctors
                    onBook={(id) => {
                      setBookDoctor(id);
                      setPatient('book');
                    }}
                  />
                )}
                {patient === 'records' && <PatientRecords go={setPatient} />}
                {patient === 'prescription' && <PatientPrescriptions />}
                {patient === 'profile' && <PatientProfile onSignOut={() => setPatient('login')} />}
              </>
            ) : (
              <>
                {doctor === 'home' && <DoctorHome go={setDoctor} />}
                {doctor === 'patients' && <DoctorPatients />}
                {doctor === 'schedule' && <DoctorSchedule />}
                {doctor === 'notes' && <DoctorNotes />}
              </>
            )}
          </div>
          {app === 'patient' && patient !== 'login' && <BottomNav label="Patient app" items={PATIENT_NAV} value={navValue} onChange={setPatient} />}
          {app === 'doctor' && <BottomNav label="Doctor app" items={DOCTOR_NAV} value={doctor} onChange={setDoctor} />}
        </MobileFrame>
      </div>
    </div>
  );
}
