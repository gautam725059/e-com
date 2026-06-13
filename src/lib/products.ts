import { supabase } from "./supabase";
import productsJson from "@/data/products.json";

export type Product = {
  id: number;
  title: string;
  price: number;
  currency?: string;
  description?: string;
  image: string;
  images?: string[];
  stock?: number;
  category?: string;
};

// Local catalog used as a fallback so the storefront keeps working even if the
// Supabase `products` table isn't set up / seeded yet.
const FALLBACK = productsJson as unknown as Product[];

/**
 * All products. Reads from Supabase; if the table is missing/empty or the query
 * errors, falls back to the bundled products.json.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    if (data && data.length) return data as Product[];
  } catch (e) {
    console.error("Supabase products fetch failed, using local fallback:", e);
  }
  return FALLBACK;
}

export async function getProductById(id: number): Promise<Product | null> {
  const all = await getAllProducts();
  return all.find((p) => p.id === id) ?? null;
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === slug);
}
