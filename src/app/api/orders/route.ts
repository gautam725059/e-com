import { NextResponse } from "next/server";
import { normalizePhone } from "@/lib/checkout";
import { addOrder, findOrder } from "@/lib/orderStore";
import { priceCart } from "@/lib/pricing";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { COD_MIN_ORDER } from "@/lib/data";

export const dynamic = "force-dynamic";

function makeOrderNumber() {
  const ts = Date.now().toString().slice(-7);
  const rnd = Math.floor(10 + Math.random() * 89);
  return `SHA${ts}${rnd}`;
}

// Create an order (COD, or an online payment that we verify first).
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = ["customer_name", "phone", "address", "city", "state", "pincode"] as const;
    for (const f of required) {
      if (!body?.[f] || String(body[f]).trim() === "") {
        return NextResponse.json({ error: `Please fill in your ${f.replace("_", " ")}.` }, { status: 400 });
      }
    }

    // Prices/totals computed server-side from the catalog; shipping from the pincode zone.
    const { items, subtotal, shipping, total } = await priceCart(body?.items ?? [], String(body.pincode));
    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const method = body?.payment_method === "razorpay" ? "razorpay" : "cod";
    let payment_status = "pending";
    let payment_id: string | null = null;

    // COD is only allowed above the minimum order value — enforced here so it
    // can't be bypassed from the browser.
    if (method === "cod" && subtotal < COD_MIN_ORDER) {
      return NextResponse.json(
        { error: `Cash on Delivery is available on orders of ₹${COD_MIN_ORDER} and above. Please pay online.` },
        { status: 400 }
      );
    }

    if (method === "razorpay") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
      const ok = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      if (!ok) {
        // Signature mismatch → payment is not genuine. Do NOT save the order.
        return NextResponse.json(
          { error: "Payment could not be verified. You have not been charged — please contact support." },
          { status: 400 }
        );
      }
      payment_status = "paid";
      payment_id = String(razorpay_payment_id);
    }

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
      payment_method: method,
      payment_status,
      payment_id,
      status: "placed",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ order_number, total, payment_status });
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
