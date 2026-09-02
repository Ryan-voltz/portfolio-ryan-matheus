/** The plotted sheet: its border, four registration ticks, and the bound edge. */
export default function SheetFrame() {
  return (
    <>
      <div className="sheet-frame" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="margin-line" aria-hidden />
    </>
  );
}
