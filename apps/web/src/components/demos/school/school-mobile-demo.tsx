'use client';

import { useState } from 'react';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import { cn } from '@/lib/cn';
import {
  BottomNav,
  STUDENT_NAV,
  StudentAnnouncements,
  StudentAttendance,
  StudentHome,
  StudentLogin,
  StudentProfile,
  StudentResults,
  StudentSchedule,
  TEACHER_NAV,
  TeacherAttendance,
  TeacherClasses,
  TeacherDashboardScreen,
  TeacherReports,
} from './mobile-screens';
import type { StudentScreen, TeacherScreen } from './mobile-screens';
import { Tabs } from './website-ui';

type App = 'student' | 'teacher';

const STUDENT_SCREENS: { id: StudentScreen; label: string; note: string }[] = [
  { id: 'login', label: 'Login', note: 'Secure sign-in with a school account.' },
  { id: 'home', label: 'Home dashboard', note: 'Attendance, average, next class and quick actions.' },
  { id: 'attendance', label: 'Attendance', note: 'Rate, counts and a four-week calendar.' },
  { id: 'results', label: 'Results', note: 'Scores and grades for every subject.' },
  { id: 'schedule', label: 'Class schedule', note: 'Day-by-day timetable with room details.' },
  { id: 'announcements', label: 'Announcements', note: 'Events, notices and academic updates.' },
  { id: 'profile', label: 'Profile', note: 'Student details, settings and sign out.' },
];

const TEACHER_SCREENS: { id: TeacherScreen; label: string; note: string }[] = [
  { id: 'dashboard', label: 'Dashboard', note: "Today's sessions and tasks at a glance." },
  { id: 'classes', label: 'Classes', note: 'Assigned classes with average performance.' },
  { id: 'attendance', label: 'Attendance marking', note: 'Mark the register with one tap per student.' },
  { id: 'reports', label: 'Student reports', note: 'Scores and attendance for each student.' },
];

/**
 * Interactive phone preview. A student app and a teacher app share one phone frame: the bottom navigation, the in-screen buttons and
 * the screen list beside the phone all move between screens, and each change slides in. Everything is dummy data in local state.
 */
export function SchoolMobileDemo() {
  const [app, setApp] = useState<App>('student');
  const [student, setStudent] = useState<StudentScreen>('login');
  const [teacher, setTeacher] = useState<TeacherScreen>('dashboard');

  const screens = app === 'student' ? STUDENT_SCREENS : TEACHER_SCREENS;
  const current = app === 'student' ? student : teacher;
  const select = (id: string) => (app === 'student' ? setStudent(id as StudentScreen) : setTeacher(id as TeacherScreen));
  const note = screens.find((s) => s.id === current)?.note;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs
          label="App"
          value={app}
          onChange={setApp}
          tabs={[
            { id: 'student', label: 'Student app', count: STUDENT_SCREENS.length },
            { id: 'teacher', label: 'Teacher app', count: TEACHER_SCREENS.length },
          ]}
        />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">{app === 'student' ? 'The student app' : 'The teacher app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'student' ? 'Everything a student needs each day, one tap from the home screen.' : 'Take attendance and review student progress in seconds, between lessons.'}</p>

        <ol aria-label="Screens" className="mt-6 grid gap-2 sm:grid-cols-2">
          {screens.map((screen, index) => {
            const on = screen.id === current;
            return (
              <li key={screen.id}>
                <button type="button" aria-current={on ? 'true' : undefined} onClick={() => select(screen.id)} className={cn('flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-600', on ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300')}>
                  <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums', on ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600')}>{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{screen.label}</span>
                    <span className="block text-xs text-slate-500">{screen.note}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <p aria-live="polite" className="sr-only">
          Showing {note}
        </p>
      </div>

      <div className="order-1 w-full lg:sticky lg:top-40 lg:order-2 lg:w-[19rem]">
        <MobileFrame label={`${app === 'student' ? 'Student' : 'Teacher'} app preview`}>
          <div key={`${app}-${current}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'student' ? (
              <>
                {student === 'login' && <StudentLogin onSignIn={() => setStudent('home')} />}
                {student === 'home' && <StudentHome go={setStudent} />}
                {student === 'attendance' && <StudentAttendance />}
                {student === 'results' && <StudentResults />}
                {student === 'schedule' && <StudentSchedule />}
                {student === 'announcements' && <StudentAnnouncements />}
                {student === 'profile' && <StudentProfile onSignOut={() => setStudent('login')} />}
              </>
            ) : (
              <>
                {teacher === 'dashboard' && <TeacherDashboardScreen go={setTeacher} />}
                {teacher === 'classes' && <TeacherClasses go={setTeacher} />}
                {teacher === 'attendance' && <TeacherAttendance />}
                {teacher === 'reports' && <TeacherReports />}
              </>
            )}
          </div>
          {app === 'student' && student !== 'login' && <BottomNav label="Student app" items={STUDENT_NAV} value={student} onChange={setStudent} />}
          {app === 'teacher' && <BottomNav label="Teacher app" items={TEACHER_NAV} value={teacher} onChange={setTeacher} />}
        </MobileFrame>
      </div>
    </div>
  );
}
