"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import products from "@/data/products.json";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];

    return products
      .filter(
        (product) =>
          product.title
            .toLowerCase()
            .includes(query.toLowerCase())
      )
      .slice(0, 6);
  }, [query]);

  return (
    <div className="relative  w-full max-w-xl">
      <Search
        size={18}
        className="absolute left-4 top-3 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white"
      />

      {query && (
        <div className="absolute mt-2 w-full bg-white border rounded-2xl shadow-xl z-50 overflow-hidden">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={() => setQuery("")}
                className="block px-4 py-3 hover:bg-gray-100"
              >
                <p className="font-medium">
                  {product.title}
                </p>
              </Link>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}