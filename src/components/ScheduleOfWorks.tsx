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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {otherProjects.map((project, i) => (
        <a
          key={project.slug}
          href={project.url}
          target="_blank"
          rel="noreferrer noopener"
          className="group relative flex flex-col justify-between rounded-xl border border-[var(--rule)] bg-[var(--card)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-md no-underline"
        >
          <div>
            {/* Screenshot Header */}
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-[var(--rule)] bg-[var(--field)]">
              <Image
                src={project.shot}
                alt={t(`${project.slug}.name`)}
                width={1600}
                height={1000}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--sheet)]/90 backdrop-blur-sm text-[var(--ink-2)] shadow-xs transition-colors duration-200 group-hover:bg-[var(--brand)] group-hover:text-[var(--plate-ink)]">
                <ArrowOut size={12} />
              </span>
            </div>

            {/* Info */}
            <div className="mt-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-base font-bold tracking-tight text-[var(--ink)] group-hover:text-[var(--brand-ink)] transition-colors duration-200">
                  {t(`${project.slug}.name`)}
                </h4>
                <span className="text-[0.6875rem] font-semibold text-[var(--ink-3)]">
                  #{String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-1 text-xs text-[var(--ink-3)] font-mono">
                {project.domain}
              </p>
              <p className="mt-2.5 text-xs text-[var(--ink-2)] line-clamp-2 leading-relaxed">
                {t(`${project.slug}.type`)}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[var(--rule)] pt-3 text-xs font-semibold text-[var(--brand-ink)]">
            <span>Visitar sistema</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </div>
        </a>
      ))}
    </div>
  );
}

