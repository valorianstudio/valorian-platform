export const dynamic = 'force-dynamic';

/** Liveness probe for hosting and uptime monitors. It does not touch the API. */
export function GET(): Response {
  return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
}
