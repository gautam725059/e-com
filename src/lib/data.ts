import type { Product, Category } from "@/types";

const U = "https://images.unsplash.com/photo-";
const F_CLIP = "/images/clow-clips.avif"; // local hair fallback
const F_EXT = "/images/hair-extansions.avif"; // local hair fallback

// Pool of hair / beauty images (local fallback guarantees nothing breaks)
const IMG = {
  a: `${U}1522337360788-8b13dee7a37e?w=700&q=80&fm=webp`,
  b: `${U}1487412947147-5cebf100ffc2?w=700&q=80&fm=webp`,
  c: `${U}1519415943484-9fa1873496d4?w=700&q=80&fm=webp`,
  d: `${U}1492106087820-71f1a00d2b11?w=700&q=80&fm=webp`,
  e: `${U}1457972729786-0411a3b2b626?w=700&q=80&fm=webp`,
  f: `${U}1595476108010-b4d1f102b1b1?w=700&q=80&fm=webp`,
  g: `${U}1503185912284-5271ff81b9a8?w=700&q=80&fm=webp`,
  h: `${U}1605980776566-0486c3ac7617?w=700&q=80&fm=webp`,
};

export const CATEGORIES: Category[] = [
  { name: "Hair Claws & Clips", img: IMG.a, href: "/category/hair-claws-and-clips" },
  { name: "Scrunchies & Bows", img: IMG.c, href: "/category/scrunchies-and-bows" },
  { name: "Headbands", img: IMG.f, href: "/category/headbands" },
  { name: "Hair Extensions", img: IMG.e, href: "/category/hair-extensions" },
  { name: "Rubber Bands", img: IMG.h, href: "/category/rubber-bands" },
  { name: "Combo & Gifts", img: IMG.d, href: "/category/combo-and-gifts" },
];

export const PRODUCTS: Product[] = [
  { id: 0, name: "Matte Claw Clip", cat: "Hair Claws & Clips", price: 99, orig: 149, img: F_CLIP, fallback: F_CLIP, desc: "Smooth matte-finish claw clip with a strong grip — holds all hair types securely without snagging or breakage. Lightweight, everyday essential.", badge: "30% Off", variants: ["Small", "Medium", "Large"], colors: ["Black", "Brown", "Beige", "Pink"], rating: 4.9, reviews: 512 },
  { id: 1, name: "Pearl Hair Clips (Set of 6)", cat: "Hair Claws & Clips", price: 149, orig: null, img: IMG.b, fallback: F_CLIP, desc: "Set of 6 dainty pearl-embellished clips. Add a touch of elegance to any hairstyle — perfect for work, parties or everyday charm.", badge: "New", variants: ["Set of 6"], colors: ["Pearl White", "Gold"], rating: 4.8, reviews: 230 },
  { id: 2, name: "Mini Claw Clips Set", cat: "Hair Claws & Clips", price: 129, orig: 179, img: F_CLIP, fallback: F_CLIP, desc: "Pack of trendy mini claw clips in assorted colours. Great for half-updos, baby hair and quick everyday styling.", badge: "", variants: ["Set of 8", "Set of 12"], colors: ["Assorted", "Pastel", "Neutral"], rating: 4.7, reviews: 188 },

  { id: 3, name: "Satin Scrunchie Set", cat: "Scrunchies & Bows", price: 199, orig: 299, img: IMG.c, fallback: F_CLIP, desc: "Set of premium satin scrunchies that are gentle on hair and prevent breakage. Soft sheen, perfect for day and night.", badge: "33% Off", variants: ["Set of 3", "Set of 6"], colors: ["Blush", "Champagne", "Black", "Wine"], rating: 4.9, reviews: 401 },
  { id: 4, name: "Velvet Bow Scrunchie", cat: "Scrunchies & Bows", price: 99, orig: null, img: IMG.d, fallback: F_CLIP, desc: "Plush velvet scrunchie with a feminine bow. Adds instant charm to ponytails and buns.", badge: "", variants: ["Single", "Set of 2"], colors: ["Maroon", "Emerald", "Black"], rating: 4.8, reviews: 276 },
  { id: 5, name: "Silk Hair Bow Clip", cat: "Scrunchies & Bows", price: 149, orig: null, img: IMG.e, fallback: F_CLIP, desc: "Elegant silk bow on a secure alligator clip. A timeless, graceful accessory for all ages.", badge: "", variants: ["Single"], colors: ["Ivory", "Blush", "Black"], rating: 4.7, reviews: 142 },

  { id: 6, name: "Knotted Headband", cat: "Headbands", price: 149, orig: null, img: IMG.f, fallback: F_EXT, desc: "Soft stretch knotted headband that stays put all day. Chic, comfortable and pairs with every outfit.", badge: "", variants: ["Free Size"], colors: ["Black", "Beige", "Mustard", "Rust"], rating: 4.8, reviews: 213 },
  { id: 7, name: "Pearl Embellished Headband", cat: "Headbands", price: 249, orig: 349, img: IMG.g, fallback: F_EXT, desc: "Statement headband adorned with pearls — instant glam for festive looks and celebrations.", badge: "Sale", variants: ["Free Size"], colors: ["Pearl White", "Gold"], rating: 4.9, reviews: 167 },

  { id: 8, name: "Clip-in Hair Extensions", cat: "Hair Extensions", price: 499, orig: 699, img: F_EXT, fallback: F_EXT, desc: "5-piece clip-in straight extensions for instant length & volume. Heat-resistant fibres that blend naturally with your hair.", badge: "Bestseller", variants: ["14 inch", "18 inch", "22 inch"], colors: ["Natural Black", "Dark Brown"], rating: 4.7, reviews: 328 },
  { id: 9, name: "Wavy Ponytail Extension", cat: "Hair Extensions", price: 399, orig: 549, img: F_EXT, fallback: F_EXT, desc: "Clip-on wavy ponytail for a fuller, glamorous look in seconds. Lightweight and secure.", badge: "", variants: ["16 inch", "20 inch"], colors: ["Natural Black", "Brown"], rating: 4.6, reviews: 154 },

  { id: 10, name: "Snag-Free Hair Ties (50 pc)", cat: "Rubber Bands", price: 49, orig: null, img: IMG.h, fallback: F_CLIP, desc: "Pack of 50 snag-free, no-crease elastic hair ties. Strong hold for daily use — the everyday essential.", badge: "", variants: ["Pack of 50", "Pack of 100"], colors: ["Black", "Multicolor", "Nude"], rating: 4.8, reviews: 489 },
  { id: 11, name: "Elastic Rubber Bands Jar", cat: "Rubber Bands", price: 79, orig: 99, img: IMG.a, fallback: F_CLIP, desc: "Handy jar of soft elastic rubber bands — gentle on hair, ideal for braids, buns and kids' styling.", badge: "", variants: ["200 pc", "500 pc"], colors: ["Black", "Transparent", "Assorted"], rating: 4.7, reviews: 221 },


  { id: 14, name: "Hair Accessory Gift Box", cat: "Combo & Gifts", price: 499, orig: 799, img: IMG.d, fallback: F_EXT, desc: "A beautifully packed box of clips, scrunchies, bows & a headband. The perfect gift for someone special.", badge: "40% Off", variants: ["Gift Box"], colors: ["Assorted"], rating: 5.0, reviews: 96 },
  { id: 15, name: "Everyday Essentials Combo", cat: "Combo & Gifts", price: 299, orig: 449, img: IMG.e, fallback: F_CLIP, desc: "Curated combo of daily-use claw clips, hair ties & a scrunchie set. Everything you need, value-packed.", badge: "Combo", variants: ["Combo Pack"], colors: ["Neutral", "Assorted"], rating: 4.8, reviews: 174 },
];

export const TESTIMONIALS = [
  { name: "Priya Sharma", loc: "Delhi", initials: "PS", rating: 5, text: "Claw clips ki quality top-notch hai! Grip strong hai aur baalon ko damage nahi karte. Packaging bhi gift-worthy thi. Definitely repurchasing!", product: "Hair Claws & Clips" },
  { name: "Kavita Reddy", loc: "Mumbai", initials: "KR", rating: 5, text: "Satin scrunchies bahut soft hain, bilkul crease nahi padta. Look premium hai aur price perfect. Loved it!", product: "Scrunchies & Bows" },
  { name: "Meera Joshi", loc: "Pune", initials: "MJ", rating: 5, text: "Pearl headband ne mere festive look ko complete kar diya. Sabne pucha kahan se liya — highly recommend!", product: "Headbands" },
  { name: "Ananya Singh", loc: "Bangalore", initials: "AS", rating: 5, text: "Hair extensions ekdum natural lagti hain aur clip-in easy hai. Instant volume mil gaya. Best value for money!", product: "Hair Extensions" },
];

// ── Helpers / derived ──
export const HERO_IMAGE = `${U}1522337360788-8b13dee7a37e?w=1400&q=85&fm=webp`;
export const HERO_SLIDES = [
  `${U}1522337360788-8b13dee7a37e?w=1600&q=85&fm=webp`,
  `${U}1519415943484-9fa1873496d4?w=1600&q=85&fm=webp`,
  `${U}1457972729786-0411a3b2b626?w=1600&q=85&fm=webp`,
  `${U}1595476108010-b4d1f102b1b1?w=1600&q=85&fm=webp`,
  `${U}1503185912284-5271ff81b9a8?w=1600&q=85&fm=webp`,
];
export const WHATSAPP_LINK =
  "https://wa.me/919818701724?text=Hi%20I%20need%20help%20with%20a%20Shanya%20order";
export const SUPPORT_EMAIL = "support@shanya.in";

// Shipping rules (used by both the UI and the server — keep them in one place)
export const FREE_SHIPPING_ABOVE = 599;
export const SHIPPING_FEE = 50;

// Set to false to pause orders (checkout then shows a "We're back soon" message).
export const ORDERS_ENABLED = true;
export const INSTAGRAM_URL = "https://www.instagram.com/shanya.in";

// Instagram feed thumbnails (webp-optimised)
export const INSTAGRAM_FEED = [
  `${U}1522337360788-8b13dee7a37e?w=300&q=70&fm=webp`,
  `${U}1519415943484-9fa1873496d4?w=300&q=70&fm=webp`,
  `${U}1457972729786-0411a3b2b626?w=300&q=70&fm=webp`,
  `${U}1595476108010-b4d1f102b1b1?w=300&q=70&fm=webp`,
  `${U}1503185912284-5271ff81b9a8?w=300&q=70&fm=webp`,
  `${U}1487412947147-5cebf100ffc2?w=300&q=70&fm=webp`,
];

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const getProduct = (id: number) => PRODUCTS.find((p) => p.id === id);

export const productsByCategorySlug = (slug: string) =>
  PRODUCTS.filter((p) => slugify(p.cat) === slug);

export const categoryNameFromSlug = (slug: string) => {
  const cat = CATEGORIES.find((c) => c.href.endsWith(`/${slug}`));
  if (cat) return cat.name;
  const prod = PRODUCTS.find((p) => slugify(p.cat) === slug);
  return prod?.cat;
};

// Featured = products on offer; Deal = the bestselling extensions
export const FEATURED = PRODUCTS.filter((p) => p.orig !== null).slice(0, 8);
export const TRENDING = PRODUCTS;
export const DEAL = PRODUCTS.find((p) => p.id === 8)!;
