"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductDetailClient({ product, imageMap, products }: any) {
  const gallery = (product.images && product.images.length) ? product.images : [product.image];
  const [selected, setSelected] = useState(0);
  const [qty, setQty] = useState(1);

  const originalPrice = Math.round(product.price * 1.25);
  const salePrice = product.price;
  const router = useRouter();
  const { addItem } = useCart();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 flex gap-6">
        <div className="hidden md:flex flex-col gap-4 w-20">
          {gallery.map((g: string, i: number) => (
            <button key={i} onClick={() => setSelected(i)} className={`w-16 h-16 rounded overflow-hidden border ${selected === i ? 'ring-2 ring-green-500' : 'ring-0'}`}>
              <img src={imageMap[g] ?? g} alt={`${product.title} ${i}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <div className="flex-1">
          <img src={imageMap[gallery[selected]] ?? gallery[selected]} alt={product.title} className="w-full h-[520px] object-cover rounded-lg shadow" />
          <div className="flex gap-3 mt-3 md:hidden">
            {gallery.map((g: string, i: number) => (
              <button key={i} onClick={() => setSelected(i)} className={`w-16 h-16 rounded overflow-hidden border ${selected === i ? 'ring-2 ring-green-500' : 'ring-0'}`}>
                <img src={imageMap[g] ?? g} alt={`${product.title} ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold">{product.title}</h1>
          <span className="text-xs uppercase bg-red-100 text-red-600 px-2 py-1 rounded">Sale</span>
        </div>

        <div className="mt-4 flex items-baseline gap-4">
          <div className="text-3xl font-extrabold text-green-600">₹{salePrice}</div>
          <div className="text-sm text-gray-500 line-through">₹{originalPrice}</div>
          <div className="text-sm text-red-500">18% off</div>
        </div>

        <p className="mt-3 text-sm text-green-600">Inclusive of all taxes</p>

        <div className="mt-6">
          <div className="text-sm text-gray-600">Color:</div>
          <div className="flex items-center gap-2 mt-2">
            <button className="w-8 h-8 rounded-full bg-gray-600 border-2 border-white shadow-inner" />
            <button className="w-8 h-8 rounded-full bg-white border border-gray-300" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="text-sm text-gray-600">Quantity</div>
          <div className="ml-4 flex items-center border rounded">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">-</button>
            <div className="px-4 py-2">{qty}</div>
            <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
          </div>
          <div className="ml-auto text-sm text-red-500">SOLD OUT</div>
        </div>

        <div className="mt-6 flex gap-3 items-center">

          <button
            onClick={() => {
              addItem(
                {
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  currency: product.currency,
                  image: product.image,
                },
                qty
              );

              router.push("/cart");
            }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Buy Now
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2"><span className="px-2 py-1 bg-gray-100 rounded">Fast Shipping</span></div>
          <div className="flex items-center gap-2"><span className="px-2 py-1 bg-gray-100 rounded">Secure payment</span></div>
          <div className="mt-2">Availability: <span className="text-gray-500">Out of stock</span></div>
        </div>
      </aside>

      <section className="lg:col-span-12 mt-12">
        <h2 className="text-2xl font-semibold mb-4">Related products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.filter((p: any) => p.id !== product.id).slice(0, 3).map((p: any) => (
            <Link key={p.id} href={`/products/${p.id}`} className="block border rounded-lg overflow-hidden">
              <img src={imageMap[p.image] ?? p.image} alt={p.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-green-600">₹{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
