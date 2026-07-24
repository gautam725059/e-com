import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { getCatalog, addProduct, updateProduct, deleteProduct } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// Parse the form payload coming from the admin UI
function parseBody(body: any) {
  const toList = (v: any) =>
    Array.isArray(v)
      ? v
      : String(v || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

  // Gallery: array of image URLs; the first one is the main/card image.
  const images = (Array.isArray(body.images) ? body.images : [])
    .map((s: any) => String(s || "").trim())
    .filter(Boolean);
  const mainImg = String(body.img || images[0] || "").trim();

  return {
    name: body.name,
    cat: body.cat,
    price: body.price,
    orig: body.orig === "" || body.orig == null ? null : body.orig,
    img: mainImg,
    images: images.length ? images : mainImg ? [mainImg] : [],
    fallback: body.fallback || mainImg,
    desc: body.desc,
    badge: body.badge,
    variants: toList(body.variants),
    colors: toList(body.colors),
    rating: body.rating,
    reviews: body.reviews,
  };
}

// List all products
export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) return unauthorized();
  try {
    return NextResponse.json({ products: await getCatalog() });
  } catch (err: any) {
    console.error("catalog list error:", err);
    return NextResponse.json({ error: "Could not load catalog.", detail: err?.message }, { status: 500 });
  }
}

// Add a product
export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) return unauthorized();
  try {
    const body = await req.json();
    if (!body?.name?.trim()) return NextResponse.json({ error: "Product name is required." }, { status: 400 });
    if (!body?.cat?.trim()) return NextResponse.json({ error: "Please choose a category." }, { status: 400 });
    const hasImage = body?.img?.trim() || (Array.isArray(body?.images) && body.images.filter(Boolean).length);
    if (!hasImage) return NextResponse.json({ error: "At least one product image is required." }, { status: 400 });

    const product = await addProduct(parseBody(body));
    return NextResponse.json({ ok: true, product });
  } catch (err: any) {
    console.error("catalog add error:", err);
    return NextResponse.json({ error: "Could not add the product.", detail: err?.message }, { status: 500 });
  }
}

// Edit a product
export async function PATCH(req: Request) {
  if (!(await isAdminRequest(req))) return unauthorized();
  try {
    const body = await req.json();
    if (body?.id == null) return NextResponse.json({ error: "Product id is required." }, { status: 400 });

    const product = await updateProduct(Number(body.id), parseBody(body));
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ ok: true, product });
  } catch (err: any) {
    console.error("catalog update error:", err);
    return NextResponse.json({ error: "Could not save the product.", detail: err?.message }, { status: 500 });
  }
}

// Delete a product  →  /api/admin/catalog?id=3
export async function DELETE(req: Request) {
  if (!(await isAdminRequest(req))) return unauthorized();
  try {
    const id = Number(new URL(req.url).searchParams.get("id"));
    if (!Number.isFinite(id)) return NextResponse.json({ error: "Product id is required." }, { status: 400 });

    const ok = await deleteProduct(id);
    if (!ok) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("catalog delete error:", err);
    return NextResponse.json({ error: "Could not delete the product.", detail: err?.message }, { status: 500 });
  }
}
