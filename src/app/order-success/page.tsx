import Link from "next/link";
import StoreLayout from "@/components/layout/StoreLayout";

type Props = { searchParams?: Promise<{ order?: string }> };

export default async function OrderSuccessPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const order = sp.order;

  return (
    <StoreLayout>
      <main className="page">
        <div className="empty-state">
          <div style={{ fontSize: 48, marginBottom: 10 }}>🎉</div>
          <h2>Order Placed Successfully</h2>
          <p>
            Thank you for shopping with Shanya. We&apos;ll reach out on WhatsApp
            with your order updates.
          </p>

          {order && (
            <>
              <div className="ordnum">Order No: {order}</div>
              <p style={{ fontSize: 12.5, color: "var(--grey)", marginTop: -8 }}>
                Save this number to track your order.
              </p>
            </>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            {order && (
              <Link
                href={`/track-order?order=${encodeURIComponent(order)}`}
                className="drawer-btn"
                style={{ display: "inline-block", width: "auto", padding: "14px 30px" }}
              >
                Track Order
              </Link>
            )}
            <Link
              href="/products"
              className="drawer-btn outline"
              style={{ display: "inline-block", width: "auto", padding: "14px 30px", marginTop: 0 }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </StoreLayout>
  );
}
