'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BarChart3, BookOpen, Briefcase, Calculator, ChevronDown, Cpu, FileText, HelpCircle, Home, Image as ImageIcon, Inbox, LayoutDashboard, Layers, LogOut, Menu, MessageSquareQuote, Monitor, MousePointerClick, Navigation, Newspaper, PanelBottom, Search, Settings, Sparkles, Tags, User, Users, Workflow, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Wordmark } from '@/components/site/wordmark';
import { Badge } from '@/components/ui/badge';
import { Dropdown, menuItemClass } from '@/components/ui/dropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Tooltip } from '@/components/ui/tooltip';
import { apiRequest } from '@/lib/client-api';
import { cn } from '@/lib/cn';
import type { AdminProfile } from '@/lib/types';

interface NavItem {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const NAV_GROUPS: { title?: string; items: NavItem[] }[] = [
  { items: [{ href: '/admin', label: 'Dashboard', Icon: LayoutDashboard }] },
  {
    title: 'Website',
    items: [
      { href: '/admin/website/home', label: 'Homepage', Icon: Home },
      { href: '/admin/website/about', label: 'About', Icon: FileText },
      { href: '/admin/website/navigation', label: 'Navigation', Icon: Navigation },
      { href: '/admin/website/footer', label: 'Footer', Icon: PanelBottom },
    ],
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/demos', label: 'Demos', Icon: Monitor },
      { href: '/admin/demo-categories', label: 'Demo categories', Icon: Tags },
      { href: '/admin/services', label: 'Services', Icon: Layers },
      { href: '/admin/solutions', label: 'Solutions', Icon: Briefcase },
      { href: '/admin/technologies', label: 'Technologies', Icon: Cpu },
      { href: '/admin/process', label: 'Process', Icon: Workflow },
      { href: '/admin/why', label: 'Why Valorian', Icon: Sparkles },
      { href: '/admin/faqs', label: 'FAQs', Icon: HelpCircle },
      { href: '/admin/ctas', label: 'CTAs', Icon: MousePointerClick },
      { href: '/admin/case-studies', label: 'Case studies', Icon: FileText },
      { href: '/admin/testimonials', label: 'Testimonials', Icon: MessageSquareQuote },
      { href: '/admin/insights', label: 'Insights', Icon: Newspaper },
      { href: '/admin/media', label: 'Media', Icon: ImageIcon },
      { href: '/admin/estimator', label: 'Estimator', Icon: Calculator },
    ],
  },
  {
    title: 'Marketing',
    items: [{ href: '/admin/seo', label: 'SEO', Icon: Search }],
  },
  {
    title: 'Sales',
    items: [
      { href: '/admin/leads', label: 'Leads', Icon: Users },
      { href: '/admin/inquiries', label: 'Inquiries', Icon: Inbox },
    ],
  },
  {
    items: [
      { href: '/admin/settings', label: 'Settings', Icon: Settings },
      { href: '/admin/profile', label: 'Profile', Icon: User },
    ],
  },
];

const UPCOMING_NAV: Omit<NavItem, 'href'>[] = [
  { label: 'Analytics', Icon: BarChart3 },
];

function SidebarNav({ pathname }: { pathname: string }) {
  const isActive = (href: string) => (href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <nav aria-label="Admin" className="flex-1 space-y-5 overflow-y-auto p-3">
      {NAV_GROUPS.map((group, index) => (
        <div key={group.title ?? index}>
          {group.title && <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-wide text-muted/70">{group.title}</p>}
          <ul className="space-y-0.5">
            {group.items.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(href) ? 'bg-primary-soft text-primary' : 'text-muted hover:bg-surface-strong hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-wide text-muted/70">Coming later</p>
        <ul className="space-y-0.5">
          {UPCOMING_NAV.map(({ label, Icon }) => (
            <li key={label}>
              <Tooltip text="Available in a later phase">
                <span aria-disabled="true" className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted/50">
                  <Icon className="size-4" aria-hidden />
                  {label}
                </span>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function AdminShell({ admin, brandName, children }: { admin: AdminProfile; brandName: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const drawerOpen = openAt === pathname;

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await apiRequest('POST', '/auth/logout');
    } finally {
      router.replace('/admin/login');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Wordmark name={brandName} href="/admin" />
        </div>
        <SidebarNav pathname={pathname} />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-foreground/40" onClick={() => setOpenAt(null)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-background shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-5">
              <Wordmark name={brandName} href="/admin" />
              <button type="button" aria-label="Close menu" onClick={() => setOpenAt(null)} className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong">
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <SidebarNav pathname={pathname} />
          </aside>
        </div>
      )}

      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <button type="button" aria-label="Open menu" aria-expanded={drawerOpen} onClick={() => setOpenAt(pathname)} className="grid size-10 place-items-center rounded-lg hover:bg-surface-strong lg:hidden">
            <Menu className="size-5" aria-hidden />
          </button>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" target="_blank" className="hidden rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground sm:block">
              View site
            </Link>
            <ThemeToggle />
            <Dropdown
              label="Account menu"
              trigger={
                <span className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-surface-strong">
                  <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{admin.name.charAt(0).toUpperCase()}</span>
                  <ChevronDown className="size-4 text-muted" aria-hidden />
                </span>
              }
            >
              <div className="px-3 py-2">
                <p className="truncate text-sm font-medium">{admin.name}</p>
                <p className="truncate text-xs text-muted">{admin.email}</p>
                <Badge tone="accent" className="mt-2">
                  Super Admin
                </Badge>
              </div>
              <hr className="my-1 border-border" />
              <Link role="menuitem" href="/admin/profile" className={menuItemClass}>
                <User className="size-4" aria-hidden /> Profile
              </Link>
              <button type="button" role="menuitem" onClick={signOut} disabled={signingOut} className={cn(menuItemClass, 'text-danger')}>
                <LogOut className="size-4" aria-hidden /> {signingOut ? 'Signing out…' : 'Sign out'}
              </button>
            </Dropdown>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
