import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { routing, type Locale } from '@/i18n/routing';
import { site } from '@/content/site';
import { featuredProjects, getFeatured, getSiblings } from '@/content/projects';
import { absolute, alternates } from '@/lib/seo';
import { Link } from '@/i18n/navigation';

import Header from '@/components/Header';
import SheetFrame from '@/components/SheetFrame';
import StationRail from '@/components/StationRail';
import Cartouche from '@/components/Cartouche';
import SectionHead from '@/components/SectionHead';
import MountedShot from '@/components/MountedShot';
import RedlineNote from '@/components/RedlineNote';
import TitleBlock from '@/components/TitleBlock';
import Reveal from '@/components/Reveal';
import { ArrowRight, ArrowLeft, ArrowOut } from '@/components/Icons';

const stackKey = (name: string) => name.toLowerCase().replace(/[^a-z]/g, '');

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    featuredProjects.map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !getFeatured(slug)) return {};
  const t = await getTranslations({ locale, namespace: `work.${slug}` });
  const path = `/work/${slug}`;

  return {
    metadataBase: new URL(site.url),
    title: t('name'),
    description: t('summary'),
    alternates: alternates(locale as Locale, path),
    openGraph: {
      title: `${t('name')} — ${site.name}`,
      description: t('summary'),
      url: absolute(locale as Locale, path),
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const project = getFeatured(slug);
  if (!project) notFound();

  const t = await getTranslations(`work.${slug}`);
  const c = await getTranslations('common');
  const s = await getTranslations('sheet');
  const tw = await getTranslations('work');
  const nav = await getTranslations('nav');
  const { previous, next } = getSiblings(slug);

  const stations = [
    { id: 'top', name: s('stationOverview') },
    { id: 'context', name: s('stationContext') },
    { id: 'stack', name: s('stationStack') },
    { id: 'delivered', name: s('stationDelivered') },
    { id: 'result', name: s('stationResult') },
  ];

  const delivered = ['d1', 'd2', 'd3', 'd4'] as const;

  return (
    <>
      <a href="#main" className="u-skip u-label">
        {c('skipToContent')}
      </a>
      <SheetFrame />
      <Header />
      <StationRail stations={stations} label={nav('sections')} />

      <main id="main">
        <Reveal as="section" id="top" className="relative scroll-mt-28">
          <div className="field-grid" aria-hidden />
          <div className="sheet relative py-14 md:py-20">
            <Link
              href="/#work"
              className="u-label u-label-ink marks inline-flex items-center gap-2.5 no-underline transition-colors duration-200 hover:text-[var(--red-ink)]"
            >
              <ArrowLeft size={13} />
              {s('backToSheet')}
            </Link>

            <div className="mt-10 grid items-end gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div>
                <div className="marks flex items-center gap-5">
                  <span className="callout">
                    <span>{project.callout}</span>
                    <span>{project.sheet}</span>
                  </span>
                  <span className="u-tag">{t('type')}</span>
                </div>

                <h1 className="u-display marks mt-7 text-[clamp(2.5rem,7.6vw,4.75rem)]">
                  {t('name')}
                </h1>

                <p className="u-lead marks mt-7 max-w-[56ch]">{t('summary')}</p>

                <div className="marks mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="plate"
                  >
                    {s('visitLive')}
                    <ArrowOut size={16} />
                  </a>
                  <span className="u-num text-[0.8125rem] tracking-[0.04em] text-[var(--ink-3)]">
                    {project.domain}
                  </span>
                </div>
              </div>

              <Cartouche
                className="marks w-full max-w-sm lg:w-auto"
                rows={[
                  { label: c('drawnBy'), value: c('soleAuthor') },
                  { label: c('stack'), value: project.stack.join(' · ') },
                  { label: c('scale'), value: '1:1' },
                  { label: c('sheet'), value: `${project.sheet} / 0${site.sheetCount}` },
                  { label: c('rev'), value: site.revision },
                ]}
              />
            </div>

            <div className="marks mt-14 md:mt-16">
              <MountedShot
                src={project.shot}
                alt={t('shotAlt')}
                caption={`${c('detail')} ${project.callout} — ${project.domain}`}
                priority
                sizes="(max-width: 1023px) 100vw, 92vw"
              />
            </div>
          </div>
        </Reveal>

        {/* CONTEXT + CHALLENGE ------------------------------------------- */}
        <Reveal as="section" id="context" className="scroll-mt-28 py-20 md:py-24">
          <div className="sheet">
            <SectionHead
              gutter={s('gutterContext')}
              headingId="context-heading"
              heading={s('headingContext')}
            />
            <div className="mt-12 grid gap-x-12 gap-y-10 lg:grid-cols-[9rem_minmax(0,1fr)]">
              <div className="hidden lg:block" />
              <div className="marks space-y-10">
                <p className="u-body text-[1.0625rem] leading-relaxed">{t('context')}</p>
                <div className="border-t border-[var(--rule)] pt-10">
                  <h3 className="u-h3">{s('headingChallenge')}</h3>
                  <p className="u-body mt-4 text-[1.0625rem] leading-relaxed">{t('challenge')}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* STACK ---------------------------------------------------------- */}
        <Reveal as="section" id="stack" className="scroll-mt-28 py-20 md:py-24">
          <div className="sheet">
            <SectionHead
              gutter={s('gutterStack')}
              headingId="stack-heading"
              heading={s('headingStack')}
            />
            <div className="mt-12 grid gap-x-12 lg:grid-cols-[9rem_minmax(0,1fr)]">
              <div className="hidden lg:block" />
              <table className="schedule marks">
                <caption className="u-label mb-4 text-left">{s('stackCaption')}</caption>
                <thead>
                  <tr className="u-label">
                    <th scope="col" className="w-16 pl-0">
                      {c('item')}
                    </th>
                    <th scope="col">{s('component')}</th>
                    <th scope="col">{s('role')}</th>
                  </tr>
                </thead>
                <tbody>
                  {project.stack.map((item, i) => (
                    <tr key={item}>
                      <td className="u-num pl-0 text-[0.6875rem] text-[var(--ink-3)]">
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="font-medium tracking-[-0.01em]">{item}</td>
                      <td className="text-[0.9375rem] text-[var(--ink-2)]">
                        {c(`stackRole.${stackKey(item)}`)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* DELIVERED ------------------------------------------------------ */}
        <Reveal as="section" id="delivered" className="scroll-mt-28 py-20 md:py-24">
          <div className="sheet">
            <SectionHead
              gutter={s('gutterDelivered')}
              headingId="delivered-heading"
              heading={s('headingDelivered')}
            />
            <div className="mt-12 grid gap-x-12 lg:grid-cols-[9rem_minmax(0,1fr)]">
              <div className="hidden lg:block" />
              <div className="marks">
                <div className="flex gap-6">
                  <div className="dim-bracket-v shrink-0 self-stretch" aria-hidden />
                  <ol className="min-w-0 flex-1 border-t border-[var(--rule)]">
                    {delivered.map((key, i) => (
                      <li
                        key={key}
                        className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 border-b border-[var(--rule)] py-6"
                      >
                        <span className="u-num pt-[0.3rem] text-[0.6875rem] text-[var(--ink-3)]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="u-body max-w-[62ch]">{t(`delivered.${key}`)}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="u-label u-label-red mt-4 pl-6 font-medium">{c('soleAuthor')}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* RESULT --------------------------------------------------------- */}
        <Reveal as="section" id="result" className="relative scroll-mt-28 py-20 md:py-24">
          <div className="field-grid" aria-hidden />
          <div className="sheet relative">
            <SectionHead
              gutter={s('gutterResult')}
              headingId="result-heading"
              heading={s('headingResult')}
            />
            <div className="mt-12 grid gap-x-12 lg:grid-cols-[9rem_minmax(0,1fr)]">
              <div className="hidden lg:block" />
              <div className="marks max-w-[68ch]">
                {project.result === 'qualitative' ? (
                  <p className="u-body text-[1.0625rem] leading-relaxed">{t('result')}</p>
                ) : (
                  <RedlineNote
                    tag={s('pendingTag')}
                    title={s('pendingTitle')}
                    body={s('pendingBody')}
                    editKey={`messages/{en,pt,es}.json → work.${slug}.result`}
                  />
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* SHEET NAVIGATION ----------------------------------------------- */}
        <nav aria-label={s('otherSheets')} className="sheet pb-8 pt-4">
          <div className="grid border border-[var(--rule-strong)] sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/work/${previous.slug}`}
                className="group flex items-center gap-5 p-6 no-underline transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--red)_5%,transparent)]"
              >
                <ArrowLeft
                  size={17}
                  className="shrink-0 text-[var(--ink-3)] transition-all duration-200 group-hover:-translate-x-0.5 group-hover:text-[var(--red-ink)]"
                />
                <span className="min-w-0">
                  <span className="u-tag block">
                    {s('previousSheet')} · {previous.sheet}
                  </span>
                  <span className="u-h3 mt-2 block truncate">{tw(`${previous.slug}.name`)}</span>
                </span>
              </Link>
            ) : null}

            {next ? (
              <Link
                href={`/work/${next.slug}`}
                className="group flex items-center justify-end gap-5 border-t border-[var(--rule)] p-6 text-right no-underline transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--red)_5%,transparent)] sm:border-l sm:border-t-0"
              >
                <span className="min-w-0">
                  <span className="u-tag block">
                    {s('nextSheet')} · {next.sheet}
                  </span>
                  <span className="u-h3 mt-2 block truncate">{tw(`${next.slug}.name`)}</span>
                </span>
                <ArrowRight
                  size={17}
                  className="shrink-0 text-[var(--ink-3)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--red-ink)]"
                />
              </Link>
            ) : null}
          </div>
        </nav>

      </main>

      <TitleBlock sheet={project.sheet} />
    </>
  );
}
