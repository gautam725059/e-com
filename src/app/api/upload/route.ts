import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const BUCKET = "product-images";

// Accepts { filename, dataUrl } and stores the image in Supabase Storage,
// returning a public URL usable directly as a product image.
export async function POST(req: Request) {
  try {
    const { filename, dataUrl } = (await req.json()) as {
      filename: string;
      dataUrl: string;
    };
    if (!filename || !dataUrl) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) return NextResponse.json({ error: "Bad data url" }, { status: 400 });

    const mime = match[1];
    const buffer = Buffer.from(match[2], "base64");
    const safe = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const key = `${Date.now()}-${safe}`;

    const { error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(key, buffer, { contentType: mime, upsert: false });
    if (error) throw error;

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key);
    return NextResponse.json({ path: data.publicUrl });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
