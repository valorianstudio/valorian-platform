import { EstimatorNav } from '@/components/admin/estimator/estimator-nav';
import { PageHeader } from '@/components/ui/page-header';

export default function EstimatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader title="Estimator" description="Pricing data behind the project cost estimator. Changes apply to new estimates immediately." />
      <EstimatorNav />
      {children}
    </>
  );
}
