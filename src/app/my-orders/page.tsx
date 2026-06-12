"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const mobile =
        localStorage.getItem("userMobile");

      if (!mobile) {
        setLoading(false);
        return;
      }

      const { data, error } =
        await supabase
          .from("orders")
          .select("*")
          .eq("phone", mobile)
          .order("id", {
            ascending: false,
          });

      if (error) {
        console.log(error);
      }

      setOrders(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="border rounded-lg p-6">
          No Orders Found
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-5"
            >
              <h2 className="font-bold">
                Order #{order.id}
              </h2>

              <p>
                Amount: ₹
                {order.total_amount}
              </p>

              <p>
                Status:
                {" "}
                {order.payment_status}
              </p>

              <p>
                Phone:
                {" "}
                {order.phone}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}