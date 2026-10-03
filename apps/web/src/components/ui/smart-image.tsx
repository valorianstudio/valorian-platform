import { FallbackImage } from './fallback-image';
import type { FallbackImageProps } from './fallback-image';

/** Content image: optimised by Next.js when it is hosted by us or Cloudinary, plain lazy <img> otherwise, with a retryable fallback. */
export function SmartImage(props: FallbackImageProps) {
  return <FallbackImage {...props} />;
}
