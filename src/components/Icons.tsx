/**
 * Every glyph on this site is drawn here, in one stroke weight, on one grid.
 * A drawing labels its parts — it does not illustrate them — so outbound
 * channels are named in words and share the single leader arrow below.
 */

type IconProps = {
  className?: string;
  size?: number;
};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'square' as const,
  strokeLinejoin: 'miter' as const,
  'aria-hidden': true,
  focusable: false as const,
});

/** Leader arrow: the drawing's pointer, used for every forward action. */
export function ArrowRight({ className, size = 18 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 12h17" />
      <path d="M14 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowDown({ className, size = 18 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3v17" />
      <path d="M6 14l6 6 6-6" />
    </svg>
  );
}

/** Off-sheet reference: this leader leaves the drawing. */
export function ArrowOut({ className, size = 16 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 18L18 6" />
      <path d="M9 6h9v9" />
    </svg>
  );
}

export function ArrowLeft({ className, size = 18 }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M21 12H4" />
      <path d="M10 6l-6 6 6 6" />
    </svg>
  );
}

/** Solid drafting arrowhead used inside dimension chains. */
export function DimArrow({ className, flip = false }: IconProps & { flip?: boolean }) {
  return (
    <svg
      width="11"
      height="9"
      viewBox="0 0 11 9"
      className={className}
      aria-hidden
      focusable={false}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M0 4.5L11 0v9z" fill="currentColor" />
    </svg>
  );
}
