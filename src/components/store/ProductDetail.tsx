"use client";

import { useState } from "react";
import { Star, ShoppingBag, Heart, Check, Truck, RotateCcw, Lock } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Img from "@/components/ui/Img";
import type { Product } from "@/types";

export default function ProductDetail({ product }: { product: Product }) {
  const { state, dispatch } = useStore();
  const [variant, setVariant] = useState(product.variants[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const wished = state.wishlist.includes(product.id);

  const pct = product.orig
    ? Math.round((1 - product.price / product.orig) * 100)
    : 0;

  const add = () => {
    dispatch({ type: "ADD_TO_CART", product, qty, variant, color });
    setAdded(true);
    dispatch({ type: "TOGGLE_CART" });
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="pd">
      <div className="pd-gal">
        <Img className="pd-gal-main" src={product.img} fallback={product.fallback} alt={product.name} />
        {product.badge && <span className="pd-badge">{product.badge}</span>}
      </div>

      <div className="pd-info">
        <div className="pd-cat">{product.cat}</div>
        <h1 className="pd-name">{product.name}</h1>

        <div className="pd-rate">
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={15} className={i < Math.round(product.rating) ? "" : "dim"} />
            ))}
          </div>
          <span>
            {product.rating} · {product.reviews} reviews
          </span>
        </div>

        <div className="pd-price">
          <span className="pd-now">₹{product.price}</span>
          {product.orig && <span className="pd-was">₹{product.orig}</span>}
          {pct > 0 && <span className="pd-pct">{pct}% OFF</span>}
        </div>

        <p className="pd-desc">{product.desc}</p>

        <div className="opt-lbl">Variant</div>
        <div className="opt-row">
          {product.variants.map((v) => (
            <button key={v} className={`opt${v === variant ? " sel" : ""}`} onClick={() => setVariant(v)}>
              {v}
            </button>
          ))}
        </div>

        <div className="opt-lbl">Color</div>
        <div className="opt-row">
          {product.colors.map((c) => (
            <button key={c} className={`opt${c === color ? " sel" : ""}`} onClick={() => setColor(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="pd-actions">
          <div className="qty-lg">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
              −
            </button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">
              +
            </button>
          </div>
          <button className={`pd-add${added ? " added" : ""}`} onClick={add}>
            {added ? (
              <>
                <Check size={16} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag size={16} /> Add to Cart
              </>
            )}
          </button>
          <button
            className={`pd-wish${wished ? " on" : ""}`}
            onClick={() => dispatch({ type: "TOGGLE_WISHLIST", id: product.id })}
            aria-label="Wishlist"
          >
            <Heart size={20} />
          </button>
        </div>

        <div className="pd-trust">
          <div>
            <Truck size={17} /> Free shipping on orders above ₹999
          </div>
          <div>
            <RotateCcw size={17} /> Easy 30-day returns
          </div>
          <div>
            <Lock size={17} /> Secure payments · COD on orders ₹1499+
          </div>
        </div>
      </div>
    </div>
  );
}
