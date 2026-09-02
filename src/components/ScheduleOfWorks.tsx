import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { otherProjects } from '@/content/projects';
import { ArrowOut } from './Icons';

/**
 * The bill of materials: everything else on the sheet, one row per system.
 * A list of links rather than a <table>, so the whole row is one target and
 * the layout can restack on a phone without losing the schedule reading.
 *
 * Adding a row is adding an object to `otherProjects` — see that file.
 */
export default async function ScheduleOfWorks() {
  const t = await getTranslations('projects');
  const c = await getTranslations('common');

  return (
    <div className="border-t border-[var(--rule-strong)]">
      {/* Column headings — the schedule's own header rule. */}
      <div className="u-label hidden grid-cols-[3.5rem_7rem_minmax(0,1.15fr)_minmax(0,1fr)_2rem] items-center gap-x-5 border-b border-[var(--rule-strong)] py-2.5 md:grid">
        <span>{c('item')}</span>
        <span />
        <span>{c('project')}</span>
        <span>{c('type')}</span>
        <span />
      </div>

      <ul>
        {otherProjects.map((project, i) => (
          <li key={project.slug} className="border-b border-[var(--rule)]">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="schedule-link group grid grid-cols-[2rem_5.5rem_minmax(0,1fr)_1.25rem] items-center gap-x-3.5 py-4 no-underline transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--red)_5%,transparent)] md:grid-cols-[3.5rem_7rem_minmax(0,1.15fr)_minmax(0,1fr)_2rem] md:gap-x-5 md:py-5"
            >
              <span className="u-num text-[0.6875rem] text-[var(--ink-3)]">
                {String(i + 1).padStart(2, '0')}
              </span>

              <span className="mount block overflow-hidden">
                <Image
                  src={project.shot}
                  alt=""
                  width={1600}
                  height={1000}
                  sizes="(max-width: 767px) 88px, 112px"
                  className="h-auto w-full"
                />
              </span>

              <span className="min-w-0">
                <span className="u-h3 block truncate text-[1.0625rem] md:text-[1.125rem]">
                  {t(`${project.slug}.name`)}
                </span>
                <span className="u-num mt-1 block truncate text-[0.6875rem] tracking-[0.05em] text-[var(--ink-3)] transition-colors duration-200 group-hover:text-[var(--red-ink)]">
                  {project.domain}
                </span>
                <span className="mt-2 block text-[0.8125rem] leading-snug text-[var(--ink-2)] md:hidden">
                  {t(`${project.slug}.type`)}
                </span>
              </span>

              <span className="hidden text-[0.9375rem] leading-snug text-[var(--ink-2)] md:block">
                {t(`${project.slug}.type`)}
              </span>

              <span className="justify-self-end text-[var(--ink-3)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--red-ink)]">
                <ArrowOut size={16} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
