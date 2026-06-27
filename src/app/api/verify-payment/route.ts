import crypto from "crypto";
import { NextResponse } from "next/server";

// Verifies a Razorpay payment signature server-side so an order can only be
// marked "paid" after Razorpay's HMAC check passes. Never trust the client.
export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { valid: false, error: "Missing payment fields" },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { valid: false, error: "Payment secret not configured" },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid = expectedSignature === razorpay_signature;

    return NextResponse.json({ valid });
  } catch (error) {
    console.error("verify-payment error:", error);
    return NextResponse.json(
      { valid: false, error: "Server error" },
      { status: 500 }
    );
  }
}
