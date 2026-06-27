import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { HERO_IMAGE } from "@/lib/data";

export default function HeroSection() {
  return (
    <section className="hero">
      <img className="hero-bg" src={HERO_IMAGE} alt="Shanya hero" />
      <div className="hero-content">
        <div className="hero-tag">
          <Sparkles size={12} />
          New Season Collection
        </div>
        <p className="hero-pre">Make your home beautiful</p>
        <h1 className="hero-h1">
          Curated for
          <br />
          <em>daily life</em>
        </h1>
        <p className="hero-sub">
          Premium hair accessories, home essentials &amp; kitchen tools —
          thoughtfully selected for the modern Indian home.
        </p>
        <div className="hero-btns">
          <Link href="/products">
            <button className="btn-gold">
              Shop Now <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="#TopCategories">
            <button className="btn-wline">Explore Categories</button>
          </Link>
        </div>
        <div className="hero-stats">
          <div>
            <div className="hs-v">100K+</div>
            <div className="hs-l">Happy Customers</div>
          </div>
          <div>
            <div className="hs-v">Free</div>
            <div className="hs-l">Shipping ₹1000+</div>
          </div>
          <div>
            <div className="hs-v">30 Days</div>
            <div className="hs-l">Easy Returns</div>
          </div>
        </div>
      </div>
      <div className="hero-sale">
        <p>Summer Sale — Up to 40% off on selected home essentials</p>
        <Link href="/products">Shop Sale →</Link>
      </div>
    </section>
  );
}
