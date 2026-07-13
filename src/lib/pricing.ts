import { getCatalog } from "./catalog";
import { computeShipping, type Zone } from "./shipping";
import type { OrderItem } from "./orderStore";

// Server-side pricing. NEVER trust prices sent by the browser — we look every
// product up in the catalog and recompute the totals ourselves. Shipping is
// charged at the actual courier rate for the customer's pincode zone.
export type IncomingItem = { id: number | string; qty: number | string; variant?: string; color?: string };

export async function priceCart(
  incoming: IncomingItem[],
  pincode = ""
): Promise<{
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  zone: Zone | null;
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
  // assumeRest: a missing/invalid pincode must never result in ₹0 shipping.
  const { shipping, zone } = computeShipping(pincode, subtotal, { assumeRest: true });

  return { items, subtotal, shipping, total: subtotal + shipping, zone };
}
