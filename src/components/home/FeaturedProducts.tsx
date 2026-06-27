import Link from "next/link";
import Img from "@/components/ui/Img";
import { FEATURED } from "@/lib/data";

export default function FeaturedProducts() {
  return (
    <section className="sec" style={{ background: "var(--offwhite)" }}>
      <div className="sec-hd">
        <div>
          <div className="sec-ey">Special Offers</div>
          <div className="sec-ti">Featured Products</div>
        </div>
        <span
          style={{
            fontSize: "11.5px",
            fontWeight: 600,
            color: "var(--gold-dk)",
            background: "var(--gold-lt)",
            padding: "7px 18px",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            border: "1px solid var(--gold-md)",
          }}
        >
          Up to 50% Off
        </span>
      </div>

      <div className="feat-g">
        {FEATURED.map((p) => (
          <div className="fc" key={p.id}>
            <div className="fc-img">
              <Img src={p.img} fallback={p.fallback} alt={p.name} />
              {p.badge && <span className="fc-off">{p.badge}</span>}
            </div>
            <div className="fc-body">
              <div className="fc-name">{p.name}</div>
              <div className="fc-sub">{p.desc}</div>
              <div className="fc-ft">
                <div>
                  <span className="fc-price">₹{p.price}</span>
                  {p.orig && <span className="fc-orig">₹{p.orig}</span>}
                </div>
                <Link href={`/products/${p.id}`}>
                  <button className="fc-btn">Shop Now</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
