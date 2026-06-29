import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Img from "@/components/ui/Img";
import { CATEGORIES } from "@/lib/data";

export default function CategorySection() {
  return (
    <section className="sec" id="TopCategories" style={{ background: "var(--cream)" }}>
      <div className="sec-hd">
        <div>
          <div className="sec-ey">Browse</div>
          <div className="sec-ti">Top Categories</div>
        </div>
        <Link href="/products" className="see-all">
          View All <ArrowRight size={15} />
        </Link>
      </div>
      <div className="cat-grid">
        {CATEGORIES.map((c) => (
          <Link key={c.name} href={c.href} className="cat-item">
            <Img src={c.img} fallback="/images/clow-clips.avif" alt={c.name} />
            <div className="cat-ov">
              <div className="cat-nm">{c.name}</div>
              <div className="cat-line" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
