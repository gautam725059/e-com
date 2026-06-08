import { notFound } from "next/navigation";
import Link from "next/link";
import products from "@/data/products.json";
import imageMap from "@/data/imageMap";
import AddToCartButton from "@/components/AddToCartButton";

type Props = { params: { id: string } };

export default function ProductDetail({ params }: Props) {
  const id = parseInt(params.id, 10);
  const product = (products as any[]).find(p => p.id === id);
  if (!product) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <img src={imageMap[product.image] ?? product.image} alt={product.title} className="w-full h-96 object-cover rounded-lg" />
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl text-green-600 mt-4">₹{product.price}</p>
          <p className="mt-6 text-gray-700">{product.description}</p>
          <div className="mt-8">
            <AddToCartButton product={product} />
            <Link href="/products" className="text-gray-600">Back to products</Link>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Related products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {(products as any[]).filter(p => p.id !== product.id).slice(0,3).map(p => (
            <Link key={p.id} href={`/products/${p.id}`} className="block border rounded-lg overflow-hidden">
              <img src={imageMap[p.image] ?? p.image} alt={p.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-green-600">₹{p.price}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
