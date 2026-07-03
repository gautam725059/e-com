"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HERO_SLIDES } from "@/lib/data";

export default function HeroSection() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero">
      {HERO_SLIDES.map((src, idx) => (
        <img
          key={idx}
          className={`hero-bg${idx === i ? " on" : ""}`}
          src={src}
          alt=""
          aria-hidden={idx !== i}
        />
      ))}

      <div className="hero-content">
        <p className="hero-pre">Hair Accessories for Every Look</p>
        <h1 className="hero-h1">
          Style Your <em>Story</em>
        </h1>
        <p className="hero-sub">Premium Hair Accessories Starting ₹49</p>
        <div className="hero-btns">
          <Link href="/products">
            <button className="btn-gold">
              Shop Now <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        <div className="hero-dots">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              className={`hero-dot${idx === i ? " on" : ""}`}
              onClick={() => setI(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
