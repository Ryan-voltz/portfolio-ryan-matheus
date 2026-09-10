export type Station = { id: string; name: string };

/**
 * Disabled in modern design: navigation is cleanly integrated in the top header.
 * Disabling this eliminates 60fps getBoundingClientRect reflows during scrolling.
 */
export default function SheetNav(_props: { stations: Station[]; label: string }) {
  return null;
}

