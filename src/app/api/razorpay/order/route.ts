import { NextResponse } from "next/server";
import { priceCart } from "@/lib/pricing";
import { razorpayClient, razorpayConfigured, RAZORPAY_KEY_ID } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

// Create a Razorpay order. The amount is computed on the SERVER from the
// catalog — the browser only sends product ids + quantities.
export async function POST(req: Request) {
  try {
    if (!razorpayConfigured()) {
      const id = RAZORPAY_KEY_ID;
      return NextResponse.json(
        {
          error: "Online payment is not configured. Please use Cash on Delivery.",
          // Diagnostic (safe — no secret values leaked): shows what the SERVER sees.
          detail: {
            keyId: id ? "present" : "MISSING",
            keyIdLen: id.length,
            keyIdPrefix: id ? id.slice(0, 8) : "",
            keySecret: (process.env.RAZORPAY_KEY_SECRET || "") ? "present" : "MISSING",
            // Names of every env var that mentions RAZORPAY (names are not secret).
            // Reveals typos / wrong var name / missing var on Vercel.
            razorpayVars: Object.keys(process.env).filter((k) => /RAZORPAY/i.test(k)),
          },
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { items, subtotal, shipping, total } = await priceCart(body?.items ?? [], String(body?.pincode ?? ""));

    if (items.length === 0 || total <= 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const order = await razorpayClient().orders.create({
      amount: Math.round(total * 100), // paise
      currency: "INR",
      receipt: `SHA_${Date.now()}`,
      notes: { subtotal: String(subtotal), shipping: String(shipping) },
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: RAZORPAY_KEY_ID, // publishable key for the checkout widget
      total,
    });
  } catch (err: any) {
    console.error("razorpay order create failed:", err);
    return NextResponse.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 }
    );
  }
}
