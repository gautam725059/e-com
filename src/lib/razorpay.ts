import crypto from "crypto";
import Razorpay from "razorpay";

// Server-only Razorpay helpers. The secret never leaves the server.
//
// key_id is read at RUNTIME, not via `process.env.NEXT_PUBLIC_*` directly.
// Next.js inlines `process.env.NEXT_PUBLIC_X` at BUILD time, so if the value
// changes on Vercel without a cache-less rebuild it can stay stuck as "".
// The client never reads this env — it gets key_id from the /api/razorpay/order
// response — so a plain server var works and is immune to the build-cache trap.
const env = process.env;
export const RAZORPAY_KEY_ID =
  env.RAZORPAY_KEY_ID || env["NEXT_PUBLIC_RAZORPAY_KEY_ID"] || "";
const RAZORPAY_KEY_SECRET = env.RAZORPAY_KEY_SECRET || "";

export const razorpayConfigured = () => Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

export function razorpayClient() {
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
}

/**
 * Verify the payment signature Razorpay sends back to the browser.
 * signature === HMAC_SHA256(`${order_id}|${payment_id}`, key_secret)
 * If this fails, the payment is NOT genuine — never save the order.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!RAZORPAY_KEY_SECRET || !orderId || !paymentId || !signature) return false;
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  // constant-time compare
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
