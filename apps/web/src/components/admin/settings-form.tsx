'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input, Select, Switch, Textarea } from '@/components/ui/field';
import { Tabs } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { refreshSiteSettings } from '@/lib/actions';
import { CURRENCIES, settingsSchema, toFieldErrors } from '@/lib/schemas';
import type { FieldErrors, SettingsValues } from '@/lib/schemas';
import type { SiteSettings } from '@/lib/types';
import { FormAlert } from './form-alert';

type TextKey = Exclude<keyof SettingsValues, 'maintenanceMode' | 'defaultCurrency'>;

function toValues(settings: SiteSettings): SettingsValues {
  return {
    brandName: settings.brandName,
    companyName: settings.companyName,
    tagline: settings.tagline,
    description: settings.description,
    primaryEmail: settings.primaryEmail,
    secondaryEmail: settings.secondaryEmail ?? '',
    phone: settings.phone ?? '',
    whatsapp: settings.whatsapp ?? '',
    websiteUrl: settings.websiteUrl ?? '',
    location: settings.location ?? '',
    linkedinUrl: settings.linkedinUrl ?? '',
    githubUrl: settings.githubUrl ?? '',
    facebookUrl: settings.facebookUrl ?? '',
    instagramUrl: settings.instagramUrl ?? '',
    twitterUrl: settings.twitterUrl ?? '',
    defaultCurrency: (CURRENCIES as readonly string[]).includes(settings.defaultCurrency) ? (settings.defaultCurrency as SettingsValues['defaultCurrency']) : 'USD',
    logoLightUrl: settings.logoLightUrl ?? '',
    logoDarkUrl: settings.logoDarkUrl ?? '',
    faviconUrl: settings.faviconUrl ?? '',
    maintenanceMode: settings.maintenanceMode,
  };
}

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const toast = useToast();
  const [values, setValues] = useState<SettingsValues>(() => toValues(initial));
  const [errors, setErrors] = useState<FieldErrors<SettingsValues>>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const text = (key: TextKey, label: string, options: { hint?: string; type?: string; autoComplete?: string } = {}) => (
    <Field label={label} error={errors[key]} hint={options.hint}>
      {(props) => (
        <Input {...props} type={options.type ?? 'text'} autoComplete={options.autoComplete} value={values[key]} onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))} />
      )}
    </Field>
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const parsed = settingsSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(toFieldErrors<SettingsValues>(parsed.error));
      setApiError(null);
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setErrors({});
    setApiError(null);
    setSubmitting(true);
    try {
      const saved = await apiRequest<SiteSettings>('PUT', '/admin/settings', parsed.data);
      setValues(toValues(saved));
      await refreshSiteSettings();
      toast.success('Settings saved. Your website is updated.');
    } catch (error) {
      setApiError(error instanceof ApiError ? error : null);
      toast.error(error instanceof ApiError ? error.message : 'Could not save settings.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <FormAlert error={apiError} />
      <Card className="p-5 sm:p-6">
        <Tabs
          items={[
            {
              id: 'general',
              label: 'General',
              content: (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {text('brandName', 'Brand name', { hint: 'Shown as the logo text.' })}
                    {text('companyName', 'Company name')}
                  </div>
                  {text('tagline', 'Positioning / category')}
                  <Field label="Description" error={errors.description} hint="Used as the default site description for search and sharing.">
                    {(props) => <Textarea {...props} value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} />}
                  </Field>
                  {text('websiteUrl', 'Website URL', { type: 'url', autoComplete: 'url' })}
                  <Field label="Default currency" error={errors.defaultCurrency}>
                    {(props) => (
                      <Select {...props} value={values.defaultCurrency} onChange={(e) => setValues((v) => ({ ...v, defaultCurrency: e.target.value as SettingsValues['defaultCurrency'] }))}>
                        {CURRENCIES.map((code) => (
                          <option key={code} value={code}>
                            {code}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </>
              ),
            },
            {
              id: 'contact',
              label: 'Contact',
              content: (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {text('primaryEmail', 'Primary email', { type: 'email' })}
                    {text('secondaryEmail', 'Secondary email', { type: 'email' })}
                    {text('phone', 'Phone', { type: 'tel', autoComplete: 'tel' })}
                    {text('whatsapp', 'WhatsApp number', { hint: 'International format, e.g. +14155550123.', type: 'tel' })}
                  </div>
                  {text('location', 'Location')}
                </>
              ),
            },
            {
              id: 'social',
              label: 'Social',
              content: (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {text('linkedinUrl', 'LinkedIn', { type: 'url' })}
                  {text('githubUrl', 'GitHub', { type: 'url' })}
                  {text('twitterUrl', 'X / Twitter', { type: 'url' })}
                  {text('facebookUrl', 'Facebook', { type: 'url' })}
                  {text('instagramUrl', 'Instagram', { type: 'url' })}
                </div>
              ),
            },
            {
              id: 'branding',
              label: 'Branding',
              content: (
                <>
                  <p className="text-sm text-muted">Media uploads arrive in a later phase. For now, paste hosted image URLs.</p>
                  {text('logoLightUrl', 'Logo (light theme)', { type: 'url' })}
                  {text('logoDarkUrl', 'Logo (dark theme)', { type: 'url' })}
                  {text('faviconUrl', 'Favicon', { type: 'url' })}
                </>
              ),
            },
            {
              id: 'system',
              label: 'System',
              content: (
                <Switch
                  label="Maintenance mode"
                  description="Visitors see a maintenance notice instead of the public pages. The admin area stays available."
                  checked={values.maintenanceMode}
                  onChange={(maintenanceMode) => setValues((v) => ({ ...v, maintenanceMode }))}
                />
              ),
            },
          ]}
        />
      </Card>
      <div className="flex justify-end">
        <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
          {submitting ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </form>
  );
}
