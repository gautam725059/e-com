"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import StoreLayout from "@/components/layout/StoreLayout";
import Img from "@/components/ui/Img";
import { useStore } from "@/context/StoreContext";
import { FREE_SHIPPING_ABOVE, SHIPPING_FEE } from "@/lib/data";

export default function CartPage() {
  const { state, dispatch, cartTotal, cartCount } = useStore();
  const shipping = cartTotal >= FREE_SHIPPING_ABOVE || cartTotal === 0 ? 0 : SHIPPING_FEE;
  const total = cartTotal + shipping;

  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <span className="cur">Cart</span>
        </div>
        <h1 className="page-h1">Your Cart</h1>

        {state.cart.length === 0 ? (
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven&apos;t added anything yet.</p>
            <Link
              href="/products"
              className="drawer-btn"
              style={{ display: "inline-block", width: "auto", padding: "14px 30px" }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="co-grid" style={{ marginTop: 20 }}>
            <div>
              {state.cart.map(({ product, qty, variant, color }) => (
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
              ))}
            </div>

            <div className="co-card">
              <h3>Order Summary</h3>
              <div className="co-sum-row">
                <span>Items ({cartCount})</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="co-sum-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>
              <div className="co-sum-row total">
                <span>Total</span>
                <b>₹{total}</b>
              </div>
              <Link href="/checkout" className="drawer-btn" style={{ marginTop: 14 }}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </main>
    </StoreLayout>
  );
}
