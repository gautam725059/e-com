import fs from "fs/promises";
import path from "path";
import type { Product } from "@/types";
import { PRODUCTS, slugify } from "./data";
import { supabaseAdmin } from "./supabaseAdmin";

// Admin-editable name/description overrides for the static catalog.
// Base products live in data.ts; edits are stored as overrides:
//  • Supabase table `shanya_catalog` (product_id, name, description) in production.
//  • Local JSON file (src/data/catalog.json) for dev.
type Override = { name?: string; desc?: string };

const TABLE = "shanya_catalog";
const FILE = path.join(process.cwd(), "src", "data", "catalog.json");
const useDb = () => !!process.env.SUPABASE_SERVICE_ROLE_KEY;

async function readOverrides(): Promise<Record<string, Override>> {
  if (useDb()) {
    const { data, error } = await supabaseAdmin.from(TABLE).select("product_id, name, description");
    if (error) throw new Error(error.message);
    const map: Record<string, Override> = {};
    (data ?? []).forEach((r: any) => {
      map[String(r.product_id)] = { name: r.name ?? undefined, desc: r.description ?? undefined };
    });
    return map;
  }
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export async function getCatalog(): Promise<Product[]> {
  const ov = await readOverrides();
  return PRODUCTS.map((p) => {
    const o = ov[String(p.id)];
    if (!o) return p;
    return { ...p, name: o.name ?? p.name, desc: o.desc ?? p.desc };
  });
}

export async function getCatalogProduct(id: number): Promise<Product | null> {
  return (await getCatalog()).find((p) => p.id === id) ?? null;
}

export async function catalogByCategorySlug(slug: string): Promise<Product[]> {
  return (await getCatalog()).filter((p) => slugify(p.cat) === slug);
}

export async function setCatalogOverride(id: number, name: string, desc: string): Promise<boolean> {
  if (!PRODUCTS.some((p) => p.id === id)) return false;

  if (useDb()) {
    const { error } = await supabaseAdmin
      .from(TABLE)
      .upsert({ product_id: id, name: name.trim(), description: desc.trim() }, { onConflict: "product_id" });
    if (error) throw new Error(error.message);
    return true;
  }

  let ov: Record<string, Override> = {};
  try {
    ov = JSON.parse(await fs.readFile(FILE, "utf-8"));
  } catch {}
  ov[String(id)] = { name: name.trim(), desc: desc.trim() };
  await fs.writeFile(FILE, JSON.stringify(ov, null, 2), "utf-8");
  return true;
}
