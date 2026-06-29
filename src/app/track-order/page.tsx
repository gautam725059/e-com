"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Package, CheckCircle2, Truck, Home } from "lucide-react";
import StoreLayout from "@/components/layout/StoreLayout";

type TrackedOrder = {
  order_number: string;
  customer_name: string;
  city: string;
  items: { id: number; name: string; price: number; qty: number; variant?: string; color?: string }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
};

const STEPS = [
  { key: "placed", label: "Placed", Icon: Package },
  { key: "confirmed", label: "Confirmed", Icon: CheckCircle2 },
  { key: "shipped", label: "Shipped", Icon: Truck },
  { key: "delivered", label: "Delivered", Icon: Home },
];

export default function TrackOrderPage() {
  const [orderNo, setOrderNo] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  // Prefill order number from ?order= (e.g. coming from the success page).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("order");
    if (q) setOrderNo(q);
  }, []);

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders?order=${encodeURIComponent(orderNo.trim())}&phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not find that order.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statusIndex = order
    ? Math.max(0, STEPS.findIndex((s) => s.key === order.status))
    : -1;
  const cancelled = order?.status === "cancelled";

  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <span className="cur">Track Order</span>
        </div>
        <h1 className="page-h1">Track Your Order</h1>
        <p className="page-meta">Enter your order number and phone to see the status.</p>

        <form className="track-form" onSubmit={track}>
          <input
            className="finput"
            placeholder="Order Number (e.g. SHA1234567 89)"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            required
          />
          <input
            className="finput"
            placeholder="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit" className="drawer-btn" disabled={loading}>
            <Search size={15} style={{ marginRight: 6 }} />
            {loading ? "Searching…" : "Track Order"}
          </button>
          {error && <p style={{ color: "#e84040", fontSize: 13, marginTop: 4 }}>{error}</p>}
        </form>

        {order && (
          <div className="track-result">
            <div className="track-head">
              <div>
                <div className="sec-ey">Order</div>
                <div className="track-no">{order.order_number}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="sec-ey">Status</div>
                <div className="track-status">{cancelled ? "Cancelled" : order.status}</div>
              </div>
            </div>

            {!cancelled && (
              <div className="tl">
                {STEPS.map((s, i) => {
                  const Icon = s.Icon;
                  return (
                    <div key={s.key} className={`tl-step${i <= statusIndex ? " done" : ""}`}>
                      <div className="tl-dot">
                        <Icon size={15} />
                      </div>
                      <div className="tl-lbl">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="track-items">
              {order.items.map((it) => (
                <div className="co-line" key={it.id}>
                  <span>
                    {it.name} {it.variant ? `(${it.variant})` : ""} × {it.qty}
                  </span>
                  <span>₹{it.price * it.qty}</span>
                </div>
              ))}
              <div className="co-sum-row" style={{ marginTop: 12 }}>
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="co-sum-row">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : `₹${order.shipping}`}</span>
              </div>
              <div className="co-sum-row total">
                <span>Total · {order.payment_method.toUpperCase()}</span>
                <b>₹{order.total}</b>
              </div>
            </div>
          </div>
        )}
      </main>
    </StoreLayout>
  );
}
