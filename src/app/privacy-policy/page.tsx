import Link from "next/link";
import type { Metadata } from "next";
import StoreLayout from "@/components/layout/StoreLayout";
import { SUPPORT_EMAIL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy Policy — Shanya",
  description:
    "How Shanya (DAG Enterprises) collects, uses and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <span className="cur">Privacy Policy</span>
        </div>
        <h1 className="page-h1">Privacy Policy</h1>

        <div className="policy">
          <p className="updated">Last updated: July 2026</p>

          <p>
            This Privacy Policy explains how <strong>Shanya</strong>, a brand of DAG Enterprises (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), collects, uses and
            protects your information when you shop with us at shanya.in. By using our website,
            you agree to this policy.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal details</strong> you provide at checkout — name, phone number,
              email and shipping address.
            </li>
            <li>
              <strong>Order information</strong> — the products you buy, order value and payment
              method.
            </li>
            <li>
              <strong>Technical data</strong> — basic device/browser information and usage
              patterns to improve our site.
            </li>
          </ul>
          <p>
            We <strong>do not store your card, UPI or bank details.</strong> All payments are
            processed securely by our payment partner, Razorpay.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To process, pack, ship and deliver your orders.</li>
            <li>To keep you updated about your order status (via WhatsApp / email / SMS).</li>
            <li>To handle returns, exchanges, refunds and customer support.</li>
            <li>To improve our products, website and shopping experience.</li>
            <li>To send offers and new-arrival updates (only if you opt in).</li>
          </ul>

          <h2>3. Sharing Your Information</h2>
          <p>
            We <strong>never sell your personal data.</strong> We only share the minimum
            information needed with trusted partners to run our business:
          </p>
          <ul>
            <li><strong>Courier partners</strong> — to deliver your order.</li>
            <li><strong>Razorpay</strong> — to securely process payments.</li>
            <li>Where required by law or a valid legal request.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            Your data is stored securely and access is restricted. Our website uses HTTPS
            encryption, and payments are handled on PCI-DSS compliant infrastructure. While no
            system is 100% secure, we take reasonable measures to protect your information.
          </p>

          <h2>5. Cookies</h2>
          <p>
            We use minimal cookies/local storage to remember your cart and wishlist and to keep
            the site working smoothly. You can clear these anytime from your browser settings.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data, and you
            can opt out of marketing messages at any time. Just email us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            Our store is intended for users aged 18 and above (or younger with parental
            supervision). We do not knowingly collect data from children.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. The latest version will always be
            available on this page with the updated date.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            For any privacy-related questions, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
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
