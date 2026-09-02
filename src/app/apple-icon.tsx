import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** The same registration mark, at the size iOS puts on a home screen. */
export default function AppleIcon() {
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
        <div style={{ position: 'absolute', top: 18, left: 18, width: 44, height: 44, borderTop: '10px solid #ff5340', borderLeft: '10px solid #ff5340', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: 18, right: 18, width: 44, height: 44, borderBottom: '10px solid #ff5340', borderRight: '10px solid #ff5340', display: 'flex' }} />
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, color: '#eff1f2', letterSpacing: -6, marginTop: -6 }}>
          R
        </div>
      </div>
    ),
    size,
  );
}
