'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * One observer for the whole document, not one per section.
 *
 * Every field on the page reveals the same way, so ten sections asking the
 * browser to watch ten separate intersection roots is ten sets of bookkeeping
 * for one behaviour. The shared observer is created on first use, marks each
 * element as it arrives, and unobserves it immediately — a section is drawn
 * once and never watched again.
 */
let shared: IntersectionObserver | null = null;

function observer() {
  if (shared) return shared;
  shared = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute('data-drawn', 'true');
        shared?.unobserve(entry.target);
      }
    },
    { threshold: 0.08, rootMargin: '0px 0px -8% 0px' },
  );
  return shared;
}

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
};

/**
 * Marks a region as drawn once it enters view. Content is always present and
 * readable; only the rules and the labels that sit on them animate in, which
 * is what a drafting pen does — the sheet is never blank.
 */
export default function Reveal({ children, as, className, id }: Props) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      node.setAttribute('data-drawn', 'true');
      return;
    }

    const io = observer();
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return (
    <Tag ref={ref} id={id} className={className} data-drawn="false">
      {children}
    </Tag>
  );
}
