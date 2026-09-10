export type CartoucheRow = {
  label: string;
  value: string;
  /** Renders in redline — reserved for status and revision. */
  accent?: boolean;
};

/**
 * The small title block that sits in the corner of a drawing field, carrying
 * the sheet's own metadata. It is the honest place for status, revision and
 * scale — facts about the document rather than claims about the work.
 */
export default function Cartouche({ rows, className }: { rows: CartoucheRow[]; className?: string }) {
  return (
    <dl
      className={`grid grid-cols-[auto_1fr] rounded-xl border border-[var(--rule)] bg-[var(--card)] shadow-sm overflow-hidden text-xs ${className ?? ''}`}
    >
      {rows.map((row, i) => (
        <div key={row.label} className="contents">
          <dt
            className={`px-3.5 py-2.5 font-medium uppercase tracking-wider text-[0.6875rem] text-[var(--ink-3)] bg-[var(--field)]/60 border-r border-[var(--rule)] ${
              i > 0 ? 'border-t border-[var(--rule)]' : ''
            }`}
          >
            {row.label}
          </dt>
          <dd
            className={`px-3.5 py-2.5 font-medium ${
              i > 0 ? 'border-t border-[var(--rule)]' : ''
            } ${row.accent ? 'text-[var(--brand-ink)] font-semibold' : 'text-[var(--ink)]'}`}
          >
            {row.accent ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" aria-hidden />
                {row.value}
              </span>
            ) : (
              row.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
