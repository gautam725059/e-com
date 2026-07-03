import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getCatalog, setCatalogOverride } from "@/lib/catalog";

export const dynamic = "force-dynamic";

async function isAdmin(req: Request): Promise<boolean> {
  const pass = req.headers.get("x-admin-pass") || "";
  if (!pass) return false;
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "src", "data", "admins.json"), "utf-8");
    const admins = JSON.parse(raw) as { password: string }[];
    return admins.some((a) => a.password === pass);
  } catch {
    return false;
  }
}

// List catalog products (admin only) — with current name/description
export async function GET(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await getCatalog();
  return NextResponse.json({
    products: products.map((p) => ({ id: p.id, name: p.name, desc: p.desc, cat: p.cat, price: p.price })),
  });
}

// Edit a product's name / description (admin only)
export async function PATCH(req: Request) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, name, desc } = body as { id?: number; name?: string; desc?: string };

  if (id == null || !name || !name.trim()) {
    return NextResponse.json({ error: "Product id and name are required." }, { status: 400 });
  }
  const ok = await setCatalogOverride(Number(id), name, desc || "");
  if (!ok) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
