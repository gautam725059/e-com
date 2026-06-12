"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("razorpay");

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const shippingCharge = 50;
  const finalAmount = totalPrice + shippingCharge;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    try {
      setLoading(true);

      const { data: order, error } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: form.customer_name,
            phone: form.phone,
            email: form.email,
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
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

      await supabase
        .from("order_items")
        .insert(orderItems);

      if (paymentMethod === "cod") {
        router.push("/order-success");
      } else {

        const res = await fetch(
          "/api/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              amount: finalAmount,
            }),
          }
        );

        const razorpayOrder =
          await res.json();

        const options = {
          key: process.env
            .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount:
            razorpayOrder.amount,

          currency:
            razorpayOrder.currency,

          name: "Shanya",

          description:
            "Order Payment",

          order_id:
            razorpayOrder.id,

          prefill: {
            name: form.customer_name,
            email: form.email,
            contact: form.phone,
          },

          theme: {
            color: "#16a34a",
          },

          handler: async (
            response: any
          ) => {

            await supabase
              .from("orders")
              .update({
                payment_status:
                  "paid",

                payment_id:
                  response.razorpay_payment_id,
              })
              .eq("id", order.id);

            router.push(
              "/order-success"
            );
          },
        };

        const paymentObject =
          new window.Razorpay(
            options
          );

        paymentObject.open();
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* Address */}
        <div className="border rounded-2xl p-6">

          <h2 className="text-xl font-semibold mb-5">
            Shipping Address
          </h2>

          <div className="space-y-4">

            <input
              name="customer_name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              name="address"
              placeholder="Address"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              name="state"
              placeholder="State"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

            <input
              name="pincode"
              placeholder="Pincode"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />

          </div>

          {/* Payment Method */}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Payment Method
            </h2>

            <div className="space-y-3">

              <label className="flex items-center gap-3 border rounded-lg p-4">

                <input
                  type="radio"
                  value="razorpay"
                  checked={
                    paymentMethod ===
                    "razorpay"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                Razorpay
              </label>

              <label className="flex items-center gap-3 border rounded-lg p-4">

                <input
                  type="radio"
                  value="cod"
                  checked={
                    paymentMethod === "cod"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                Cash On Delivery
              </label>

            </div>
          </div>
        </div>

        {/* Order Summary */}

        <div className="border rounded-2xl p-6 h-fit">

          <h2 className="text-xl font-semibold mb-5">
            Order Summary
          </h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between mb-3"
            >
              <span>
                {item.title} ×{" "}
                {item.quantity}
              </span>

              <span>
                ₹
                {item.price *
                  item.quantity}
              </span>
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
            <span>
              ₹{finalAmount}
            </span>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-6 bg-navy-700 text-white py-3 rounded-lg"
          >
            {paymentMethod === "cod"
              ? "Place COD Order"
              : "Proceed To Payment"}
          </button>

        </div>

      </div>
    </div>
  );
}