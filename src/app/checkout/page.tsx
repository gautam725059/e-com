"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StoreLayout from "@/components/layout/StoreLayout";
import { useStore } from "@/context/StoreContext";
import { ORDERS_ENABLED, FREE_SHIPPING_ABOVE, COD_MIN_ORDER } from "@/lib/data";
import { computeShipping } from "@/lib/shipping";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const EMPTY = { customer_name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

export default function CheckoutPage() {
  const { state, dispatch, cartTotal } = useStore();
  const router = useRouter();
  const [form, setForm] = useState(EMPTY);
  const [method, setMethod] = useState<"cod" | "razorpay">("razorpay");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Shipping = actual courier rate for the customer's pincode zone (free above ₹999)
  const ship = computeShipping(form.pincode, cartTotal);
  const shipping = ship.shipping;
  const total = cartTotal + shipping;

  // COD unlocks only on orders of ₹1499+ (same rule is enforced on the server).
  const codAllowed = cartTotal >= COD_MIN_ORDER;
  const payMethod: "cod" | "razorpay" = codAllowed ? method : "razorpay";

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // Only ids + qty go to the server — it prices the cart itself.
  const cartPayload = () =>
    state.cart.map((i) => ({ id: i.product.id, qty: i.qty, variant: i.variant, color: i.color }));

  // Save the order (COD, or an online payment with its Razorpay proof).
  const saveOrder = async (payment: Record<string, string> = {}) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, items: cartPayload(), payment_method: payMethod, ...payment }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Could not place your order.");
    dispatch({ type: "CLEAR_CART" });
    router.push(`/order-success?order=${encodeURIComponent(data.order_number)}`);
  };

  const payOnline = async () => {
    // 1. Server creates the Razorpay order (amount computed from the catalog).
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartPayload(), pincode: form.pincode }),
    });
    const rzp = await res.json();
    if (!res.ok) throw new Error(rzp.error || "Could not start the payment.");

    if (typeof window === "undefined" || !window.Razorpay) {
      throw new Error("Payment widget failed to load. Please refresh and try again.");
    }

    // 2. Open the Razorpay checkout.
    const checkout = new window.Razorpay({
      key: rzp.key_id,
      amount: rzp.amount,
      currency: rzp.currency,
      name: "Shanya",
      description: "Premium Hair Accessories",
      order_id: rzp.id,
      prefill: { name: form.customer_name, email: form.email, contact: form.phone },
      theme: { color: "#B8963E" },
      // 3. On success the server VERIFIES the signature before saving the order.
      handler: async (r: any) => {
        try {
          await saveOrder({
            razorpay_order_id: r.razorpay_order_id,
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
          });
        } catch (err: any) {
          setError(err.message || "Payment verification failed.");
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setError("Payment cancelled — you have not been charged.");
          setLoading(false);
        },
      },
    });

    checkout.on("payment.failed", (resp: any) => {
      setError(resp?.error?.description || "Payment failed. Please try again.");
      setLoading(false);
    });

    checkout.open();
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ORDERS_ENABLED) {
      setError("🛍️ We're back soon! Orders are temporarily paused — thank you for your patience. 💛");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (payMethod === "razorpay") {
        await payOnline(); // navigation happens inside the success handler
      } else {
        await saveOrder(); // COD
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <Link href="/cart">Cart</Link> / <span className="cur">Checkout</span>
        </div>
        <h1 className="page-h1">Checkout</h1>

        {!ORDERS_ENABLED && (
          <div
            style={{
              background: "var(--gold-lt)",
              border: "1px solid var(--gold-md)",
              color: "var(--gold-dk)",
              padding: "14px 18px",
              marginTop: 16,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            🛍️ We&apos;re back soon! Orders are temporarily paused — thank you for your patience 💛
          </div>
        )}

        {state.cart.length === 0 ? (
          <div className="empty-state">
            <h2>Your cart is empty</h2>
            <p>Add some products before checking out.</p>
            <Link href="/products" className="drawer-btn" style={{ display: "inline-block", width: "auto", padding: "14px 30px" }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <form className="co-grid" style={{ marginTop: 20 }} onSubmit={placeOrder}>
            <div>
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
              </div>

              <div className="co-card" style={{ marginTop: 16 }}>
                <h3>Payment Method</h3>
                <label className={`pay-opt${payMethod === "razorpay" ? " sel" : ""}`}>
                  <input
                    type="radio"
                    name="pay"
                    checked={payMethod === "razorpay"}
                    onChange={() => setMethod("razorpay")}
                  />
                  <span>
                    <b>Pay Online</b>
                    <em>UPI · Cards · Netbanking · Wallets — secured by Razorpay</em>
                  </span>
                </label>

                <label className={`pay-opt${payMethod === "cod" ? " sel" : ""}${!codAllowed ? " off" : ""}`}>
                  <input
                    type="radio"
                    name="pay"
                    disabled={!codAllowed}
                    checked={payMethod === "cod"}
                    onChange={() => setMethod("cod")}
                  />
                  <span>
                    <b>Cash on Delivery</b>
                    {codAllowed ? (
                      <em>Pay in cash when your order arrives</em>
                    ) : (
                      <em>
                        🔒 Available on orders of ₹{COD_MIN_ORDER}+ — add ₹{COD_MIN_ORDER - cartTotal} more to unlock
                      </em>
                    )}
                  </span>
                </label>
              </div>
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
                <span>
                  Shipping
                  {ship.zone && !ship.free && (
                    <em style={{ display: "block", fontStyle: "normal", fontSize: 11, color: "var(--grey)" }}>
                      {ship.zone.label}
                    </em>
                  )}
                </span>
                <span>
                  {ship.free ? (
                    <b style={{ color: "#16a34a" }}>Free</b>
                  ) : ship.known ? (
                    `₹${shipping}`
                  ) : (
                    <em style={{ fontStyle: "normal", fontSize: 12, color: "var(--grey)" }}>Enter pincode</em>
                  )}
                </span>
              </div>
              <div className="co-sum-row total">
                <span>Total</span>
                <b>₹{total}</b>
              </div>

              {!ship.free && (
                <p style={{ fontSize: 11, color: "var(--grey)", marginTop: 6 }}>
                  Add ₹{FREE_SHIPPING_ABOVE - cartTotal} more for <b>free shipping</b>
                </p>
              )}

              {error && <p style={{ color: "#e84040", fontSize: 12.5, marginTop: 12 }}>{error}</p>}

              <button type="submit" className="drawer-btn" style={{ marginTop: 14 }} disabled={loading}>
                {!ORDERS_ENABLED
                  ? "We're Back Soon 🛍️"
                  : loading
                  ? "Processing…"
                  : payMethod === "razorpay"
                  ? `Pay ₹${total} Securely`
                  : "Place COD Order"}
              </button>

              <p style={{ fontSize: 11, color: "var(--grey)", marginTop: 10, textAlign: "center" }}>
                🔒 100% secure payments · Free shipping above ₹{FREE_SHIPPING_ABOVE} · COD on ₹{COD_MIN_ORDER}+
              </p>
            </div>
          </form>
        )}
      </main>
    </StoreLayout>
  );
}
