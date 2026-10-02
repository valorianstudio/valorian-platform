'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Archive, ExternalLink, Eye, Pencil, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import { refreshContent } from '@/lib/actions';
import { ApiError, apiRequest } from '@/lib/client-api';

interface RowActionsProps {
  /** API collection, e.g. "case-studies" or "articles". */
  resource: string;
  /** Admin route segment, e.g. "case-studies" or "insights". */
  adminPath: string;
  /** Public route segment for the live link. */
  publicPath: string;
  id: string;
  slug: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  live: boolean;
}

export function RowActions({ resource, adminPath, publicPath, id, slug, title, status, featured, live }: RowActionsProps) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function run(action: () => Promise<unknown>, message: string) {
    if (busy) return;
    setBusy(true);
    try {
      await action();
      await refreshContent();
      toast.success(message);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong.');
    } finally {
      setBusy(false);
      setConfirm(false);
    }
  }

  const patch = (body: Record<string, unknown>, message: string) => run(() => apiRequest('PATCH', `/admin/${resource}/${id}`, body), message);

  return (
    <div className="flex flex-wrap items-center gap-1">
      <Button size="sm" variant="ghost" aria-label={featured ? 'Remove from featured' : 'Mark as featured'} aria-pressed={featured} disabled={busy} onClick={() => patch({ featured: !featured }, 'Updated.')}>
        <Star className={`size-4 ${featured ? 'fill-current text-primary' : ''}`} />
      </Button>
      <Button size="sm" variant="secondary" disabled={busy} onClick={() => patch({ status: status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }, status === 'PUBLISHED' ? 'Unpublished.' : 'Published.')}>
        {status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
      </Button>
      {status !== 'ARCHIVED' && (
        <Button size="sm" variant="ghost" aria-label="Archive" disabled={busy} onClick={() => patch({ status: 'ARCHIVED' }, 'Archived.')}>
          <Archive className="size-4" />
        </Button>
      )}
      {live ? (
        <Link href={`/${publicPath}/${slug}`} target="_blank" aria-label="View on site" className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong">
          <ExternalLink className="size-4" />
        </Link>
      ) : (
        <Link href={`/admin/preview/${adminPath}/${id}`} target="_blank" aria-label="Preview draft" className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong">
          <Eye className="size-4" />
        </Link>
      )}
      <Link href={`/admin/${adminPath}/${id}/edit`} aria-label="Edit" className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong">
        <Pencil className="size-4" />
      </Link>
      <Button size="sm" variant="ghost" aria-label="Delete" className="text-danger" disabled={busy} onClick={() => setConfirm(true)}>
        <Trash2 className="size-4" />
      </Button>
      <ConfirmDialog open={confirm} title="Delete permanently?" description={`“${title}” will be permanently removed. Consider archiving it instead.`} busy={busy} onConfirm={() => run(() => apiRequest('DELETE', `/admin/${resource}/${id}`), 'Deleted.')} onCancel={() => setConfirm(false)} />
    </div>
  );
}
