import Image from 'next/image';
import Link from 'next/link';

/**
 * The Valorian logo, unmodified (black lettering on a transparent background).
 * On slate sections pass `onDark` and it sits on a warm-white tile instead of being recoloured.
 */
export function Wordmark({ name, href = '/', priority = false, onDark = false, className = 'h-10 sm:h-11 lg:h-12' }: { name: string; href?: string; priority?: boolean; onDark?: boolean; className?: string }) {
  return (
    <Link
      href={href}
      aria-label={`${name} home`}
      className={onDark ? 'inline-flex items-center rounded-xl bg-[#fffdfc] px-3 py-1' : '-ml-2 inline-flex min-w-0 items-center rounded-lg px-2 transition-opacity duration-200 hover:opacity-80'}
    >
      <Image src="/branding/valorian-logo.png" alt="Valorian" width={1280} height={427} priority={priority} sizes="180px" className={`${className} w-auto`} />
    </Link>
  );
}
