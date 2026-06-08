"use client";

import { useCart } from "@/context/CartContext";
import React from "react";

export default function AddToCartButton({ product, qty = 1 }: { product: any; qty?: number }) {
  const { addItem } = useCart();

  return (
    <button
      className="bg-black text-white px-5 py-3 rounded mr-4"
      onClick={() => addItem({ id: product.id, title: product.title, price: product.price, currency: product.currency, image: product.image }, qty)}
    >
      Add to cart
    </button>
  );
}
