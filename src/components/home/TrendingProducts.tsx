import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import type { Product } from "@/types";

export default function TrendingProducts({ products }: { products: Product[] }) {
  return (
    <section className="sec" style={{ background: "var(--cream)" }}>
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
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
