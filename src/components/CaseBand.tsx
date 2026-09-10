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
 *
 * On a phone that alternation has nowhere to go, so the order changes instead:
 * the mounted detail leads and the reading follows. A buyer scrolling a
 * portfolio on a phone is looking for the work, not for a paragraph about it.
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
  const h = await getTranslations('home.work');
  const mirrored = index % 2 === 1;

  return (
    <Reveal as="article" className="detail group rounded-2xl border border-[var(--rule)] bg-[var(--card)] p-6 md:p-10 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="grid items-center gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <div className={`order-2 ${mirrored ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center rounded-md bg-[var(--brand)]/10 px-2.5 py-1 text-xs font-bold text-[var(--brand-ink)]">
              Case 0{index + 1}
            </span>
            <span className="text-xs font-medium text-[var(--ink-3)]">
              · {t('type')}
            </span>
          </div>

          <h3 className="u-h2 mt-4 text-[clamp(1.75rem,2.2vw,2.5rem)] font-bold tracking-tight text-[var(--ink)]">
            {t('name')}
          </h3>

          <p className="mt-4 text-base leading-relaxed text-[var(--ink-2)]">
            {t('summary')}
          </p>

          <div className="mt-6 border-t border-[var(--rule)] pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              Tecnologias & Arquitetura
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-lg border border-[var(--rule)] bg-[var(--field)] px-2.5 py-1 text-xs font-medium text-[var(--ink)] shadow-2xs"
                >
                  {item}
                </span>
              ))}
              <span className="inline-flex items-center rounded-lg border border-[var(--brand)]/20 bg-[var(--brand)]/5 px-2.5 py-1 text-xs font-semibold text-[var(--brand-ink)]">
                {c('soleAuthor')}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={`/work/${project.slug}`} className="plate">
              {h('viewCase')}
              <ArrowRight size={16} />
            </Link>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="chip font-medium text-xs tracking-wider uppercase"
            >
              <span>{project.domain}</span>
              <ArrowOut size={13} />
            </a>
          </div>
        </div>

        <div className={`order-1 ${mirrored ? 'lg:order-1' : 'lg:order-2'}`}>
          <MountedShot
            src={project.shot}
            alt={t('shotAlt')}
            caption={`${c('detail')} ${project.callout} — ${project.domain}`}
            url={project.url}
            expandLabel={c('expand', { name: t('name') })}
            closeLabel={c('close')}
            bleed
          />
        </div>
      </div>
    </Reveal>
  );
}
