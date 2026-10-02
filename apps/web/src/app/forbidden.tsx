import { ButtonLink } from '@/components/ui/button';

export default function Forbidden() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <p className="font-mono text-sm text-primary">403</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">You do not have permission to access this page</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">Your role does not include this area. If you need access, ask a Super Admin to update your role.</p>
        <ButtonLink href="/admin" className="mt-8">
          Back to dashboard
        </ButtonLink>
      </div>
    </main>
  );
}
