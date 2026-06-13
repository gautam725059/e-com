import Link from "next/link";
import products from "@/data/products.json";
import categories, { getCategory } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  searchParams?: Promise<{ page?: string; category?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const activeCategory = sp.category ? getCategory(sp.category) : undefined;

  const all = (products as any[]).filter((p) =>
    activeCategory ? p.category === activeCategory.slug : true
  );

  const page = parseInt(sp.page || "1", 10) || 1;
  const perPage = 6;
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paged = all.slice(start, start + perPage);

  const qs = (p: number) =>
    `/products?${activeCategory ? `category=${activeCategory.slug}&` : ""}page=${p}`;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6">
          {activeCategory ? activeCategory.name : "All Products"}
        </h1>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full text-sm border transition ${
              !activeCategory ? "bg-navy-700 text-white border-navy-700" : "bg-white text-gray-700 hover:border-navy-700"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                activeCategory?.slug === c.slug
                  ? "bg-navy-700 text-white border-navy-700"
                  : "bg-white text-gray-700 hover:border-navy-700"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {total > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {paged.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-gray-600">
                Showing {start + 1} - {Math.min(start + perPage, total)} of {total} products
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={qs(Math.max(1, page - 1))}
                  className={`px-3 py-2 rounded ${page === 1 ? "bg-gray-200 text-gray-500 pointer-events-none" : "bg-white border"}`}
                >
                  Prev
                </Link>
                <div className="px-3 py-2">Page {page} / {totalPages}</div>
                <Link
                  href={qs(Math.min(totalPages, page + 1))}
                  className={`px-3 py-2 rounded ${page === totalPages ? "bg-gray-200 text-gray-500 pointer-events-none" : "bg-white border"}`}
                >
                  Next
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border rounded-xl p-10 text-center text-gray-600">
            No products found in this category.
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
