'use client';

import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import { BottomNav } from '@/components/demos/shared/mobile-kit';
import { COURSE_THEME } from '@/data/course/meta';
import { cn } from '@/lib/cn';
import {
  INSTRUCTOR_NAV,
  InstructorAnalytics,
  InstructorCourses,
  InstructorDashboard,
  InstructorUpload,
  STUDENT_NAV,
  StudentCourseDetails,
  StudentCourses,
  StudentHome,
  StudentLesson,
  StudentLogin,
  StudentProfile,
  StudentProgress,
  StudentQuiz,
  StudentSplash,
} from './course-mobile-screens';
import type { InstructorScreen, StudentScreen } from './course-mobile-screens';

type App = 'student' | 'instructor';

const STUDENT_SCREENS: { id: StudentScreen; label: string; note: string }[] = [
  { id: 'splash', label: 'Splash', note: 'Branded welcome screen.' },
  { id: 'login', label: 'Login', note: 'Sign in with your academy account.' },
  { id: 'home', label: 'Home dashboard', note: 'Continue learning and what is due.' },
  { id: 'courses', label: 'Course list', note: 'Browse by category, with progress.' },
  { id: 'details', label: 'Course details', note: 'Lessons, duration and enrolment.' },
  { id: 'lesson', label: 'Video lesson', note: 'Player with progress and a lesson quiz.' },
  { id: 'progress', label: 'Progress tracking', note: 'Minutes studied and your streak.' },
  { id: 'quiz', label: 'Quiz', note: 'Multiple choice with instant feedback.' },
  { id: 'profile', label: 'Profile', note: 'Certificates, settings and sign out.' },
];

const INSTRUCTOR_SCREENS: { id: InstructorScreen; label: string; note: string }[] = [
  { id: 'dashboard', label: 'Dashboard', note: 'Learners who need help, and the marking queue.' },
  { id: 'courses', label: 'Course management', note: 'Your courses, status and progress.' },
  { id: 'analytics', label: 'Student analytics', note: 'Completion, scores and top learners.' },
  { id: 'upload', label: 'Upload content', note: 'Add lesson files and publish them.' },
];

/**
 * Interactive phone preview. A student app and an instructor app share one phone frame. Enrolling in a course, playing a lesson,
 * answering the quiz and publishing content all update in place, so the preview feels like the real product.
 */
export function CourseMobileApp() {
  const [app, setApp] = useState<App>('student');
  const [student, setStudent] = useState<StudentScreen>('splash');
  const [instructor, setInstructor] = useState<InstructorScreen>('dashboard');
  const [courseId, setCourseId] = useState('c1');
  const [enrolled, setEnrolled] = useState(true);

  const screens = app === 'student' ? STUDENT_SCREENS : INSTRUCTOR_SCREENS;
  const current = app === 'student' ? student : instructor;
  const select = (id: string) => (app === 'student' ? setStudent(id as StudentScreen) : setInstructor(id as InstructorScreen));
  const splash = app === 'student' && student === 'splash';
  const navValue: (typeof STUDENT_NAV)[number]['id'] = student === 'details' || student === 'lesson' || student === 'quiz' ? 'courses' : student === 'login' || student === 'splash' ? 'home' : (student as (typeof STUDENT_NAV)[number]['id']);

  return (
    <div style={COURSE_THEME} className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs
          label="App"
          value={app}
          onChange={setApp}
          tabs={[
            { id: 'student', label: 'Student app', count: STUDENT_SCREENS.length },
            { id: 'instructor', label: 'Instructor app', count: INSTRUCTOR_SCREENS.length },
          ]}
        />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">{app === 'student' ? 'The student app' : 'The instructor app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'student' ? 'Pick up any course, watch a lesson and check your progress from anywhere.' : 'Publish lessons, follow learners and mark work from the same phone.'}</p>

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
        <MobileFrame label={`${app === 'student' ? 'Student' : 'Instructor'} app preview`} tone={splash ? 'light' : 'dark'} screenClassName={splash ? 'bg-course' : 'bg-white'}>
          <div key={`${app}-${current}-${courseId}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'student' ? (
              <>
                {student === 'splash' && <StudentSplash onStart={() => setStudent('login')} />}
                {student === 'login' && <StudentLogin onSignIn={() => setStudent('home')} />}
                {student === 'home' && <StudentHome go={setStudent} />}
                {student === 'courses' && (
                  <StudentCourses
                    onOpen={(id) => {
                      setCourseId(id);
                      setStudent('details');
                    }}
                  />
                )}
                {student === 'details' && <StudentCourseDetails id={courseId} enrolled={enrolled} onEnrol={() => setEnrolled(true)} onPlay={() => setStudent('lesson')} />}
                {student === 'lesson' && <StudentLesson onQuiz={() => setStudent('quiz')} />}
                {student === 'quiz' && <StudentQuiz />}
                {student === 'progress' && <StudentProgress />}
                {student === 'profile' && <StudentProfile onSignOut={() => setStudent('login')} />}
              </>
            ) : (
              <>
                {instructor === 'dashboard' && <InstructorDashboard go={setInstructor} />}
                {instructor === 'courses' && <InstructorCourses />}
                {instructor === 'analytics' && <InstructorAnalytics />}
                {instructor === 'upload' && <InstructorUpload />}
              </>
            )}
          </div>
          {app === 'student' && student !== 'splash' && student !== 'login' && <BottomNav label="Student app" items={STUDENT_NAV} value={navValue} onChange={setStudent} />}
          {app === 'instructor' && <BottomNav label="Instructor app" items={INSTRUCTOR_NAV} value={instructor} onChange={setInstructor} />}
        </MobileFrame>
      </div>
    </div>
  );
}
