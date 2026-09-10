'use client';

import { useState } from 'react';
import { Copy, Check } from './Icons';

type Props = {
  email: string;
  className?: string;
  label?: string;
  copiedLabel?: string;
};

export default function CopyEmailButton({
  email,
  className,
  label = 'Copiar e-mail',
  copiedLabel = 'Copiado!',
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard API fallback
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={label}
      aria-label={copied ? copiedLabel : label}
      className={`chip inline-flex items-center gap-2 rounded-lg border border-[var(--rule)] bg-[var(--sheet)] px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--ink-2)] transition-all duration-200 hover:border-[var(--brand)] hover:text-[var(--brand-ink)] focus-visible:outline-2 focus-visible:outline-[var(--brand)] ${className ?? ''}`}
    >
      {copied ? (
        <>
          <Check size={14} className="text-emerald-500" />
          <span className="text-emerald-500">{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

