import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Valorian Studio',
    short_name: 'Valorian',
    description: 'Software development company building web applications, SaaS platforms, AI solutions and mobile apps.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f4ee',
    theme_color: '#344648',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
