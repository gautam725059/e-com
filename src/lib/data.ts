import type { Product, Category } from "@/types";

export const PRODUCTS: Product[] = [
  {id:0, name:'Hooks', cat:'Adhesive Hooks', price:12, orig:null, img:'https://www.shanya.in/images/wall-hooks.avif', fallback:'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&q=80', desc:'Heavy-duty adhesive hooks — no drilling required. Holds up to 5kg. Perfect for kitchen, bathroom, bedroom walls. Easy to install and remove without leaving marks.', badge:'', variants:['Small','Medium','Large'], colors:['White','Black'], rating:4.8, reviews:234},
  {id:1, name:'Claw Clip', cat:'Hair Accessories', price:5, orig:6, img:'https://www.shanya.in/images/clow-clips.avif', fallback:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', desc:'Smooth matte resin claw clip — holds all hair types securely without damage or breakage. Lightweight design, strong grip. Available in multiple trendy colours.', badge:'20% Off', variants:['Small','Large'], colors:['Black','Brown','Beige','Pink'], rating:4.9, reviews:512},
  {id:2, name:'Hair Extensions', cat:'Hair Accessories', price:79, orig:null, img:'https://www.shanya.in/images/hair-extansions.avif', fallback:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', desc:'5-piece clip-in straight hair extensions in natural black. Adds volume and length instantly. Heat-resistant synthetic fibres that blend with natural hair.', badge:'New', variants:['14 inch','18 inch','22 inch'], colors:['Natural Black','Dark Brown'], rating:4.6, reviews:187},
  {id:3, name:'Knife Set', cat:'Kitchen Accessories', price:99, orig:141, img:'https://www.shanya.in/images/knife-set.avif', fallback:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', desc:'Professional 5-piece stainless steel knife set with ergonomic non-slip handles. Includes chef knife, bread knife, utility knife, paring knife and magnetic wooden block.', badge:'30% Off', variants:['5-Piece Set','7-Piece Set'], colors:['Black Handle','Wooden Handle'], rating:4.7, reviews:328},
  {id:4, name:'Key Ring', cat:'Key Chain', price:8, orig:null, img:'https://www.shanya.in/images/key-ring.avif', fallback:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', desc:'Sturdy metal key ring with durable clasp. Anti-rust stainless steel construction. Slim profile fits easily in pockets and bags. Set of 3 rings.', badge:'', variants:['Set of 3','Set of 6'], colors:['Silver','Gold','Rose Gold'], rating:4.5, reviews:91},
  {id:5, name:'Decoration Kit', cat:'Birthday Decorations', price:45, orig:75, img:'https://www.shanya.in/images/decoration-kit.jpg', fallback:'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', desc:'Complete birthday decoration kit — includes balloons, streamers, banner, table confetti and star foil balloons. Easy to set up in under 10 minutes.', badge:'40% Off', variants:['Basic Kit','Premium Kit'], colors:['Pink','Blue','Gold','Multicolor'], rating:4.9, reviews:143},
];

export const CATEGORIES: Category[] = [
  {name:'Adhesive Hooks', img:'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80', href:'/category/adhesive-hooks'},
  {name:'Hair Accessories', img:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80', href:'/category/hair-accessories'},
  {name:'Bathroom Accessories', img:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80', href:'/category/bathroom-accessories'},
  {name:'Kitchen Accessories', img:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', href:'/category/kitchen-accessories'},
  {name:'Key Chain', img:'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80', href:'/category/key-chain'},
  {name:'Birthday Decorations', img:'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&q=80', href:'/category/birthday-decorations'},
];

export const TESTIMONIALS = [
  {name:'Priya Sharma', loc:'Delhi', initials:'PS', rating:5, text:'Quality ekdum top notch hai! Wall hooks ne ghar ko organize kar diya. Delivery bhi super fast thi. Definitely repurchasing!', product:'Adhesive Hooks'},
  {name:'Kavita Reddy', loc:'Mumbai', initials:'KR', rating:5, text:'Claw clips amazing hain. WhatsApp support ne 5 min mein reply diya — outstanding service! Packaging bhi gift-worthy thi.', product:'Hair Accessories'},
  {name:'Meera Joshi', loc:'Pune', initials:'MJ', rating:5, text:'Knife set bahut sharp aur sturdy hai. Price ke hisaab se best value for money. Ghar mein sab use kar rahe hain!', product:'Knife Set'},
  {name:'Ananya Singh', loc:'Bangalore', initials:'AS', rating:5, text:'Decoration kit ne birthday party complete kar di! COD option bhi tha. Sabne pucha kahan se liya — highly recommend!', product:'Decoration Kit'},
];

// ── Helpers / derived ──
export const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=85";
export const WHATSAPP_LINK =
  "https://wa.me/919818701724?text=Hi%20I%20need%20help%20with%20an%20order";

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

// Featured = products carrying a discount/badge; Deal = the Knife Set.
export const FEATURED = PRODUCTS.filter((p) => p.orig !== null);
export const TRENDING = PRODUCTS;
export const DEAL = PRODUCTS.find((p) => p.id === 3)!;
