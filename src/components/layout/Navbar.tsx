"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import BrandLogo from "./BrandLogo";

const LINKS = [
  { label: "Products", href: "/products" },
  { label: "Top Categories", href: "/#TopCategories" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { dispatch, cartCount, wishlistCount } = useStore();
  const [menu, setMenu] = useState(false);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="logo" aria-label="Shanya home">
          <BrandLogo />
        </Link>

        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="nl">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-r">
          <button className="nav-ic" aria-label="Search" onClick={() => dispatch({ type: "TOGGLE_SEARCH" })}>
            <Search size={20} />
          </button>
          <button className="nav-ic" aria-label="Wishlist" onClick={() => dispatch({ type: "TOGGLE_WISHLIST_MODAL" })}>
            <Heart size={20} />
            {wishlistCount > 0 && <span className="cdot">{wishlistCount}</span>}
          </button>
          <button className="nav-ic" aria-label="Cart" onClick={() => dispatch({ type: "TOGGLE_CART" })}>
            <ShoppingBag size={20} />
            {cartCount > 0 && <span className="cdot">{cartCount}</span>}
          </button>
          <button className="nav-ic nav-burger" aria-label="Menu" onClick={() => setMenu((v) => !v)}>
            {menu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menu ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.label} href={l.href} onClick={() => setMenu(false)}>
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}
