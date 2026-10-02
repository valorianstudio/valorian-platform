'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FolderKanban, LayoutDashboard, LogOut, Menu, User, Users, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Wordmark } from '@/components/site/wordmark';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { apiRequest } from '@/lib/client-api';
import { cn } from '@/lib/cn';
import type { ClientSession } from '@/lib/portal';

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
  ownerOnly?: boolean;
}

const NAV: NavItem[] = [
  { href: '/client/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/client/projects', label: 'Projects', Icon: FolderKanban },
  { href: '/client/team', label: 'Company users', Icon: Users, ownerOnly: true },
  { href: '/client/profile', label: 'Profile', Icon: User },
];

function Nav({ pathname, role, onNavigate }: { pathname: string; role: ClientSession['role']; onNavigate?: () => void }) {
  const items = NAV.filter((item) => !item.ownerOnly || role === 'OWNER');
  return (
    <nav aria-label="Client portal" className="flex-1 space-y-0.5 p-3">
      {items.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', active ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface-strong hover:text-foreground')}
          >
            <Icon className="size-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function ClientShell({ client, brandName, children }: { client: ClientSession; brandName: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await apiRequest('POST', '/client-auth/logout');
    } finally {
      router.replace('/client/login');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Wordmark name={brandName} href="/client/dashboard" />
        </div>
        <Nav pathname={pathname} role={client.role} />
        <div className="border-t border-border p-4">
          <p className="truncate text-sm font-medium">{client.companyName}</p>
          <p className="truncate text-xs text-muted">{client.email}</p>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-background shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Wordmark name={brandName} href="/client/dashboard" />
              <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <Nav pathname={pathname} role={client.role} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <button type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-lg hover:bg-surface-strong lg:hidden">
            <Menu className="size-5" aria-hidden />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Badge className="hidden sm:inline-flex">{client.role === 'OWNER' ? 'Owner' : 'Member'}</Badge>
            <span className="hidden max-w-40 truncate text-sm text-muted sm:block">{client.name}</span>
            <ThemeToggle />
            <button type="button" onClick={signOut} disabled={signingOut} className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-muted hover:bg-surface-strong hover:text-foreground">
              <LogOut className="size-4" aria-hidden /> <span className="hidden sm:inline">{signingOut ? 'Signing out…' : 'Sign out'}</span>
            </button>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
