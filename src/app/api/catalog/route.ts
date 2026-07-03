import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

// Public: the merged catalog (base data + admin name/description edits).
export async function GET() {
  const products = await getCatalog();
  return NextResponse.json({ products });
}
