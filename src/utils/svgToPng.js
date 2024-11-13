import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import { JSDOM } from 'jsdom';
import svg2img from 'svg2img';
import { promisify } from 'util';

const svg2imgPromise = promisify(svg2img);

async function convertSvgToPng(svgPath, pngPath, size) {
  try {
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    const buffer = await svg2imgPromise(svgContent, { width: size, height: size });
    fs.writeFileSync(pngPath, buffer);
    console.log(`Generated ${pngPath}`);
  } catch (error) {
    console.error(`Error converting ${svgPath}:`, error);
  }
}

async function generateIcons() {
  const sizes = [16, 48, 128];
  
  for (const size of sizes) {
    await convertSvgToPng(
      `icons/icon${size}.svg`,
      `icons/icon${size}.png`,
      size
    );
  }
}

generateIcons();