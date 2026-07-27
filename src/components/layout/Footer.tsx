import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { INSTAGRAM_FEED, INSTAGRAM_URL, SUPPORT_EMAIL, WHATSAPP_LINK } from "@/lib/data";

// lucide dropped brand icons — inline SVG glyphs.
type IconProps = { className?: string };
const Facebook = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p} aria-hidden>
    <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.3v-2.9h2.3V9.3c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .08 2 .08v2.2h-1.1c-1.1 0-1.4.66-1.4 1.3v1.6h2.4l-.4 2.9h-2v7A10 10 0 0022 12z" />
  </svg>
);
const Instagram = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p} aria-hidden>
    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2A4.8 4.8 0 1016.8 13 4.8 4.8 0 0012 8.2zm6.4-3.4a1.2 1.2 0 11-1.2 1.2 1.2 1.2 0 011.2-1.2z" />
  </svg>
);
const Youtube = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p} aria-hidden>
    <path d="M21.6 7.2a2.7 2.7 0 00-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 002.4 7.2 28 28 0 002 12a28 28 0 00.4 4.8 2.7 2.7 0 001.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 001.9-1.9A28 28 0 0022 12a28 28 0 00-.4-4.8zM10 15V9l5 3-5 3z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      {/* Instagram feed */}
      <div className="ig-band">
        <div className="page-width">
          <div className="ig-head">
            <div>
              <div className="ft-ct" style={{ marginBottom: 4 }}>@shanya.in</div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,.55)" }}>Follow us on Instagram for daily hair inspo</span>
            </div>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="ig-follow">
              <Instagram /> Follow
            </a>
          </div>
          <div className="ig-grid">
            {INSTAGRAM_FEED.map((src, i) => (
              <a key={i} href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="ig-cell">
                <img src={src} alt="Shanya on Instagram" loading="lazy" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="page-width">
        <div className="ft-top">
          <div>
            <div className="ft-logo">
              <BrandLogo footer />
            </div>
            <div className="ft-tagline">Premium Hair Accessories</div>
            <div className="ft-desc">
              Affordable luxury hair accessories — claws, scrunchies, bows,
              headbands & extensions, thoughtfully designed for Indian women & girls.
            </div>
            <div className="ft-socs">
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="ft-soc" aria-label="Instagram"><Instagram /></a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="ft-soc" aria-label="Facebook"><Facebook /></a>
              <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="ft-soc" aria-label="YouTube"><Youtube /></a>
            </div>
          </div>

          <div>
            <div className="ft-ct">Quick Links</div>
            <Link href="/products" className="ft-lk">Shop All</Link>
            <Link href="/products" className="ft-lk">New Arrivals</Link>
            <Link href="/products" className="ft-lk">Bestsellers</Link>
            <Link href="/track-order" className="ft-lk">Track Order</Link>
          </div>

          <div>
            <div className="ft-ct">Customer Support</div>
            <Link href="/contact" className="ft-lk">Contact Us</Link>
            <Link href="/#faq" className="ft-lk">FAQs</Link>
            <Link href="/shipping-policy" className="ft-lk">Shipping &amp; Delivery</Link>
            <Link href="/returns" className="ft-lk">Returns &amp; Exchange</Link>
            <Link href="/privacy-policy" className="ft-lk">Privacy Policy</Link>
          </div>

          <div>
            <div className="ft-ct">Get in Touch</div>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="ft-contact"><Mail size={15} /> {SUPPORT_EMAIL}</a>
            <a href="tel:+919818701724" className="ft-contact"><Phone size={15} /> +91 98187 01724</a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="ft-contact"><Phone size={15} /> WhatsApp Support</a>
            <div className="ft-contact" style={{ alignItems: "flex-start" }}>
              <MapPin size={15} style={{ marginTop: 3, flexShrink: 0 }} />
              <span>DAG Enterprises,<br />Farrukh Nagar - Panchgaon Rd, Fazilpur Badli,<br />Gurugram, Haryana 122506</span>
            </div>
          </div>
        </div>

        <div className="ft-bot">
          <div className="ft-copy">© 2026 Shanya · DAG Enterprises. All rights reserved.</div>
          <div className="ft-pols">
            <Link href="/privacy-policy" className="ft-pol">Privacy Policy</Link>
            <Link href="/terms" className="ft-pol">Terms &amp; Conditions</Link>
            <Link href="/shipping-policy" className="ft-pol">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
