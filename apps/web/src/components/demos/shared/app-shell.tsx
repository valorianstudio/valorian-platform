'use client';

import { Bell, Menu, UserRound, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Avatar, SelectMenu, useDismiss } from './app-ui';

export interface ShellNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  render: () => ReactNode;
}

export interface ShellNotification {
  id: string;
  title: string;
  date: string;
}

function Notifications({ items }: { items: ShellNotification[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-haspopup="true" aria-expanded={open} aria-label={`Notifications, ${items.length} new`} onClick={() => setOpen((v) => !v)} className="relative grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)]">
        <Bell className="size-4" aria-hidden />
        <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-[var(--demo-good,#10b981)] ring-2 ring-white" />
      </button>
      {open && (
        <div role="region" aria-label="Notifications" className="demo-rise absolute right-0 top-11 z-30 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          <p className="px-2 py-1.5 text-xs font-semibold text-slate-500">Notifications</p>
          <ul>
            {items.map((item) => (
              <li key={item.id} className="rounded-lg px-2 py-2 hover:bg-slate-50">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <p className="text-xs text-slate-500">{item.date}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * A role-aware application shell for interactive website demos: fake browser bar, sidebar (a drawer below lg), top bar with a
 * "View as" dropdown and notifications, and a scrolling content area. Switching the role swaps the whole navigation.
 * Colours come from the --demo-* variables (sidebar, nav-active, accent), so each demo keeps its own brand.
 */
export function AppShell<R extends string>({ brand, domain, roles, nav, users, notifications }: { brand: ReactNode; domain: string; roles: readonly R[]; nav: Record<R, ShellNavItem[]>; users: Record<R, { name: string; title: string }>; notifications: ShellNotification[] }) {
  const [role, setRole] = useState<R>(roles[0]);
  const [view, setView] = useState(nav[roles[0]][0].id);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = nav[role];
  const active = items.find((item) => item.id === view) ?? items[0];
  const user = users[role];

  function changeRole(next: R) {
    setRole(next);
    setView(nav[next][0].id);
    setMenuOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_80px_-40px_rgb(15_23_42/0.35)]">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-4 py-2.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="size-2.5 rounded-full bg-slate-300" />
        <span className="ml-3 hidden h-6 flex-1 items-center rounded-md bg-white px-3 text-xs text-slate-500 sm:flex">
          {domain}/{role.toLowerCase().replace(/\s+/g, '-')}/{active.id}
        </span>
      </div>

      <div className="relative flex h-[40rem] bg-slate-50 sm:h-[44rem]">
        {menuOpen && <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="absolute inset-0 z-30 bg-slate-900/40 lg:hidden" />}
        <aside className={cn('absolute inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-[var(--demo-sidebar,#0f172a)] transition-[transform,visibility] duration-200 lg:static lg:visible lg:w-56 lg:translate-x-0 xl:w-60', menuOpen ? 'visible translate-x-0' : 'invisible -translate-x-full')}>
          <div className="flex h-14 items-center justify-between px-4">
            {brand}
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className="grid size-8 place-items-center rounded-lg text-white/60 hover:text-white focus-visible:outline-2 focus-visible:outline-white lg:hidden">
              <X className="size-4" aria-hidden />
            </button>
          </div>
          <nav aria-label={`${role} navigation`} className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
            {items.map((item) => {
              const Icon = item.icon;
              const current = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={current ? 'page' : undefined}
                  onClick={() => {
                    setView(item.id);
                    setMenuOpen(false);
                  }}
                  className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-white', current ? 'bg-[var(--demo-nav-active,#2563eb)] text-white' : 'text-white/70 hover:bg-white/5 hover:text-white')}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="m-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <Avatar name={user.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="truncate text-xs text-white/60">{user.title}</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-200 bg-white px-3 sm:px-5">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent,#2563eb)] lg:hidden">
              <Menu className="size-4" aria-hidden />
            </button>
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{active.label}</p>
            <SelectMenu label="View as" value={role} options={roles} onChange={changeRole} icon={UserRound} align="right" className="w-36 sm:w-48" />
            <Notifications items={notifications} />
          </div>
          <div key={`${role}-${active.id}`} className="demo-slide flex-1 overflow-y-auto p-3 sm:p-5">
            {active.render()}
          </div>
        </div>
      </div>
    </div>
  );
}
