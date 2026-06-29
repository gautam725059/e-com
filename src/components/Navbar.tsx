"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import SearchBar from "./SearchBar";
import Image from "next/image";


import {
  Menu,
  X,
  ShoppingCart,
  User,
  Shield,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalCount } = useCart();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [mobile, setMobile] = useState("");
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // If we scroll down past 80px and are scrolling down, hide the menu
      if (currentScrollY > 80 && currentScrollY > lastScrollY) {
        setShowMenu(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 80) {
        // If we scroll up, show the menu
        setShowMenu(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  },
    []);
  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("userLoggedIn") === "true";

    const userMobile =
      localStorage.getItem("userMobile") || "";

    setLoggedIn(isLoggedIn);
    setMobile(userMobile);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 transition-all duration-300">

      {/* Top Header Section (Always Sticky) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">

        <div className="h-16 lg:h-20 flex items-center justify-between gap-2 sm:gap-4">

          {/* Logo */}
          <Image
            src="/images/shanya1.png"
            alt="Shanya"
            width={160}
            height={160}
            className="h-10 lg:h-14 w-auto object-contain shrink-0"
            priority
          />

          {/* Search — single line, inline on every screen size */}
          <div className="flex flex-1 justify-center px-1 md:px-8 min-w-0">
            <SearchBar />
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">



            {/* Sign In */}
            {loggedIn ? (
              <div className="hidden md:flex items-center gap-3">

                <Link
                  href="/my-orders"
                  className="text-gray-700 hover:text-gold-500"
                >
                  My Orders
                </Link>

                <User
                  size={22}
                  className="text-navy-700"
                />

                <button
                  onClick={() => {
                    localStorage.removeItem("userLoggedIn");
                    localStorage.removeItem("userMobile");

                    setLoggedIn(false);

                    router.push("/");
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Sign Out
                </button>

              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 text-gray-700 hover:text-gold-500 transition"
              >
                <User size={20} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-gold-500 transition"
            >
              <ShoppingCart size={24} />

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-bold">
                {totalCount}
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-gray-700 hover:text-gold-500 transition"
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

      </div>

      {/* Section 2: Desktop Main Menu (Hides on Scroll Down) */}
      <div
        className={`hidden md:block border-t border-gray-100 transition-all duration-300 ease-in-out origin-top overflow-hidden ${showMenu ? "max-h-12 opacity-100" : "max-h-0 opacity-0 pointer-events-none border-t-0"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-center gap-10 text-sm font-semibold text-gray-600">

          <Link
            href="/products"
            className="hover:text-gold-500 transition duration-200"
          >
            Products
          </Link>

          <Link
            href="/#TopCategories"
            className="hover:text-gold-500 transition duration-200"
          >
            Top Categories
          </Link>

          <Link
            href="/blogs"
            className="hover:text-gold-500 transition duration-200"
          >
            Blogs
          </Link>

          <Link
            href="/contact us"
            className="hover:text-gold-500 transition duration-200"
          >
            Contact
          </Link>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-inner">

          <div className="px-4 py-4 flex flex-col gap-4 font-medium">

            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-gold-500 transition"
            >
              Products
            </Link>

            <Link
              href="/#TopCategories"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-gold-500 transition"
            >
              Top Categories
            </Link>

            <Link
              href="/blogs"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-gold-500 transition"
            >
              Blogs
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-gold-500 transition"
            >
              Contact
            </Link>

            {loggedIn ? (
              <>
                <Link
                  href="/my-orders"
                  onClick={() => setOpen(false)}
                  className="text-gray-700"
                >
                  My Orders
                </Link>

                <button
                  onClick={() => {
                    localStorage.removeItem("userLoggedIn");
                    localStorage.removeItem("userMobile");

                    setLoggedIn(false);
                    setOpen(false);

                    router.push("/");
                  }}
                  className="text-left text-red-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-gray-700 hover:text-gold-500 transition"
              >
                Sign In
              </Link>
            )}

          </div>

        </div>
      )}

    </nav>
  );
}