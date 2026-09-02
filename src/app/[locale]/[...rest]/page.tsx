import { notFound } from 'next/navigation';

/** Anything inside a locale that is not a real sheet renders the 404 sheet. */
export default function CatchAllPage() {
  notFound();
}
