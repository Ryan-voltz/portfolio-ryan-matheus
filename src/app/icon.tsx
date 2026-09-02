import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/**
 * The sheet's registration mark, reduced to a favicon: the redline corner
 * ticks that frame every page, around the drawing's initial. It reads at 16px
 * because it is two shapes, not a logotype.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111518',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 6, left: 6, width: 16, height: 16, borderTop: '5px solid #ff5340', borderLeft: '5px solid #ff5340', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 6, right: 6, width: 16, height: 16, borderBottom: '5px solid #ff5340', borderRight: '5px solid #ff5340', display: 'flex' }} />
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            fontWeight: 700,
            color: '#eff1f2',
            letterSpacing: -2,
            marginTop: -2,
          }}
        >
          R
        </div>
      </div>
    ),
    size,
  );
}
