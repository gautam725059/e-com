import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { listOrders, setOrderStatus } from "@/lib/orderStore";

export const dynamic = "force-dynamic";

export const ORDER_STATUSES = ["placed", "confirmed", "shipped", "delivered", "cancelled"] as const;

// List all orders (admin only).
export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("admin orders list error:", err);
    return NextResponse.json(
      { error: "Could not load orders.", detail: err?.message }, { status: 500 }
    );
  }
}

// Update an order's status (admin only).
export async function PATCH(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { order_number, status } = body as { order_number?: string; status?: string };

  if (!order_number || !status || !ORDER_STATUSES.includes(status as any)) {
    return NextResponse.json({ error: "Invalid order or status" }, { status: 400 });
  }

  const ok = await setOrderStatus(order_number, status);
  if (!ok) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
