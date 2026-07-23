import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

// Upload a product image to Supabase Storage and return its public URL.
export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Image upload needs SUPABASE_SERVICE_ROLE_KEY in your environment." },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file received." }, { status: 400 });

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "Please upload a JPG, PNG, WEBP or AVIF image." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image is too large (max 5 MB)." }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const slug = file.name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "product";
    const objectPath = `products/${Date.now()}-${slug}.${ext}`;

    const bytes = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(objectPath, bytes, {
      contentType: file.type,
      cacheControl: "31536000", // 1 year — filenames are unique
      upsert: false,
    });

    if (error) {
      console.error("storage upload failed:", error);
      return NextResponse.json(
        { error: "Upload failed. Is the 'product-images' bucket created?", detail: error.message },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(objectPath);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err: any) {
    console.error("upload error:", err);
    return NextResponse.json({ error: "Upload failed.", detail: err?.message }, { status: 500 });
  }
}
