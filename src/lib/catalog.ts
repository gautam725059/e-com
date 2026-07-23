import fs from "fs/promises";
import path from "path";
import type { Product } from "@/types";
import { PRODUCTS, slugify } from "./data";
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Storefront catalog with full admin CRUD.
 *  • Supabase table `shanya_catalog` when SUPABASE_SERVICE_ROLE_KEY is set (production)
 *  • Local JSON file (src/data/catalog.json) otherwise (dev)
 * data.ts PRODUCTS is the seed — used until the admin saves any change.
 */
const TABLE = "shanya_catalog";
const FILE = path.join(process.cwd(), "src", "data", "catalog.json");
const useDb = () => !!process.env.SUPABASE_SERVICE_ROLE_KEY;

export type ProductInput = Partial<Omit<Product, "id">>;

function normalise(p: any, fallbackId: number): Product {
  const img = String(p.img || "").trim();
  return {
    id: Number(p.id ?? fallbackId),
    name: String(p.name || "Untitled").trim(),
    cat: String(p.cat || "").trim(),
    price: Math.max(0, Number(p.price) || 0),
    orig: p.orig === null || p.orig === "" || p.orig === undefined ? null : Number(p.orig) || null,
    img,
    fallback: String(p.fallback || img || "/images/clow-clips.avif").trim(),
    desc: String(p.desc || "").trim(),
    badge: String(p.badge || "").trim(),
    variants: Array.isArray(p.variants) ? p.variants.filter(Boolean) : [],
    colors: Array.isArray(p.colors) ? p.colors.filter(Boolean) : [],
    rating: Number(p.rating) || 4.8,
    reviews: Number(p.reviews) || 0,
  };
}

// DB row <-> Product. The column is `description` because `desc` is reserved SQL.
const toRow = (p: Product) => ({
  id: p.id,
  name: p.name,
  cat: p.cat,
  price: p.price,
  orig: p.orig,
  img: p.img,
  fallback: p.fallback,
  description: p.desc,
  badge: p.badge,
  variants: p.variants,
  colors: p.colors,
  rating: p.rating,
  reviews: p.reviews,
  updated_at: new Date().toISOString(),
});

const fromRow = (r: any, i: number): Product => normalise({ ...r, desc: r.description }, i);

async function readAll(): Promise<Product[]> {
  if (useDb()) {
    try {
      const { data, error } = await supabaseAdmin.from(TABLE).select("*").order("id", { ascending: true });
      if (error) throw new Error(error.message);
      if (data && data.length) return data.map(fromRow);
    } catch (err: any) {
      // Table missing / DB hiccup — never take the storefront down, fall back
      // to the seed catalog so browsing keeps working.
      console.warn(`[catalog] Supabase read failed (${err?.message}) — using seed products.`);
    }
    return PRODUCTS;
  }
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.products)) {
      return parsed.products.map((p: any, i: number) => normalise(p, i));
    }
    // Legacy shape: { "0": { name, desc } } — keep those edits.
    if (parsed && typeof parsed === "object" && Object.keys(parsed).length) {
      return PRODUCTS.map((p) => {
        const o = parsed[String(p.id)];
        return o ? { ...p, name: o.name ?? p.name, desc: o.desc ?? p.desc } : p;
      });
    }
  } catch {}
  return PRODUCTS;
}

async function writeAll(products: Product[]): Promise<void> {
  if (useDb()) {
    const { error } = await supabaseAdmin.from(TABLE).upsert(products.map(toRow), { onConflict: "id" });
    if (error) throw new Error(error.message);
    return;
  }
  await fs.writeFile(FILE, JSON.stringify({ products }, null, 2), "utf-8");
}

// ── Reads ──
export async function getCatalog(): Promise<Product[]> {
  return readAll();
}

export async function getCatalogProduct(id: number): Promise<Product | null> {
  return (await readAll()).find((p) => p.id === id) ?? null;
}

export async function catalogByCategorySlug(slug: string): Promise<Product[]> {
  return (await readAll()).filter((p) => slugify(p.cat) === slug);
}

// ── Writes (admin only) ──
export async function addProduct(input: ProductInput): Promise<Product> {
  const all = await readAll();
  const nextId = all.reduce((m, p) => Math.max(m, p.id), -1) + 1;
  const product = normalise(input, nextId);
  product.id = nextId;
  await writeAll([...all, product]);
  return product;
}

export async function updateProduct(id: number, input: ProductInput): Promise<Product | null> {
  const all = await readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const merged = normalise({ ...all[idx], ...input, id }, id);
  const next = [...all];
  next[idx] = merged;
  await writeAll(next);
  return merged;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const all = await readAll();
  if (!all.some((p) => p.id === id)) return false;
  const next = all.filter((p) => p.id !== id);
  if (useDb()) {
    const { error } = await supabaseAdmin.from(TABLE).delete().eq("id", id);
    if (error) throw new Error(error.message);
    return true;
  }
  await writeAll(next);
  return true;
}
