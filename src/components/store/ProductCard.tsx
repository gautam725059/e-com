"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import type { Product } from "@/types";

export default function ProductCard({ p }: { p: Product }) {
  const { state, dispatch } = useStore();
  const [src, setSrc] = useState(p.img);
  const [added, setAdded] = useState(false);
  const wished = state.wishlist.includes(p.id);

  const add = () => {
    dispatch({ type: "ADD_TO_CART", product: p, qty: 1, variant: p.variants[0], color: p.colors[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="pc">
      <div className="pc-iw">
        <Link href={`/products/${p.id}`}>
          <img
            className="pc-img"
            src={src}
            alt={p.name}
            loading="lazy"
            onError={() => src !== p.fallback && setSrc(p.fallback)}
          />
        </Link>
        {p.badge && (
          <span className="fc-off" style={{ position: "absolute", top: 10, left: 10 }}>
            {p.badge}
          </span>
        )}
        <div
          className={`pc-wl${wished ? " on" : ""}`}
          onClick={() => dispatch({ type: "TOGGLE_WISHLIST", id: p.id })}
        >
          <Heart size={15} />
        </div>
      </div>
      <div className="pc-body">
        <div className="pc-cat">{p.cat}</div>
        <Link href={`/products/${p.id}`}>
          <div className="pc-name">{p.name}</div>
        </Link>
        <div className="pc-price">
          ₹{p.price}
          {p.orig && (
            <span style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through", marginLeft: 6 }}>
              ₹{p.orig}
            </span>
          )}
        </div>
        <button className={`pc-add${added ? " added" : ""}`} onClick={add}>
          {added ? (
            <>
              <Check size={14} /> Added!
            </>
          ) : (
            <>
              <ShoppingBag size={14} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
