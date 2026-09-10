type Props = {
  stages: string[];
  /** The overall dimension: what the whole span adds up to. */
  spanLabel: string;
};

/**
 * Modern corporate delivery pipeline:
 * Four clear, disciplined phases representing end-to-end full-stack ownership.
 */
export default function DimensionChain({ stages, spanLabel }: Props) {
  return (
    <div className="w-full">
      {/* Modern Connected Step Pipeline */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {stages.map((stage, i) => (
          <div
            key={stage}
            className="group relative flex flex-col justify-between rounded-xl border border-[var(--rule)] bg-[var(--card)] p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--brand)]/10 text-[0.6875rem] font-bold text-[var(--brand-ink)]">
                0{i + 1}
              </span>
              {i < stages.length - 1 && (
                <span className="hidden text-xs text-[var(--ink-3)]/40 sm:inline">→</span>
              )}
            </div>
            <p className="mt-3 text-sm font-semibold tracking-tight text-[var(--ink)]">
              {stage}
            </p>
          </div>
        ))}
      </div>

      {/* Signature Guarantee Badge */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-[var(--brand)] animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-[var(--brand-ink)] uppercase">
            {spanLabel}
          </span>
        </div>
        <span className="text-xs text-[var(--ink-3)]">
          Levantamento de requisitos até a homologação final
        </span>
      </div>
    </div>
  );
}

