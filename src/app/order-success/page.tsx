import Link from "next/link";
import StoreLayout from "@/components/layout/StoreLayout";

export default function OrderSuccessPage() {
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
          <Link
            href="/products"
            className="drawer-btn"
            style={{ display: "inline-block", width: "auto", padding: "14px 30px" }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </StoreLayout>
  );
}
