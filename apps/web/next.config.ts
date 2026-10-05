import type { NextConfig } from 'next';

const apiUrl = process.env.API_URL ?? 'http://localhost:4000';
const isProduction = process.env.NODE_ENV === 'production';
const cloudinaryName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (isProduction && !process.env.API_URL) throw new Error('API_URL must be set for production builds (the URL the Next.js server uses to reach the API).');
if (isProduction && !process.env.NEXT_PUBLIC_SITE_URL) throw new Error('NEXT_PUBLIC_SITE_URL must be set for production builds (for example https://valorian.com).');

// Pages ship inline bootstrap scripts (theme, Next.js), so scripts allow 'unsafe-inline'. Everything else is locked to this origin.
// Remote images are allowed because editors may reference external image URLs in content; nothing else may load remotely.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const baseHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  ...(isProduction
    ? [
        { key: 'Content-Security-Policy', value: csp },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      ]
    : []),
];

// Private areas must never be stored by a CDN (for example Cloudflare) or the browser cache.
const privateHeaders = [
  { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
  { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
];

const config: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  experimental: { authInterrupts: true },
  images: {
    localPatterns: [{ pathname: '/api/media/**' }, { pathname: '/brand/**' }, { pathname: '/branding/**' }, { pathname: '/demos/**' }],
    // Uploaded media lives on Cloudinary. Only that host (and, when set, only this account's folder) may be optimised.
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: cloudinaryName ? `/${cloudinaryName}/image/upload/**` : '/**' }],
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    // Demos that moved to a new slug (educore, clinicos, tableflow, fitcore, learnova, modeva, hotel-management-system). One page per demo: the old address sends visitors (and search engines) to the new one.
    return [
      { source: '/demos/educore', destination: '/demos/school-management', permanent: true },
      { source: '/demos/clinicos', destination: '/demos/clinic-management', permanent: true },
      { source: '/demos/tableflow', destination: '/demos/restaurant-management', permanent: true },
      { source: '/demos/fitcore', destination: '/demos/gym-management', permanent: true },
      { source: '/demos/learnova', destination: '/demos/course-learning', permanent: true },
      { source: '/demos/modeva', destination: '/demos/clothing-ecommerce', permanent: true },
      { source: '/demos/hotel-management-system', destination: '/demos/hotel-management', permanent: true },
    ];
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiUrl}/api/:path*` }];
  },
  async headers() {
    return [
      { source: '/:path*', headers: baseHeaders },
      { source: '/admin/:path*', headers: privateHeaders },
      { source: '/client/:path*', headers: privateHeaders },
    ];
  },
};

export default config;
