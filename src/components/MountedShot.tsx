import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  /** Caption bar under the mount: "DETAIL A — volarecompany.com.br". */
  caption: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * A detail mounted on the sheet: a drawn frame with registration ticks and a
 * caption rule beneath. The screenshots are real captures of the live sites —
 * see public/shots/PROVENANCE.txt.
 */
export default function MountedShot({ src, alt, caption, priority, sizes }: Props) {
  return (
    <figure className="m-0">
      <div className="mount">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1000}
          priority={priority}
          sizes={sizes ?? '(max-width: 1023px) 100vw, 58vw'}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="u-label mt-3 flex items-center gap-3">
        <span className="h-px w-6 shrink-0 bg-[var(--red)]" aria-hidden />
        {caption}
      </figcaption>
    </figure>
  );
}
