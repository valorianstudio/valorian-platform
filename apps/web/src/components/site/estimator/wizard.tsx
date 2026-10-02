'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock, Search, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/field';
import { ApiError, apiRequest } from '@/lib/client-api';
import type { EstimateResult, EstimatorConfig } from '@/lib/cms-types';
import { cn } from '@/lib/cn';
import { getSessionId, track } from '@/lib/analytics';
import { whatsappLink, whatsappMessages } from '@/lib/whatsapp';
import { LeadForm } from '../lead-form';

const STEPS = ['Project', 'Industry', 'Features', 'Complexity', 'Integrations', 'Scale'] as const;
const STEP_KEYS = ['project', 'industry', 'features', 'complexity', 'integrations', 'scale'] as const;
const SYMBOLS = { BDT: '৳', USD: '$' } as const;

function money(amount: number, currency: EstimateResult['currency']): string {
  return `${SYMBOLS[currency]}${amount.toLocaleString('en-US')}`;
}

function Choice({
  type,
  name,
  checked,
  disabled,
  onChange,
  title,
  description,
  badges,
}: {
  type: 'radio' | 'checkbox';
  name: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  title: string;
  description?: string | null;
  badges?: ReactNode;
}) {
  return (
    <label
      className={cn(
        'relative flex h-full cursor-pointer gap-3 rounded-xl border bg-background p-4 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
        checked ? 'border-primary bg-primary-soft/50' : 'border-border hover:border-primary/40',
        disabled && 'cursor-default opacity-90',
      )}
    >
      <input type={type} name={name} checked={checked} disabled={disabled} onChange={onChange} className="sr-only" />
      <span aria-hidden className={cn('mt-0.5 grid size-5 shrink-0 place-items-center border', type === 'radio' ? 'rounded-full' : 'rounded-md', checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border')}>
        {checked && <Check className="size-3" />}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 font-medium">
          {title}
          {badges}
        </span>
        {description && <span className="mt-0.5 block text-sm text-muted">{description}</span>}
      </span>
    </label>
  );
}

interface WizardProps {
  config: EstimatorConfig;
  company: string;
  whatsappNumber: string | null;
  responseNote?: string | null;
}

export function EstimatorWizard({ config, company, whatsappNumber, responseNote }: WizardProps) {
  const { preset } = config;
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState(preset.projectType ?? '');
  const [industry, setIndustry] = useState(preset.industry ?? '');
  const [featureIds, setFeatureIds] = useState<Set<string>>(() => new Set([...config.features.filter((f) => f.required).map((f) => f.id), ...preset.featureIds]));
  const [integrationIds, setIntegrationIds] = useState<Set<string>>(new Set());
  const [complexity, setComplexity] = useState(config.complexities[Math.min(1, config.complexities.length - 1)]?.slug ?? '');
  const [scale, setScale] = useState(config.scales[0]?.key ?? '');
  const [urgency, setUrgency] = useState((config.urgencies.find((u) => u.key === 'normal') ?? config.urgencies[0])?.key ?? '');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    track({ type: 'ESTIMATOR_START' });
  }, []);

  const selectedType = config.projectTypes.find((t) => t.slug === projectType);
  const platform = selectedType?.platform;
  const availableOn = (platforms: ('WEBSITE' | 'MOBILE')[]) => !platform || platform === 'BOTH' || platforms.includes(platform);
  const features = useMemo(() => config.features.filter((f) => availableOn(f.platforms)), [config.features, platform]); // eslint-disable-line react-hooks/exhaustive-deps
  const integrations = useMemo(() => config.integrations.filter((i) => availableOn(i.platforms)), [config.integrations, platform]); // eslint-disable-line react-hooks/exhaustive-deps
  const visibleFeatures = features.filter((f) => (!category || f.categoryId === category) && `${f.name} ${f.description ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()));
  const categories = config.categories.filter((c) => features.some((f) => f.categoryId === c.id));
  const canContinue = step === 0 ? Boolean(projectType) : step === 3 ? Boolean(complexity) : step === 5 ? Boolean(scale && urgency) : true;

  const toggle = (set: Set<string>, id: string, update: (next: Set<string>) => void) => {
    const next = new Set(set);
    if (!next.delete(id)) next.add(id);
    update(next);
  };

  async function calculate() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const body = {
        projectType,
        demo: preset.demo?.slug,
        industry: industry || undefined,
        featureIds: features.filter((f) => featureIds.has(f.id)).map((f) => f.id),
        integrationIds: integrations.filter((i) => integrationIds.has(i.id)).map((i) => i.id),
        complexity,
        scale,
        urgency,
        sessionId: getSessionId(),
      };
      setResult(await apiRequest<EstimateResult>('POST', '/estimator/calculate', body));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not calculate the estimate.');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-6 animate-fade-up">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-primary-soft to-accent-soft px-6 py-8 sm:px-10 sm:py-10">
            <p className="text-sm font-medium text-primary">Estimated project investment</p>
            <p className="mt-2 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {money(result.min, result.currency)} – {money(result.max, result.currency)}
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-muted">
              <Clock className="size-4" aria-hidden /> Estimated timeline: {result.weeks.min}–{result.weeks.max} weeks
            </p>
          </div>
          <dl className="grid gap-6 p-6 sm:grid-cols-2 sm:p-10">
            {[
              ['Project type', result.projectType],
              ['Platform', { WEBSITE: 'Website', MOBILE: 'Mobile App', BOTH: 'Website + Mobile' }[result.platform]],
              ['Complexity', result.complexity],
              ['Scale', result.scale],
              ['Timeline preference', result.urgency],
            ].map(([term, value]) => (
              <div key={term}>
                <dt className="text-sm text-muted">{term}</dt>
                <dd className="mt-0.5 font-medium">{value}</dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="text-sm text-muted">Selected features</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {result.features.map((f) => (
                  <Badge key={f.id}>{f.name}</Badge>
                ))}
              </dd>
            </div>
            {result.integrations.length > 0 && (
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted">Integrations</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {result.integrations.map((i) => (
                    <Badge key={i.id} tone="primary">{i.name}</Badge>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          <p className="border-t border-border bg-surface px-6 py-4 text-sm text-muted sm:px-10">{result.disclaimer}</p>
        </Card>
        {showForm ? (
          <Card className="p-5 sm:p-8" id="discuss">
            <h2 className="mb-1 text-xl font-semibold">Discuss this project</h2>
            <p className="mb-6 text-muted">Your estimate and selections are attached automatically. Just tell us how to reach you.</p>
            <LeadForm
              context={{ source: 'ESTIMATOR', estimateId: result.id, demo: preset.demo?.slug, demoName: preset.demo?.name, platform: result.platform, projectType: result.projectType, backHref: '/estimate', backLabel: 'Back to estimator' }}
              company={company}
              whatsappNumber={whatsappNumber}
              responseNote={responseNote}
              submitLabel="Send project request"
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button size="lg" onClick={() => setShowForm(true)}>Discuss This Project <ArrowRight className="size-4" aria-hidden /></Button>
            <Button size="lg" variant="secondary" onClick={() => setShowForm(true)}>Request Project Review</Button>
            {whatsappLink(whatsappNumber, whatsappMessages.estimate(company)) && (
              <ButtonLink href={whatsappLink(whatsappNumber, whatsappMessages.estimate(company)) ?? '#'} size="lg" variant="secondary" target="_blank" rel="noopener noreferrer">Discuss My Estimate</ButtonLink>
            )}
            <ButtonLink href="/contact" size="lg" variant="ghost">Contact {company}</ButtonLink>
            <Button size="lg" variant="ghost" onClick={() => { setResult(null); setStep(0); }}>Adjust estimate</Button>
          </div>
        )}
      </div>
    );
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div>
      {preset.demo && (
        <p className="mb-6 flex items-center gap-2 rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
          <Sparkles className="size-4 shrink-0" aria-hidden /> Estimating a project like <strong>{preset.demo.name}</strong>. We preselected its typical features; adjust anything.
        </p>
      )}
      <div className="mb-8">
        <p className="mb-3 text-sm text-muted" aria-live="polite">
          Step {step + 1} of {STEPS.length} · <span className="font-medium text-foreground">{STEPS[step]}</span>
        </p>
        <div className="flex gap-1.5" aria-hidden>
          {STEPS.map((label, index) => (
            <span key={label} className={cn('h-1.5 flex-1 rounded-full transition-colors', index <= step ? 'bg-primary' : 'bg-surface-strong')} />
          ))}
        </div>
      </div>

      <div key={step} className="animate-fade-up">
        {step === 0 && (
          <fieldset>
            <legend className="mb-1 text-2xl font-semibold tracking-tight">What do you want to build?</legend>
            <p className="mb-6 text-muted">Choose the closest match. You can refine everything else next.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {config.projectTypes.map((type) => (
                <Choice
                  key={type.slug}
                  type="radio"
                  name="project-type"
                  checked={projectType === type.slug}
                  onChange={() => {
                    setProjectType(type.slug);
                    setFeatureIds((current) => new Set([...current].filter((id) => config.features.find((f) => f.id === id && (type.platform === 'BOTH' || f.platforms.includes(type.platform as 'WEBSITE' | 'MOBILE'))))));
                    setIntegrationIds(new Set());
                  }}
                  title={type.name}
                  description={type.description}
                />
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="mb-1 text-2xl font-semibold tracking-tight">Which industry or use case?</legend>
            <p className="mb-6 text-muted">Optional. We highlight features that suit your industry.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Choice type="radio" name="industry" checked={industry === ''} onChange={() => setIndustry('')} title="Other / not sure" />
              {config.industries.map((item) => (
                <Choice key={item.slug} type="radio" name="industry" checked={industry === item.slug} onChange={() => setIndustry(item.slug)} title={item.name} />
              ))}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="mb-1 text-2xl font-semibold tracking-tight">Select features</legend>
            <p className="mb-6 text-muted">Pick what you need. Required items are always included.</p>
            <div className="mb-5 space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                <Input aria-label="Search features" placeholder="Search features…" className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              {categories.length > 1 && (
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter by category">
                  {[{ id: '', name: 'All' }, ...categories].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={category === c.id}
                      onClick={() => setCategory(c.id)}
                      className={cn('shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors', category === c.id ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted hover:text-foreground')}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {visibleFeatures.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-5 py-8 text-center text-muted">No features match your search.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {visibleFeatures.map((f) => (
                  <Choice
                    key={f.id}
                    type="checkbox"
                    name="features"
                    checked={featureIds.has(f.id)}
                    disabled={f.required}
                    onChange={() => toggle(featureIds, f.id, setFeatureIds)}
                    title={f.name}
                    description={f.description}
                    badges={
                      <>
                        {f.required && <Badge>Included</Badge>}
                        {!f.required && f.recommended && <Badge tone="accent">Recommended</Badge>}
                        {(preset.featureIds.includes(f.id) || (industry && f.industries.includes(industry))) && <Badge tone="primary">Suggested</Badge>}
                      </>
                    }
                  />
                ))}
              </div>
            )}
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="mb-1 text-2xl font-semibold tracking-tight">How complex is the project?</legend>
            <p className="mb-6 text-muted">This shapes both cost and timeline.</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {config.complexities.map((c) => (
                <Choice key={c.slug} type="radio" name="complexity" checked={complexity === c.slug} onChange={() => setComplexity(c.slug)} title={c.name} description={c.description} />
              ))}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <fieldset>
            <legend className="mb-1 text-2xl font-semibold tracking-tight">Any integrations?</legend>
            <p className="mb-6 text-muted">Optional. Connect your product to other services.</p>
            {integrations.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-5 py-8 text-center text-muted">No integrations available for this project type.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {integrations.map((i) => (
                  <Choice key={i.id} type="checkbox" name="integrations" checked={integrationIds.has(i.id)} onChange={() => toggle(integrationIds, i.id, setIntegrationIds)} title={i.name} description={i.description} />
                ))}
              </div>
            )}
          </fieldset>
        )}

        {step === 5 && (
          <div className="space-y-8">
            <fieldset>
              <legend className="mb-1 text-2xl font-semibold tracking-tight">Expected users</legend>
              <p className="mb-4 text-muted">Larger audiences need more robust infrastructure.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {config.scales.map((s) => (
                  <Choice key={s.key} type="radio" name="scale" checked={scale === s.key} onChange={() => setScale(s.key)} title={s.label} description={s.description} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-4 text-2xl font-semibold tracking-tight">Timeline</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {config.urgencies.map((u) => (
                  <Choice key={u.key} type="radio" name="urgency" checked={urgency === u.key} onChange={() => setUrgency(u.key)} title={u.label} description={u.description} />
                ))}
              </div>
            </fieldset>
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-6 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 -mx-5 mt-10 flex items-center justify-between gap-3 border-t border-border bg-background/90 px-5 py-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <Button variant="secondary" size="lg" disabled={step === 0 || loading} onClick={() => setStep(step - 1)}>
          <ArrowLeft className="size-4" aria-hidden /> Back
        </Button>
        {isLast ? (
          <Button size="lg" loading={loading} onClick={calculate} disabled={!canContinue}>
            {loading ? 'Calculating…' : 'See my estimate'}
          </Button>
        ) : (
          <Button
            size="lg"
            disabled={!canContinue}
            onClick={() => {
              track({ type: 'ESTIMATOR_STEP_COMPLETE', step: STEP_KEYS[step] });
              setStep(step + 1);
            }}
          >
            Next <ArrowRight className="size-4" aria-hidden />
          </Button>
        )}
      </div>
    </div>
  );
}
