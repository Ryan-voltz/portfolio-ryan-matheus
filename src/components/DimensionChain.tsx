import { DimArrow } from './Icons';

type Props = {
  stages: string[];
  /** The overall dimension: what the whole span adds up to. */
  spanLabel: string;
};

/**
 * The claim, drawn instead of asserted: four stages of delivery measured as a
 * dimension chain, with one overall bracket beneath spanning every one of them
 * and carrying a single name. This is the page's thesis and its one device.
 */
export default function DimensionChain({ stages, spanLabel }: Props) {
  return (
    <div className="dim">
      {/* Horizontal chain — the sheet is wide enough to measure across. */}
      <div className="hidden md:block">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
        >
          {stages.map((stage, i) => (
            <div key={stage} className="relative pr-px">
              <div
                className="dim-span draws"
                style={{ ['--draw-delay' as string]: `${i * 110}ms` }}
              >
                <DimArrow className="absolute left-0 -top-[4px] text-[var(--rule-strong)]" />
                <DimArrow flip className="absolute right-0 -top-[4px] text-[var(--rule-strong)]" />
              </div>
              <p
                className="u-label u-label-ink marks pt-4"
                style={{ ['--draw-delay' as string]: `${i * 110}ms` }}
              >
                {stage}
              </p>
            </div>
          ))}
        </div>

        <div
          className="dim-bracket draws mt-8"
          style={{ ['--draw-delay' as string]: `${stages.length * 110 + 120}ms` }}
        />
        <p
          className="u-label u-label-red marks pt-4 font-medium"
          style={{ ['--draw-delay' as string]: `${stages.length * 110 + 120}ms` }}
        >
          {spanLabel}
        </p>
      </div>

      {/* Vertical chain — the same measurement, turned through 90°. */}
      <div className="md:hidden">
        <div className="flex gap-5">
          <div className="dim-bracket-v shrink-0 self-stretch" aria-hidden />
          <ol className="min-w-0 flex-1">
            {stages.map((stage) => (
              <li key={stage} className="dim-span-v py-3 pl-4">
                <span className="u-label u-label-ink">{stage}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="u-label u-label-red pt-4 font-medium">{spanLabel}</p>
      </div>
    </div>
  );
}
