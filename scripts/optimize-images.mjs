/**
 * Image Optimization Script
 * Converts all PNG images in /public to optimized WebP format
 * and creates smaller PNG fallbacks for compatibility
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const PUBLIC_DIR = join(process.cwd(), 'public');
const OUTPUT_DIR = join(PUBLIC_DIR, 'optimized');

// Image optimization configs
const configs = {
  // Hero doctor image - max 1200px wide, quality 80
  'Doctor SLM.png': { maxWidth: 1200, quality: 80 },
  // Logos - max 500px wide, quality 85
  'Slmlogo.png': { maxWidth: 500, quality: 85 },
  'SLM Logo.png': { maxWidth: 500, quality: 85 },
  // MTC images
  'MTC.png': { maxWidth: 600, quality: 75 },
  'Banner horizonal MTC.png': { maxWidth: 800, quality: 80 },
  'MTC banner horizontal.png': { maxWidth: 800, quality: 80 },
  // Favicons - max 256px
  'SLM Favicon.png': { maxWidth: 256, quality: 85 },
  'slmfavicon.png': { maxWidth: 256, quality: 85 },
  // Pin
  'PinSLM.png': { maxWidth: 100, quality: 80 },
};

async function optimizeImage(inputPath, filename) {
  const config = configs[filename] || { maxWidth: 1000, quality: 80 };
  const nameWithoutExt = basename(filename, extname(filename));

  try {
    const metadata = await sharp(inputPath).metadata();
    const originalSize = (await stat(inputPath)).size;

    // Calculate new dimensions
    const newWidth = Math.min(metadata.width, config.maxWidth);

    // Create WebP version
    const webpOutput = join(OUTPUT_DIR, `${nameWithoutExt}.webp`);
    await sharp(inputPath)
      .resize(newWidth, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: config.quality, effort: 6 })
      .toFile(webpOutput);

    const webpSize = (await stat(webpOutput)).size;

    // Create optimized PNG version (for fallback/compatibility)
    const pngOutput = join(OUTPUT_DIR, `${nameWithoutExt}.png`);
    await sharp(inputPath)
      .resize(newWidth, null, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: config.quality, compressionLevel: 9, palette: true })
      .toFile(pngOutput);

    const pngSize = (await stat(pngOutput)).size;

    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);
    console.log(`✅ ${filename}`);
    console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   WebP:     ${(webpSize / 1024).toFixed(0)} KB (${savings}% smaller)`);
    console.log(`   PNG opt:  ${(pngSize / 1024).toFixed(0)} KB`);
    console.log('');

    return { filename, originalSize, webpSize, pngSize };
  } catch (err) {
    console.error(`❌ Error processing ${filename}:`, err.message);
    return null;
  }
}

async function processServiciosDir() {
  const serviciosDir = join(PUBLIC_DIR, 'servicios');
  const outputServiciosDir = join(OUTPUT_DIR, 'servicios');
  await mkdir(outputServiciosDir, { recursive: true });

  const files = await readdir(serviciosDir);
  for (const file of files) {
    if (extname(file).toLowerCase() !== '.png') continue;

    const inputPath = join(serviciosDir, file);
    const nameWithoutExt = basename(file, extname(file));

    const originalSize = (await stat(inputPath)).size;

    // WebP
    const webpOutput = join(outputServiciosDir, `${nameWithoutExt}.webp`);
    await sharp(inputPath)
      .resize(800, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(webpOutput);

    const webpSize = (await stat(webpOutput)).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    console.log(`✅ servicios/${file}`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(0)} KB → WebP: ${(webpSize / 1024).toFixed(0)} KB (${savings}% smaller)`);
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script for San Luis Medic\n');
  console.log('='.repeat(50));

  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(PUBLIC_DIR);
  const pngFiles = files.filter(f => extname(f).toLowerCase() === '.png');

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of pngFiles) {
    const inputPath = join(PUBLIC_DIR, file);
    const fileStat = await stat(inputPath);
    if (fileStat.isDirectory()) continue;

    const result = await optimizeImage(inputPath, file);
    if (result) {
      totalOriginal += result.originalSize;
      totalOptimized += result.webpSize;
    }
  }

  console.log('='.repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`   Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total WebP:     ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Total savings:  ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%\n`);

  console.log('Processing servicios images...\n');
  await processServiciosDir();

  console.log('\n✨ Done! Optimized images saved to /public/optimized/');
}

main().catch(console.error);
