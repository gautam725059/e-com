import Link from "next/link";
import type { Metadata } from "next";
import StoreLayout from "@/components/layout/StoreLayout";
import { SUPPORT_EMAIL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Returns & Exchange Policy — Shanya",
  description:
    "Shanya returns & exchange policy — easy 7-day returns, exchanges, refund timelines and how to raise a return request.",
};

export default function ReturnsPolicyPage() {
  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <span className="cur">Returns &amp; Exchange</span>
        </div>
        <h1 className="page-h1">Returns &amp; Exchange Policy</h1>

        <div className="policy">
          <p className="updated">Last updated: July 2026</p>

          <p>
            At <strong>Shanya</strong> (a brand of Tejswi Impex Pvt. Ltd.), your satisfaction
            matters to us. If something isn&apos;t right with your order, we&apos;re here to help
            with an easy return or exchange.
          </p>

          <div className="box">
            <b>Easy 7-Day Returns.</b> You can request a return or exchange within{" "}
            <b>7 days</b> of receiving your order.
          </div>

          <h2>1. Return Eligibility</h2>
          <p>To be eligible for a return or exchange, the item must be:</p>
          <ul>
            <li>Unused, unworn and in its <strong>original condition</strong>.</li>
            <li>In the <strong>original packaging</strong> with all tags and labels intact.</li>
            <li>Accompanied by the order number / proof of purchase.</li>
            <li>Requested within <strong>7 days</strong> of delivery.</li>
          </ul>

          <h2>2. Hygiene &amp; Non-Returnable Items</h2>
          <p>
            For hygiene and safety reasons, certain items <strong>cannot be returned or
            exchanged</strong> once opened or used, including:
          </p>
          <ul>
            <li>Hair extensions and ponytails that have been opened or worn.</li>
            <li>Items that show signs of use, damage or wear.</li>
            <li>Products returned without original packaging or tags.</li>
            <li>Free gifts, and items marked &quot;non-returnable&quot; on the product page.</li>
          </ul>

          <h2>3. Damaged, Defective or Wrong Item</h2>
          <p>
            Received a damaged, defective or incorrect product? We&apos;re truly sorry! Please
            report it within <strong>48 hours</strong> of delivery with a clear photo/unboxing
            video, and we&apos;ll arrange a free replacement or full refund — no questions asked.
          </p>

          <h2>4. How to Request a Return / Exchange</h2>
          <ul>
            <li>
              Message us on <strong>WhatsApp</strong> or email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with your{" "}
              <strong>order number</strong> and reason.
            </li>
            <li>Our team will confirm eligibility and share the next steps within 1–2 days.</li>
            <li>
              Depending on your location, we&apos;ll arrange a reverse pickup or ask you to
              self-ship to our address.
            </li>
          </ul>

          <h2>5. Exchanges</h2>
          <p>
            Want a different colour, size or design? We&apos;re happy to exchange eligible items
            (subject to availability). If the new item differs in price, the difference will be
            collected or refunded accordingly.
          </p>

          <h2>6. Refunds</h2>
          <ul>
            <li>
              Once your returned item is received and inspected, your refund is processed within{" "}
              <strong>5–7 business days</strong>.
            </li>
            <li>
              <strong>Prepaid orders</strong> are refunded to your original payment method
              (UPI / card / net banking).
            </li>
            <li>
              <strong>COD orders</strong> are refunded via UPI / bank transfer — we&apos;ll collect
              your details at the time of return.
            </li>
            <li>Shipping charges (if any) are non-refundable, except for damaged/wrong items.</li>
          </ul>

          <h2>7. Cancellations</h2>
          <p>
            Orders can be cancelled before they are dispatched. Once shipped, an order cannot be
            cancelled but can be returned as per this policy after delivery. To cancel, contact us
            as soon as possible with your order number.
          </p>

          <h2>8. Need Help?</h2>
          <p>
            For any return, exchange or refund query, reach out at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or on WhatsApp — we&apos;re
            here to make it easy. 💛
          </p>
          <p style={{ color: "var(--black)", marginTop: 24 }}>
            <strong>Shanya</strong> · Tejswi Impex Pvt. Ltd.
            <br />
            Plot No. 44, Sector 44, Gurgaon, Haryana, India
          </p>
        </div>
      </main>
    </StoreLayout>
  );
}
