"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useRequireLogin } from "@/hooks/useRequireLogin";
import { CHECKOUT_KEY } from "@/lib/checkout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AddressPage() {
  const { allowed } = useRequireLogin("/checkout");
  const { items, totalPrice } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Prefill from previous data / login details.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(CHECKOUT_KEY);
      if (saved) {
        setForm((f) => ({ ...f, ...JSON.parse(saved) }));
        return;
      }
    } catch {}
    setForm((f) => ({
      ...f,
      customer_name: localStorage.getItem("userName") || "",
      phone: localStorage.getItem("userMobile") || "",
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const continueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(form));
    router.push("/checkout/payment");
  };

  if (!allowed) {
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
          <span className="font-semibold text-navy-700">1. Address</span>
          <span className="text-gray-300">→</span>
          <span className="text-gray-400">2. Payment</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Shipping Address</h1>

        <form onSubmit={continueToPayment} className="grid lg:grid-cols-2 gap-10">
          <div className="border rounded-2xl p-6 space-y-4">
            <input name="customer_name" required value={form.customer_name} placeholder="Full Name" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
            <input name="phone" required value={form.phone} placeholder="Phone Number" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
            <input name="email" type="email" value={form.email} placeholder="Email (optional)" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
            <input name="address" required value={form.address} placeholder="Address" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
            <div className="grid grid-cols-2 gap-4">
              <input name="city" required value={form.city} placeholder="City" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
              <input name="state" required value={form.state} placeholder="State" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
            </div>
            <input name="pincode" required value={form.pincode} placeholder="Pincode" onChange={handleChange} className="w-full border rounded-lg px-4 py-3" />
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
              <span>₹50</span>
            </div>
            <div className="flex justify-between mt-4 font-bold text-xl">
              <span>Total</span>
              <span>₹{totalPrice + 50}</span>
            </div>

            <button type="submit" className="w-full mt-6 bg-navy-700 hover:bg-navy-800 text-white py-3 rounded-lg font-medium">
              Continue to Payment
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
