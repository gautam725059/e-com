import Link from 'next/link';
import imageMap from '@/data/imageMap';
import categories from '@/data/categories';

export default function TopCategories() {
  return (
    <section id="TopCategories" className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Top Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="card p-4 text-center hover:shadow-lg transition"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto shadow-sm">
              <img
                src={imageMap[c.img] ?? `/images/${c.img}`}
                alt={c.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 text-sm font-medium">{c.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
