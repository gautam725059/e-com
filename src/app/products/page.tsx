import Link from "next/link";
import products from "@/data/products.json";
import imageMap from "@/data/imageMap";

type Props = { searchParams?: { page?: string } };

export default function ProductsPage({ searchParams }: Props) {
  const page = parseInt((searchParams?.page as string) || "1", 10) || 1;
  const perPage = 6;
  const total = (products as any[]).length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paged = (products as any[]).slice(start, start + perPage);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {paged.map((p: any) => (
          <article key={p.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
            <div className="relative">
              <img src={imageMap[p.image] ?? p.image} alt={p.title} className="w-full h-56 object-cover" />
              <div className="absolute top-3 left-3 bg-navy-800 text-white text-sm px-3 py-1 rounded">₹{p.price}</div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800">{p.title}</h3>
              <p className="text-gray-500 mt-2 text-sm line-clamp-2">{p.description}</p>
              <div className="mt-4 flex items-center gap-3">
                <Link href={`/products/${p.id}`} className="bg-navy-700 text-white px-4 py-2 rounded-lg">View product</Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {start + 1} - {Math.min(start + perPage, total)} of {total} products</div>
        <div className="flex items-center gap-2">
          <Link href={`/products?page=${Math.max(1, page - 1)}`} className={`px-3 py-2 rounded ${page === 1 ? 'bg-gray-200 text-gray-500' : 'bg-white border'}`}>Prev</Link>
          <div className="px-3 py-2">Page {page} / {totalPages}</div>
          <Link href={`/products?page=${Math.min(totalPages, page + 1)}`} className={`px-3 py-2 rounded ${page === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-white border'}`}>Next</Link>
        </div>
      </div>
    </main>
  );
}
