import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { from, lastValueFrom, Observable, of } from 'rxjs';

const TTL_MS = 30_000;
const MAX_ENTRIES = 300;

/**
 * Short-lived in-memory cache for public, identical-for-everyone GET endpoints (published content, settings, configs).
 *
 * Why: the database is a network hop away, and one public page can need several queries. Without this, every website instance
 * and every visitor that misses the web server's own cache pays that cost again. With it, the first request in each 30 s window
 * does the work and everyone else is answered from memory; concurrent identical requests share a single in-flight query.
 *
 * Correctness: only successful results are stored (errors such as 404 are never cached), and the whole cache is emptied after
 * any successful admin write (see main.ts), so an editor's change is visible immediately rather than after the TTL.
 */
@Injectable()
export class PublicCacheInterceptor implements NestInterceptor {
  private static readonly entries = new Map<string, { value: unknown; expires: number }>();
  private static readonly inflight = new Map<string, Promise<unknown>>();

  private static generation = 0;

  static clear(): void {
    PublicCacheInterceptor.generation++;
    PublicCacheInterceptor.entries.clear();
    PublicCacheInterceptor.inflight.clear();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    if (request.method !== 'GET') return next.handle();
    const { entries, inflight } = PublicCacheInterceptor;
    const key = request.url;

    const hit = entries.get(key);
    if (hit && hit.expires > Date.now()) return of(hit.value);

    const pending = inflight.get(key);
    if (pending) return from(pending);

    const generation = PublicCacheInterceptor.generation;
    const work = lastValueFrom(next.handle())
      .then((value) => {
        // A write that landed while this query was running makes the result stale: hand it to the waiting callers, but do not keep it.
        if (generation !== PublicCacheInterceptor.generation) return value;
        if (entries.size >= MAX_ENTRIES) entries.delete(entries.keys().next().value as string);
        entries.set(key, { value, expires: Date.now() + TTL_MS });
        return value;
      })
      .finally(() => {
        if (inflight.get(key) === work) inflight.delete(key);
      });
    inflight.set(key, work);
    return from(work);
  }
}
