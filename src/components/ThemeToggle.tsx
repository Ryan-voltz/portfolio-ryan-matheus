'use client';

import { Sun, Moon } from './Icons';

type Props = {
  className?: string;
  ariaLabel?: string;
};

export default function ThemeToggle({ className, ariaLabel = 'Alternar tema claro/escuro' }: Props) {
  const toggle = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('theme', next);
    } catch {
      // localStorage may be disabled
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={ariaLabel}
      title="Alternar tema claro/escuro"
      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--rule)] bg-[var(--sheet)] text-[var(--ink-2)] transition-all duration-200 hover:border-[var(--brand)] hover:bg-[var(--field)] hover:text-[var(--brand-ink)] focus-visible:outline-2 focus-visible:outline-[var(--brand)] ${className ?? ''}`}
    >
      <Sun size={15} className="hidden dark:block transition-transform duration-300 hover:rotate-45" />
      <Moon size={15} className="block dark:hidden transition-transform duration-300 hover:-rotate-12" />
    </button>
  );
}
