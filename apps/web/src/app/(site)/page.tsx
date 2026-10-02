import { Hero } from '@/components/site/home/hero';
import { CapabilityPreview, DemoPreviewSection, FinalCta, ProcessPreview, WhyValorian } from '@/components/site/home/sections';
import { getSiteSettings } from '@/lib/server-api';

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero category={settings.tagline} />
      <CapabilityPreview />
      <WhyValorian companyName={settings.companyName} />
      <DemoPreviewSection />
      <ProcessPreview />
      <FinalCta companyName={settings.companyName} />
    </>
  );
}
