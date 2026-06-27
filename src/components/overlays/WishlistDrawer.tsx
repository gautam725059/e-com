"use client";

import Link from "next/link";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Img from "@/components/ui/Img";
import { PRODUCTS } from "@/lib/data";

export default function WishlistDrawer() {
  const { state, dispatch } = useStore();
  const close = () => dispatch({ type: "CLOSE_ALL" });
  const items = PRODUCTS.filter((p) => state.wishlist.includes(p.id));

  return (
    <aside className="drawer" role="dialog" aria-label="Wishlist">
      <div className="drawer-hd">
        <h3>Wishlist ({items.length})</h3>
        <button className="drawer-x" onClick={close} aria-label="Close">
          <X size={22} />
        </button>
      </div>

      <div className="drawer-body">
        {items.length === 0 ? (
          <div className="drawer-empty">Your wishlist is empty.</div>
        ) : (
          items.map((p) => (
            <div className="cline" key={p.id}>
              <Img className="cline-img" src={p.img} fallback={p.fallback} alt={p.name} />
              <div className="cline-main">
                <Link href={`/products/${p.id}`} onClick={close} className="cline-name">
                  {p.name}
                </Link>
                <div className="cline-meta">{p.cat}</div>
                <div className="cline-bottom">
                  <button
                    className="cline-rm"
                    style={{ margin: 0, color: "var(--black)" }}
                    onClick={() =>
                      dispatch({ type: "ADD_TO_CART", product: p, qty: 1, variant: p.variants[0], color: p.colors[0] })
                    }
                  >
                    <ShoppingBag size={13} /> Add to Cart
                  </button>
                  <div className="cline-price">₹{p.price}</div>
                </div>
                <button className="cline-rm" onClick={() => dispatch({ type: "TOGGLE_WISHLIST", id: p.id })}>
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
