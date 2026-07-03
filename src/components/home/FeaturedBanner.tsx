import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedBanner() {
  return (
    <section className="fbanner">
      <img
        className="fbanner-bg"
        src="https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=1600&q=85&fm=webp"
        alt=""
        loading="lazy"
      />
      <div className="fbanner-overlay" />
      <div className="fbanner-content">
        <p className="eyebrow" style={{ color: "var(--gold-md)" }}>Just In</p>
        <h2 className="fbanner-title">New Arrivals</h2>
        <p className="fbanner-text">Fresh styles every week — be the first to flaunt the latest trends.</p>
        <Link href="/products" className="btn-gold" style={{ marginTop: 18 }}>
          Explore Now <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
