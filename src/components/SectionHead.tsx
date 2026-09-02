import type { ReactNode } from 'react';

type Props = {
  /** Sits in the filing margin, beside the field rule — never above the heading. */
  gutter: string;
  heading: ReactNode;
  lead?: ReactNode;
  headingId?: string;
};

/**
 * Every field on the sheet opens the same way: one rule across the full
 * measure, its label out in the margin, then the heading in the field itself.
 */
export default function SectionHead({ gutter, heading, lead, headingId }: Props) {
  return (
    <div>
      <div className="rule-strong draws" />
      <div className="mt-6 grid gap-x-12 gap-y-4 lg:grid-cols-[9rem_minmax(0,1fr)]">
        {/* The field label lives in the margin, beside the heading. Below lg the
            grid collapses, and a label stacked above a heading is a kicker — so
            it is dropped rather than moved. */}
        <p className="u-tag marks hidden lg:block lg:pt-[0.55rem]">{gutter}</p>
        <div>
          <h2 id={headingId} className="u-h2 marks" style={{ ['--draw-delay' as string]: '80ms' }}>
            {heading}
          </h2>
          {lead ? (
            <div
              className="u-lead marks mt-5 max-w-[64ch]"
              style={{ ['--draw-delay' as string]: '160ms' }}
            >
              {lead}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
