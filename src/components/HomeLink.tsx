'use client';

import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Props = {
  children: ReactNode;
  className?: string;
  ariaLabel: string;
};

/**
 * The header logo. Locale switches re-render the root layout (it owns
 * <html>), which unsettles Next's own scroll restoration on this route
 * shape — clicking home while already scrolled down could leave the reader
 * exactly where they were instead of at the top. Scrolling explicitly here
 * doesn't depend on that machinery working.
 */
export default function HomeLink({ children, className, ariaLabel }: Props) {
  return (
    <Link
      href="/"
      className={className}
      aria-label={ariaLabel}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      {children}
    </Link>
  );
}
