import Link from "next/link";
import type { Metadata } from "next";
import StoreLayout from "@/components/layout/StoreLayout";
import { SUPPORT_EMAIL, FREE_SHIPPING_ABOVE, COD_MIN_ORDER } from "@/lib/data";

export const metadata: Metadata = {
  title: "Terms & Conditions — Shanya",
  description: "The terms & conditions governing your use of Shanya (DAG Enterprises) and shanya.in.",
};

export default function TermsPage() {
  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <span className="cur">Terms &amp; Conditions</span>
        </div>
        <h1 className="page-h1">Terms &amp; Conditions</h1>

        <div className="policy">
          <p className="updated">Last updated: July 2026</p>

          <p>
            Welcome to <strong>Shanya</strong>, a brand of DAG Enterprises. By accessing or
            purchasing from shanya.in, you agree to the following terms. Please read them carefully.
          </p>

          <h2>1. General</h2>
          <p>
            These terms govern your use of our website and the purchase of products from us. We may
            update these terms at any time; continued use of the site means you accept the latest
            version.
          </p>

          <h2>2. Products &amp; Pricing</h2>
          <ul>
            <li>
              All prices are listed in <strong>Indian Rupees (₹)</strong> and are inclusive of
              applicable taxes unless stated otherwise.
            </li>
            <li>
              Product colours may vary slightly from the images due to screen and lighting
              differences.
            </li>
            <li>
              We reserve the right to correct pricing errors, and to change prices, offers or
              product availability without prior notice.
            </li>
          </ul>

          <h2>3. Orders &amp; Payment</h2>
          <ul>
            <li>
              Placing an order is an offer to buy; we reserve the right to accept or cancel any
              order (for example, due to stock or suspected fraud).
            </li>
            <li>
              Payments are accepted via UPI, cards, net banking and wallets through Razorpay, or
              via <strong>Cash on Delivery on orders of ₹{COD_MIN_ORDER} and above</strong>.
            </li>
            <li>
              <strong>Free shipping</strong> applies on orders of ₹{FREE_SHIPPING_ABOVE} and above;
              a flat shipping fee applies below that.
            </li>
          </ul>

          <h2>4. Shipping, Returns &amp; Refunds</h2>
          <p>
            Delivery, returns, exchanges and refunds are governed by our{" "}
            <Link href="/shipping-policy">Shipping &amp; Delivery Policy</Link> and{" "}
            <Link href="/returns">Returns &amp; Exchange Policy</Link>, which form part of these
            terms.
          </p>

          <h2>5. Use of the Website</h2>
          <ul>
            <li>You agree to provide accurate information and to use the site lawfully.</li>
            <li>
              You may not misuse the site — including fraudulent orders, spamming, scraping,
              hacking, or any activity that disrupts our service.
            </li>
            <li>We may suspend or refuse service to anyone violating these terms.</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            All content on this site — the &quot;Shanya&quot; name, logo, product images, text and
            design — is the property of DAG Enterprises and may not be copied or used
            without our written permission.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            Our products are sold &quot;as is&quot;. To the extent permitted by law, Shanya /
            DAG Enterprises is not liable for any indirect or incidental damages arising
            from the use of our products or website. Our maximum liability is limited to the value
            of the product purchased.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes are subject to the
            exclusive jurisdiction of the courts of <strong>Gurgaon, Haryana</strong>.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            Questions about these terms? Email{" "}
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
