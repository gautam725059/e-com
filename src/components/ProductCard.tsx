import Link from "next/link";
import { resolveImg } from "@/data/imageMap";

type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  image: string;
  stock?: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const inStock = (product.stock ?? 0) > 0;

  return (
    <article className="group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col">
      <Link href={`/products/${product.id}`} className="relative block">
        <img
          src={resolveImg(product.image)}
          alt={product.title}
          className="w-full h-56 object-cover group-hover:scale-[1.02] transition"
        />
        <div className="absolute top-3 left-3 bg-navy-800 text-white text-sm px-3 py-1 rounded">
          ₹{product.price}
        </div>
        {!inStock && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of stock
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg text-gray-800">{product.title}</h3>
        {product.description && (
          <p className="text-gray-500 mt-2 text-sm line-clamp-2">{product.description}</p>
        )}
        <div className="mt-4 pt-2">
          <Link
            href={`/products/${product.id}`}
            className="inline-block bg-navy-700 hover:bg-navy-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            View product
          </Link>
        </div>
      </div>
    </article>
  );
}
