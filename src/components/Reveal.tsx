'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Fraction of the element that must be visible before the pen starts. */
  threshold?: number;
};

/**
 * Marks a region as drawn once it enters view. Content is always present and
 * readable; only the rules and the labels that sit on them animate in, which
 * is what a drafting pen does — the sheet is never blank.
 */
export default function Reveal({ children, as, className, id, threshold = 0.12 }: Props) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} id={id} className={className} data-drawn={drawn ? 'true' : 'false'}>
      {children}
    </Tag>
  );
}
