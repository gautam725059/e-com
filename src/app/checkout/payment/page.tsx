"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { CHECKOUT_KEY, CheckoutAddress } from "@/lib/checkout";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const { allowed } = useRequireLogin("/checkout/payment");
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState<CheckoutAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);

  const shippingCharge = 50;
  const finalAmount = totalPrice + shippingCharge;

  // Pull the address captured in step 1. If missing, send the user back.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(CHECKOUT_KEY);
      if (saved) {
        setAddress(JSON.parse(saved));
        return;
      }
    } catch {}
    router.replace("/checkout");
  }, [router]);

  const placeOrder = async () => {
    if (!address) return;
    try {
      setLoading(true);

      const { data: order, error } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: address.customer_name,
            phone: address.phone,
            email: address.email,
            address: address.address,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            total_amount: finalAmount,
            payment_method: paymentMethod,
            payment_status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.title,
        price: item.price,
        quantity: item.quantity,
      }));

      await supabase.from("order_items").insert(orderItems);

      const finish = (id: number) => {
        clearCart();
        sessionStorage.removeItem(CHECKOUT_KEY);
        router.push(`/order-success?order=${id}`);
      };

      if (paymentMethod === "cod") {
        finish(order.id);
        return;
      }

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const razorpayOrder = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Shanya",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        prefill: {
          name: address.customer_name,
          email: address.email,
          contact: address.phone,
        },
        theme: { color: "#13294b" },
        handler: async (response: any) => {
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              payment_id: response.razorpay_payment_id,
            })
            .eq("id", order.id);
          finish(order.id);
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!allowed || !address) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-24 text-center text-gray-500">Loading…</main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
          <button onClick={() => router.push("/products")} className="bg-navy-700 text-white px-6 py-3 rounded-lg">
            Browse Products
          </button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-3 text-sm mb-8">
          <button onClick={() => router.push("/checkout")} className="text-gray-400 hover:text-navy-700">
            1. Address
          </button>
          <span className="text-gray-300">→</span>
          <span className="font-semibold text-navy-700">2. Payment</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Payment</h1>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Deliver to + payment method */}
          <div className="space-y-6">
            <div className="border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Deliver to</h2>
                <button onClick={() => router.push("/checkout")} className="text-sm text-gold-600 hover:underline">
                  Edit
                </button>
              </div>
              <p className="font-medium">{address.customer_name} · {address.phone}</p>
              <p className="text-gray-600 text-sm mt-1">
                {address.address}, {address.city}, {address.state} - {address.pincode}
              </p>
            </div>

            <div className="border rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">
                  <input type="radio" value="razorpay" checked={paymentMethod === "razorpay"} onChange={(e) => setPaymentMethod(e.target.value)} />
                  Razorpay (UPI / Card / Netbanking)
                </label>
                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">
                  <input type="radio" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} />
                  Cash On Delivery
                </label>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="border rounded-2xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-5">Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-3">
                <span>{item.title} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Shipping</span>
              <span>₹{shippingCharge}</span>
            </div>
            <div className="flex justify-between mt-4 font-bold text-xl">
              <span>Total</span>
              <span>₹{finalAmount}</span>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full mt-6 bg-navy-700 hover:bg-navy-800 disabled:opacity-50 text-white py-3 rounded-lg font-medium"
            >
              {loading ? "Processing…" : paymentMethod === "cod" ? "Place COD Order" : "Pay Now"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
