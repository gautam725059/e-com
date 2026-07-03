"use client";

import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto-advance the mobile slider every 2s (only when it's actually a
  // horizontal slider — i.e. the container overflows, which is the mobile view).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (el.scrollWidth <= el.clientWidth + 4) return; // desktop grid, no scroll
      const first = el.querySelector(".tc") as HTMLElement | null;
      const step = first ? first.offsetWidth + 12 : el.clientWidth;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="sec" style={{ background: "var(--offwhite)" }}>
      <div className="sec-hd">
        <div>
          <div className="sec-ey">Real Reviews</div>
          <div className="sec-ti">What Customers Say</div>
        </div>
        <div className="rating-row">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} />
          ))}
          <span>4.9 · 1000+ Reviews</span>
        </div>
      </div>

      <div className="testi-g" ref={trackRef}>
        {TESTIMONIALS.map((t) => (
          <div className="tc" key={t.name}>
            <div className="tc-q">&ldquo;</div>
            <div className="tc-stars">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={13} />
              ))}
            </div>
            <div className="tc-text">{t.text}</div>
            <div className="tc-prod">{t.product}</div>
            <div className="tc-auth">
              <div className="tc-av">{t.initials}</div>
              <div>
                <div className="tc-name">{t.name}</div>
                <div className="tc-loc">{t.loc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
