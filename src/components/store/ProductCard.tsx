"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import type { Product } from "@/types";

export default function ProductCard({ p }: { p: Product }) {
  const { state, dispatch } = useStore();
  const [src, setSrc] = useState(p.img);
  const wished = state.wishlist.includes(p.id);
  const discount = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;
  const href = `/products/${p.id}`;

  return (
    <div className="pc">
      <div className="pc-iw">
        <Link href={href} aria-label={p.name}>
          <img
            className="pc-img"
            src={src}
            alt={p.name}
            loading="lazy"
            onError={() => src !== p.fallback && setSrc(p.fallback)}
          />
        </Link>

        {(discount > 0 || p.badge) && (
          <span className="fc-off">{discount > 0 ? `${discount}% Off` : p.badge}</span>
        )}

        <button
          className={`pc-wl${wished ? " on" : ""}`}
          aria-label="Add to wishlist"
          onClick={() => dispatch({ type: "TOGGLE_WISHLIST", id: p.id })}
        >
          <Heart size={14} />
        </button>
      </div>

      <Link href={href} className="pc-body">
        <div className="pc-name">{p.name}</div>
        <div className="pc-price">
          ₹{p.price}
          {p.orig && <span className="pc-mrp">₹{p.orig}</span>}
        </div>
      </Link>
    </div>
  );
}
