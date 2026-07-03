import Link from "next/link";
import { notFound } from "next/navigation";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductDetail from "@/components/store/ProductDetail";
import ProductCard from "@/components/store/ProductCard";
import { PRODUCTS, slugify } from "@/lib/data";
import { getCatalog, getCatalogProduct } from "@/lib/catalog";

export const revalidate = 10;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: String(p.id) }));
}

type Props = { params: Promise<{ id: string }> };

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getCatalogProduct(Number(id));
  if (!product) notFound();

  const related = (await getCatalog()).filter((p) => p.id !== product.id);

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
