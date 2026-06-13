import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/data/categories";
import { getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return notFound();

  const items = await getProductsByCategory(slug);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <nav className="text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-gold-500">Home</Link>
          {" / "}
          <Link href="/#TopCategories" className="hover:text-gold-500">Categories</Link>
          {" / "}
          <span className="text-gray-700">{category.name}</span>
        </nav>

        <h1 className="text-3xl lg:text-4xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-500 mb-8">
          {items.length} {items.length === 1 ? "product" : "products"}
        </p>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white border rounded-xl p-10 text-center">
            <p className="text-gray-600 mb-4">No products in this category yet.</p>
            <Link href="/products" className="inline-block bg-navy-700 text-white px-6 py-3 rounded-lg">
              Browse all products
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
