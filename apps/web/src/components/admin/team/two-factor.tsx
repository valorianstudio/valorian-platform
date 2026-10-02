'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { FormAlert } from '../form-alert';

export function TwoFactorCard({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [setup, setSetup] = useState<{ secret: string; otpauthUrl: string } | null>(null);
  const [codes, setCodes] = useState<string[] | null>(null);
  const [disabling, setDisabling] = useState(false);

  async function guarded(task: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await task();
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  const start = () => guarded(async () => setSetup(await apiRequest<{ secret: string; otpauthUrl: string }>('POST', '/auth/2fa/setup')));

  function enable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get('code') ?? '').trim();
    void guarded(async () => {
      const result = await apiRequest<{ backupCodes: string[] }>('POST', '/auth/2fa/enable', { code });
      setCodes(result.backupCodes);
      setSetup(null);
      router.refresh();
    });
  }

  function disable(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void guarded(async () => {
      await apiRequest('POST', '/auth/2fa/disable', { password: String(form.get('password') ?? ''), code: String(form.get('code') ?? '').trim() });
      toast.success('Two-factor authentication turned off.');
      setDisabling(false);
      router.refresh();
    });
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck className="size-5 text-accent" aria-hidden /> Two-factor authentication
          </h2>
          <p className="mt-1 text-sm text-muted">{enabled ? 'Enabled. You will be asked for a code from your authenticator app when you sign in.' : 'Add a second step at sign-in using an authenticator app. Optional but recommended.'}</p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <FormAlert error={error} />

        {codes && (
          <div className="rounded-lg border border-border bg-surface-strong p-4">
            <p className="text-sm font-medium">Save your backup codes</p>
            <p className="mt-1 text-sm text-muted">Each code works once if you lose your authenticator. They are shown only now.</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm">
              {codes.map((code) => (
                <li key={code}>{code}</li>
              ))}
            </ul>
            <Button className="mt-4" size="sm" onClick={() => setCodes(null)}>
              I have saved them
            </Button>
          </div>
        )}

        {!enabled && !setup && !codes && (
          <Button onClick={start} loading={busy}>
            Set up 2FA
          </Button>
        )}

        {setup && (
          <form onSubmit={enable} className="space-y-4">
            <p className="text-sm text-muted">
              Add this account to your authenticator app using the key below (choose “enter a setup key”), then enter the 6-digit code it shows.
            </p>
            <code className="block break-all rounded-lg border border-border bg-surface-strong p-3 font-mono text-sm">{setup.secret}</code>
            <a href={setup.otpauthUrl} className="text-sm text-primary">
              Open in authenticator app
            </a>
            <Field label="6-digit code">{(props) => <Input {...props} name="code" inputMode="numeric" autoComplete="one-time-code" required />}</Field>
            <div className="flex gap-3">
              <Button type="submit" loading={busy}>
                Turn on 2FA
              </Button>
              <Button variant="secondary" onClick={() => setSetup(null)} disabled={busy}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {enabled && !disabling && !codes && (
          <Button variant="secondary" onClick={() => setDisabling(true)}>
            Turn off 2FA
          </Button>
        )}

        {enabled && disabling && (
          <form onSubmit={disable} className="space-y-4">
            <Field label="Password">{(props) => <Input {...props} name="password" type="password" autoComplete="current-password" required />}</Field>
            <Field label="Authenticator or backup code">{(props) => <Input {...props} name="code" autoComplete="one-time-code" required />}</Field>
            <div className="flex gap-3">
              <Button type="submit" variant="danger" loading={busy}>
                Turn off 2FA
              </Button>
              <Button variant="secondary" onClick={() => setDisabling(false)} disabled={busy}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </Card>
  );
}
