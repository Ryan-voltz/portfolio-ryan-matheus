'use client';

import { useEffect, useRef, useState } from 'react';

export type Station = { id: string; name: string };

/**
 * Wayfinding for the sheet, in one component and one scroll listener.
 *
 * ≥1280px it is the station rail out in the filing margin. Below that the
 * margin closes, so the same information becomes the dimension strip under the
 * header: five measured spans, one per field, the current one filling with
 * redline as you read through it. It is the hero's own device doing a second
 * job, which is why the phone does not get a hamburger — a drawing already
 * knows how to say where you are.
 *
 * Position is read from geometry rather than from an IntersectionObserver
 * band: a band picks whichever section happens to cross it, which put the rail
 * one station behind on tall fields.
 */
export default function SheetNav({ stations, label }: { stations: Station[]; label: string }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    let nodes = stations.map((s) => document.getElementById(s.id));

    const read = () => {
      frame.current = 0;
      if (nodes.some((n) => !n)) nodes = stations.map((s) => document.getElementById(s.id));

      // The reading line sits a third down the viewport: the section you are
      // actually looking at, not the one that merely starts on screen.
      const line = window.scrollY + window.innerHeight * 0.34;
      const tops = nodes.map((n) => (n ? n.getBoundingClientRect().top + window.scrollY : Infinity));

      let idx = 0;
      for (let i = 0; i < tops.length; i++) if (tops[i] <= line) idx = i;

      const start = tops[idx];
      const end = idx + 1 < tops.length ? tops[idx + 1] : document.documentElement.scrollHeight;
      const span = Math.max(end - start, 1);
      const p = Math.min(1, Math.max(0, (line - start) / span));

      setActive(idx);
      setProgress(p);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [stations]);

  const fill = (i: number) => (i < active ? 1 : i === active ? progress : 0);

  return (
    <>
      {/* ≥1280px — the station rail in the filing margin. */}
      <nav
        aria-label={label}
        className="pointer-events-none fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 pl-[max(1.75rem,calc((100vw-96rem)/2+1.75rem))] xl:block"
      >
        <ol className="pointer-events-auto flex flex-col gap-0.5">
          {stations.map((station, i) => (
            <li key={station.id}>
              <a
                href={`#${station.id}`}
                className="station"
                aria-current={active === i ? 'true' : undefined}
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

      {/* Below 1280px — the dimension strip, inside the header. */}
      <nav aria-label={label} className="strip xl:hidden">
        <ol className="sheet !flex h-full">
          {stations.map((station, i) => (
            <li key={station.id}>
              <a
                href={`#${station.id}`}
                className="strip-span"
                aria-current={active === i ? 'true' : undefined}
              >
                <span className="strip-track" aria-hidden>
                  <span className="strip-fill" style={{ transform: `scaleX(${fill(i)})` }} />
                </span>
                <span className="strip-name">{station.name}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
