"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Package,
  Users,
  CreditCard,
  LogOut,
  Menu,
  X,
  Shield,
  ArrowLeft,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Upload,
} from "lucide-react";
import { CATEGORIES } from "@/lib/data";

const ORDER_STATUS_FLOW = ["placed", "confirmed", "shipped", "delivered", "cancelled"];

const MAX_IMAGES = 5;

const BLANK_PRODUCT = {
  id: null as number | null,
  name: "",
  cat: "",
  price: "",
  orig: "",
  img: "",
  images: [] as string[],
  desc: "",
  badge: "",
  variants: "",
  colors: "",
  rating: 4.8,
  reviews: 0,
};
const titleCase = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Revenue per day for the last 7 days, from live orders.
function buildSalesSeries(orders: any[]): { label: string; val: number }[] {
  const today = new Date();
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days.map((d) => {
    const key = d.toDateString();
    const val = orders
      .filter((o) => o.created_ts && new Date(o.created_ts).toDateString() === key)
      .reduce((s, o) => s + (o.total_amount || 0), 0);
    return { label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), val };
  });
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auth
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [message, setMessage] = useState("");

  // Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [soldByProduct, setSoldByProduct] = useState<Record<number, number>>({});

  // Storefront catalog
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [catFilter, setCatFilter] = useState("All");
  const [editing, setEditing] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imgUrlInput, setImgUrlInput] = useState("");

  // Restore session (needs the password too — it authenticates the admin APIs)
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem("adminAuth");
      const p = sessionStorage.getItem("adminPass");
      if (auth === "true" && p) {
        setAuthorized(true);
        setAdminPass(p);
      } else {
        sessionStorage.removeItem("adminAuth");
        sessionStorage.removeItem("adminPass");
      }
    } catch {}
  }, []);

  // Load orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoadingOrders(true);
        const res = await fetch("/api/admin/orders", { headers: { "x-admin-pass": adminPass } });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          setMessage(
            res.status === 401
              ? "Session expired — please log in again."
              : `Could not load orders${e.error ? ": " + e.error : ""}.`
          );
          setOrders([]);
          return;
        }
        const { orders: rows } = await res.json();
        const mapped = (rows || []).map((o: any) => ({
          id: o.order_number,
          order_number: o.order_number,
          customer_name: o.customer_name || "Unknown Customer",
          phone: o.phone || "",
          email: o.email || "",
          address: o.address || "",
          city: o.city || "",
          state: o.state || "",
          pincode: o.pincode || "",
          items: Array.isArray(o.items) ? o.items : [],
          total_amount: o.total || 0,
          subtotal: o.subtotal || 0,
          shipping: o.shipping || 0,
          payment_method: (o.payment_method || "cod").toUpperCase(),
          payment_status: o.payment_status || (o.payment_method === "cod" ? "pending" : "paid"),
          status: titleCase(o.status || "placed"),
          rawStatus: o.status || "placed",
          created_ts: o.created_at || null,
          created_at: new Date(o.created_at || Date.now()).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));
        setOrders(mapped);

        const sold: Record<number, number> = {};
        mapped.forEach((o: any) =>
          o.items.forEach((it: any) => {
            if (it.id == null) return;
            sold[it.id] = (sold[it.id] || 0) + (it.qty || 0);
          })
        );
        setSoldByProduct(sold);
      } catch (e) {
        console.error("orders fetch failed", e);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    }
    if (authorized && adminPass) fetchOrders();
  }, [authorized, adminPass]);

  // Load storefront catalog
  useEffect(() => {
    async function fetchCatalog() {
      try {
        setLoadingCatalog(true);
        const res = await fetch("/api/admin/catalog", { headers: { "x-admin-pass": adminPass } });
        if (res.ok) {
          const d = await res.json();
          setCatalog(d.products || []);
        }
      } catch (e) {
        console.error("catalog fetch failed", e);
      } finally {
        setLoadingCatalog(false);
      }
    }
    if (authorized && adminPass) fetchCatalog();
  }, [authorized, adminPass]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await fetch("/api/admins/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!r.ok) return setMessage("Invalid username or password");
      sessionStorage.setItem("adminAuth", "true");
      sessionStorage.setItem("adminPass", password);
      setAdminPass(password);
      setAuthorized(true);
      setMessage("Access granted");
      setTimeout(() => setMessage(""), 2000);
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminPass");
    setAuthorized(false);
    setAdminPass("");
    setPassword("");
    setMessage("Logged out");
  }

  async function handleUpdateOrderStatus(orderNumber: string, newStatus: string) {
    try {
      const r = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-pass": adminPass },
        body: JSON.stringify({ order_number: orderNumber, status: newStatus }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Update failed");
      setOrders((prev) =>
        prev.map((o) =>
          o.order_number === orderNumber ? { ...o, status: titleCase(newStatus), rawStatus: newStatus } : o
        )
      );
      setMessage(`Order ${orderNumber} marked ${newStatus}`);
      setTimeout(() => setMessage(""), 2500);
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  async function reloadCatalog() {
    const res = await fetch("/api/admin/catalog", { headers: { "x-admin-pass": adminPass } });
    if (res.ok) setCatalog((await res.json()).products || []);
  }

  function startAdd() {
    setEditing({ ...BLANK_PRODUCT, images: [], cat: catFilter !== "All" ? catFilter : CATEGORIES[0].name });
    setImgUrlInput("");
    setFormOpen(true);
  }

  function startEdit(p: any) {
    setImgUrlInput("");
    setEditing({
      ...p,
      orig: p.orig ?? "",
      images: p.images?.length ? [...p.images] : p.img ? [p.img] : [],
      variants: (p.variants || []).join(", "),
      colors: (p.colors || []).join(", "),
    });
    setFormOpen(true);
  }

  function addImage(url: string) {
    const clean = url.trim();
    if (!clean) return;
    setEditing((f: any) => {
      const list = [...(f.images || [])];
      if (list.includes(clean) || list.length >= MAX_IMAGES) return f;
      list.push(clean);
      return { ...f, images: list, img: list[0] };
    });
  }

  function removeImage(idx: number) {
    setEditing((f: any) => {
      const list = (f.images || []).filter((_: string, i: number) => i !== idx);
      return { ...f, images: list, img: list[0] || "" };
    });
  }

  function makeMainImage(idx: number) {
    setEditing((f: any) => {
      const list = [...(f.images || [])];
      const [pick] = list.splice(idx, 1);
      list.unshift(pick);
      return { ...f, images: list, img: list[0] };
    });
  }

  function setField(k: string, v: any) {
    setEditing((f: any) => ({ ...f, [k]: v }));
  }

  // Upload one or more files and append each to the product gallery.
  async function handleImageUpload(files: File[]) {
    const room = MAX_IMAGES - (editing?.images?.length || 0);
    if (room <= 0) {
      setMessage(`You can add up to ${MAX_IMAGES} images per product.`);
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    const batch = files.slice(0, room);
    setUploading(true);
    try {
      for (const file of batch) {
        const fd = new FormData();
        fd.append("file", file);
        // NOTE: no Content-Type header — the browser sets the multipart boundary.
        const r = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "x-admin-pass": adminPass },
          body: fd,
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Upload failed");
        addImage(d.url);
      }
      setMessage(batch.length > 1 ? `${batch.length} images uploaded ✅` : "Image uploaded ✅");
      setTimeout(() => setMessage(""), 2500);
    } catch (err: any) {
      setMessage(String(err.message || err));
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (!(editing.images || []).length) {
      setMessage("Please add at least one product image.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    setSavingProduct(true);
    try {
      const isNew = editing.id == null;
      const r = await fetch("/api/admin/catalog", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-pass": adminPass },
        body: JSON.stringify(editing),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Save failed");
      await reloadCatalog();
      setFormOpen(false);
      setEditing(null);
      setMessage(isNew ? `Added "${d.product.name}" — live on the store` : `Saved "${d.product.name}"`);
      setTimeout(() => setMessage(""), 2800);
    } catch (err: any) {
      setMessage(String(err.message || err));
    } finally {
      setSavingProduct(false);
    }
  }

  async function handleDeleteProduct(p: any) {
    if (!window.confirm(`Delete "${p.name}" permanently? It will be removed from the website.`)) return;
    try {
      const r = await fetch(`/api/admin/catalog?id=${p.id}`, {
        method: "DELETE",
        headers: { "x-admin-pass": adminPass },
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Delete failed");
      await reloadCatalog();
      setMessage(`Deleted "${p.name}"`);
      setTimeout(() => setMessage(""), 2500);
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  // Printable invoice / bill
  function openInvoice(order: any) {
    const w = window.open("", "_blank", "width=900,height=1000");
    if (!w) {
      setMessage("Allow pop-ups to print the invoice.");
      return;
    }
    const inr = (n: number) =>
      "₹" + Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // Absolute URL — the print window has no page context of its own.
    const logoUrl = `${window.location.origin}/images/shanya-logo.webp`;
    const rows = (order.items || [])
      .map(
        (it: any) => `
      <tr>
        <td class="i-name">${it.name}${it.variant ? `<span class="i-sub">${it.variant}${it.color ? " · " + it.color : ""}</span>` : ""}</td>
        <td class="c">${String(it.qty).padStart(2, "0")}<span class="i-sub">qty</span></td>
        <td class="r">${inr(it.price)}<span class="i-sub">per unit</span></td>
        <td class="c">0.00</td>
        <td class="r">${inr(it.price * it.qty)}</td>
      </tr>`
      )
      .join("");

    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${order.order_number}</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',Arial,sans-serif;color:#1A1A1A;background:#f3ece1;padding:32px}
        .inv{max-width:760px;margin:0 auto;background:#fff;padding:44px 46px;box-shadow:0 10px 40px rgba(0,0,0,.08)}
        .top{display:flex;justify-content:space-between;align-items:flex-start}
        .brand-logo{height:78px;width:auto;display:block}
        .brand-name{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;letter-spacing:1px;line-height:1;display:none}
        .brand-ul{display:block;height:3px;width:90px;background:linear-gradient(90deg,#B8963E,transparent);margin-top:4px}
        .brand-sub{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#8a8275;margin-top:8px}
        .banner{display:flex;align-items:center;background:#1A1A1A;color:#fff;padding:14px 26px}
        .banner i{display:inline-block;width:4px;height:26px;background:#B8963E;margin-right:4px}
        .banner i:nth-child(2){opacity:.6}
        .banner b{font-size:30px;font-weight:700;letter-spacing:7px;margin-left:12px}
        .meta{margin-top:18px;font-size:13px;line-height:1.7}
        .rule{border:0;border-top:1px solid #B8963E;opacity:.5;margin:18px 0}
        .cols{display:flex;justify-content:space-between;gap:40px;font-size:13px;line-height:1.7}
        .cols h4{font-size:12px;font-weight:700;margin-bottom:4px}
        .cols .muted{color:#6b6357}
        table{width:100%;border-collapse:collapse;margin-top:6px}
        thead th{text-align:left;font-size:13px;font-weight:700;padding:12px 8px;border-bottom:2px solid #1A1A1A}
        thead th.c{text-align:center}thead th.r{text-align:right}
        tbody td{padding:16px 8px;border-bottom:1px solid #ece3d4;font-size:14px;vertical-align:top}
        td.c{text-align:center}td.r{text-align:right}
        .i-name{font-weight:500}
        .i-sub{display:block;font-size:11px;color:#9a9082;font-weight:400;margin-top:2px}
        .foot{display:flex;justify-content:space-between;margin-top:22px;gap:30px}
        .terms{font-size:11px;color:#9a9082;max-width:260px;line-height:1.7}
        .terms h4{font-size:12px;color:#1A1A1A;margin-bottom:6px}
        .totals{width:280px}
        .totals .row{display:flex;justify-content:space-between;font-size:13px;padding:7px 0}
        .totals .row .lbl{color:#6b6357}
        .total-bar{display:flex;justify-content:space-between;align-items:center;background:#1A1A1A;color:#fff;margin-top:12px;padding:14px 18px}
        .total-bar .t1{font-family:'Playfair Display',serif;font-size:18px}
        .total-bar .t2{font-family:'Playfair Display',serif;font-size:22px;font-weight:700}
        .thanks{text-align:center;margin-top:30px;font-size:11px;color:#9a9082;border-top:1px solid #ece3d4;padding-top:14px}
        @media print{body{background:#fff;padding:0}.inv{box-shadow:none}}
      </style></head><body>
      <div class="inv">
        <div class="top">
          <div>
            <img class="brand-logo" src="${logoUrl}" alt="Shanya"
                 onerror="this.style.display='none';document.getElementById('wordmark').style.display='block'">
            <div class="brand-name" id="wordmark">Shanya<span class="brand-ul"></span></div>
            <div class="brand-sub">Premium Hair Accessories</div>
          </div>
          <div class="banner"><i></i><i></i><b>INVOICE</b></div>
        </div>
        <div class="meta">
          <b>Invoice No:</b> ${order.order_number}<br>
          <b>Date:</b> ${order.created_at}<br>
          <b>Status:</b> ${order.status}
        </div>
        <hr class="rule">
        <div class="cols">
          <div>
            <h4>Bill From:</h4>
            <div>Shanya by Tejswi Impex Pvt. Ltd.</div>
            <div class="muted">Plot No. 44, Sector 44,<br>Gurgaon, Haryana, India</div>
            <div class="muted">+91 98187 01724</div>
          </div>
          <div>
            <h4>Bill To:</h4>
            <div>${order.customer_name}</div>
            <div class="muted">${order.address || ""}${order.city ? ", " + order.city : ""}<br>${order.state || ""}${order.pincode ? " - " + order.pincode : ""}</div>
            <div class="muted">${order.phone || ""}${order.email ? " · " + order.email : ""}</div>
          </div>
        </div>
        <hr class="rule">
        <table>
          <thead><tr><th>Item</th><th class="c">Quantity</th><th class="r">Rate</th><th class="c">Tax</th><th class="r">Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="foot">
          <div class="terms">
            <h4>Terms &amp; Conditions:</h4>
            Payment Method: ${String(order.payment_method || "COD").toUpperCase()}.
            Goods once sold are subject to our 7-day return policy.
            Thank you for shopping with Shanya.
          </div>
          <div class="totals">
            <div class="row"><span class="lbl">Subtotal</span><span>${inr(order.subtotal)}</span></div>
            <div class="row"><span class="lbl">Shipping</span><span>${order.shipping === 0 ? "Free" : inr(order.shipping)}</span></div>
            <div class="row"><span class="lbl">Discount</span><span>${inr(0)}</span></div>
            <div class="row"><span class="lbl">Tax</span><span>${inr(0)}</span></div>
            <div class="total-bar"><span class="t1">Total</span><span class="t2">${inr(order.total_amount)}</span></div>
          </div>
        </div>
        <div class="thanks">www.shanya.in · This is a computer-generated invoice and does not require a signature.</div>
      </div>
      <script>window.onload=function(){window.print()}</script>
      </body></html>`);
    w.document.close();
  }

  // ── Derived stats (all from live orders + storefront catalog) ──
  const displayOrders = orders.length;
  const displayRevenue = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const totalCustomers = new Set(orders.map((o) => o.phone).filter(Boolean)).size;
  const displayProducts = catalog.length;

  const statusCounts = orders.reduce((acc, o) => {
    const s = o.status || "Placed";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const salesSeries = buildSalesSeries(orders);

  const topProducts = [...catalog]
    .map((p) => ({ ...p, sold: soldByProduct[p.id] || 0 }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // ── Login screen ──
  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#0d1527] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#16223f] border border-[#23355d] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#d4af37]" />
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="bg-white rounded-2xl p-3 mb-4 shadow-lg">
              <img src="/images/shanya-logo.webp" alt="Shanya" className="w-24 h-24 object-contain" />
            </div>
            <p className="text-xs text-[#c5a880] uppercase tracking-[0.25em] font-semibold">Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-[#0d1527] border border-[#2e4272] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d1527] border border-[#2e4272] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#d4af37] transition text-sm tracking-widest font-medium"
              />
            </div>
            <button className="w-full bg-gradient-to-r from-[#b89528] to-[#d4af37] text-white py-3.5 rounded-lg font-bold tracking-wider hover:opacity-95 transition shadow-lg text-sm mt-3 uppercase">
              Authenticate
            </button>
            {message && (
              <div className="text-center text-sm font-medium text-red-400 mt-2 bg-red-950/40 border border-red-900/60 py-2.5 rounded-lg">
                {message}
              </div>
            )}
          </form>

          <div className="mt-8 text-center text-xs text-gray-400 border-t border-[#23355d] pt-4">
            <Link href="/" className="hover:text-white transition inline-flex items-center gap-1">
              <ArrowLeft size={12} /> Return to Storefront
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Orders", icon: ShoppingBag },
    { label: "Catalog", icon: Tag },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fc] flex font-sans text-gray-800">
      {/* Sidebar */}
      <aside
        className={`w-64 bg-[#111c2a] text-gray-300 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        <div className="h-20 border-b border-gray-800 flex items-center px-6 gap-3">
          <div className="bg-white rounded-lg p-1.5 flex-shrink-0">
            <img src="/images/shanya-icon.webp" alt="Shanya" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-white">SHANYA</span>
            <span className="text-[9px] text-[#c5a880] uppercase tracking-widest font-bold -mt-0.5">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  isActive ? "bg-[#967850] text-white shadow-md" : "hover:bg-gray-800 hover:text-white text-gray-400"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-gray-400"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-950/20 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500 hover:text-gray-800">
              <Menu size={22} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">{activeTab}</h2>
          </div>
          <Link href="/" className="text-xs font-bold text-[#967850] hover:text-[#7d6340] flex items-center gap-1">
            View Store <ArrowRight size={14} />
          </Link>
        </header>

        <div className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {message && (
            <div className="bg-[#111c2a] text-[#c5a880] border border-gray-800 px-5 py-4 rounded-xl flex items-center justify-between text-sm shadow-md font-medium">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#d4af37]" />
                <span>{message}</span>
              </div>
              <button onClick={() => setMessage("")} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
          )}

          {/* ── DASHBOARD ── */}
          {activeTab === "Dashboard" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Orders" value={displayOrders.toLocaleString()} sub="from website checkout" icon={<ShoppingBag size={22} />} tone="bg-blue-50 text-blue-600" />
                <StatCard label="Total Revenue" value={`₹${displayRevenue.toLocaleString()}`} sub="across all orders" icon={<span className="text-lg font-bold">₹</span>} tone="bg-emerald-50 text-emerald-600" />
                <StatCard label="Total Customers" value={totalCustomers.toLocaleString()} sub="unique buyers" icon={<Users size={22} />} tone="bg-purple-50 text-purple-600" />
                <StatCard label="Products Live" value={String(displayProducts)} sub="in the storefront" icon={<Package size={22} />} tone="bg-orange-50 text-orange-600" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900">Sales Overview</h4>
                    <p className="text-xs text-gray-400">Revenue, last 7 days</p>
                  </div>
                  <SalesChart points={salesSeries} />
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900">Order Status</h4>
                    <p className="text-xs text-gray-400">Real-time statuses</p>
                  </div>
                  <StatusDonutChart counts={statusCounts} total={displayOrders} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">Recent Orders</h4>
                      <p className="text-xs text-gray-400">Latest checkout activity</p>
                    </div>
                    <button onClick={() => setActiveTab("Orders")} className="text-xs font-bold text-[#967850] hover:text-[#7d6340] flex items-center gap-1 transition">
                      View All <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                          <th className="py-3 px-2">Order No</th>
                          <th className="py-3 px-2">Customer</th>
                          <th className="py-3 px-2">Amount</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-gray-400 font-medium">
                              {loadingOrders ? "Loading orders…" : "No orders yet."}
                            </td>
                          </tr>
                        )}
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                            <td className="py-3 px-2 font-bold text-gray-900">{order.order_number}</td>
                            <td className="py-3 px-2 font-semibold text-gray-700">{order.customer_name}</td>
                            <td className="py-3 px-2 font-bold text-gray-900">₹{order.total_amount?.toLocaleString()}</td>
                            <td className="py-3 px-2">
                              <StatusPill status={order.status} />
                            </td>
                            <td className="py-3 px-2 text-gray-400 font-medium">{order.created_at}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">Top Products</h4>
                      <p className="text-xs text-gray-400">By units sold</p>
                    </div>
                    <button onClick={() => setActiveTab("Catalog")} className="text-xs font-bold text-[#967850] hover:text-[#7d6340] flex items-center gap-1 transition">
                      Catalog <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {topProducts.length === 0 && <p className="text-xs text-gray-400 py-4">No products loaded.</p>}
                    {topProducts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</h5>
                            <p className="text-[10px] text-gray-400">₹{p.price}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-600 whitespace-nowrap">{p.sold} sold</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "Orders" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">All Orders</h4>
                  <p className="text-xs text-gray-400">Change status or generate an invoice</p>
                </div>
                <div className="text-xs font-semibold text-gray-400">Total: {orders.length}</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50">
                      <th className="py-3 px-4">Order No</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-center">Bill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-gray-400 font-medium">
                          {loadingOrders ? "Loading orders…" : "No orders found."}
                        </td>
                      </tr>
                    )}
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition align-top">
                        <td className="py-4 px-4 font-bold text-gray-900">{order.order_number}</td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-800">{order.customer_name}</div>
                          <div className="text-[10px] text-gray-400">
                            {order.phone}
                            {order.city ? ` · ${order.city}` : ""}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-500 max-w-[180px]">
                          <div className="font-semibold text-gray-700">
                            {order.items.reduce((s: number, i: any) => s + (i.qty || 0), 0)} items
                          </div>
                          <div className="text-[10px] text-gray-400 line-clamp-2">
                            {order.items.map((i: any) => `${i.name}×${i.qty}`).join(", ")}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900">₹{order.total_amount?.toLocaleString()}</td>
                        <td className="py-4 px-4 text-gray-500 font-medium uppercase text-[10px]">{order.payment_method}</td>
                        <td className="py-4 px-4">
                          <select
                            value={order.rawStatus}
                            onChange={(e) => handleUpdateOrderStatus(order.order_number, e.target.value)}
                            className={`text-[11px] font-bold rounded-full px-2.5 py-1 border focus:outline-none cursor-pointer ${statusClass(order.rawStatus)}`}
                          >
                            {ORDER_STATUS_FLOW.map((s) => (
                              <option key={s} value={s}>
                                {titleCase(s)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4 text-gray-400 font-semibold text-[11px]">{order.created_at}</td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => openInvoice(order)}
                            className="inline-flex items-center gap-1 bg-[#111c2a] hover:bg-[#1c2c44] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition"
                          >
                            <CreditCard size={12} /> Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CATALOG (storefront products: add / edit / delete) ── */}
          {activeTab === "Catalog" && (
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-gray-900">Storefront Catalog</h4>
                  <p className="text-xs text-gray-400">
                    Add, edit or remove products. Changes go live on the website within ~10 seconds.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#967850]"
                  >
                    <option value="All">All Categories ({catalog.length})</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({catalog.filter((p) => p.cat === c.name).length})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={startAdd}
                    className="bg-[#967850] hover:bg-[#7d6340] text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <Plus size={15} /> Add Product
                  </button>
                </div>
              </div>

              {/* Add / Edit form */}
              {formOpen && editing && (
                <form onSubmit={handleSaveProduct} className="bg-white border-2 border-[#967850]/30 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                    <h4 className="font-bold text-gray-900">
                      {editing.id == null ? "Add New Product" : `Edit Product #${editing.id}`}
                    </h4>
                    <button
                      type="button"
                      onClick={() => { setFormOpen(false); setEditing(null); }}
                      className="text-gray-400 hover:text-gray-800"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <Field label="Product Name *">
                      <input required value={editing.name} onChange={(e) => setField("name", e.target.value)}
                        placeholder="e.g. Satin Scrunchie Set" className={inputCls} />
                    </Field>

                    <Field label="Category *">
                      <select required value={editing.cat} onChange={(e) => setField("cat", e.target.value)} className={inputCls}>
                        <option value="">Select category…</option>
                        {CATEGORIES.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Selling Price (₹) *">
                      <input required type="number" min={1} value={editing.price}
                        onChange={(e) => setField("price", e.target.value)} placeholder="199" className={inputCls} />
                    </Field>

                    <Field label="MRP / Original Price (₹) — optional">
                      <input type="number" min={0} value={editing.orig ?? ""}
                        onChange={(e) => setField("orig", e.target.value)} placeholder="299 (leave blank if none)" className={inputCls} />
                    </Field>

                    <Field label={`Product Images * (up to ${MAX_IMAGES})`} full>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-3">
                          {(editing.images || []).map((url: string, i: number) => (
                            <div key={url + i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                              <img src={url} alt={`image ${i + 1}`} className="w-full h-full object-cover" />
                              {i === 0 ? (
                                <span className="absolute bottom-0 inset-x-0 bg-[#967850] text-white text-[9px] font-bold text-center py-0.5">
                                  MAIN
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => makeMainImage(i)}
                                  title="Make this the main image"
                                  className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold py-0.5 opacity-0 group-hover:opacity-100 transition"
                                >
                                  SET MAIN
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                title="Remove image"
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 text-red-600 text-xs font-bold flex items-center justify-center shadow hover:bg-red-600 hover:text-white transition"
                              >
                                ×
                              </button>
                            </div>
                          ))}

                          {(editing.images || []).length < MAX_IMAGES && (
                            <label className={`w-24 h-24 flex flex-col items-center justify-center gap-1 border-2 border-dashed rounded-lg cursor-pointer transition text-[10px] font-bold text-center px-1 ${
                              uploading ? "border-gray-200 text-gray-400" : "border-[#967850]/40 text-[#967850] hover:bg-[#967850]/5"
                            }`}>
                              <Upload size={16} />
                              {uploading ? "Uploading…" : "Add image"}
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                disabled={uploading}
                                className="hidden"
                                onChange={(e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length) handleImageUpload(files);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            value={imgUrlInput}
                            onChange={(e) => setImgUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addImage(imgUrlInput);
                                setImgUrlInput("");
                              }
                            }}
                            placeholder="…or paste an image URL"
                            className={inputCls}
                          />
                          <button
                            type="button"
                            onClick={() => { addImage(imgUrlInput); setImgUrlInput(""); }}
                            className="px-4 rounded-lg border border-[#967850]/40 text-[#967850] text-xs font-bold hover:bg-[#967850]/5 transition whitespace-nowrap"
                          >
                            Add
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400">
                          First image is the main one shown on product cards. Hover a thumbnail to change the main image or remove it.
                        </p>
                      </div>
                    </Field>

                    <Field label="Description" full>
                      <textarea rows={3} value={editing.desc} onChange={(e) => setField("desc", e.target.value)}
                        placeholder="Short product description shown on the product page…" className={inputCls} />
                    </Field>

                    <Field label="Variants (comma separated)">
                      <input value={editing.variants} onChange={(e) => setField("variants", e.target.value)}
                        placeholder="Small, Medium, Large" className={inputCls} />
                    </Field>

                    <Field label="Colors (comma separated)">
                      <input value={editing.colors} onChange={(e) => setField("colors", e.target.value)}
                        placeholder="Black, Brown, Pink" className={inputCls} />
                    </Field>

                    <Field label="Badge — optional">
                      <input value={editing.badge} onChange={(e) => setField("badge", e.target.value)}
                        placeholder="New / Bestseller" className={inputCls} />
                    </Field>

                    <Field label="Rating & Reviews">
                      <div className="grid grid-cols-2 gap-3">
                        <input type="number" step="0.1" min={1} max={5} value={editing.rating}
                          onChange={(e) => setField("rating", e.target.value)} placeholder="4.8" className={inputCls} />
                        <input type="number" min={0} value={editing.reviews}
                          onChange={(e) => setField("reviews", e.target.value)} placeholder="120" className={inputCls} />
                      </div>
                    </Field>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button type="submit" disabled={savingProduct}
                      className="bg-[#967850] hover:bg-[#7d6340] disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition">
                      {savingProduct ? "Saving…" : editing.id == null ? "Add Product" : "Save Changes"}
                    </button>
                    <button type="button" onClick={() => { setFormOpen(false); setEditing(null); }}
                      className="text-xs font-bold text-gray-500 hover:text-gray-800 px-3 py-2.5">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Product list */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                {loadingCatalog ? (
                  <div className="text-center text-gray-400 py-8 font-medium">Loading catalog…</div>
                ) : (
                  <div className="space-y-3">
                    {catalog
                      .filter((p) => catFilter === "All" || p.cat === catFilter)
                      .map((p) => (
                        <div key={p.id} className="border border-gray-100 rounded-lg p-3 flex items-center gap-4 hover:bg-gray-50/50 transition">
                          <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                            <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-gray-900 truncate">{p.name}</div>
                            <div className="text-[11px] text-[#967850] font-semibold uppercase tracking-wide">{p.cat}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              <b className="text-gray-900">₹{p.price}</b>
                              {p.orig ? <span className="line-through text-gray-400 ml-1.5">₹{p.orig}</span> : null}
                              {p.badge ? <span className="ml-2 bg-[#967850]/10 text-[#967850] px-1.5 py-0.5 rounded text-[10px] font-bold">{p.badge}</span> : null}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => startEdit(p)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition">
                              <Edit size={13} /> Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(p)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-[11px] font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}

                    {catalog.filter((p) => catFilter === "All" || p.cat === catFilter).length === 0 && (
                      <div className="text-center text-gray-400 py-10 font-medium">
                        No products in this category yet.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ── Small presentational helpers ── */
const inputCls =
  "w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#967850]";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function StatCard({ label, value, sub, icon, tone }: { label: string; value: string; sub: string; icon: React.ReactNode; tone: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <h3 className="text-2xl font-black text-gray-900">{value}</h3>
        <span className="text-xs text-gray-400 font-medium">{sub}</span>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tone}`}>{icon}</div>
    </div>
  );
}

function statusClass(raw: string) {
  return raw === "delivered"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : raw === "shipped"
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : raw === "confirmed"
    ? "bg-sky-50 text-sky-700 border-sky-200"
    : raw === "cancelled"
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : "bg-gray-100 text-gray-600 border-gray-200";
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Delivered"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "Shipped"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : status === "Cancelled"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-sky-50 text-sky-700 border-sky-200";
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${cls}`}>{status}</span>;
}

function SalesChart({ points }: { points: { label: string; val: number }[] }) {
  const data = points && points.length ? points : [{ label: "", val: 0 }];
  const x0 = 40, x1 = 480, yTop = 40, yBottom = 200;
  const maxVal = Math.max(...data.map((d) => d.val), 1);
  const niceMax = Math.ceil(maxVal / 4) * 4 || 4;
  const step = data.length > 1 ? (x1 - x0) / (data.length - 1) : 0;
  const coords = data.map((d, i) => ({
    x: x0 + step * i,
    y: yBottom - (d.val / niceMax) * (yBottom - yTop),
    ...d,
  }));
  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)},${yBottom} L ${coords[0].x.toFixed(1)},${yBottom} Z`;
  const fmtK = (n: number) => (n >= 1000 ? `${Math.round(n / 100) / 10}K` : `${n}`);
  const yTicks = [0, 1, 2, 3, 4].map((i) => ({
    y: yBottom - (i / 4) * (yBottom - yTop),
    val: (niceMax / 4) * i,
  }));

  return (
    <div className="w-full h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
        {yTicks.map((t, i) => (
          <line key={i} x1={x0} y1={t.y} x2={x1} y2={t.y} stroke="#f1f5f9" strokeWidth={i === 0 ? 2 : 1} strokeDasharray={i === 0 ? "3 3" : undefined} />
        ))}
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B8963E" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#B8963E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#goldGrad)" />
        <path d={linePath} fill="none" stroke="#B8963E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="5" fill="#ffffff" stroke="#B8963E" strokeWidth="2.5" />
        ))}
        {yTicks.map((t, i) => (
          <text key={i} x="12" y={t.y + 4} className="text-[10px] fill-gray-400 font-medium">{fmtK(t.val)}</text>
        ))}
        {coords.map((c, i) => (
          <text key={i} x={c.x} y="225" textAnchor="middle" className="text-[9px] sm:text-[10px] fill-gray-400 font-medium">{c.label}</text>
        ))}
      </svg>
    </div>
  );
}

function StatusDonutChart({ counts, total }: { counts: Record<string, number>; total: number }) {
  const C = 2 * Math.PI * 36;
  const segDefs = [
    { key: "Placed", color: "#94a3b8" },
    { key: "Confirmed", color: "#3b82f6" },
    { key: "Shipped", color: "#f97316" },
    { key: "Delivered", color: "#10b981" },
    { key: "Cancelled", color: "#ef4444" },
  ];

  let offset = 0;
  const segments = segDefs.map((s) => {
    const value = counts[s.key] || 0;
    const frac = total > 0 ? value / total : 0;
    const dash = frac * C;
    const seg = { ...s, value, frac, dash, dashOffset: -offset };
    offset += dash;
    return seg;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="36" stroke="#f1f5f9" strokeWidth="14" fill="transparent" />
          {segments.map((s) =>
            s.value > 0 ? (
              <circle
                key={s.key}
                cx="50" cy="50" r="36"
                stroke={s.color} strokeWidth="14" fill="transparent"
                strokeDasharray={`${s.dash.toFixed(2)} ${(C - s.dash).toFixed(2)}`}
                strokeDashoffset={s.dashOffset.toFixed(2)}
              />
            ) : null
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-gray-800">{total.toLocaleString()}</span>
          <span className="text-xs text-gray-400 font-medium">Total</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-xs text-gray-600 font-medium">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="w-16">{s.key}</span>
            <span className="text-gray-900 font-semibold">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
