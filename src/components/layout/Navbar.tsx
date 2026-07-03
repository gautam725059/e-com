"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { CATEGORIES } from "@/lib/data";
import BrandLogo from "./BrandLogo";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Collections", href: "/#TopCategories" },
  { label: "New Arrivals", href: "/products" },
  { label: "Sale", href: "/products" },
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
          <Link href="/" className="nl">Home</Link>
          <Link href="/products" className="nl">Shop</Link>

          <div className="nav-dd">
            <button className="nl nav-dd-btn">
              Shop By Category <ChevronDown size={14} />
            </button>
            <div className="nav-dd-menu">
              {CATEGORIES.map((c) => (
                <Link key={c.name} href={c.href}>{c.name}</Link>
              ))}
            </div>
          </div>

          <Link href="/#TopCategories" className="nl">Collections</Link>
          <Link href="/products" className="nl">New Arrivals</Link>
          <Link href="/products" className="nl">Sale</Link>
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
          <Link key={l.label} href={l.href} onClick={() => setMenu(false)}>{l.label}</Link>
        ))}
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--gold)", padding: "10px 0 4px" }}>
          Shop By Category
        </div>
        {CATEGORIES.map((c) => (
          <Link key={c.name} href={c.href} onClick={() => setMenu(false)} style={{ paddingLeft: 8 }}>{c.name}</Link>
        ))}
      </div>
    </>
  );
}
