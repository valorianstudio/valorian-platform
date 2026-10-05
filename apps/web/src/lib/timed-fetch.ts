import 'server-only';

const SLOW_MS = 1000;

/**
 * fetch() for calls to the API that logs the slow ones (over 1 s) and the failed ones. These calls are wrapped in try/catch and fall back
 * to defaults, so without this a slow or failing API only shows up as a slow or degraded page with nothing to trace it to.
 * Responses served from the Next.js fetch cache take no measurable time and log nothing.
 */
export async function timedFetch(label: string, url: string, init: RequestInit): Promise<Response> {
  const started = performance.now();
  try {
    const response = await fetch(url, init);
    const ms = Math.round(performance.now() - started);
    if (response.status >= 500) console.warn(`[api] ${label} answered HTTP ${response.status} after ${ms}ms`);
    else if (ms >= SLOW_MS) console.warn(`[api] ${label} took ${ms}ms`);
    return response;
  } catch (error) {
    console.warn(`[api] ${label} failed after ${Math.round(performance.now() - started)}ms (${error instanceof Error ? error.name : 'error'})`);
    throw error;
  }
}
