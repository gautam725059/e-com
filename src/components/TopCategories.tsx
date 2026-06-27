import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import imageMap from '@/data/imageMap';
import categories from '@/data/categories';

export default function TopCategories() {
  return (
    <section id="TopCategories" className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Top Categories</h2>
        <Link href="/products" className="text-sm font-medium text-navy-700 hover:text-gold-600 transition">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-navy-50 shadow-sm hover:shadow-lg transition"
          >
            <img
              src={imageMap[c.img] ?? `/images/${c.img}`}
              alt={c.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/65 via-black/25 to-transparent flex items-end justify-between gap-2">
              <span className="text-white font-semibold leading-tight">{c.name}</span>
              <span className="shrink-0 w-8 h-8 rounded-full bg-white text-navy-700 flex items-center justify-center shadow group-hover:bg-gold-500 group-hover:text-white transition">
                <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
