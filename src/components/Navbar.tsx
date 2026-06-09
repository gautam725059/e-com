"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalCount } = useCart();

  return (
    <nav className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-extrabold text-green-700">Shanya</Link>
          <div className="hidden lg:flex items-center gap-6 text-gray-700">
            <Link href="/products" className="hover:text-green-600">Products</Link>
            <Link href="/#TopCategories" className="hover:text-green-600">Top Categories</Link>
            <Link href="#contact" className="hover:text-green-600">Contact</Link>
          </div>
        </div>

        <div className="flex-1 hidden md:flex items-center justify-center px-4">
          <div className="w-full max-w-xl">
            <label htmlFor="search" className="sr-only">Search products</label>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <input id="search" placeholder="Search products, categories..." className="flex-1 px-4 py-2 outline-none text-sm" />
              <button className="bg-green-600 text-white px-4 py-2 text-sm">Search</button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Link href="/login" className="text-gray-700 px-3 py-1 rounded hover:bg-gray-50">Sign in</Link>
          </div>

          <Link href="/cart" className="relative text-gray-700 hover:text-green-700">
            <span className="sr-only">View cart</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
            </svg>
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">{totalCount}</span>
          </Link>

          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
            onClick={() => setOpen(v => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link href="/products" className="block text-gray-700" onClick={() => setOpen(false)}>Products</Link>
            <Link href="/#TopCategories" className="block text-gray-700" onClick={() => setOpen(false)}>Top Categories</Link>
            <Link href="#contact" className="block text-gray-700" onClick={() => setOpen(false)}>Contact</Link>
            <div className="pt-2">
              <Link href="/cart" className="block bg-green-600 text-white text-center px-4 py-2 rounded">Cart</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}