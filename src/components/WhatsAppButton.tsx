"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919818701724?text=Hi%20I%20need%20help%20with%20an%20order"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 inline-flex h-14 items-center gap-3 rounded-full bg-[#25D366] px-4 pr-5 text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1ebe5d] hover:shadow-[0_16px_38px_rgba(37,211,102,0.45)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-white/25">
        <FaWhatsapp size={24} aria-hidden="true" />
      </span>

      <span className="flex flex-col leading-none">
        <span className="text-[11px] font-medium uppercase tracking-wide text-white/80">
          Need help?
        </span>
        <span className="mt-1 whitespace-nowrap text-sm font-semibold">
          Chat With Us
        </span>
      </span>
    </a>
  );
}