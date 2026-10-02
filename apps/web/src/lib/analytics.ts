/**
 * First-party, privacy-friendly analytics client.
 * - Anonymous random session id (no fingerprinting), rotated after 30 minutes of inactivity.
 * - Honours Do Not Track / Global Privacy Control.
 * - Events are batched and sent with sendBeacon, so they never block navigation.
 */

export type ClientEventType =
  | 'PAGE_VIEW'
  | 'DEMO_VIEW'
  | 'DEMO_PLATFORM_SELECT'
  | 'SERVICE_VIEW'
  | 'SOLUTION_VIEW'
  | 'CASE_STUDY_VIEW'
  | 'ARTICLE_VIEW'
  | 'ESTIMATOR_START'
  | 'ESTIMATOR_STEP_COMPLETE'
  | 'CTA_CLICK'
  | 'WHATSAPP_CLICK'
  | 'CONTACT_FORM_START';

export interface ClientEvent {
  type: ClientEventType;
  path?: string;
  platform?: 'WEBSITE' | 'MOBILE';
  step?: 'project' | 'industry' | 'features' | 'complexity' | 'integrations' | 'scale';
  cta?: string;
}

interface Attribution {
  ref?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

const STORAGE_KEY = 'val_sid';
const SESSION_TTL = 30 * 60 * 1000;
const ENDPOINT = '/api/analytics/collect';

let memorySession: string | null = null;
let pendingAttribution: Attribution | undefined;
let queue: ClientEvent[] = [];
let timer: number | undefined;

function trackingAllowed(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.doNotTrack !== '1' && nav.globalPrivacyControl !== true;
}

function randomId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function clean(value: string | null): string | undefined {
  const text = value?.trim().slice(0, 100);
  return text && /^[A-Za-z0-9 ._:/\-+%]*$/.test(text) ? text : undefined;
}

function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  let ref: string | undefined;
  try {
    const host = document.referrer ? new URL(document.referrer).hostname : '';
    if (host && host !== window.location.hostname) ref = host.slice(0, 120);
  } catch {
    ref = undefined;
  }
  return {
    ref,
    utmSource: clean(params.get('utm_source')),
    utmMedium: clean(params.get('utm_medium')),
    utmCampaign: clean(params.get('utm_campaign')),
    utmContent: clean(params.get('utm_content')),
    utmTerm: clean(params.get('utm_term')),
  };
}

/** Returns the current anonymous session id, starting a new session when the last one expired. */
export function getSessionId(): string | undefined {
  if (!trackingAllowed()) return undefined;
  let id: string | undefined;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as { id?: string; ts?: number }) : null;
    if (stored?.id && stored.ts && Date.now() - stored.ts < SESSION_TTL) id = stored.id;
  } catch {
    id = memorySession ?? undefined;
  }
  if (!id) {
    id = randomId();
    pendingAttribution = captureAttribution();
  }
  memorySession = id;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, ts: Date.now() }));
  } catch {
    /* storage unavailable: the in-memory id still groups events for this page load */
  }
  return id;
}

function flush(): void {
  timer = undefined;
  if (queue.length === 0) return;
  const sessionId = getSessionId();
  const events = queue.splice(0, 8);
  if (!sessionId) {
    queue = [];
    return;
  }
  const body = JSON.stringify({ sessionId, attr: pendingAttribution, events });
  pendingAttribution = undefined;
  try {
    const sent = typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    if (!sent) void fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => undefined);
  } catch {
    /* analytics must never affect the page */
  }
  if (queue.length > 0) schedule();
}

function schedule(): void {
  if (timer === undefined) timer = window.setTimeout(flush, 200);
}

export function track(event: ClientEvent): void {
  if (typeof window === 'undefined' || !trackingAllowed()) return;
  queue.push({ ...event, path: event.path ?? (window.location.pathname.replace(/\/+$/, '') || '/') });
  schedule();
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && queue.length > 0) flush();
  });
}
