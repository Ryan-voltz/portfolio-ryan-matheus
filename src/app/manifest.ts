import type { MetadataRoute } from 'next';
import { site } from '@/content/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.headline}`,
    short_name: site.name,
    description:
      'Full-stack developer building custom business systems — CRM, ERP, e-commerce and compliance platforms.',
    start_url: '/',
    display: 'standalone',
    background_color: '#eff1f2',
    theme_color: '#eff1f2',
    icons: [
      { src: '/icon', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
