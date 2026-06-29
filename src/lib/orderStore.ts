import fs from "fs/promises";
import path from "path";

// Simple file-based order store — works locally with zero external setup
// (no Supabase keys, no SQL, no RLS). Orders live in src/data/orders.json.
export type OrderItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
  variant?: string;
  color?: string;
};

export type StoredOrder = {
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment_method: string;
  status: string; // placed | confirmed | shipped | delivered | cancelled
  created_at: string;
};

const FILE = path.join(process.cwd(), "src", "data", "orders.json");

async function readAll(): Promise<StoredOrder[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(orders: StoredOrder[]): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function listOrders(): Promise<StoredOrder[]> {
  const all = await readAll();
  return all.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function addOrder(order: StoredOrder): Promise<void> {
  const all = await readAll();
  all.push(order);
  await writeAll(all);
}

export async function findOrder(orderNumber: string): Promise<StoredOrder | null> {
  const all = await readAll();
  return all.find((o) => o.order_number === orderNumber) ?? null;
}

export async function setOrderStatus(orderNumber: string, status: string): Promise<boolean> {
  const all = await readAll();
  const order = all.find((o) => o.order_number === orderNumber);
  if (!order) return false;
  order.status = status;
  await writeAll(all);
  return true;
}
