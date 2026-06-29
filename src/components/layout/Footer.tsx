import Link from "next/link";
import { MapPin } from "lucide-react";
import BrandLogo from "./BrandLogo";

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
const Twitter = (p: IconProps) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p} aria-hidden>
    <path d="M18.9 2H22l-7 8 8.2 12h-6.4l-5-7.3L6 22H2.9l7.5-8.6L2 2h6.6l4.6 6.7L18.9 2zm-1.1 18h1.7L7.3 4H5.5l12.3 16z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="ft-top">
        <div>
          <div className="ft-logo">
            <BrandLogo footer />
          </div>
          <div className="ft-tagline">Premium Hair Accessories</div>
          <div className="ft-desc">
            Claws, scrunchies, bows, headbands & extensions — affordable luxury
            hair accessories, thoughtfully designed for Indian women & girls.
          </div>
          <div className="ft-socs">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="ft-soc" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="ft-soc" aria-label="Instagram">
              <Instagram />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer" className="ft-soc" aria-label="Twitter">
              <Twitter />
            </a>
          </div>
        </div>

        <div>
          <div className="ft-ct">Shop</div>
          <Link href="/products" className="ft-lk">All Products</Link>
          <Link href="/products" className="ft-lk">New Arrivals</Link>
          <Link href="/products" className="ft-lk">Best Sellers</Link>
          <Link href="/products" className="ft-lk">Sale</Link>
        </div>

        <div>
          <div className="ft-ct">Company</div>
          <Link href="/contact" className="ft-lk">About Us</Link>
          <Link href="/contact" className="ft-lk">Contact Us</Link>
          <Link href="/contact" className="ft-lk">Careers</Link>
          <Link href="/contact" className="ft-lk">Support</Link>
        </div>

        <div>
          <div className="ft-ct">Our Location</div>
          <div className="ft-addr">
            Plot No. 44,
            <br />
            Tejswi Impex Private Limited,
            <br />
            Sector 44, Gurgaon,
            <br />
            Haryana, India
          </div>
          <div className="ft-map">
            <MapPin size={16} />
            <span>Sector 44, Gurgaon</span>
          </div>
        </div>
      </div>

      <div className="ft-bot">
        <div className="ft-copy">© 2026 Shanya. All rights reserved.</div>
        <div className="ft-pols">
          <Link href="/privacy-policy" className="ft-pol">Privacy Policy</Link>
          <Link href="/terms" className="ft-pol">Terms &amp; Conditions</Link>
          <Link href="/shipping-policy" className="ft-pol">Shipping Policy</Link>
        </div>
      </div>
    </footer>
  );
}
