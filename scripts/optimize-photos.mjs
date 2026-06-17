import sharp from "sharp";
import { readdir } from "fs/promises";
import { join, extname, basename } from "path";

const PHOTOS_DIR = "./public/photos";
const THUMB_WIDTH = 900;

const files = (await readdir(PHOTOS_DIR)).filter(f =>
  [".jpeg", ".jpg"].includes(extname(f).toLowerCase()) && !f.includes("-thumb")
);

for (const file of files) {
  const input = join(PHOTOS_DIR, file);
  const name = basename(file, extname(file));
  const ext = extname(file).toLowerCase();

  // Thumbnail
  const thumbOut = join(PHOTOS_DIR, `${name}-thumb${ext}`);
  await sharp(input)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .jpeg({ mozjpeg: true, quality: 90 })
    .toFile(thumbOut);

  // Lossless strip metadata on original (overwrite)
  const buf = await sharp(input)
    .jpeg({ mozjpeg: true, quality: 100 })
    .toBuffer();
  await sharp(buf).toFile(input);

  const origSize = (await import("fs")).statSync(input).size;
  const thumbSize = (await import("fs")).statSync(thumbOut).size;
  console.log(`${file}: orig ${(origSize/1024).toFixed(0)}KB | thumb ${(thumbSize/1024).toFixed(0)}KB`);
}

console.log("\nDone!");
