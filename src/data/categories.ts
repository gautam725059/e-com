// Single source of truth for product categories.
// `slug` is used in URLs (/category/[slug]) and as the `category` field on products.

export type Category = {
  slug: string;
  name: string;
  img: string;
};

const categories: Category[] = [
  { slug: "adhesive-hooks", name: "Adhesive Hooks", img: "wall-hooks.avif" },
  { slug: "hair-accessories", name: "Hair Accessories", img: "clow-clips.avif" },
  { slug: "bathroom-accessories", name: "Bathroom Accessories", img: "Bathroom-Accessories.avif" },
  { slug: "kitchen-accessories", name: "Kitchen Accessories", img: "knife-set.avif" },
  { slug: "key-chain", name: "Key Chain", img: "key-ring.avif" },
  { slug: "birthday-decorations", name: "Birthday Decorations", img: "decoration-kit.jpg" },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export default categories;
