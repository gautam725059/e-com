"use client";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-navy-800 to-navy-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-3xl font-bold text-gold-500">
            Shanya
          </h3>

          <p className="text-gray-400 mt-4 leading-relaxed text-sm">
            Premium kitchen essentials and lifestyle products
            designed to elevate your everyday living experience.
          </p>

          <div className="flex gap-4 mt-5">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.3v-2.9h2.3V9.3c0-2.3 1.4-3.6 3.5-3.6 1 0 2 .08 2 .08v2.2h-1.1c-1.1 0-1.4.66-1.4 1.3v1.6h2.4l-.4 2.9h-2v7A10 10 0 0022 12z" />
              </svg>
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2A4.8 4.8 0 1016.8 13 4.8 4.8 0 0012 8.2zm6.4-3.4a1.2 1.2 0 11-1.2 1.2 1.2 1.2 0 011.2-1.2z" />
              </svg>
            </a>

            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer"
              className="text-gray-400 hover:text-gold-500 transition flex items-center gap-2"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M22 5.8c-.6.3-1.3.5-2 .6a3.6 3.6 0 001.6-2c-.7.4-1.5.7-2.4.8A3.6 3.6 0 0015.5 4c-2 0-3.6 1.6-3.6 3.6 0 .3 0 .6.1.9-3-.2-5.7-1.6-7.5-3.8-.3.6-.4 1.3-.4 2 0 1.3.7 2.6 1.8 3.3-.6 0-1.1-.2-1.6-.4v.1c0 2 1.4 3.6 3.2 4-.3.1-.7.1-1 .1-.2 0-.5 0-.7-.1.5 1.5 1.9 2.6 3.6 2.6A7.3 7.3 0 012 19.5a10.3 10.3 0 005.6 1.6c6.7 0 10.4-5.6 10.4-10.4v-.5c.7-.5 1.3-1.2 1.8-1.9-.6.3-1.2.5-1.9.6z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-semibold text-lg">
            Shop
          </h4>

          <ul className="mt-4 space-y-3 text-gray-400 text-sm">
            <li>
              <a
                href="/products"
                className="hover:text-gold-500 transition"
              >
                All Products
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-gold-500 transition"
              >
                New Arrivals
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-gold-500 transition"
              >
                Best Sellers
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-gold-500 transition"
              >
                Sale
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold text-lg">
            Company
          </h4>

          <ul className="mt-4 space-y-3 text-gray-400 text-sm">
            <li>
              <a
                href="#"
                className="hover:text-gold-500 transition"
              >
                About Us
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-gold-500 transition"
              >
                Contact Us
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-gold-500 transition"
              >
                Careers
              </a>
            </li>

            <li>
              <a
                href="#"
                className="hover:text-gold-500 transition"
              >
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-semibold text-lg mb-3">
            Our Location
          </h4>

          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Plot No. 44,
            <br />
            Tejswi Impex Private Limited,
            <br />
            Sector 44,
            Gurgaon, Haryana,
            <br />
            India
          </p>

          <div className="overflow-hidden rounded-xl border border-navy-700 shadow-lg">
            <iframe
              src="https://maps.google.com/maps?q=28.4534743,77.0709891&z=16&output=embed"
              width="100%"
              height="180"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tejswi Impex Location"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

          <p>
            © 2026 Shanya. All rights reserved.
          </p>

          <div className="flex gap-6 mt-3 md:mt-0">
            <a
              href="/privacy-policy"
              className="hover:text-gold-500 transition"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="hover:text-gold-500 transition"
            >
              Terms & Conditions
            </a>

            <a
              href="/shipping-policy"
              className="hover:text-gold-500 transition"
            >
              Shipping Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}