import Link from "next/link";
import type { Metadata } from "next";
import StoreLayout from "@/components/layout/StoreLayout";
import { SUPPORT_EMAIL, WHATSAPP_LINK } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact Us — Shanya",
  description:
    "Get in touch with Shanya (DAG Enterprises) — email, WhatsApp and phone support for orders, returns and any questions.",
};

// Support phone (same number as WhatsApp support).
const PHONE_DISPLAY = "+91 98187 01724";
const PHONE_TEL = "+919818701724";

export default function ContactPage() {
  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <span className="cur">Contact Us</span>
        </div>
        <h1 className="page-h1">Contact Us</h1>

        <div className="policy">
          <p>
            We&apos;d love to hear from you. Whether it&apos;s a question about an order, a return, or
            just some hair-styling advice — the <strong>Shanya</strong> team is here to help.
          </p>

          <h2>Customer Support</h2>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            </li>
            <li>
              <strong>Phone:</strong> <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
            </li>
            <li>
              <strong>WhatsApp:</strong>{" "}
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                Chat with us on WhatsApp
              </a>
            </li>
          </ul>
          <p>
            Support hours: <strong>Monday–Saturday, 10:00 AM – 6:00 PM IST</strong>. We usually reply
            within one business day.
          </p>

          <h2>Order &amp; Returns Help</h2>
          <p>
            For anything about an existing order, please keep your <strong>order number</strong>{" "}
            (from your confirmation) handy. You can also{" "}
            <Link href="/track-order">track your order</Link> here, and read our{" "}
            <Link href="/shipping-policy">Shipping Policy</Link> and{" "}
            <Link href="/returns">Returns &amp; Refund Policy</Link>.
          </p>

          <h2>Registered Business</h2>
          <p style={{ color: "var(--black)" }}>
            <strong>Shanya</strong> · DAG Enterprises
            <br />
            Plot No. 44, Sector 44, Gurgaon, Haryana, India
          </p>
        </div>
      </main>
    </StoreLayout>
  );
}
