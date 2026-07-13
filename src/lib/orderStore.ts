import fs from "fs/promises";
import path from "path";
import { supabaseAdmin } from "./supabaseAdmin";

// Order store with two backends:
//  • Supabase (table `shanya_orders`) when SUPABASE_SERVICE_ROLE_KEY is set —
//    this is the production path (Vercel filesystem is read-only/ephemeral).
//  • Local JSON file (src/data/orders.json) otherwise — zero-setup local dev.
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
  payment_method: string; // cod | razorpay
  payment_status: string; // pending (COD) | paid (verified online payment)
  payment_id: string | null; // Razorpay payment id, if paid online
  status: string; // placed | confirmed | shipped | delivered | cancelled
  created_at: string;
};

const TABLE = "shanya_orders";
const FILE = path.join(process.cwd(), "src", "data", "orders.json");
const useDb = () => !!process.env.SUPABASE_SERVICE_ROLE_KEY;

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
  if (useDb()) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as StoredOrder[];
  }
  const all = await readAll();
  return all.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function addOrder(order: StoredOrder): Promise<void> {
  if (useDb()) {
    const { error } = await supabaseAdmin.from(TABLE).insert(order);
    if (error) throw new Error(error.message);
    return;
  }
  const all = await readAll();
  all.push(order);
  await writeAll(all);
}

export async function findOrder(orderNumber: string): Promise<StoredOrder | null> {
  if (useDb()) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .select("*")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as StoredOrder) ?? null;
  }
  const all = await readAll();
  return all.find((o) => o.order_number === orderNumber) ?? null;
}

export async function setOrderStatus(orderNumber: string, status: string): Promise<boolean> {
  if (useDb()) {
    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update({ status })
      .eq("order_number", orderNumber)
      .select("order_number");
    if (error) throw new Error(error.message);
    return (data?.length ?? 0) > 0;
  }
  const all = await readAll();
  const order = all.find((o) => o.order_number === orderNumber);
  if (!order) return false;
  order.status = status;
  await writeAll(all);
  return true;
}
