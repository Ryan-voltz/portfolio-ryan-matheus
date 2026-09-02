import { getTranslations } from 'next-intl/server';
import { site, whatsappHref } from '@/content/site';
import SectionHead from './SectionHead';
import Reveal from './Reveal';
import { ArrowRight, ArrowOut } from './Icons';

/** The issue block: who to write to, on which channel, and the sheet's status. */
export default async function ContactBlock() {
  const t = await getTranslations('contact');

  const channels = [
    { label: 'LinkedIn', href: site.links.linkedin },
    { label: 'GitHub', href: site.links.github },
    { label: 'WhatsApp', href: whatsappHref(t('whatsappMessage')) },
  ];

  return (
    <Reveal as="section" id="contact" className="relative scroll-mt-28 py-20 md:py-28">
      <div className="field-grid" aria-hidden />
      <div className="sheet relative">
        <SectionHead
          gutter={t('gutter')}
          headingId="contact-heading"
          heading={t('heading')}
          lead={t('lead')}
        />

        <div className="mt-12 grid gap-x-12 gap-y-10 lg:grid-cols-[9rem_1fr]">
          <div className="hidden lg:block" />
          <div>
            <a
              href={`mailto:${site.email}`}
              className="u-display marks block break-words text-[clamp(1.5rem,4.6vw,2.9rem)] leading-[1.05] no-underline transition-colors duration-200 hover:text-[var(--red-ink)]"
            >
              {site.email}
            </a>

            <div className="marks mt-9 flex flex-wrap items-center gap-4">
              <a href={`mailto:${site.email}`} className="plate">
                {t('cta')}
                <ArrowRight size={16} />
              </a>
              {channels.map((channel) => (
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

            <p className="u-label u-label-red marks mt-10 flex items-center gap-2.5 font-medium">
              <span className="rev-tri" aria-hidden />
              {t('status')}
            </p>
            <p className="u-body marks mt-3 max-w-[54ch] text-[0.9375rem]">{t('note')}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
