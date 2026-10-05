import { PreviewBackButton } from '@/components/demos/shared/preview-back-button';

/**
 * Standalone previews (the landing-page demos). No Valorian header, footer or splash: the page looks like the client's own website,
 * with one floating "Back" button. Anything in this route group gets the same treatment.
 */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PreviewBackButton />
      {children}
    </>
  );
}
