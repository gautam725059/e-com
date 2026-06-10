"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import SearchBar from "./SearchBar";
import {
  Menu,
  X,
  ShoppingCart,
  User,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalCount } = useCart();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">

      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">

        <div className="h-16 lg:h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl lg:text-3xl font-black text-green-700"
          >
            SHANYA
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <SearchBar />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 lg:gap-6">

            {/* Sign In */}
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 text-gray-700 hover:text-green-600 transition"
            >
              <User size={20} />
              <span>Sign In</span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-green-700 transition"
            >
              <ShoppingCart size={24} />

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                {totalCount}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden"
              aria-label="Toggle Menu"
            >
              {open ? (
                <X size={28} />
              ) : (
                <Menu size={28} />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>

      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-center gap-10 text-sm font-medium">

          <Link
            href="/products"
            className="hover:text-green-600 transition"
          >
            Products
          </Link>

          <Link
            href="/#TopCategories"
            className="hover:text-green-600 transition"
          >
            Top Categories
          </Link>

          <Link
            href="/blogs"
            className="hover:text-green-600 transition"
          >
            Blogs
          </Link>

          <Link
            href="/contact"
            className="hover:text-green-600 transition"
          >
            Contact
          </Link>

        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white">

          <div className="px-4 py-4 flex flex-col gap-4">

            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              Products
            </Link>

            <Link
              href="/#TopCategories"
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              Top Categories
            </Link>

            <Link
              href="/blogs"
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              Blogs
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              Contact
            </Link>

            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="text-gray-700"
            >
              Sign In
            </Link>

          </div>

        </div>
      )}

    </nav>
  );
}