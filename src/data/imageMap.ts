// Map product image filenames to public URLs to avoid importing binary modules
const imageMap: { [key: string]: string } = {
  'wall-hooks.avif': '/images/wall-hooks.avif',
  'clow-clips.avif': '/images/clow-clips.avif',
  'hair-extansions.avif': '/images/hair-extansions.avif',
  'knife-set.avif': '/images/knife-set.avif',
  'key-ring.avif': '/images/key-ring.avif',
  'decoration-kit.jpg': '/images/decoration-kit.jpg',
  'wall-hooks-2.svg': '/images/wall-hooks-2.svg',
  'Bathroom-Accessories.avif': '/images/Bathroom-Accessories.avif',
};

/**
 * Resolve a product image reference to a usable URL.
 * Handles: absolute paths/URLs (e.g. admin uploads at /uploads/..), mapped
 * bundled images, and bare filenames that live in /public/images.
 */
export function resolveImg(img?: string): string {
  if (!img) return "/images/default.jpg";
  if (img.startsWith("http") || img.startsWith("/")) return img;
  return imageMap[img] ?? `/images/${img}`;
}

export default imageMap;
