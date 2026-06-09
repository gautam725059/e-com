import { notFound } from "next/navigation";
import Link from "next/link";
import products from "@/data/products.json";
import imageMap from "@/data/imageMap";
import ProductDetailClient from "@/components/ProductDetailClient";

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetail({ params }: Props) {
  const p = await params;
  const id = parseInt(p.id, 10);
  const product = (products as any[]).find((p) => p.id === id);
  if (!product) return notFound();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/">Home</Link> / <Link href="/products">Products</Link> / <span className="text-gray-700">{product.title}</span>
      </nav>

      <ProductDetailClient product={product} imageMap={imageMap} products={products} />
    </main>
  );
}
