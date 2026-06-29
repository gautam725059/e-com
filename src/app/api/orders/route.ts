import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/checkout";
import { addOrder, findOrder, type OrderItem } from "@/lib/orderStore";

export const dynamic = "force-dynamic";

function makeOrderNumber() {
  const ts = Date.now().toString().slice(-7);
  const rnd = Math.floor(10 + Math.random() * 89);
  return `SHA${ts}${rnd}`;
}

// Create an order
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const required = ["customer_name", "phone", "address", "city", "state", "pincode"] as const;
    for (const f of required) {
      if (!body?.[f] || String(body[f]).trim() === "") {
        return NextResponse.json({ error: `Please fill in your ${f.replace("_", " ")}.` }, { status: 400 });
      }
    }

    const items: OrderItem[] = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0);
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;
    const order_number = makeOrderNumber();

    await addOrder({
      order_number,
      customer_name: String(body.customer_name).trim(),
      phone: normalizePhone(body.phone),
      email: body.email ? String(body.email).trim() : null,
      address: String(body.address).trim(),
      city: String(body.city).trim(),
      state: String(body.state).trim(),
      pincode: String(body.pincode).trim(),
      items,
      subtotal,
      shipping,
      total,
      payment_method: "cod",
      status: "placed",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ order_number });
  } catch (err: any) {
    console.error("order POST error:", err);
    return NextResponse.json(
      { error: "Could not save your order. Please try again.", detail: err?.message },
      { status: 500 }
    );
  }
}

// Track an order: /api/orders?order=SHA...&phone=98XXXXXXXX
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderNo = url.searchParams.get("order")?.trim();
    const phone = url.searchParams.get("phone")?.trim();

    if (!orderNo || !phone) {
      return NextResponse.json({ error: "Order number and phone are required." }, { status: 400 });
    }

    const order = await findOrder(orderNo);
    if (!order || normalizePhone(order.phone) !== normalizePhone(phone)) {
      return NextResponse.json({ error: "No order found with that number and phone." }, { status: 404 });
    }

    const { phone: _omit, ...safe } = order;
    return NextResponse.json({ order: safe });
  } catch (err) {
    console.error("order GET error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
