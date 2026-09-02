'use client';

import { useEffect, useState } from 'react';

export type Station = { id: string; name: string };

/**
 * The dimension rail down the left edge of the sheet. It is the page's single
 * vertical axis: every section is pinned to a numbered station on it, and the
 * station you are reading takes the redline mark.
 *
 * Hidden below 1280px, where the header nav carries the same wayfinding.
 */
export default function StationRail({ stations, label }: { stations: Station[]; label: string }) {
  const [active, setActive] = useState(stations[0]?.id);

  useEffect(() => {
    const nodes = stations
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));

    if (!nodes.length || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band across the upper third: the section you are reading, not the
      // one that happens to be tallest.
      { rootMargin: '-12% 0px -62% 0px', threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [stations]);

  return (
    <nav
      aria-label={label}
      className="pointer-events-none fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 pl-[max(1.75rem,calc((100vw-96rem)/2+1.75rem))] xl:block"
    >
      <ol className="pointer-events-auto flex flex-col gap-0.5">
        {stations.map((station, i) => (
          <li key={station.id}>
            <a
              href={`#${station.id}`}
              className="station group"
              aria-current={active === station.id ? 'true' : undefined}
            >
              <span className="u-num text-[0.625rem] tabular-nums opacity-70">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="grid grid-cols-[1.25rem_auto] items-center gap-2">
                <span className="station-mark" aria-hidden />
                <span className="station-name">{station.name}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
