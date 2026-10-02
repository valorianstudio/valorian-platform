import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/field';
import { LEAD_PRIORITIES, LEAD_STATUSES } from '@/lib/types';
import { SOURCE_LABEL, STATUS_LABEL } from './shared';

export const LEAD_FILTER_KEYS = ['q', 'status', 'priority', 'source', 'demo', 'service', 'country', 'from', 'to', 'followUp', 'archived', 'sort', 'dir', 'page'] as const;

interface Props {
  values: Record<string, string>;
  demos: { id: string; name: string }[];
  services: { id: string; title: string }[];
}

/** Plain GET form: filters live in the URL, so views are shareable and need no client JS. */
export function LeadFilters({ values, demos, services }: Props) {
  return (
    <form method="get" action="/admin/leads" role="search" aria-label="Filter leads" className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="relative sm:col-span-2 lg:col-span-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <Input name="q" aria-label="Search leads" placeholder="Search by reference, name, email, company or phone…" defaultValue={values.q} className="pl-10" />
      </div>
      <Select name="status" aria-label="Status" defaultValue={values.status}>
        <option value="">All statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
        ))}
      </Select>
      <Select name="priority" aria-label="Priority" defaultValue={values.priority}>
        <option value="">All priorities</option>
        {LEAD_PRIORITIES.map((p) => (
          <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
        ))}
      </Select>
      <Select name="source" aria-label="Source" defaultValue={values.source}>
        <option value="">All sources</option>
        {Object.entries(SOURCE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </Select>
      <Select name="followUp" aria-label="Follow-up" defaultValue={values.followUp}>
        <option value="">Any follow-up</option>
        <option value="overdue">Overdue</option>
        <option value="today">Due today</option>
        <option value="upcoming">Upcoming</option>
      </Select>
      <Select name="demo" aria-label="Demo" defaultValue={values.demo}>
        <option value="">All demos</option>
        {demos.map((d) => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </Select>
      <Select name="service" aria-label="Service" defaultValue={values.service}>
        <option value="">All services</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>{s.title}</option>
        ))}
      </Select>
      <Input name="country" aria-label="Country" placeholder="Country" defaultValue={values.country} />
      <Select name="sort" aria-label="Sort by" defaultValue={values.sort}>
        <option value="">Newest first</option>
        <option value="followUp">Follow-up date</option>
        <option value="estimate">Estimate size</option>
        <option value="priority">Priority</option>
        <option value="updated">Recently updated</option>
      </Select>
      <label className="flex items-center gap-2 text-sm text-muted">
        From <Input name="from" type="date" aria-label="Created from" defaultValue={values.from} className="h-10" />
      </label>
      <label className="flex items-center gap-2 text-sm text-muted">
        To <Input name="to" type="date" aria-label="Created to" defaultValue={values.to} className="h-10" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="archived" value="1" defaultChecked={values.archived === '1'} className="size-4 accent-[var(--primary)]" /> Show archived
      </label>
      <Button type="submit">Apply filters</Button>
    </form>
  );
}
