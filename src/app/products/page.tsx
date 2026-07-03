import Link from "next/link";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/store/ProductCard";
import { CATEGORIES, slugify, categoryNameFromSlug } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";

type Props = { searchParams?: Promise<{ cat?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const active = sp.cat;
  const all = await getCatalog();
  const items = active ? all.filter((p) => slugify(p.cat) === active) : all;
  const title = active ? categoryNameFromSlug(active) ?? "Products" : "All Products";

  return (
    <StoreLayout>
      <main className="page">
        <div className="crumb">
          <Link href="/">Home</Link> / <span className="cur">Shop</span>
        </div>
        <h1 className="page-h1">{title}</h1>
        <p className="page-meta">
          {items.length} {items.length === 1 ? "product" : "products"}
        </p>

        <div className="chips">
          <Link href="/products" className={`chip${!active ? " active" : ""}`}>
            All
          </Link>
          {CATEGORIES.map((c) => {
            const slug = c.href.split("/").pop()!;
            return (
              <Link
                key={c.name}
                href={`/products?cat=${slug}`}
                className={`chip${active === slug ? " active" : ""}`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>

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
