"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import imageMap from "@/data/imageMap";
import products from "@/data/products.json";


export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, totalCount, totalPrice } = useCart();

  if (!items.length) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="card p-12">
          <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
          <Link href="/products" className="btn btn-primary">Browse products</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map(item => {
          const imgSrc = item.image ? (imageMap[item.image] ?? `/images/${item.image}`) : '/images/key-ring.avif';
          return (
            <div key={item.id} className="flex items-center gap-4 card p-4">
              <img src={imgSrc} alt={item.title} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-sm muted">₹{item.price} each</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border rounded" onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                <div className="px-4">{item.quantity}</div>
                <button className="px-3 py-1 border rounded" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="w-28 text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
              <button className="ml-4 text-red-600" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-sm muted">Items: {totalCount}</div>
          <div className="text-2xl font-bold">Total: ₹{totalPrice.toFixed(2)}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="btn btn-ghost"
            onClick={() => {
              clearCart();
            }}
          >
            Clear Cart
          </button>

          <Link
            href="/checkout"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Proceed To Checkout
          </Link>
        </div>
      </div>
      <h2 className="text-2xl font-bold mt-12 mb-6">
        Recommended Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 4).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={imageMap[product.image] ?? product.image}
              alt={product.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-3">
              <h3 className="font-medium line-clamp-2">
                {product.title}
              </h3>

              <p className="text-green-600 font-semibold mt-2">
                ₹{product.price}
              </p>
            </div>

          </Link>
        ))}
      </div>
    </main>


  );
}
