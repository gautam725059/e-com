import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAllProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

// List products (Supabase, with local fallback)
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

// Create a product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Never trust a client-supplied id; let the DB assign it.
    const { id: _ignore, ...insert } = body;
    const { data, error } = await supabaseAdmin
      .from("products")
      .insert(insert)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// Update a product (partial)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body as { id: number; [k: string]: any };
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// Delete a product (?id=)
export async function DELETE(req: Request) {
  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
