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
      className={`grid grid-cols-[auto_1fr] border border-[var(--rule-strong)] bg-[var(--sheet)] ${className ?? ''}`}
    >
      {rows.map((row, i) => (
        <div key={row.label} className="contents">
          <dt
            className={`u-label hatch border-r border-[var(--rule)] px-3 py-2 ${
              i > 0 ? 'border-t border-t-[var(--rule)]' : ''
            }`}
          >
            {row.label}
          </dt>
          <dd
            className={`u-num px-3 py-2 text-[0.6875rem] tracking-[0.06em] ${
              i > 0 ? 'border-t border-[var(--rule)]' : ''
            } ${row.accent ? 'text-[var(--red-ink)] font-medium' : 'text-[var(--ink)]'}`}
          >
            {row.accent ? (
              <span className="inline-flex items-center gap-2">
                <span className="rev-tri" aria-hidden />
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
