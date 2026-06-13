import { notFound } from "next/navigation";
import Link from "next/link";
import imageMap from "@/data/imageMap";
import { getCategory } from "@/data/categories";
import { getAllProducts } from "@/lib/products";
import ProductDetailClient from "@/components/ProductDetailClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetail({ params }: Props) {
  const p = await params;
  const id = parseInt(p.id, 10);
  const products = await getAllProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return notFound();

  const category = product.category ? getCategory(product.category) : undefined;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gold-500">Home</Link>
          {" / "}
          {category ? (
            <Link href={`/category/${category.slug}`} className="hover:text-gold-500">{category.name}</Link>
          ) : (
            <Link href="/products" className="hover:text-gold-500">Products</Link>
          )}
          {" / "}
          <span className="text-gray-700">{product.title}</span>
        </nav>

        <ProductDetailClient product={product} imageMap={imageMap} products={products} />
      </main>
      <Footer />
    </>
  );
}
