"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StoreLayout from "@/components/layout/StoreLayout";
import { useStore } from "@/context/StoreContext";

const EMPTY = { customer_name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

export default function CheckoutPage() {
  const { state, dispatch, cartTotal } = useStore();
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = cartTotal >= 1000 ? 0 : 50;
  const total = cartTotal + shipping;

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const items = state.cart.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        qty: i.qty,
        variant: i.variant,
        color: i.color,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(
          (data.error || "Could not place your order.") +
            (data.detail ? ` — ${data.detail}` : "")
        );
        setLoading(false);
        return;
      }

      dispatch({ type: "CLEAR_CART" });
      router.push(`/order-success?order=${encodeURIComponent(data.order_number)}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
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
                <input className="finput" required placeholder="Full Name" value={form.customer_name} onChange={set("customer_name")} />
                <input className="finput" required placeholder="Phone Number" type="tel" value={form.phone} onChange={set("phone")} />
                <input className="finput" placeholder="Email (optional)" type="email" value={form.email} onChange={set("email")} />
                <input className="finput" required placeholder="Address" value={form.address} onChange={set("address")} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <input className="finput" required placeholder="City" value={form.city} onChange={set("city")} />
                  <input className="finput" required placeholder="State" value={form.state} onChange={set("state")} />
                </div>
                <input className="finput" required placeholder="Pincode" value={form.pincode} onChange={set("pincode")} />
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

              {error && (
                <p style={{ color: "#e84040", fontSize: 12.5, marginTop: 12 }}>{error}</p>
              )}

              <button type="submit" className="drawer-btn" style={{ marginTop: 14 }} disabled={loading}>
                {loading ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </form>
        )}
      </main>
    </StoreLayout>
  );
}
