import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { TRENDING } from "@/lib/data";

export default function TrendingProducts() {
  return (
    <section className="sec" style={{ background: "var(--white)" }}>
      <div className="sec-hd">
        <div>
          <div className="sec-ey">Most Loved</div>
          <div className="sec-ti">Trending Products</div>
        </div>
        <Link href="/products" className="see-all">
          View All <ArrowRight size={15} />
        </Link>
      </div>
      <div className="prod-g">
        {TRENDING.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
