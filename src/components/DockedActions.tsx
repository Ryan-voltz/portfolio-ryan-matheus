'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowOut } from './Icons';

type Props = {
  email: string;
  whatsappHref: string;
  status: string;
  cta: string;
  whatsappLabel: string;
};

/**
 * The issue stamp, docked where a thumb already rests.
 *
 * It arrives only once the hero's own action has scrolled out of reach, so the
 * page never puts two primary actions on screen at the same time, and it
 * carries the one fact a buyer is looking for at that moment — that Ryan is
 * open to work — beside the two channels Brazilian and international clients
 * actually use. Hidden entirely at ≥1024px, where the header's action is
 * always visible.
 */
export default function DockedActions({ email, whatsappHref, status, cta, whatsappLabel }: Props) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('top');
    const contact = document.getElementById('contact');

    let heroPast = false;
    let atContact = false;

    const update = () => {
      setShown(heroPast && !atContact);
    };

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroPast = !entry.isIntersecting;
        update();
      },
      { threshold: 0.1 }
    );

    const contactObserver = new IntersectionObserver(
      ([entry]) => {
        atContact = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 }
    );

    if (hero) heroObserver.observe(hero);
    if (contact) contactObserver.observe(contact);

    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, []);

  return (
    <div className="dock" data-shown={shown} aria-hidden={!shown}>
      <p className="dock-status flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400" title={status}>
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
        <span className="truncate">{status}</span>
        <span className="sr-only">{status}</span>
      </p>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer noopener"
        className="chip u-tag u-tag-ink shrink-0"
        tabIndex={shown ? undefined : -1}
      >
        {whatsappLabel}
        <ArrowOut size={13} />
      </a>

      <a href={`mailto:${email}`} className="plate" tabIndex={shown ? undefined : -1}>
        {cta}
        <ArrowRight size={15} />
      </a>
    </div>
  );
}
