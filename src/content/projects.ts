/**
 * Structured project data. All prose lives in `messages/{en,pt,es}.json`
 * under `work.<slug>.*` and `projects.<slug>.*`.
 *
 * ADDING A PROJECT
 * ----------------
 * 1. Capture its screenshot:  node scripts/capture-sites.mjs
 *    (add it to the SITES array in that script first)
 * 2. Push an entry onto `otherProjects` below.
 * 3. Add `projects.<slug>.name` / `.type` to all three message files.
 * Nothing else needs to change — the schedule table and the sitemap read
 * from these arrays.
 */

export type Stack = string[];

export type FeaturedProject = {
  slug: string;
  /** Detail letter used by the drawing callouts: A, B, C … */
  callout: string;
  /** Sheet number of the project's own page. Home is sheet 01. */
  sheet: string;
  url: string;
  domain: string;
  stack: Stack;
  shot: string;
  /**
   * 'qualitative' — a described outcome exists, no figures.
   * 'pending'     — Ryan has not supplied a result yet; the page renders a
   *                 visible redline placeholder instead of inventing one.
   */
  result: 'qualitative' | 'pending';
};

export type OtherProject = {
  slug: string;
  url: string;
  domain: string;
  shot: string;
};

export const featuredProjects: FeaturedProject[] = [
  {
    slug: 'volare',
    callout: 'A',
    sheet: '02',
    url: 'https://volarecompany.com.br/',
    domain: 'volarecompany.com.br',
    stack: ['React', 'Vite', 'Supabase'],
    shot: '/shots/volare.webp',
    result: 'qualitative',
  },
  {
    slug: 'voltz-hub',
    callout: 'B',
    sheet: '03',
    url: 'https://voltzhub.com.br/',
    domain: 'voltzhub.com.br',
    stack: ['React', 'Vite', 'Supabase', 'Framer Motion'],
    shot: '/shots/voltz-hub.webp',
    result: 'pending',
  },
  {
    slug: 'blumenns',
    callout: 'C',
    sheet: '04',
    url: 'https://blumenns.com/',
    domain: 'blumenns.com',
    stack: ['React', 'Vite'],
    shot: '/shots/blumenns.webp',
    result: 'pending',
  },
];

export const otherProjects: OtherProject[] = [
  {
    slug: 'seu-puto-store',
    url: 'https://seuputostore.com.br/',
    domain: 'seuputostore.com.br',
    shot: '/shots/seu-puto-store.webp',
  },
  {
    slug: 'overall-cla',
    url: 'https://overalclasuplementos.com.br/',
    domain: 'overalclasuplementos.com.br',
    shot: '/shots/overall-cla.webp',
  },
  {
    slug: 'fipec',
    url: 'https://fipec.com.br/',
    domain: 'fipec.com.br',
    shot: '/shots/fipec.webp',
  },
  {
    slug: 'g7-comercio',
    url: 'https://g7comercio.com.br/',
    domain: 'g7comercio.com.br',
    shot: '/shots/g7-comercio.webp',
  },
  {
    slug: 'grupo-educare',
    url: 'https://editoraeducare.com.br/',
    domain: 'editoraeducare.com.br',
    shot: '/shots/grupo-educare.webp',
  },
];

export const featuredSlugs = featuredProjects.map((p) => p.slug);

export const getFeatured = (slug: string) => featuredProjects.find((p) => p.slug === slug);

export const getSiblings = (slug: string) => {
  const i = featuredProjects.findIndex((p) => p.slug === slug);
  if (i === -1) return { previous: undefined, next: undefined };
  return {
    previous: featuredProjects[(i - 1 + featuredProjects.length) % featuredProjects.length],
    next: featuredProjects[(i + 1) % featuredProjects.length],
  };
};
