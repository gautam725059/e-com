"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Img from "@/components/ui/Img";
import { PRODUCTS } from "@/lib/data";

export default function SearchModal() {
  const { dispatch } = useStore();
  const [q, setQ] = useState("");
  const close = () => dispatch({ type: "CLOSE_ALL" });

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(t) || p.cat.toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <div className="search-wrap" role="dialog" aria-label="Search" onClick={close}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-in">
          <Search size={20} color="var(--grey)" />
          <input
            autoFocus
            type="text"
            placeholder="Search products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="drawer-x" onClick={close} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {q.trim() && (
          <div className="search-res">
            {results.length === 0 ? (
              <div className="search-empty">No products found for “{q}”.</div>
            ) : (
              results.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="sres" onClick={close}>
                  <Img src={p.img} fallback={p.fallback} alt={p.name} />
                  <div>
                    <div className="sres-ct">{p.cat}</div>
                    <div className="sres-nm">{p.name}</div>
                  </div>
                  <div className="sres-pr">₹{p.price}</div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
