import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
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

      <div className="testi-g">
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
