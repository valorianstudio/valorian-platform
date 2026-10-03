'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Eye, EyeOff, FileText, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Modal } from '@/components/admin/team/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { FILE_CATEGORIES, MILESTONE_STATUSES, REQUEST_STATUSES, REQUEST_TYPE_LABEL, dateInput, formatDate, formatDateTime, formatSize, label, milestoneTone } from '@/lib/portal';
import type { FileCategory, MilestoneStatus, PortalMilestone, RequestStatus, RequestType } from '@/lib/portal';

function useAction() {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  async function run(task: () => Promise<unknown>, success?: string): Promise<boolean> {
    setBusy(true);
    setError(null);
    try {
      await task();
      if (success) toast.success(success);
      router.refresh();
      return true;
    } catch (e) {
      const apiError = e instanceof ApiError ? e : new ApiError('Something went wrong.', 0);
      setError(apiError);
      toast.error(apiError.message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  return { busy, error, setError, run };
}

/* ---------- milestones ---------- */

export function MilestonesPanel({ projectId, milestones, canManage }: { projectId: string; milestones: PortalMilestone[]; canManage: boolean }) {
  const { busy, error, setError, run } = useAction();
  const [editing, setEditing] = useState<PortalMilestone | 'new' | null>(null);
  const [toDelete, setToDelete] = useState<PortalMilestone | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const body = { title: String(f.get('title') ?? ''), description: String(f.get('description') ?? ''), status: String(f.get('status') ?? 'PENDING'), dueDate: String(f.get('dueDate') ?? '') };
    const ok = await run(() => (editing === 'new' ? apiRequest('POST', `/admin/projects/${projectId}/milestones`, body) : apiRequest('PATCH', `/admin/projects/${projectId}/milestones/${(editing as PortalMilestone).id}`, body)), 'Milestone saved.');
    if (ok) setEditing(null);
  }

  const quick = (m: PortalMilestone, status: MilestoneStatus) => run(() => apiRequest('PATCH', `/admin/projects/${projectId}/milestones/${m.id}`, { status }), 'Milestone updated.');
  const current = editing && editing !== 'new' ? editing : null;

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Milestones</h2>
        {canManage && (
          <Button size="sm" onClick={() => { setError(null); setEditing('new'); }}>
            <Plus className="size-4" aria-hidden /> Add milestone
          </Button>
        )}
      </div>
      {milestones.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No milestones yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {milestones.map((m) => (
            <li key={m.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-muted">{m.status === 'COMPLETED' ? `Completed ${formatDate(m.completedDate)}` : m.dueDate ? `Due ${formatDate(m.dueDate)}` : 'No due date'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={milestoneTone(m.status)}>{label(m.status)}</Badge>
                {canManage && (
                  <>
                    <Select aria-label={`Status of ${m.title}`} value={m.status} disabled={busy} onChange={(e) => void quick(m, e.target.value as MilestoneStatus)} className="h-9 w-36">
                      {MILESTONE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {label(s)}
                        </option>
                      ))}
                    </Select>
                    <Button variant="ghost" size="sm" aria-label={`Edit ${m.title}`} onClick={() => { setError(null); setEditing(m); }}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="sm" aria-label={`Delete ${m.title}`} className="text-danger" onClick={() => setToDelete(m)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={editing !== null} title={editing === 'new' ? 'Add milestone' : 'Edit milestone'} onClose={() => !busy && setEditing(null)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormAlert error={error} />
          <Field label="Title">{(props) => <Input {...props} name="title" defaultValue={current?.title} required maxLength={120} />}</Field>
          <Field label="Description">{(props) => <Textarea {...props} name="description" defaultValue={current?.description ?? ''} maxLength={1000} className="min-h-20" />}</Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Status">
              {(props) => (
                <Select {...props} name="status" defaultValue={current?.status ?? 'PENDING'}>
                  {MILESTONE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {label(s)}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Due date">{(props) => <Input {...props} name="dueDate" type="date" defaultValue={dateInput(current?.dueDate)} />}</Field>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEditing(null)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" loading={busy}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this milestone?"
        description={`“${toDelete?.title ?? ''}” will be removed from the client's timeline.`}
        busy={busy}
        onConfirm={async () => {
          if (toDelete) await run(() => apiRequest('DELETE', `/admin/projects/${projectId}/milestones/${toDelete.id}`), 'Milestone deleted.');
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </Card>
  );
}

/* ---------- updates ---------- */

interface UpdateRow {
  id: string;
  title: string;
  content: string;
  visibleToClient: boolean;
  createdByName: string;
  createdAt: string;
}

export function UpdatesPanel({ projectId, updates, canManage }: { projectId: string; updates: UpdateRow[]; canManage: boolean }) {
  const { busy, error, setError, run } = useAction();
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<UpdateRow | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const ok = await run(() => apiRequest('POST', `/admin/projects/${projectId}/updates`, { title: String(f.get('title') ?? ''), content: String(f.get('content') ?? ''), visibleToClient: f.get('visible') === 'on' }), 'Update saved.');
    if (ok) setOpen(false);
  }

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Updates</h2>
        {canManage && (
          <Button size="sm" onClick={() => { setError(null); setOpen(true); }}>
            <Plus className="size-4" aria-hidden /> Post update
          </Button>
        )}
      </div>
      {updates.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No updates yet.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {updates.map((u) => (
            <li key={u.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{u.title}</p>
                  <p className="text-xs text-muted">
                    {u.createdByName} · {formatDateTime(u.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge tone={u.visibleToClient ? 'accent' : 'neutral'}>{u.visibleToClient ? 'Visible to client' : 'Internal'}</Badge>
                  {canManage && (
                    <>
                      <Button variant="ghost" size="sm" disabled={busy} aria-label={u.visibleToClient ? 'Hide from client' : 'Show to client'} onClick={() => void run(() => apiRequest('PATCH', `/admin/projects/${projectId}/updates/${u.id}`, { visibleToClient: !u.visibleToClient }), 'Visibility updated.')}>
                        {u.visibleToClient ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Delete update" className="text-danger" onClick={() => setToDelete(u)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm">{u.content}</p>
            </li>
          ))}
        </ul>
      )}
      <Modal open={open} title="Post update" onClose={() => !busy && setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormAlert error={error} />
          <Field label="Title">{(props) => <Input {...props} name="title" required maxLength={140} />}</Field>
          <Field label="Details">{(props) => <Textarea {...props} name="content" required maxLength={8000} />}</Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visible" defaultChecked className="size-4 accent-[var(--color-primary)]" /> Visible to the client
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" loading={busy}>
              Post
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this update?"
        description={`“${toDelete?.title ?? ''}” will be removed permanently.`}
        busy={busy}
        onConfirm={async () => {
          if (toDelete) await run(() => apiRequest('DELETE', `/admin/projects/${projectId}/updates/${toDelete.id}`), 'Update deleted.');
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </Card>
  );
}

/* ---------- files ---------- */

interface FileRow {
  id: string;
  name: string;
  size: number;
  category: FileCategory;
  uploadedByName: string;
  visibleToClient: boolean;
  createdAt: string;
}

export function FilesPanel({ projectId, files, canManage }: { projectId: string; files: FileRow[]; canManage: boolean }) {
  const { busy, error, setError, run } = useAction();
  const input = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<FileCategory>('DOCUMENT');
  const [visible, setVisible] = useState(true);
  const [toDelete, setToDelete] = useState<FileRow | null>(null);

  async function upload(event: FormEvent) {
    event.preventDefault();
    const file = input.current?.files?.[0];
    if (!file) return setError(new ApiError('Choose a file first.', 400));
    if (file.size > 15 * 1024 * 1024) return setError(new ApiError('Files must be 15 MB or smaller.', 400));
    const ok = await run(async () => {
      const response = await fetch(`/api/admin/projects/${projectId}/files?name=${encodeURIComponent(file.name)}&category=${category}&visible=${visible}`, { method: 'POST', headers: { 'Content-Type': 'application/octet-stream' }, body: file });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { message?: string };
        throw new ApiError(payload.message ?? 'Upload failed.', response.status);
      }
    }, 'File uploaded.');
    if (ok && input.current) input.current.value = '';
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Files</h2>
      {canManage && (
        <form onSubmit={upload} className="mt-4 space-y-3 rounded-xl border border-dashed border-border p-4">
          <FormAlert error={error} />
          <input ref={input} type="file" aria-label="File to upload" className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-surface-strong file:px-3 file:py-2 file:text-sm" />
          <div className="flex flex-wrap items-center gap-3">
            <Select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value as FileCategory)} className="h-10 w-40">
              {FILE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {label(c)}
                </option>
              ))}
            </Select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="size-4 accent-[var(--color-primary)]" /> Share with client
            </label>
            <Button type="submit" loading={busy} size="sm">
              <Upload className="size-4" aria-hidden /> Upload
            </Button>
          </div>
          <p className="text-xs text-muted">PDF, images, Office documents, text, CSV or ZIP. Up to 15 MB.</p>
        </form>
      )}
      {files.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No files uploaded yet.</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {files.map((f) => (
            <li key={f.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="size-5 shrink-0 text-muted" aria-hidden />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="text-xs text-muted">
                    {label(f.category)} · {formatSize(f.size)} · {f.uploadedByName} · {formatDate(f.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Badge tone={f.visibleToClient ? 'accent' : 'neutral'}>{f.visibleToClient ? 'Shared' : 'Internal'}</Badge>
                <a href={`/api/admin/projects/${projectId}/files/${f.id}/download`} aria-label={`Download ${f.name}`} className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong">
                  <Download className="size-4" />
                </a>
                {canManage && (
                  <>
                    <Button variant="ghost" size="sm" disabled={busy} aria-label={f.visibleToClient ? 'Stop sharing' : 'Share with client'} onClick={() => void run(() => apiRequest('PATCH', `/admin/projects/${projectId}/files/${f.id}`, { visibleToClient: !f.visibleToClient }), 'Sharing updated.')}>
                      {f.visibleToClient ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" aria-label={`Delete ${f.name}`} className="text-danger" onClick={() => setToDelete(f)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this file?"
        description={`“${toDelete?.name ?? ''}” will be deleted for everyone, including the client.`}
        busy={busy}
        onConfirm={async () => {
          if (toDelete) await run(() => apiRequest('DELETE', `/admin/projects/${projectId}/files/${toDelete.id}`), 'File deleted.');
          setToDelete(null);
        }}
        onCancel={() => setToDelete(null)}
      />
    </Card>
  );
}

/* ---------- requests ---------- */

interface RequestRow {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  priority: string;
  status: RequestStatus;
  createdAt: string;
  createdBy: { name: string } | null;
}

export function RequestsPanel({ projectId, requests, canManage }: { projectId: string; requests: RequestRow[]; canManage: boolean }) {
  const { busy, run } = useAction();
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Client requests</h2>
      {requests.length === 0 ? (
        <p className="mt-4 text-sm text-muted">The client has not submitted any requests.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {requests.map((r) => (
            <li key={r.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{r.title}</p>
                  <Badge>{REQUEST_TYPE_LABEL[r.type]}</Badge>
                  <Badge tone={r.priority === 'URGENT' || r.priority === 'HIGH' ? 'danger' : 'neutral'}>{label(r.priority)}</Badge>
                </div>
                {canManage ? (
                  <Select aria-label={`Status of ${r.title}`} value={r.status} disabled={busy} onChange={(e) => void run(() => apiRequest('PATCH', `/admin/projects/${projectId}/requests/${r.id}`, { status: e.target.value }), 'Request updated.')} className="h-9 w-36">
                    {REQUEST_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {label(s)}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Badge>{label(r.status)}</Badge>
                )}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{r.description}</p>
              <p className="mt-2 text-xs text-muted">
                {r.createdBy?.name ?? 'Client'} · {formatDateTime(r.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ---------- archive ---------- */

export function ArchiveButton({ projectId, archived }: { projectId: string; archived: boolean }) {
  const { busy, run } = useAction();
  return (
    <Button variant="secondary" size="sm" loading={busy} onClick={() => void run(() => apiRequest('POST', `/admin/projects/${projectId}/${archived ? 'restore' : 'archive'}`), archived ? 'Project restored.' : 'Project archived.')}>
      {archived ? 'Restore project' : 'Archive project'}
    </Button>
  );
}
