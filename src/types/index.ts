export interface Product {
  id: number;
  name: string;
  cat: string;
  price: number;
  orig: number | null;
  img: string; // main image (shown on cards)
  images?: string[]; // full gallery shown on the product page
  fallback: string;
  desc: string;
  badge: string;
  variants: string[];
  colors: string[];
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  qty: number;
  variant: string;
  color: string;
}

export interface Category {
  name: string;
  img: string;
  href: string;
}
