'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FormAlert } from '@/components/admin/form-alert';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { REQUEST_TYPES, REQUEST_TYPE_LABEL } from '@/lib/portal';

export function RequestForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    try {
      await apiRequest('POST', `/client/projects/${projectId}/requests`, {
        title: String(data.get('title') ?? ''),
        description: String(data.get('description') ?? ''),
        type: String(data.get('type') ?? 'QUESTION'),
        priority: String(data.get('priority') ?? 'NORMAL'),
      });
      form.reset();
      toast.success('Request sent to the Valorian team.');
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormAlert error={error} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Type">
          {(props) => (
            <Select {...props} name="type" defaultValue="QUESTION">
              {REQUEST_TYPES.map((type) => (
                <option key={type} value={type}>
                  {REQUEST_TYPE_LABEL[type]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Priority">
          {(props) => (
            <Select {...props} name="priority" defaultValue="NORMAL">
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </Select>
          )}
        </Field>
      </div>
      <Field label="Title">{(props) => <Input {...props} name="title" required maxLength={140} />}</Field>
      <Field label="Details">{(props) => <Textarea {...props} name="description" required maxLength={4000} />}</Field>
      <Button type="submit" loading={busy}>
        Submit request
      </Button>
    </form>
  );
}
