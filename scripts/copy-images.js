const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src/images');
const outDir = path.resolve(__dirname, '../public/images');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => /\.(avif|jpg|jpeg|png|webp)$/i.test(f));

for (const file of files) {
  try {
    fs.copyFileSync(path.join(srcDir, file), path.join(outDir, file));
    console.log(`copied ${file}`);
  } catch (err) {
    console.error('copy error', file, err.message || err);
  }
}
