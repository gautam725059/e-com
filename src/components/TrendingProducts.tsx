import { resolveImg } from '@/data/imageMap';
import { getAllProducts } from '@/lib/products';

export default async function TrendingProducts() {
  const products = await getAllProducts();
  const items = products.slice(0, 8);
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-center mb-6">Trending Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((p) => (
          <div key={p.id} className="card p-3 text-center hover:shadow-lg transition">
            <img src={resolveImg(p.image)} className="mx-auto rounded-lg w-full h-40 object-cover" alt={p.title} />
            <p className="mt-3 text-sm font-medium">{p.title}</p>
            <div className="text-sm muted mt-1">₹{p.price}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
