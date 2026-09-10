import { getTranslations } from 'next-intl/server';
import { site, whatsappHref } from '@/content/site';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import { ArrowRight, ArrowOut, WhatsApp } from './Icons';

import CopyEmailButton from './CopyEmailButton';

/** The contact block: who to write to, on which channel, and availability status. */
export default async function ContactBlock() {
  const t = await getTranslations('contact');

  const channels = [
    { label: 'WhatsApp', href: whatsappHref(t('whatsappMessage')), primary: true },
    { label: 'LinkedIn', href: site.links.linkedin },
    { label: 'GitHub', href: site.links.github },
  ];

  return (
    <Reveal as="section" id="contact" className="relative scroll-mt-28 py-20 md:py-28">
      <div className="sheet relative">
        <div className="rounded-3xl border border-[var(--rule)] bg-[var(--card)] p-8 md:p-14 shadow-sm">
          <SectionHead
            gutter={t('gutter')}
            headingId="contact-heading"
            heading={t('heading')}
            lead={t('lead')}
          />

          <div className="mt-10 max-w-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={`mailto:${site.email}`}
                className="u-display block break-words text-[clamp(1.5rem,4vw,2.5rem)] font-bold tracking-tight text-[var(--ink)] no-underline transition-colors duration-200 hover:text-[var(--brand-ink)]"
              >
                {site.email}
              </a>
              <CopyEmailButton email={site.email} label="Copiar" copiedLabel="Copiado!" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a href={whatsappHref(t('whatsappMessage'))} target="_blank" rel="noreferrer noopener" className="plate">
                <WhatsApp size={16} />
                <span>Conversar no WhatsApp ({site.links.whatsappDisplay})</span>
                <ArrowRight size={16} />
              </a>

              <a
                href={`mailto:${site.email}`}
                className="chip u-tag u-tag-ink font-semibold"
              >
                {t('cta')}
                <ArrowOut size={13} />
              </a>

              {channels.filter(c => c.label !== 'WhatsApp').map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="chip u-tag u-tag-ink"
                >
                  {channel.label}
                  <ArrowOut size={13} />
                </a>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {t('status')}
              </p>
            </div>
            <p className="mt-2 text-xs text-[var(--ink-3)]">{t('note')}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

