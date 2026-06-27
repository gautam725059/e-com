import Link from "next/link";
import { notFound } from "next/navigation";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/store/ProductCard";
import { CATEGORIES, productsByCategorySlug, categoryNameFromSlug } from "@/lib/data";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.href.split("/").pop()! }));
}

type Props = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const name = categoryNameFromSlug(slug);
  if (!name) notFound();

  const items = productsByCategorySlug(slug);

  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <Link href="/products">Shop</Link> /{" "}
          <span className="cur">{name}</span>
        </div>
        <h1 className="page-h1">{name}</h1>
        <p className="page-meta">
          {items.length} {items.length === 1 ? "product" : "products"}
        </p>

        {items.length > 0 ? (
          <div className="prod-g">
            {items.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Nothing here yet</h2>
            <p>No products in this category right now.</p>
            <Link
              href="/products"
              className="drawer-btn"
              style={{ display: "inline-block", width: "auto", padding: "14px 30px" }}
            >
              Browse all products
            </Link>
          </div>
        )}
      </main>
    </StoreLayout>
  );
}
