import Link from "next/link";
import type { Metadata } from "next";
import StoreLayout from "@/components/layout/StoreLayout";
import { FREE_SHIPPING_ABOVE, COD_MIN_ORDER, SUPPORT_EMAIL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy — Shanya",
  description:
    "Shanya shipping & delivery policy — free shipping, delivery timelines, Cash on Delivery, order tracking and Pan-India delivery.",
};

export default function ShippingPolicyPage() {
  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <span className="cur">Shipping &amp; Delivery Policy</span>
        </div>
        <h1 className="page-h1">Shipping &amp; Delivery Policy</h1>

        <div className="policy">
          <p className="updated">Last updated: July 2026</p>

          <p>
            At <strong>Shanya</strong> (a brand of DAG Enterprises), we want your
            order to reach you quickly, safely and beautifully packed. This policy explains
            how we process, ship and deliver your orders across India.
          </p>

          <h2>1. Shipping Charges</h2>
          <div className="box">
            <b>FREE shipping</b> on all orders of <b>₹{FREE_SHIPPING_ABOVE} and above.</b>
            <br />
            For orders below ₹{FREE_SHIPPING_ABOVE}, a flat shipping charge of <b>₹99</b> applies.
          </div>
          <p>
            The exact shipping charge (if any) is always shown at checkout before you pay —
            there are no hidden fees.
          </p>

          <h2>2. Delivery Timeline</h2>
          <p>
            We deliver <strong>Pan India in 1–5 business days</strong> from the date of dispatch.
            Delivery time may vary slightly based on your location:
          </p>
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Estimated Delivery</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Metro cities (Delhi, Mumbai, Bangalore, etc.)</td>
                <td>1–3 business days</td>
              </tr>
              <tr>
                <td>Other cities &amp; towns</td>
                <td>3–5 business days</td>
              </tr>
              <tr>
                <td>Remote areas (North-East, J&amp;K, Islands)</td>
                <td>5–7 business days</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Order Processing</h2>
          <p>
            Orders are processed and dispatched within <strong>1–2 business days</strong> of
            being placed. Orders placed on Sundays or public holidays are processed on the
            next working day.
          </p>

          <h2>4. Cash on Delivery (COD)</h2>
          <p>
            Cash on Delivery is available on orders of <strong>₹{COD_MIN_ORDER} and above</strong>.
            For orders below ₹{COD_MIN_ORDER}, please use our secure online payment options
            (UPI, Cards, Net Banking or Wallets). We also accept prepaid orders on all values.
          </p>

          <h2>5. Order Tracking</h2>
          <p>
            Once your order is dispatched, you will receive a confirmation with your order
            number. You can check your order status anytime on our{" "}
            <Link href="/track-order">Track Order</Link> page using your order number and
            registered phone number, or reach us on WhatsApp for updates.
          </p>

          <h2>6. Delivery Guidelines</h2>
          <ul>
            <li>Please ensure your shipping address and phone number are complete and correct.</li>
            <li>Our courier partner may attempt delivery 2–3 times before returning the parcel.</li>
            <li>Someone should be available at the address to receive the order.</li>
            <li>For COD orders, please keep the exact amount ready at the time of delivery.</li>
          </ul>

          <h2>7. Delays</h2>
          <p>
            While we aim to deliver within the estimated timeline, delays may occasionally
            occur due to weather, festivals, courier issues or other circumstances beyond our
            control. We appreciate your patience and will always keep you informed.
          </p>

          <h2>8. Need Help?</h2>
          <p>
            For any shipping or delivery queries, reach out to us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or via WhatsApp. We&apos;re
            happy to help!
          </p>
          <p style={{ color: "var(--black)", marginTop: 24 }}>
            <strong>Shanya</strong> · DAG Enterprises
            <br />
            Farrukh Nagar - Panchgaon Rd, Fazilpur Badli, Gurugram, Haryana 122506
          </p>
        </div>
      </main>
    </StoreLayout>
  );
}
