/**
 * Brand constants. Every fact here was supplied by Ryan; nothing is inferred.
 * Change a value once and it updates the header, the title block, the contact
 * block, the metadata and the sitemap.
 */

export const site = {
  name: 'Ryan Matheus',
  /** Pinned headline. Do not reword. */
  headline: 'Full-Stack Developer — Custom CRM/ERP, E-commerce & Business Systems',
  email: 'ryan.voltzagency@gmail.com',
  domain: 'ryanmatheus.com.br',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ryanmatheus.com.br',

  /** Drawing metadata rendered in the cartouche and the title block. */
  drawingNumber: 'RM-2026',
  revision: '2026.09',
  sheetCount: 4,

  links: {
    linkedin: 'https://www.linkedin.com/in/ryan-matheus-7955b2231/',
    github: 'https://github.com/Ryan-voltz',
    /** E.164 without the +, for wa.me. */
    whatsapp: '5571992506752',
    whatsappDisplay: '+55 71 99250-6752',
  },
} as const;

export const whatsappHref = (message: string) =>
  `https://wa.me/${site.links.whatsapp}?text=${encodeURIComponent(message)}`;
