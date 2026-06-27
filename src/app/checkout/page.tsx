"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StoreLayout from "@/components/layout/StoreLayout";
import { useStore } from "@/context/StoreContext";

export default function CheckoutPage() {
  const { state, dispatch, cartTotal } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const shipping = cartTotal >= 1000 ? 0 : 50;
  const total = cartTotal + shipping;

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      dispatch({ type: "CLEAR_CART" });
      router.push("/order-success");
    }, 600);
  };

  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <Link href="/cart">Cart</Link> /{" "}
          <span className="cur">Checkout</span>
        </div>
        <h1 className="page-h1">Checkout</h1>

        {state.cart.length === 0 ? (
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p>Add some products before checking out.</p>
            <Link
              href="/products"
              className="drawer-btn"
              style={{ display: "inline-block", width: "auto", padding: "14px 30px" }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <form className="co-grid" style={{ marginTop: 20 }} onSubmit={placeOrder}>
            <div className="co-card">
              <h3>Shipping Details</h3>
              <div style={{ display: "grid", gap: 12 }}>
                <input className="finput" required placeholder="Full Name" />
                <input className="finput" required placeholder="Phone Number" type="tel" />
                <input className="finput" placeholder="Email (optional)" type="email" />
                <input className="finput" required placeholder="Address" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input className="finput" required placeholder="City" />
                  <input className="finput" required placeholder="State" />
                </div>
                <input className="finput" required placeholder="Pincode" />
              </div>
              <p style={{ fontSize: 12, color: "var(--grey)", marginTop: 14 }}>
                Payment: Cash on Delivery (COD)
              </p>
            </div>

            <div className="co-card">
              <h3>Order Summary</h3>
              {state.cart.map((i) => (
                <div className="co-line" key={i.product.id}>
                  <span>
                    {i.product.name} × {i.qty}
                  </span>
                  <span>₹{i.product.price * i.qty}</span>
                </div>
              ))}
              <div className="co-sum-row" style={{ marginTop: 12 }}>
                <span>Subtotal</span>
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
              <button
                type="submit"
                className="drawer-btn"
                style={{ marginTop: 14 }}
                disabled={loading}
              >
                {loading ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </form>
        )}
      </main>
    </StoreLayout>
  );
}
