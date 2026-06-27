import Link from "next/link";
import { notFound } from "next/navigation";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductDetail from "@/components/store/ProductDetail";
import ProductCard from "@/components/store/ProductCard";
import { PRODUCTS, getProduct, slugify } from "@/lib/data";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }));
}

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.id !== product.id);

  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> /{" "}
          <Link href={`/products?cat=${slugify(product.cat)}`}>{product.cat}</Link> /{" "}
          <span className="cur">{product.name}</span>
        </div>

        <ProductDetail product={product} />

        <div style={{ marginTop: 64 }}>
          <div className="sec-hd">
            <div>
              <div className="sec-ey">You May Also Like</div>
              <div className="sec-ti">Related Products</div>
            </div>
          </div>
          <div className="prod-g">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </main>
    </StoreLayout>
  );
}
