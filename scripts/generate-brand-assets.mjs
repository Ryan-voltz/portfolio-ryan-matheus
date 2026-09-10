import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public/brand');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('Generating brand assets from LOGO RYAN.png...');
  const baseImg = sharp('LOGO RYAN.png');

  // --------------------------------------------------------------------------
  // 1. EXTRACT ISOLATED RM SYMBOL (Top-Left quadrant: solid dark navy bg)
  // --------------------------------------------------------------------------
  const symbolCrop = baseImg.clone().extract({ left: 110, top: 178, width: 335, height: 160 });
  const { data: sData, info: sInfo } = await symbolCrop.raw().toBuffer({ resolveWithObject: true });

  // Calculate background color along the top/bottom borders of crop
  let bgR = 0, bgG = 0, bgB = 0, sBorderCount = 0;
  for (let x = 0; x < sInfo.width; x++) {
    const topIdx = x * 4;
    bgR += sData[topIdx]; bgG += sData[topIdx + 1]; bgB += sData[topIdx + 2]; sBorderCount++;
    const botIdx = ((sInfo.height - 1) * sInfo.width + x) * 4;
    bgR += sData[botIdx]; bgG += sData[botIdx + 1]; bgB += sData[botIdx + 2]; sBorderCount++;
  }
  const sBgLum = (bgR + bgG + bgB) / (sBorderCount * 3);

  const symWhite = Buffer.alloc(sInfo.width * sInfo.height * 4);
  const symDark = Buffer.alloc(sInfo.width * sInfo.height * 4);

  for (let i = 0; i < sData.length; i += 4) {
    const lum = (sData[i] + sData[i + 1] + sData[i + 2]) / 3;
    let alpha = 0;
    if (lum > sBgLum + 10) {
      alpha = Math.min(255, Math.max(0, Math.round(((lum - (sBgLum + 10)) / (255 - (sBgLum + 10))) * 255)));
    }
    // Pure white for dark mode
    symWhite[i] = 255; symWhite[i + 1] = 255; symWhite[i + 2] = 255; symWhite[i + 3] = alpha;
    // Dark navy (#0f172a: 15, 23, 42) for light mode
    symDark[i] = 15; symDark[i + 1] = 23; symDark[i + 2] = 42; symDark[i + 3] = alpha;
  }

  const symWhiteBuf = await sharp(symWhite, { raw: { width: sInfo.width, height: sInfo.height, channels: 4 } })
    .trim()
    .png()
    .toBuffer();
  const symDarkBuf = await sharp(symDark, { raw: { width: sInfo.width, height: sInfo.height, channels: 4 } })
    .trim()
    .png()
    .toBuffer();

  await sharp(symWhiteBuf).toFile(path.join(outDir, 'logo-symbol-white.png'));
  await sharp(symDarkBuf).toFile(path.join(outDir, 'logo-symbol-dark.png'));
  console.log('✔ Generated logo-symbol-white.png and logo-symbol-dark.png');

  // --------------------------------------------------------------------------
  // 2. EXTRACT STACKED LOGO (Symbol + RYAN MATHEUS beneath it)
  // --------------------------------------------------------------------------
  const stackedCrop = baseImg.clone().extract({ left: 100, top: 165, width: 445, height: 235 });
  const { data: stData, info: stInfo } = await stackedCrop.raw().toBuffer({ resolveWithObject: true });

  let stBgR = 0, stBgG = 0, stBgB = 0, stBorderCount = 0;
  for (let x = 0; x < stInfo.width; x++) {
    const topIdx = x * 4;
    stBgR += stData[topIdx]; stBgG += stData[topIdx + 1]; stBgB += stData[topIdx + 2]; stBorderCount++;
    const botIdx = ((stInfo.height - 1) * stInfo.width + x) * 4;
    stBgR += stData[botIdx]; stBgG += stData[botIdx + 1]; stBgB += stData[botIdx + 2]; stBorderCount++;
  }
  const stBgLum = (stBgR + stBgG + stBgB) / (stBorderCount * 3);

  const stWhite = Buffer.alloc(stInfo.width * stInfo.height * 4);
  const stDark = Buffer.alloc(stInfo.width * stInfo.height * 4);

  for (let i = 0; i < stData.length; i += 4) {
    const lum = (stData[i] + stData[i + 1] + stData[i + 2]) / 3;
    let alpha = 0;
    if (lum > stBgLum + 10) {
      alpha = Math.min(255, Math.max(0, Math.round(((lum - (stBgLum + 10)) / (255 - (stBgLum + 10))) * 255)));
    }
    stWhite[i] = 255; stWhite[i + 1] = 255; stWhite[i + 2] = 255; stWhite[i + 3] = alpha;
    stDark[i] = 15; stDark[i + 1] = 23; stDark[i + 2] = 42; stDark[i + 3] = alpha;
  }

  await sharp(stWhite, { raw: { width: stInfo.width, height: stInfo.height, channels: 4 } })
    .trim()
    .png()
    .toFile(path.join(outDir, 'logo-stacked-white.png'));

  await sharp(stDark, { raw: { width: stInfo.width, height: stInfo.height, channels: 4 } })
    .trim()
    .png()
    .toFile(path.join(outDir, 'logo-stacked-dark.png'));
  console.log('✔ Generated logo-stacked-white.png and logo-stacked-dark.png');

  // --------------------------------------------------------------------------
  // 3. EXTRACT CLEAN DIVIDER & TEXT FOR HORIZONTAL LOCKUP
  // --------------------------------------------------------------------------
  const textCrop = baseImg.clone().extract({ left: 170, top: 1055, width: 230, height: 110 });
  const { data: tData, info: tInfo } = await textCrop.raw().toBuffer({ resolveWithObject: true });

  let tBgR = 0, tBgG = 0, tBgB = 0, tCount = 0;
  for (let x = 0; x < tInfo.width; x++) {
    const topIdx = x * 4;
    tBgR += tData[topIdx]; tBgG += tData[topIdx + 1]; tBgB += tData[topIdx + 2]; tCount++;
    const botIdx = ((tInfo.height - 1) * tInfo.width + x) * 4;
    tBgR += tData[botIdx]; tBgG += tData[botIdx + 1]; tBgB += tData[botIdx + 2]; tCount++;
  }
  const tBgLum = (tBgR + tBgG + tBgB) / (tCount * 3);

  const tWhite = Buffer.alloc(tInfo.width * tInfo.height * 4);
  const tDark = Buffer.alloc(tInfo.width * tInfo.height * 4);

  for (let i = 0; i < tData.length; i += 4) {
    const lum = (tData[i] + tData[i + 1] + tData[i + 2]) / 3;
    let alpha = 0;
    if (lum > tBgLum + 12) {
      alpha = Math.min(255, Math.max(0, Math.round(((lum - (tBgLum + 12)) / (255 - (tBgLum + 12))) * 255)));
    }
    tWhite[i] = 255; tWhite[i + 1] = 255; tWhite[i + 2] = 255; tWhite[i + 3] = alpha;
    tDark[i] = 15; tDark[i + 1] = 23; tDark[i + 2] = 42; tDark[i + 3] = alpha;
  }

  const textWhiteTrimmed = await sharp(tWhite, { raw: { width: tInfo.width, height: tInfo.height, channels: 4 } })
    .trim()
    .png()
    .toBuffer();
  const textDarkTrimmed = await sharp(tDark, { raw: { width: tInfo.width, height: tInfo.height, channels: 4 } })
    .trim()
    .png()
    .toBuffer();

  const textMeta = await sharp(textDarkTrimmed).metadata();
  const targetH = textMeta.height;

  // Scale symbol to exact matching height
  const symDarkResized = await sharp(symDarkBuf).resize({ height: targetH }).toBuffer();
  const symWhiteResized = await sharp(symWhiteBuf).resize({ height: targetH }).toBuffer();
  const symMeta = await sharp(symDarkResized).metadata();

  const gap = 16;
  const totalW = symMeta.width + gap + textMeta.width;

  await sharp({
    create: {
      width: totalW,
      height: targetH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    { input: symDarkResized, left: 0, top: 0 },
    { input: textDarkTrimmed, left: symMeta.width + gap, top: 0 }
  ])
  .png()
  .toFile(path.join(outDir, 'logo-horizontal-dark.png'));

  await sharp({
    create: {
      width: totalW,
      height: targetH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .composite([
    { input: symWhiteResized, left: 0, top: 0 },
    { input: textWhiteTrimmed, left: symMeta.width + gap, top: 0 }
  ])
  .png()
  .toFile(path.join(outDir, 'logo-horizontal-white.png'));

  console.log('✔ Generated logo-horizontal-dark.png and logo-horizontal-white.png');

  // --------------------------------------------------------------------------
  // 4. EXTRACT SQUIRCLE APP ICONS (Dark & Light)
  // --------------------------------------------------------------------------
  const sqDarkCrop = await baseImg.clone().extract({ left: 45, top: 540, width: 230, height: 230 }).png().toBuffer();
  const sqLightCrop = await baseImg.clone().extract({ left: 345, top: 540, width: 230, height: 230 }).png().toBuffer();

  const squircleSize = 230;
  const r = 52;
  const roundedRectSvg = Buffer.from(
    `<svg width="${squircleSize}" height="${squircleSize}">
      <rect x="0" y="0" width="${squircleSize}" height="${squircleSize}" rx="${r}" ry="${r}" fill="#fff"/>
    </svg>`
  );

  await sharp(sqDarkCrop)
    .composite([{ input: roundedRectSvg, blend: 'dest-in' }])
    .png()
    .toFile(path.join(outDir, 'icon-squircle-dark.png'));

  await sharp(sqLightCrop)
    .composite([{ input: roundedRectSvg, blend: 'dest-in' }])
    .png()
    .toFile(path.join(outDir, 'icon-squircle-light.png'));

  console.log('✔ Generated icon-squircle-dark.png and icon-squircle-light.png');

  console.log('All brand assets successfully generated in public/brand/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

