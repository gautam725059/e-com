"use client";

import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import Img from "@/components/ui/Img";

export default function CartDrawer() {
  const { state, dispatch, cartTotal, cartCount } = useStore();
  const close = () => dispatch({ type: "CLOSE_ALL" });

  return (
    <aside className="drawer" role="dialog" aria-label="Shopping cart">
      <div className="drawer-hd">
        <h3>Your Cart ({cartCount})</h3>
        <button className="drawer-x" onClick={close} aria-label="Close">
          <X size={22} />
        </button>
      </div>

      <div className="drawer-body">
        {state.cart.length === 0 ? (
          <div className="drawer-empty">Your cart is empty.</div>
        ) : (
          state.cart.map(({ product, qty, variant, color }) => (
            <div className="cline" key={product.id}>
              <Img className="cline-img" src={product.img} fallback={product.fallback} alt={product.name} />
              <div className="cline-main">
                <div className="cline-name">{product.name}</div>
                <div className="cline-meta">
                  {variant} · {color}
                </div>
                <div className="cline-bottom">
                  <div className="qty">
                    <button onClick={() => dispatch({ type: "UPDATE_QTY", id: product.id, delta: -1 })} aria-label="Decrease">
                      <Minus size={13} />
                    </button>
                    <span>{qty}</span>
                    <button onClick={() => dispatch({ type: "UPDATE_QTY", id: product.id, delta: 1 })} aria-label="Increase">
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="cline-price">₹{product.price * qty}</div>
                </div>
                <button className="cline-rm" onClick={() => dispatch({ type: "REMOVE_FROM_CART", id: product.id })}>
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {state.cart.length > 0 && (
        <div className="drawer-ft">
          <div className="drawer-sub">
            <span>Subtotal</span>
            <b>₹{cartTotal}</b>
          </div>
          <Link href="/checkout" className="drawer-btn" onClick={close}>
            Checkout
          </Link>
          <Link href="/cart" className="drawer-btn outline" onClick={close}>
            View Full Cart
          </Link>
        </div>
      )}
    </aside>
  );
}
