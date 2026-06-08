const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.resolve(__dirname, '../src/images');
const outDir = path.resolve(__dirname, '../public/images');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => /\.(avif|jpg|jpeg|png|webp)$/i.test(f));

async function convert() {
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const base = path.basename(file, ext);
    const srcPath = path.join(srcDir, file);
    const outPath = path.join(outDir, base + '.jpg');

    try {
      // If already jpg and exists, just copy
      if (ext === '.jpg' || ext === '.jpeg') {
        fs.copyFileSync(srcPath, outPath);
        console.log(`copied ${file} -> ${base}.jpg`);
        continue;
      }

      await sharp(srcPath).jpeg({ quality: 85 }).toFile(outPath);
      console.log(`converted ${file} -> ${base}.jpg`);
    } catch (err) {
      console.error('error converting', file, err.message || err);
    }
  }
}

convert();
