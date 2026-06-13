import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = {
  searchParams?: Promise<{ order?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const orderId = sp.order;

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="bg-white border rounded-2xl shadow-sm p-10">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-navy-700">Order Placed Successfully</h1>
          <p className="mt-4 text-gray-600">Thank you for shopping with Shanya.</p>

          {orderId && (
            <p className="mt-4 inline-block bg-gray-100 px-4 py-2 rounded-lg text-sm">
              Order ID: <span className="font-semibold">#{orderId}</span>
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/my-orders" className="bg-navy-700 hover:bg-navy-800 text-white px-6 py-3 rounded-lg font-medium">
              View My Orders
            </Link>
            <Link href="/products" className="border px-6 py-3 rounded-lg font-medium hover:border-navy-700">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
