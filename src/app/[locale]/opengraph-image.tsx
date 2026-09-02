import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { site } from '@/content/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${site.name} — ${site.headline}`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * The link preview is the same drawing sheet, reduced to its title block.
 * Fonts are fetched from Google at build time; if that fails the card still
 * renders, just in the default face.
 */
async function loadArchivo(weight: number): Promise<ArrayBuffer | null> {
  try {
    // No UA header: Google then serves a TTF, which is what satori can read.
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Archivo:wght@${weight}`,
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'home' });

  const [bold, regular] = await Promise.all([loadArchivo(700), loadArchivo(400)]);

  const sheet = '#eff1f2';
  const ink = '#111518';
  const ink3 = '#5f6c73';
  const rule = '#7c888e';
  const red = '#c8271a';

  const fonts = [
    ...(bold ? [{ name: 'Archivo', data: bold, weight: 700 as const, style: 'normal' as const }] : []),
    ...(regular
      ? [{ name: 'Archivo', data: regular, weight: 400 as const, style: 'normal' as const }]
      : []),
  ];

  const stages = [t('stage1'), t('stage2'), t('stage3'), t('stage4')];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: sheet,
          color: ink,
          fontFamily: fonts.length ? 'Archivo' : 'sans-serif',
          padding: 56,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            border: `1px solid ${rule}`,
            padding: 52,
            position: 'relative',
          }}
        >
          {/* Registration ticks */}
          <div style={{ position: 'absolute', top: -1, left: -1, width: 22, height: 22, borderTop: `3px solid ${red}`, borderLeft: `3px solid ${red}`, display: 'flex' }} />
          <div style={{ position: 'absolute', top: -1, right: -1, width: 22, height: 22, borderTop: `3px solid ${red}`, borderRight: `3px solid ${red}`, display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: -1, left: -1, width: 22, height: 22, borderBottom: `3px solid ${red}`, borderLeft: `3px solid ${red}`, display: 'flex' }} />
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 22, height: 22, borderBottom: `3px solid ${red}`, borderRight: `3px solid ${red}`, display: 'flex' }} />

          <div style={{ display: 'flex', fontSize: 17, letterSpacing: 3, color: ink3 }}>
            {site.drawingNumber} · {site.domain}
          </div>

          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', fontSize: 96, fontWeight: 700, letterSpacing: -3 }}>
              {site.name}
            </div>
            <div
              style={{
                display: 'flex',
                marginTop: 22,
                fontSize: 30,
                fontWeight: 400,
                color: ink,
                maxWidth: 900,
                lineHeight: 1.25,
              }}
            >
              {site.headline}
            </div>
          </div>

          {/* The dimension chain, reduced to its measure */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', width: '100%' }}>
              {stages.map((stage) => (
                <div
                  key={stage}
                  style={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    borderTop: `1px solid ${rule}`,
                    borderLeft: `1px solid ${rule}`,
                    paddingTop: 14,
                    paddingLeft: 12,
                    fontSize: 15,
                    letterSpacing: 2.4,
                    color: ink,
                    textTransform: 'uppercase',
                  }}
                >
                  {stage}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', width: '100%', borderTop: `2px solid ${red}`, marginTop: 30 }} />
            <div
              style={{
                display: 'flex',
                marginTop: 14,
                fontSize: 16,
                letterSpacing: 2.6,
                color: red,
                textTransform: 'uppercase',
              }}
            >
              {t('span')}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
