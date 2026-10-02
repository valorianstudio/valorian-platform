'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { refreshContent } from '@/lib/actions';
import { ApiError, apiRequest } from '@/lib/client-api';
import { FormAlert } from '../form-alert';

export function FooterForm({ copyrightText }: { copyrightText: string | null }) {
  const toast = useToast();
  const [value, setValue] = useState(copyrightText ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await apiRequest('PATCH', '/admin/settings/footer', { copyrightText: value });
      await refreshContent();
      toast.success('Footer saved.');
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormAlert error={error} />
        <Field label="Copyright text" hint="Leave empty to use “© year Company. All rights reserved.”">
          {(props) => <Input {...props} maxLength={200} value={value} onChange={(e) => setValue(e.target.value)} />}
        </Field>
        <Button type="submit" loading={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </Card>
  );
}
