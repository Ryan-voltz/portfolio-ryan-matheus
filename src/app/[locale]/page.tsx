import Image from 'next/image';
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
import CredentialsSection from '@/components/CredentialsSection';
import Reveal from '@/components/Reveal';
import HeroThreeScene from '@/components/HeroThreeScene';
import TiltCard from '@/components/TiltCard';
import { ArrowRight, ArrowDown, WhatsApp } from '@/components/Icons';

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

  const notes = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8'] as const;

  const stations = [
    { id: 'top', name: nav('start') },
    { id: 'about', name: nav('about') },
    { id: 'credentials', name: nav('credentials') },
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
            FIRST VIEWPORT — Hero section with Executive Identity Header & 3D Blueprint Core
        ------------------------------------------------------------------- */}
        <Reveal as="section" id="top" className="relative scroll-mt-28">
          <div className="field-grid" aria-hidden />
          <div className="sheet relative flex min-h-[calc(100svh-6rem)] flex-col justify-center py-6 md:py-16 lg:min-h-[calc(100svh-7rem)]">
            <div className="flex flex-col gap-9 lg:grid lg:grid-cols-[minmax(0,1.24fr)_minmax(0,0.76fr)] lg:gap-x-16 lg:gap-y-14">
              <div className="lg:col-start-1 lg:row-start-1 flex flex-col justify-center">
                {/* Senior UI Executive Identity Header */}
                <div className="mb-7 flex items-center gap-4 sm:gap-5">
                  <div className="relative shrink-0 group">
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl border-2 border-[var(--brand-ink)]/35 bg-[var(--field)] shadow-xl shadow-[var(--brand-ink)]/10 ring-4 ring-[var(--brand-ink)]/10 transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src="/profile/ryan-matheus-portrait.webp"
                        alt="Ryan Matheus"
                        width={80}
                        height={80}
                        priority
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    {/* Live pulsing online indicator */}
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--sheet)] shadow">
                      <span className="h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[var(--sheet)] animate-pulse" />
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 w-fit">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{t('meta.status')}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--ink-3)]">
                      <span className="font-bold text-[var(--ink)] tracking-tight">Ryan Matheus</span>
                      <span>•</span>
                      <span className="text-[var(--brand-ink)] font-semibold">Tecnólogo ADS</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">Salvador, BA</span>
                    </div>
                  </div>
                </div>

                <h1>
                  <span className="u-display block text-[clamp(2.85rem,8.2vw,5.5rem)] text-[var(--ink)]">
                    {site.name}
                  </span>
                  <span className="mt-5 block max-w-[38ch] text-[clamp(1.15rem,2vw,1.7rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ink)] md:mt-6">
                    {site.headline}
                  </span>
                </h1>

                <p className="u-lead mt-6 max-w-[58ch] md:mt-7">{t('lead')}</p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href={`mailto:${site.email}`} className="plate">
                    {t('cta')}
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href="#work"
                    className="chip text-xs uppercase font-semibold tracking-wider text-[var(--ink)] transition-colors duration-200 hover:text-[var(--brand-ink)]"
                  >
                    {t('ctaSecondary')}
                    <ArrowDown size={14} />
                  </a>
                </div>
              </div>

              <div className="order-2 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-2 mt-4 pt-6 border-t border-[var(--rule)]">
                <DimensionChain
                  stages={[t('stage1'), t('stage2'), t('stage3'), t('stage4')]}
                  spanLabel={t('span')}
                />
              </div>

              <div className="marks order-4 flex flex-col gap-6 lg:order-none lg:col-start-2 lg:row-start-1 lg:h-full lg:justify-between">
                {/* Interactive 3D Three.js Blueprint Core */}
                <TiltCard maxTilt={4} glare={true} className="rounded-2xl border border-[var(--rule)] bg-[var(--card)]/80 shadow-md backdrop-blur-sm overflow-hidden">
                  <HeroThreeScene className="h-48 sm:h-56 w-full" />
                </TiltCard>

                {/* Index of Works with Official Logo Lockup */}
                <div className="rounded-xl border border-[var(--rule)] bg-[var(--card)] p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between border-b border-[var(--rule)] pb-3">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src="/brand/logo-horizontal-dark.png"
                        alt="Ryan Matheus"
                        width={140}
                        height={28}
                        className="brand-logo-light h-6.5 w-auto"
                      />
                      <Image
                        src="/brand/logo-horizontal-white.png"
                        alt="Ryan Matheus"
                        width={140}
                        height={28}
                        className="brand-logo-dark h-6.5 w-auto"
                      />
                    </div>
                    <span className="u-tag text-[0.625rem] text-[var(--brand-ink)] font-semibold uppercase tracking-wider">
                      Portfolio & Lab
                    </span>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-3)]">{t('indexLabel')}</p>
                  <ul className="mt-3 divide-y divide-[var(--rule)]">
                    {featuredProjects.map((project, i) => (
                      <li key={project.slug}>
                        <Link
                          href={`/work/${project.slug}`}
                          className="group flex items-center justify-between gap-4 py-3 no-underline transition-colors duration-200 hover:text-[var(--brand-ink)]"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-[var(--field)] text-[0.625rem] font-bold text-[var(--ink-3)]">
                              0{i + 1}
                            </span>
                            <span className="truncate text-sm font-medium tracking-tight text-[var(--ink)] group-hover:text-[var(--brand-ink)]">
                              {tw(`${project.slug}.name`)}
                            </span>
                          </span>
                          <ArrowRight
                            size={14}
                            className="shrink-0 text-[var(--ink-3)] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[var(--brand-ink)]"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Cartouche
                  rows={[
                    { label: c('education'), value: t('meta.education'), accent: true },
                    { label: c('experience'), value: t('meta.experience') },
                    { label: c('systems'), value: t('meta.systems') },
                    { label: c('industries'), value: t('meta.industries') },
                    { label: c('languages'), value: 'EN · PT · ES' },
                  ]}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------
            GENERAL NOTES — Bio and Grand Executive Profile Showcase
        ------------------------------------------------------------------- */}
        <Reveal as="section" id="about" className="field scroll-mt-28 py-20 md:py-28">
          <div className="sheet">
            <SectionHead
              gutter={t('about.gutter')}
              headingId="about-heading"
              heading={t('about.heading')}
              lead={t('about.lead')}
            />

            <div className="mt-14 grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,1.25fr)_22rem] xl:grid-cols-[minmax(0,1.3fr)_24rem]">
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

              {/* Senior UI Executive Profile Showcase */}
              <div className="marks">
                <TiltCard maxTilt={5} glare={true} className="rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    {/* Grand Executive Portrait */}
                    <div className="relative w-full aspect-[4/4.8] sm:aspect-[4/4.5] overflow-hidden rounded-2xl shadow-2xl border border-[var(--rule)] group">
                      <Image
                        src="/profile/ryan-matheus-portrait.webp"
                        alt="Ryan Matheus"
                        width={400}
                        height={480}
                        priority
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Floating Executive Brand Pill */}
                      <div className="absolute bottom-3 left-3 right-3 rounded-xl backdrop-blur-md bg-[var(--sheet)]/90 dark:bg-[var(--sheet)]/85 border border-[var(--rule)]/60 px-3.5 py-2 flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Image
                            src="/brand/logo-symbol-dark.png"
                            alt="RM"
                            width={28}
                            height={16}
                            className="brand-logo-light h-4.5 w-auto shrink-0"
                          />
                          <Image
                            src="/brand/logo-symbol-white.png"
                            alt="RM"
                            width={28}
                            height={16}
                            className="brand-logo-dark h-4.5 w-auto shrink-0"
                          />
                          <span className="truncate text-xs font-bold text-[var(--ink)] tracking-tight">Ryan Matheus</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                          Disponível
                        </span>
                      </div>
                    </div>

                    {/* Official Horizontal Logo Lockup */}
                    <div className="mt-5 flex items-center justify-center">
                      <Image
                        src="/brand/logo-horizontal-dark.png"
                        alt="Ryan Matheus"
                        width={200}
                        height={40}
                        className="brand-logo-light h-8 md:h-9 w-auto transition-transform duration-200 hover:scale-105"
                      />
                      <Image
                        src="/brand/logo-horizontal-white.png"
                        alt="Ryan Matheus"
                        width={200}
                        height={40}
                        className="brand-logo-dark h-8 md:h-9 w-auto transition-transform duration-200 hover:scale-105"
                      />
                    </div>

                    <div className="mt-3 text-center">
                      <h4 className="text-base font-bold text-[var(--ink)]">Desenvolvedor Full-Stack</h4>
                      <p className="mt-1 text-xs font-medium text-[var(--brand-ink)]">Fundador · Voltz Agency</p>
                      <p className="mt-2 text-xs leading-relaxed text-[var(--ink-2)] max-w-[32ch] mx-auto">
                        Especialista em softwares de gestão corporativos, landing pages de alta conversão e portfólios sob medida.
                      </p>
                    </div>

                    {/* Technical Specs Table */}
                    <div className="mt-5 w-full border-t border-[var(--rule)] pt-4 text-left text-xs text-[var(--ink-3)] space-y-2.5">
                      <div className="flex justify-between items-center py-0.5 border-b border-[var(--rule)]/40 pb-1.5">
                        <span className="font-mono">Formação:</span>
                        <strong className="text-[var(--ink)] font-semibold">Tecnólogo em ADS</strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-[var(--rule)]/40 pb-1.5">
                        <span className="font-mono">Instituição:</span>
                        <strong className="text-[var(--ink)] font-semibold">Anhanguera (Cogna)</strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-[var(--rule)]/40 pb-1.5">
                        <span className="font-mono">Experiência:</span>
                        <strong className="text-[var(--ink)] font-semibold">3+ anos em produção</strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5 border-b border-[var(--rule)]/40 pb-1.5">
                        <span className="font-mono">Localização:</span>
                        <strong className="text-[var(--ink)] font-semibold">Salvador, BA</strong>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="font-mono">Atendimento:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Global Remoto</strong>
                      </div>
                    </div>
                  </div>

                  {/* Direct WhatsApp CTA Button */}
                  <a
                    href={whatsappHref('Olá Ryan! Vi seu perfil e gostaria de conversar sobre um projeto.')}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 text-xs font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
                  >
                    <WhatsApp size={16} />
                    <span>Conversar no WhatsApp</span>
                  </a>
                </TiltCard>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ------------------------------------------------------------------
            CREDENTIALS — Degree & Certifications with verified previews.
        ------------------------------------------------------------------- */}
        <Reveal as="section" id="credentials" className="field relative scroll-mt-28 py-20 md:py-28">
          <div className="field-grid" aria-hidden />
          <CredentialsSection />
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
