'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowOut } from './Icons';

type Props = {
  src: string;
  alt: string;
  /** Caption bar under the mount: "DETAIL A — volarecompany.com.br". */
  caption: string;
  priority?: boolean;
  sizes?: string;
  /** Accessible name for the expand affordance. */
  expandLabel: string;
  closeLabel: string;
  /** Let the shot reach the screen edges below 1024px. */
  bleed?: boolean;
};

/**
 * A detail mounted on the sheet: a drawn frame with registration ticks and a
 * caption rule beneath. The screenshots are real captures of the live sites —
 * see public/shots/PROVENANCE.txt.
 *
 * Tapping the mount opens the detail at working size. A 1600px capture shown
 * 366px wide on a phone is a thumbnail of a system, not evidence of one; the
 * viewer shows it wider than the screen and lets you pan, which is what
 * looking closely at a drawing detail actually is.
 */
export default function MountedShot({
  src,
  alt,
  caption,
  priority,
  sizes,
  expandLabel,
  closeLabel,
  bleed,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  // The full-size capture is 80-100kB and lives behind a tap. Mounting its
  // <img> before the dialog is opened downloads every one of them on page
  // load — a closed dialog is display:none, which does not stop a fetch.
  const [opened, setOpened] = useState(false);

  const open = () => {
    setOpened(true);
    dialog.current?.showModal();
  };

  return (
    <figure className="m-0">
      <button
        type="button"
        onClick={open}
        aria-label={expandLabel}
        className={`mount group/mount block w-full cursor-zoom-in p-0 text-left ${bleed ? 'bleed' : ''}`}
      >
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1000}
          priority={priority}
          sizes={sizes ?? '(max-width: 1023px) 100vw, 58vw'}
          className="h-auto w-full"
        />
      </button>

      <figcaption className="u-label mt-3 flex items-center gap-3">
        <span className="h-px w-6 shrink-0 bg-[var(--red)]" aria-hidden />
        <span className="min-w-0 truncate">{caption}</span>
        <ArrowOut size={12} className="ml-auto shrink-0 opacity-70" />
      </figcaption>

      <dialog
        ref={dialog}
        className="viewer"
        onClick={(e) => {
          // Native backdrop clicks land on the dialog element itself.
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="viewer-head">
          <p className="u-label min-w-0 truncate">{caption}</p>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="u-tag u-tag-ink shrink-0 border border-[var(--rule-strong)] px-3 py-2 transition-colors duration-200 hover:border-[var(--red)] hover:text-[var(--red-ink)]"
          >
            {closeLabel}
          </button>
        </div>
        <div className="viewer-scroll">
          {/* Plain img at native width: the viewer exists precisely to escape
              the responsive size the page needs. Rendered only after the first
              open, then kept, so re-opening is instant. */}
          {opened ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} width={1600} height={1000} decoding="async" />
          ) : null}
        </div>
      </dialog>
    </figure>
  );
}
