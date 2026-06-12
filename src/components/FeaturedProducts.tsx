"use client";

import Link from "next/link";
import products from "@/data/products.json";
import imageMap from "@/data/imageMap";
import { useCart } from "@/context/CartContext";

export default function FeaturedProducts() {
  const { addItem } = useCart();
  const featured = products.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((p: any) => (
          <article key={p.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition relative">
            <div className="relative">
              <img src={imageMap[p.image] ?? p.image} alt={p.title} className="w-full h-56 sm:h-64 object-cover" />
              <div className="absolute top-3 left-3 bg-navy-800 text-white text-sm px-3 py-1 rounded">₹{p.price}</div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800">{p.title}</h3>
              <p className="text-gray-500 mt-2 text-sm line-clamp-2">{p.description}</p>
              <div className="mt-4 flex items-center gap-3">
                <button className="bg-navy-700 hover:bg-navy-800 text-white px-4 py-2 rounded-lg" onClick={() => addItem({ id: p.id, title: p.title, price: p.price, currency: p.currency, image: p.image })}>Add to cart</button>
                <Link href={`/products/${p.id}`} className="text-navy-700 font-medium">View details</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
