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
  const frame = useRef(0);

  useEffect(() => {
    const read = () => {
      frame.current = 0;
      const hero = document.getElementById('top');
      const past = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > 600;
      // Stand down over the contact block: its own plate is the action there.
      const contact = document.getElementById('contact');
      const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.75 : false;
      setShown(past && !atContact);
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
  }, []);

  return (
    <div className="dock" data-shown={shown} aria-hidden={!shown}>
      <p className="dock-status u-label u-label-red font-medium" title={status}>
        <span className="rev-tri" aria-hidden />
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
