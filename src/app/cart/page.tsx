"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { resolveImg } from "@/data/imageMap";
import type { Product } from "@/lib/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { allowed } = useRequireLogin("/cart");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
  } = useCart();

  // While the login check runs (or redirects), don't flash the cart.
  if (!allowed) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-24 text-center text-gray-500">
          Loading your cart…
        </main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-xl shadow p-10">
            <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
            <Link href="/products" className="inline-block bg-navy-700 text-white px-6 py-3 rounded-lg">
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {/* Cart Items */}
        <div className="space-y-5">
          {items.map((item) => {
            const imgSrc = item.image ? resolveImg(item.image) : "/images/key-ring.avif";

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center gap-4"
              >
                <img
                  src={imgSrc}
                  alt={item.title}
                  className="w-full md:w-24 h-52 md:h-24 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">₹{item.price} each</p>
                </div>

                <div className="flex items-center justify-between md:justify-start gap-4">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button className="px-3 py-2" onClick={() => updateQty(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button className="px-3 py-2" onClick={() => updateQty(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>

                  <div className="font-bold text-navy-700">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                <button className="text-red-600 text-sm md:ml-4" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-gray-500">Items: {totalCount}</p>
            <h2 className="text-3xl font-bold mt-2">₹{totalPrice.toFixed(2)}</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <button onClick={clearCart} className="border px-6 py-3 rounded-lg">
              Clear Cart
            </button>
            <Link
              href="/checkout"
              className="w-full md:w-auto text-center bg-navy-700 hover:bg-navy-800 text-white px-6 py-3 rounded-lg font-medium"
            >
              Proceed To Checkout
            </Link>
          </div>
        </div>

        {/* Recommended Products */}
        <h2 className="text-2xl font-bold mt-12 mb-6">Recommended Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {products.slice(0, 4).map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={resolveImg(product.image)}
                alt={product.title}
                className="w-full h-56 md:h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium line-clamp-2">{product.title}</h3>
                <p className="text-navy-700 font-bold mt-2">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
