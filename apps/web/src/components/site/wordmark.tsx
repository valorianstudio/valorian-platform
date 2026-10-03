import Image from 'next/image';
import Link from 'next/link';

/** Intrinsic size of the trimmed logo files (public/branding). Keep in sync with scripts/generate-brand-assets.mjs. */
const LOGO_WIDTH = 1190;
const LOGO_HEIGHT = 321;

/**
 * The official Valorian Studio logo. The dark-ink file is used on light surfaces and the cream file on slate sections (`onDark`).
 * Both are served through the Next.js optimizer, so retina screens get a 2x/3x rendition without shipping a huge file everywhere.
 */
export function Wordmark({ name, href = '/', priority = false, onDark = false, className = 'h-11 sm:h-12 lg:h-14' }: { name: string; href?: string; priority?: boolean; onDark?: boolean; className?: string }) {
  return (
    <Link
      href={href}
      aria-label={`${name} home`}
      className="-ml-1 inline-flex min-w-0 items-center rounded-lg px-1 transition-opacity duration-200 hover:opacity-80"
    >
      <Image
        src={onDark ? '/branding/valorian-logo-light.png' : '/branding/valorian-logo.png'}
        alt="Valorian Studio"
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        quality={90}
        sizes="(min-width: 1024px) 208px, (min-width: 640px) 178px, 163px"
        className={`${className} w-auto max-w-full`}
      />
    </Link>
  );
}
