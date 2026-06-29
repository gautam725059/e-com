"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";
import Img from "@/components/ui/Img";
import { DEAL } from "@/lib/data";

export default function DealOfDay() {
  const [t, setT] = useState({ h: "--", m: "--", s: "--" });

  useEffect(() => {
    const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
    const tick = () => {
      const end = new Date();
      end.setHours(23, 59, 59, 0);
      const d = Math.max(0, end.getTime() - Date.now());
      setT({ h: pad(d / 3600000), m: pad((d % 3600000) / 60000), s: pad((d % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const p = DEAL;
  const pct = p.orig ? Math.round((1 - p.price / p.orig) * 100) : 0;

  return (
    <div className="deal-wrap">
      <div className="deal">
        <div className="deal-l">
          <div className="deal-badge">
            <Zap size={13} /> Deal of the Day
          </div>
          <div className="deal-title">{p.name}</div>
          <div className="deal-sub">{p.desc}</div>
          <div className="deal-pr">
            <span className="deal-now">₹{p.price}</span>
            {p.orig && <span className="deal-was">₹{p.orig}</span>}
            <span className="deal-pct">{pct}% OFF</span>
          </div>
          <div className="dt-lbl">Offer Ends In</div>
          <div className="dt-row">
            <div className="dt-box">
              <div className="dt-n">{t.h}</div>
              <div className="dt-u">Hrs</div>
            </div>
            <div className="dt-box">
              <div className="dt-n">{t.m}</div>
              <div className="dt-u">Min</div>
            </div>
            <div className="dt-box">
              <div className="dt-n">{t.s}</div>
              <div className="dt-u">Sec</div>
            </div>
          </div>
          <Link href={`/products/${p.id}`}>
            <button className="btn-gold-sm">
              Grab the Deal <ArrowRight size={16} />
            </button>
          </Link>
        </div>
        <div className="deal-r">
          <Img src={p.img} fallback={p.fallback} alt={p.name} />
        </div>
      </div>
    </div>
  );
}
