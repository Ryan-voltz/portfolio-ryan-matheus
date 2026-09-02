import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { FeaturedProject } from '@/content/projects';
import MountedShot from './MountedShot';
import Reveal from './Reveal';
import { ArrowRight, ArrowOut } from './Icons';

/**
 * One featured case, given the full measure of the sheet. Details alternate
 * sides down the page the way they are placed on a real drawing — where they
 * fit — which also paces the scroll.
 */
export default async function CaseBand({
  project,
  index,
}: {
  project: FeaturedProject;
  index: number;
}) {
  const t = await getTranslations(`work.${project.slug}`);
  const c = await getTranslations('common');
  const mirrored = index % 2 === 1;

  return (
    <Reveal as="article" className="detail group border-t border-[var(--rule)] pt-10 md:pt-14">
      <div
        className={`grid items-start gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]`}
      >
        <div className={mirrored ? 'lg:order-2' : undefined}>
          <div className="flex items-center gap-4">
            <span className="callout marks">
              <span>{project.callout}</span>
              <span>{project.sheet}</span>
            </span>
            <svg
              className="leader hidden sm:block"
              width="132"
              height="12"
              viewBox="0 0 132 12"
              aria-hidden
              style={{ ['--len' as string]: 150 }}
            >
              <path d="M0 6 H120 M112 2 L120 6 L112 10" />
            </svg>
          </div>

          <h3 className="u-h2 marks mt-6" style={{ ['--draw-delay' as string]: '60ms' }}>
            {t('name')}
          </h3>
          <p className="u-tag marks mt-3" style={{ ['--draw-delay' as string]: '110ms' }}>
            {t('type')}
          </p>

          <p className="u-body marks mt-6 max-w-[52ch]" style={{ ['--draw-delay' as string]: '150ms' }}>
            {t('summary')}
          </p>

          <dl className="marks mt-8 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 border-t border-[var(--rule)] pt-5">
            <dt className="u-label pt-[0.15rem]">{c('stack')}</dt>
            <dd className="u-num text-[0.75rem] tracking-[0.05em] text-[var(--ink)]">
              {project.stack.join('  ·  ')}
            </dd>
            <dt className="u-label pt-[0.15rem]">{c('drawnBy')}</dt>
            <dd className="u-num text-[0.75rem] tracking-[0.05em] text-[var(--ink)]">
              {c('soleAuthor')}
            </dd>
          </dl>

          <div className="marks mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href={`/work/${project.slug}`} className="plate">
              {c('openSheet', { sheet: project.sheet })}
              <ArrowRight size={16} />
            </Link>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="u-link u-num inline-flex items-center gap-2 text-[0.8125rem] tracking-[0.04em]"
            >
              {project.domain}
              <ArrowOut size={14} />
            </a>
          </div>
        </div>

        <div className={mirrored ? 'lg:order-1' : undefined}>
          <MountedShot
            src={project.shot}
            alt={t('shotAlt')}
            caption={`${c('detail')} ${project.callout} — ${project.domain}`}
          />
        </div>
      </div>
    </Reveal>
  );
}
