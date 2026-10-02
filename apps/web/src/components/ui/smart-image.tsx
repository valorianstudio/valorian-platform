import Image from 'next/image';

interface SmartImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

/** Uses the Next.js optimizer for uploaded media; external URLs fall back to a plain lazy <img>. */
export function SmartImage({ src, alt, width, height, sizes = '100vw', className, priority }: SmartImageProps) {
  if (src.startsWith('/api/media/')) {
    return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className={className} priority={priority} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} width={width} height={height} loading={priority ? 'eager' : 'lazy'} decoding="async" fetchPriority={priority ? 'high' : undefined} className={className} />
  );
}
