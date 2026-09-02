type Props = {
  /** Short mono tag, e.g. "REV PENDING". */
  tag: string;
  title: string;
  body: string;
  /** Message key to fill. Emitted as an HTML comment, not shown to visitors. */
  editKey?: string;
};

/**
 * A redline: the mark an engineer puts on a check print where something is not
 * yet resolved. It is used here for exactly one thing — a result Ryan has not
 * supplied. No figure is invented to fill the space, in any language.
 */
export default function RedlineNote({ tag, title, body, editKey }: Props) {
  return (
    <div className="redline" role="note">
      <p className="u-label u-label-red flex items-center gap-2 font-medium">
        <span className="rev-tri" aria-hidden />
        {tag}
      </p>
      <p className="u-h3 mt-3 text-[var(--ink)]">{title}</p>
      <p className="u-body mt-2 text-[0.9375rem]">{body}</p>
      {/* The gap is visible to everyone; the file to edit is for whoever opens
          the source. See README → "Placeholders waiting on you". */}
      {editKey ? (
        <span hidden aria-hidden dangerouslySetInnerHTML={{ __html: `<!-- FILL IN: ${editKey} -->` }} />
      ) : null}
    </div>
  );
}
