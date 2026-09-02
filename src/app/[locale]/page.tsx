import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing, type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { site, whatsappHref } from '@/content/site';
import { featuredProjects, otherProjects } from '@/content/projects';
import { absolute, alternates } from '@/lib/seo';

import Header from '@/components/Header';
import SheetFrame from '@/components/SheetFrame';
import DockedActions from '@/components/DockedActions';
import { HomeJsonLd } from '@/components/JsonLd';
import DimensionChain from '@/components/DimensionChain';
import Cartouche from '@/components/Cartouche';
import SectionHead from '@/components/SectionHead';
import CaseBand from '@/components/CaseBand';
import ScheduleOfWorks from '@/components/ScheduleOfWorks';
import ContactBlock from '@/components/ContactBlock';
import TitleBlock from '@/components/TitleBlock';
import Reveal from '@/components/Reveal';
import { ArrowRight, ArrowDown } from '@/components/Icons';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    metadataBase: new URL(site.url),
    title: `${site.name} — ${t('titleSuffix')}`,
    description: t('description'),
    alternates: alternates(locale as Locale),
    openGraph: { url: absolute(locale as Locale) },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const nav = await getTranslations('nav');
  const tw = await getTranslations('work');
  const c = await getTranslations('common');
  const contact = await getTranslations('contact');
  const meta = await getTranslations('meta');

  const notes = ['n1', 'n2', 'n3', 'n4', 'n5'] as const;

  const stations = [
    { id: 'top', name: nav('start') },
    { id: 'about', name: nav('about') },
    { id: 'work', name: nav('work') },
    { id: 'projects', name: nav('projects') },
    { id: 'contact', name: nav('contact') },
  ];

  return (
    <>
      <HomeJsonLd locale={locale as Locale} description={meta('description')} />
      <a href="#main" className="u-skip u-label">
        {c('skipToContent')}
      </a>
      <SheetFrame />
      <Header stations={stations} />

      <main id="main">
        {/* ------------------------------------------------------------------
            FIRST VIEWPORT — the sheet, its subject, and the one measurement
            that carries the whole argument.
        ------------------------------------------------------------------- */}
        <Reveal as="section" id="top" className="relative scroll-mt-28">
          <div className="field-grid" aria-hidden />
          <div className="sheet relative flex min-h-[calc(100svh-6rem)] flex-col justify-center py-6 md:py-16 lg:min-h-[calc(100svh-7rem)]">
            {/* On a phone the order is subject → measurement → action, so the
                thesis and the one action both land inside the first screen; the
                index and title block follow. On lg the same four blocks become
                the sheet's field, with the title block closing the right column. */}
            <div className="flex flex-col gap-9 lg:grid lg:grid-cols-[minmax(0,1.24fr)_minmax(0,0.76fr)] lg:gap-x-16 lg:gap-y-14">
              <div className="lg:col-start-1 lg:row-start-1">
                <h1>
                  <span className="u-display block text-[clamp(2.85rem,8.2vw,5.5rem)]">
                    {site.name}
                  </span>
                  <span className="mt-5 block max-w-[38ch] text-[clamp(1.15rem,2vw,1.7rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ink)] md:mt-6">
                    {site.headline}
                  </span>
                </h1>

                <p className="u-lead mt-6 max-w-[58ch] md:mt-7">{t('lead')}</p>
              </div>

              <div className="order-2 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-2">
                <DimensionChain
                  stages={[t('stage1'), t('stage2'), t('stage3'), t('stage4')]}
                  spanLabel={t('span')}
                />
              </div>

              <div className="marks order-3 flex flex-wrap items-center gap-x-8 gap-y-4 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-3">
                <a href={`mailto:${site.email}`} className="plate">
                  {t('cta')}
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#work"
                  className="u-tag u-tag-ink inline-flex items-center gap-2.5 no-underline transition-colors duration-200 hover:text-[var(--red-ink)]"
                >
                  {t('ctaSecondary')}
                  <ArrowDown size={14} />
                </a>
              </div>

              <div className="marks order-4 flex flex-col gap-9 lg:order-none lg:col-start-2 lg:row-start-1 lg:h-full lg:justify-between lg:gap-10">
                <div>
                  <p className="u-tag">{t('indexLabel')}</p>
                  <ul className="mt-4 border-t border-[var(--rule-strong)]">
                    {featuredProjects.map((project) => (
                      <li key={project.slug}>
                        <Link
                          href={`/work/${project.slug}`}
                          className="group flex items-center justify-between gap-5 border-b border-[var(--rule)] py-3.5 no-underline transition-colors duration-200 hover:text-[var(--red-ink)]"
                        >
                          <span className="flex min-w-0 items-baseline gap-3.5">
                            <span className="u-num shrink-0 text-[0.625rem] text-[var(--ink-3)]">
                              {project.callout} / {project.sheet}
                            </span>
                            <span className="truncate text-[0.9375rem] font-medium tracking-[-0.01em]">
                              {tw(`${project.slug}.name`)}
                            </span>
                          </span>
                          <ArrowRight
                            size={14}
                            className="shrink-0 text-[var(--ink-3)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--red-ink)]"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Cartouche
                  rows={[
                    { label: c('experience'), value: t('meta.experience') },
                    { label: c('systems'), value: t('meta.systems') },
                    { label: c('industries'), value: t('meta.industries') },
                    { label: c('languages'), value: 'EN · PT · ES' },
                    { label: c('status'), value: t('meta.status'), accent: true },
                  ]}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------
            GENERAL NOTES — the bio, in the form a drawing states its notes.
        ------------------------------------------------------------------- */}
        <Reveal as="section" id="about" className="field scroll-mt-28 py-20 md:py-28">
          <div className="sheet">
            <SectionHead
              gutter={t('about.gutter')}
              headingId="about-heading"
              heading={t('about.heading')}
              lead={t('about.lead')}
            />

            <div className="mt-14 grid gap-x-12 gap-y-12 lg:grid-cols-[9rem_minmax(0,1fr)_16rem]">
              <div className="hidden lg:block" />

              <ol className="marks border-t border-[var(--rule)]">
                {notes.map((note, i) => (
                  <li
                    key={note}
                    className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b border-[var(--rule)] py-6"
                  >
                    <span className="u-num pt-[0.3rem] text-[0.6875rem] text-[var(--ink-3)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="u-body max-w-[64ch]">{t(`about.${note}`)}</p>
                  </li>
                ))}
              </ol>

              {/* Portrait slot. Ryan supplies the file; until then the mount
                  says what a drawing says about a part that has not arrived. */}
              <div className="marks">
                {/* Drop a 4:5 image at public/portrait.jpg and replace this mount
                    with a next/image inside the same wrapper. */}
                <div className="mount mx-auto flex aspect-4/5 w-full max-w-[13rem] flex-col items-center justify-center gap-3 px-5 text-center lg:mx-0 lg:max-w-none">
                  <span className="rev-tri" aria-hidden />
                  <span className="u-label u-label-red font-medium">{t('about.portraitTag')}</span>
                  <span className="max-w-[24ch] text-[0.8125rem] leading-relaxed text-[var(--ink-2)]">
                    {t('about.portraitNote')}
                  </span>
                </div>
                <p className="u-label mt-3 flex items-center gap-3">
                  <span className="h-px w-6 shrink-0 bg-[var(--red)]" aria-hidden />
                  {t('about.portraitCaption')}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------
            DETAILS A / B / C — the three cases, each given the full measure.
        ------------------------------------------------------------------- */}
        <Reveal as="section" id="work" className="field relative scroll-mt-28 py-20 md:py-28">
          <div className="field-grid" aria-hidden />
          <div className="sheet relative">
            <SectionHead
              gutter={t('work.gutter')}
              headingId="work-heading"
              heading={t('work.heading')}
              lead={t('work.lead')}
            />
          </div>

          <div className="sheet relative mt-14 space-y-16 md:space-y-24">
            {featuredProjects.map((project, i) => (
              <CaseBand key={project.slug} project={project} index={i} />
            ))}
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------
            SCHEDULE — everything else, as a bill of materials.
        ------------------------------------------------------------------- */}
        <Reveal as="section" id="projects" className="field scroll-mt-28 py-20 md:py-28">
          <div className="sheet">
            <SectionHead
              gutter={t('projects.gutter')}
              headingId="projects-heading"
              heading={t('projects.heading')}
              lead={t('projects.lead', { count: otherProjects.length })}
            />
            <div className="marks mt-12">
              <ScheduleOfWorks />
            </div>
          </div>
        </Reveal>

        <ContactBlock />
      </main>

      <TitleBlock />

      <DockedActions
        email={site.email}
        whatsappHref={whatsappHref(contact('whatsappMessage'))}
        status={t('meta.statusShort')}
        cta={t('cta')}
        whatsappLabel="WhatsApp"
      />
    </>
  );
}
