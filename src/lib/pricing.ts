import { getCatalog } from "./catalog";
import { FREE_SHIPPING_ABOVE, SHIPPING_FEE } from "./data";
import type { OrderItem } from "./orderStore";

// Server-side pricing. NEVER trust prices sent by the browser — we look every
// product up in the catalog and recompute the totals ourselves. This is what
// the Razorpay charge and the saved order are based on.
export type IncomingItem = { id: number | string; qty: number | string; variant?: string; color?: string };

export async function priceCart(incoming: IncomingItem[]): Promise<{
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}> {
  const catalog = await getCatalog();

  const items: OrderItem[] = [];
  for (const raw of incoming ?? []) {
    const product = catalog.find((c) => c.id === Number(raw.id));
    if (!product) continue; // unknown product id → ignore
    const qty = Math.max(1, Math.min(99, Number(raw.qty) || 1));
    items.push({
      id: product.id,
      name: product.name,
      price: product.price, // authoritative price
      qty,
      variant: raw.variant || product.variants[0],
      color: raw.color || product.colors[0],
    });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_ABOVE || subtotal === 0 ? 0 : SHIPPING_FEE;
  return { items, subtotal, shipping, total: subtotal + shipping };
}
