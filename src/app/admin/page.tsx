"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import imageMap from "@/data/imageMap";
import categoriesData from "@/data/categories";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FolderTree, 
  Users, 
  Tag, 
  Star, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  ChevronDown, 
  ArrowUpRight, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp, 
  ArrowRight,
  Menu,
  X,
  RefreshCw,
  Shield,
  CheckCircle,
  Clock,
  Truck,
  AlertTriangle,
  Minus,
  ArrowLeft,
  Check,
  Percent,
  MessageSquare
} from "lucide-react";

// Helper for resolving image paths
const getImgUrl = (img: string) => {
  if (!img) return '/images/default.jpg';
  if (img.startsWith('http') || img.startsWith('/')) return img;
  return imageMap[img] || `/images/${img}`;
};

const ORDER_STATUS_FLOW = ["placed", "confirmed", "shipped", "delivered", "cancelled"];
const titleCase = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

// Build revenue-per-day for the last 7 days from live orders.
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

const MOCK_CATEGORIES = [
  { name: "Kitchenware", count: 2, slug: "kitchenware" },
  { name: "Lifestyle", count: 3, slug: "lifestyle" },
  { name: "Cosmetics", count: 1, slug: "cosmetics" },
];

const MOCK_COUPONS = [
  { code: "WELCOME10", discount: "10%", status: "Active", expiry: "31 Dec 2026" },
  { code: "SHANYA20", discount: "20%", status: "Active", expiry: "30 Jun 2026" },
  { code: "FREESHIP", discount: "Free Shipping", status: "Expired", expiry: "01 Jan 2026" }
];

const MOCK_REVIEWS = [
  { author: "Rita D.", rating: 5, comment: "Durable and elegant hooks. Easy to install!", product: "Hooks" },
  { author: "Karan S.", rating: 4, comment: "Holds hair tightly, color is very premium.", product: "Claw Clip" },
  { author: "Pooja M.", rating: 5, comment: "Looks just like real hair. Extremely satisfied.", product: "Hair Extensions" }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auth states
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState('admin');
  const [adminPass, setAdminPass] = useState("");
  const [message, setMessage] = useState("");

  // Product states
  const [products, setProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Add Product form states
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(10);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState(categoriesData[0]?.slug ?? "");
  
  // Edit Product form states
  const [editing, setEditing] = useState({ 
    title: "", 
    price: 0, 
    description: "", 
    stock: 0,
    images: [] as string[] 
  });

  // Orders from Supabase (live website data)
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  // Units sold per product id, aggregated from order_items
  const [soldByProduct, setSoldByProduct] = useState<Record<number, number>>({});

  // Fetch products
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        if (data.length) {
          setSelectedId(data[0].id);
          setEditing({ 
            title: data[0].title, 
            price: data[0].price, 
            description: data[0].description, 
            stock: data[0].stock ?? 0,
            images: data[0].images || [data[0].image] 
          });
        }
      })
      .catch(() => {});
  }, []);

  // Fetch check auth
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem('adminAuth');
      const p = sessionStorage.getItem('adminPass');
      // Only treat as logged-in if we also have the password (needed for the
      // admin API). Old sessions without it must log in again.
      if (auth === 'true' && p) {
        setAuthorized(true);
        setAdminPass(p);
      } else {
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminPass');
      }
    } catch (e) {}
  }, []);

  // Fetch live orders from Supabase via the service-role admin API
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoadingOrders(true);
        const res = await fetch("/api/admin/orders", { headers: { "x-admin-pass": adminPass } });
        if (!res.ok) {
          const e = await res.json().catch(() => ({}));
          console.error("admin orders fetch failed:", e);
          setMessage(
            res.status === 401
              ? "Session expired — please log in again."
              : `Could not load orders${e.error ? ": " + e.error : ""}. Set SUPABASE_SERVICE_ROLE_KEY.`
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
          payment_status: o.payment_method === "cod" ? "pending" : "paid",
          status: titleCase(o.status || "placed"),
          rawStatus: o.status || "placed",
          created_ts: o.created_at || null,
          created_at: new Date(o.created_at || Date.now()).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          }),
        }));
        setOrders(mapped);

        // Units sold per product, aggregated from each order's items JSON
        const sold: Record<number, number> = {};
        mapped.forEach((o: any) =>
          o.items.forEach((it: any) => {
            if (it.id == null) return;
            sold[it.id] = (sold[it.id] || 0) + (it.qty || 0);
          })
        );
        setSoldByProduct(sold);
      } catch (e) {
        console.error("Failed to query orders:", e);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    }
    if (authorized && adminPass) {
      fetchOrders();
    }
  }, [authorized, adminPass]);

  // Sync edit form with selection
  useEffect(() => {
    if (selectedId == null) return;
    const p = products.find(x => x.id === selectedId);
    if (p) {
      setEditing({ 
        title: p.title, 
        price: p.price, 
        description: p.description, 
        stock: p.stock ?? 0,
        images: p.images || [p.image] 
      });
    }
  }, [selectedId, products]);

  // Handle image upload helper
  async function handleUpload(): Promise<string | null> {
    if (!file) return null;
    const dataUrl = await new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(String(reader.result));
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

    const payload = { filename: file.name, dataUrl };
    const r = await fetch('/api/upload', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(payload) 
    });
    if (!r.ok) throw new Error('Upload failed');
    const json = await r.json();
    return json.path as string;
  }

  // Add new product
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      setMessage('Adding product...');
      let imagePath = "";
      if (file) {
        setMessage('Uploading image...');
        imagePath = await handleUpload() || "";
      }
      
      const img = imagePath || "wall-hooks.avif";
      const product = {
        title,
        price: Number(price),
        description,
        image: img,
        images: [img],
        stock: Number(stock),
        category
      };

      const r = await fetch('/api/products', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(product) 
      });
      if (!r.ok) throw new Error('Save failed');
      const saved = await r.json();
      setProducts(prev => [...prev, saved]);
      setMessage('Product added successfully!');
      setTitle(''); setPrice(0); setDescription(''); setStock(10); setFile(null);
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  // Update existing product details
  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return setMessage('No product selected');
    try {
      setMessage('Updating...');
      let uploaded: string | null = null;
      if (file) uploaded = await handleUpload();
      const body: any = { 
        id: selectedId, 
        title: editing.title, 
        price: Number(editing.price), 
        description: editing.description,
        stock: Number(editing.stock)
      };
      if (uploaded) {
        body.images = [...(editing.images || []), uploaded];
        body.image = uploaded;
      }
      const r = await fetch('/api/products', { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(body) 
      });
      if (!r.ok) throw new Error('Update failed');
      const updated = await r.json();
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setFile(null);
      setMessage('Product updated successfully!');
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  // Quick stock adjuster from Inventory tab
  async function handleUpdateStock(id: number, newStock: number) {
    try {
      const cleanStock = Math.max(0, newStock);
      const r = await fetch('/api/products', { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id, stock: cleanStock }) 
      });
      if (!r.ok) throw new Error('Stock update failed');
      const updated = await r.json();
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setMessage(`Stock updated to ${cleanStock} for product #${id}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  // Delete a product permanently
  async function handleDeleteProduct(id: number, title?: string) {
    if (!window.confirm(`Delete "${title || `product #${id}`}" permanently? This removes it from the website too.`)) return;
    try {
      const r = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Delete failed');
      setProducts(prev => prev.filter(p => p.id !== id));
      if (selectedId === id) setSelectedId(null);
      setMessage(`Product #${id} deleted`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  // Login action
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await fetch('/api/admins/verify', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ username, password }) 
      });
      if (!r.ok) return setMessage('Invalid username or password');
      sessionStorage.setItem('adminAuth', 'true');
      sessionStorage.setItem('adminPass', password);
      setAdminPass(password);
      setAuthorized(true);
      setMessage('Access granted');
      setTimeout(() => setMessage(''), 2000);
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  // Logout action
  function handleLogout() {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminPass');
    setAuthorized(false);
    setAdminPass('');
    setPassword('');
    setMessage('Logged out');
  }

  // Change an order's status (placed → confirmed → shipped → delivered / cancelled)
  async function handleUpdateOrderStatus(orderNumber: string, newStatus: string) {
    try {
      const r = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-pass': adminPass },
        body: JSON.stringify({ order_number: orderNumber, status: newStatus }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Update failed');
      setOrders(prev => prev.map(o =>
        o.order_number === orderNumber ? { ...o, status: titleCase(newStatus), rawStatus: newStatus } : o
      ));
      setMessage(`Order ${orderNumber} marked ${newStatus}`);
      setTimeout(() => setMessage(''), 2500);
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  // Open a printable invoice / bill for an order in a new window
  function openInvoice(order: any) {
    const w = window.open('', '_blank', 'width=900,height=1000');
    if (!w) { setMessage('Allow pop-ups to print the invoice.'); return; }
    const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const rows = (order.items || []).map((it: any) => `
      <tr>
        <td class="i-name">${it.name}${it.variant ? `<span class="i-sub">${it.variant}${it.color ? ' · ' + it.color : ''}</span>` : ''}</td>
        <td class="c">${String(it.qty).padStart(2, '0')}<span class="i-sub">qty</span></td>
        <td class="r">${inr(it.price)}<span class="i-sub">per unit</span></td>
        <td class="c">0.00</td>
        <td class="r">${inr(it.price * it.qty)}</td>
      </tr>`).join('');

    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${order.order_number}</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',Arial,sans-serif;color:#1A1A1A;background:#f3ece1;padding:32px}
        .inv{max-width:760px;margin:0 auto;background:#fff;padding:44px 46px;box-shadow:0 10px 40px rgba(0,0,0,.08)}
        .top{display:flex;justify-content:space-between;align-items:flex-start}
        .brand-name{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;letter-spacing:1px;line-height:1}
        .brand-ul{display:block;height:3px;width:90px;background:linear-gradient(90deg,#B8963E,transparent);margin-top:4px}
        .brand-sub{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#8a8275;margin-top:8px}
        .banner{display:flex;align-items:center;background:#1A1A1A;color:#fff;padding:14px 26px}
        .banner i{display:inline-block;width:4px;height:26px;background:#B8963E;margin-right:4px}
        .banner i:nth-child(2){opacity:.6}
        .banner b{font-size:30px;font-weight:700;letter-spacing:7px;margin-left:12px}
        .meta{margin-top:18px;font-size:13px;line-height:1.7}
        .meta b{font-weight:700}
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
            <div class="brand-name">Shanya<span class="brand-ul"></span></div>
            <div class="brand-sub">Hair Accessories &amp; Home Essentials</div>
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
            <div class="muted">${order.address || ''}${order.city ? ', ' + order.city : ''}<br>${order.state ? order.state : ''}${order.pincode ? ' - ' + order.pincode : ''}</div>
            <div class="muted">${order.phone || ''}${order.email ? ' · ' + order.email : ''}</div>
          </div>
        </div>

        <hr class="rule">

        <table>
          <thead><tr>
            <th>Item</th><th class="c">Quantity</th><th class="r">Rate</th><th class="c">Tax</th><th class="r">Amount</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="foot">
          <div class="terms">
            <h4>Terms &amp; Conditions:</h4>
            Payment Method: ${String(order.payment_method || 'COD').toUpperCase()}.
            Goods once sold are subject to our 7-day return policy.
            Thank you for shopping with Shanya.
          </div>
          <div class="totals">
            <div class="row"><span class="lbl">Subtotal</span><span>${inr(order.subtotal)}</span></div>
            <div class="row"><span class="lbl">Shipping</span><span>${order.shipping === 0 ? 'Free' : inr(order.shipping)}</span></div>
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

  // Live stats computed entirely from website data (Supabase orders + catalog)
  const displayOrders = orders.length;
  const displayRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalCustomers = new Set(orders.map((o) => o.phone).filter(Boolean)).size;
  const displayProducts = products.length;

  // Order status breakdown for the donut chart
  const statusCounts = orders.reduce((acc, o) => {
    const s = o.status || "Processing";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Revenue per day for the last 7 days
  const salesSeries = buildSalesSeries(orders);

  // Best-selling products by real units sold
  const topProducts = [...products]
    .map((p) => ({ ...p, sold: soldByProduct[p.id] || 0 }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  if (!authorized) {
    return (
      <main className="min-h-screen bg-[#0d1527] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-[#16223f] border border-[#23355d] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#d4af37]" />
          
          <div className="flex flex-col items-center mb-8 text-center">
            {/* Gold Mandala Logo */}
            <svg className="w-16 h-16 text-[#d4af37] mb-3" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="50" cy="50" r="12" strokeWidth="2" />
              <circle cx="50" cy="32" r="12" />
              <circle cx="50" cy="68" r="12" />
              <circle cx="32" cy="50" r="12" />
              <circle cx="68" cy="50" r="12" />
              <circle cx="37" cy="37" r="12" />
              <circle cx="63" cy="63" r="12" />
              <circle cx="37" cy="63" r="12" />
              <circle cx="63" cy="37" r="12" />
            </svg>
            <h1 className="text-2xl font-black text-white tracking-widest">SHANYA</h1>
            <p className="text-xs text-[#c5a880] uppercase tracking-widest font-semibold mt-1">Admin Panel Control</p>
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

  // Sidebar items
  const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Orders", icon: ShoppingBag },
    { label: "Products", icon: Package },
    { label: "Categories", icon: FolderTree },
    { label: "Customers", icon: Users },
    { label: "Coupons", icon: Tag },
    { label: "Reviews", icon: Star },
    { label: "Payments", icon: CreditCard },
    { label: "Reports", icon: BarChart3 },
    { label: "Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-[#f8f9fc] flex font-sans text-gray-800">
      
      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-[#111c2a] text-gray-300 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static`}>
        
        {/* Sidebar Header Logo */}
        <div className="h-20 border-b border-gray-800 flex items-center px-6 gap-3">
          {/* Gold Mandala Logo */}
          <svg className="w-8 h-8 text-[#d4af37] flex-shrink-0" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="50" cy="50" r="12" strokeWidth="2.0" />
            <circle cx="50" cy="32" r="12" />
            <circle cx="50" cy="68" r="12" />
            <circle cx="32" cy="50" r="12" />
            <circle cx="68" cy="50" r="12" />
            <circle cx="37" cy="37" r="12" />
            <circle cx="63" cy="63" r="12" />
            <circle cx="37" cy="63" r="12" />
            <circle cx="63" cy="37" r="12" />
          </svg>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-wider text-white">SHANYA</span>
            <span className="text-[9px] text-[#c5a880] uppercase tracking-widest font-bold -mt-0.5">Admin Panel</span>
          </div>
        </div>

        {/* Sidebar Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  isActive 
                    ? 'bg-[#967850] text-white shadow-md' 
                    : 'hover:bg-gray-800 hover:text-white text-gray-400'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-800"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-xl font-bold text-gray-900">{activeTab}</h2>
          </div>

          {/* Search bar & Notification Area */}
          <div className="flex items-center gap-6">
            
            {/* Search Input */}
            <div className="relative hidden md:block w-60">
              <input 
                placeholder="Search..."
                className="w-full bg-gray-50 border border-gray-100 rounded-lg pl-4 pr-10 py-2.5 text-xs font-medium focus:outline-none focus:border-[#967850] transition"
              />
              <Search size={16} className="absolute right-3.5 top-3 text-gray-400" />
            </div>

            {/* Notification bell */}
            <button className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-full transition">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 border-l border-gray-100 pl-6 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-[#967850]/20 flex items-center justify-center font-bold text-[#967850] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Admin" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-700">
                <span>Admin</span>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-700 transition" />
              </div>
            </div>

          </div>

        </header>

        {/* Dashboard Pages Switchboard */}
        <div className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">

          {message && (
            <div className="bg-[#111c2a] text-[#c5a880] border border-gray-800 px-5 py-4 rounded-xl flex items-center justify-between text-sm shadow-md animate-fade-in font-medium">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#d4af37]" />
                <span>{message}</span>
              </div>
              <button onClick={() => setMessage("")} className="text-gray-400 hover:text-white"><X size={16} /></button>
            </div>
          )}

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "Dashboard" && (
            <>
              {/* Summary Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Orders Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
                    <h3 className="text-2xl font-black text-gray-900">{displayOrders.toLocaleString()}</h3>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-400 font-medium">from website checkout</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <ShoppingBag size={22} />
                  </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</span>
                    <h3 className="text-2xl font-black text-gray-900">₹{displayRevenue.toLocaleString()}</h3>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-400 font-medium">across all orders</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold">₹</span>
                  </div>
                </div>

                {/* Total Customers Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Customers</span>
                    <h3 className="text-2xl font-black text-gray-900">{totalCustomers.toLocaleString()}</h3>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-400 font-medium">unique buyers</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <Users size={22} />
                  </div>
                </div>

                {/* Total Products Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Products</span>
                    <h3 className="text-2xl font-black text-gray-900">{displayProducts}</h3>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-400 font-medium">live in catalog</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                    <Package size={22} />
                  </div>
                </div>

              </div>

              {/* Charts Grid Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sales Line Chart */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">Sales Overview</h4>
                      <p className="text-xs text-gray-400">Revenue, last 7 days</p>
                    </div>
                    <select className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none">
                      <option>Last 7 Days</option>
                    </select>
                  </div>
                  <SalesChart points={salesSeries} />
                </div>

                {/* Order Status Donut Chart */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-900">Order Status</h4>
                    <p className="text-xs text-gray-400">Real-time order statuses</p>
                  </div>
                  <StatusDonutChart counts={statusCounts} total={displayOrders} />
                </div>

              </div>

              {/* Lists and Data Table Grid Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">Recent Orders</h4>
                      <p className="text-xs text-gray-400">Latest shop orders activity</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab("Orders")}
                      className="text-xs font-bold text-[#967850] hover:text-[#7d6340] flex items-center gap-1 transition"
                    >
                      View All Orders <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                          <th className="py-3 px-2">Order ID</th>
                          <th className="py-3 px-2">Customer</th>
                          <th className="py-3 px-2">Amount</th>
                          <th className="py-3 px-2">Payment</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                              {loadingOrders ? "Loading orders…" : "No orders yet. They’ll appear here as customers check out."}
                            </td>
                          </tr>
                        )}
                        {orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                            <td className="py-3 px-2 font-bold text-gray-900">#ORD-{order.id}</td>
                            <td className="py-3 px-2 font-semibold text-gray-700">{order.customer_name}</td>
                            <td className="py-3 px-2 font-bold text-gray-900">₹{order.total_amount?.toLocaleString()}</td>
                            <td className="py-3 px-2 text-gray-500 font-medium">{order.payment_method}</td>
                            <td className="py-3 px-2">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                order.status === "Shipped" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                order.status === "Cancelled" ? "bg-rose-50 text-rose-700 border-rose-200" :
                                "bg-sky-50 text-sky-700 border-sky-200"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-gray-400 font-medium">{order.created_at}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Top Products sold list */}
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">Top Products</h4>
                      <p className="text-xs text-gray-400">Most popular listings</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab("Products")}
                      className="text-xs font-bold text-[#967850] hover:text-[#7d6340] flex items-center gap-1 transition"
                    >
                      View All <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {topProducts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                            <img src={getImgUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-gray-800 line-clamp-1">{p.title}</h5>
                            <p className="text-[10px] text-gray-400">₹{p.price}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">{p.sold} Sold</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB 2: ORDERS LIST */}
          {activeTab === "Orders" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">All Orders Log</h4>
                  <p className="text-xs text-gray-400">Log of orders registered via website checkout</p>
                </div>
                <div className="text-xs font-semibold text-gray-400">
                  Total Orders: {orders.length}
                </div>
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
                          {loadingOrders ? "Loading orders…" : "No orders found in the database yet."}
                        </td>
                      </tr>
                    )}
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition align-top">
                        <td className="py-4 px-4 font-bold text-gray-900">{order.order_number}</td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-800">{order.customer_name}</div>
                          <div className="text-[10px] text-gray-400">{order.phone}{order.city ? ` · ${order.city}` : ""}</div>
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
                            className={`text-[11px] font-bold rounded-full px-2.5 py-1 border focus:outline-none cursor-pointer ${
                              order.rawStatus === "delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                              order.rawStatus === "shipped" ? "bg-amber-50 text-amber-700 border-amber-200" :
                              order.rawStatus === "confirmed" ? "bg-sky-50 text-sky-700 border-sky-200" :
                              order.rawStatus === "cancelled" ? "bg-rose-50 text-rose-700 border-rose-200" :
                              "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            {ORDER_STATUS_FLOW.map((s) => (
                              <option key={s} value={s}>{titleCase(s)}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-4 text-gray-400 font-semibold text-[11px]">{order.created_at}</td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => openInvoice(order)}
                            className="inline-flex items-center gap-1 bg-[#111c2a] hover:bg-[#1c2c44] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition"
                            title="Generate invoice / bill"
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

          {/* TAB 3: PRODUCTS & INVENTORY */}
          {activeTab === "Products" && (
            <div className="space-y-6">
              
              {/* Product and Stock subtab toggle */}
              <div className="bg-white border border-gray-100 p-1.5 rounded-xl shadow-sm inline-flex gap-1.5 text-xs font-bold text-gray-500">
                <button 
                  id="btn-subtab-editor"
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800"
                  onClick={() => {
                    const el1 = document.getElementById("panel-editor");
                    const el2 = document.getElementById("panel-inventory");
                    const b1 = document.getElementById("btn-subtab-editor");
                    const b2 = document.getElementById("btn-subtab-inventory");
                    if(el1 && el2 && b1 && b2) {
                      el1.classList.remove("hidden");
                      el2.classList.add("hidden");
                      b1.classList.add("bg-gray-100", "text-gray-800");
                      b2.classList.remove("bg-gray-100", "text-gray-800");
                    }
                  }}
                >
                  Product Manager
                </button>
                <button 
                  id="btn-subtab-inventory"
                  className="px-4 py-2 rounded-lg"
                  onClick={() => {
                    const el1 = document.getElementById("panel-editor");
                    const el2 = document.getElementById("panel-inventory");
                    const b1 = document.getElementById("btn-subtab-editor");
                    const b2 = document.getElementById("btn-subtab-inventory");
                    if(el1 && el2 && b1 && b2) {
                      el1.classList.add("hidden");
                      el2.classList.remove("hidden");
                      b2.classList.add("bg-gray-100", "text-gray-800");
                      b1.classList.remove("bg-gray-100", "text-gray-800");
                    }
                  }}
                >
                  Inventory Stock Manager
                </button>
              </div>

              {/* Subtab Panel 1: Product Editor */}
              <div id="panel-editor" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Product Selector & Add New Form */}
                <div className="space-y-6">
                  
                  {/* Select Product to edit */}
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-3">
                    <h4 className="font-bold text-gray-900 text-sm">Select Product to Edit</h4>
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-[#967850]"
                      value={selectedId ?? ""} 
                      onChange={(e) => setSelectedId(Number(e.target.value))}
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>ID: #{p.id} — {p.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Add New Product Form */}
                  <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                    <h4 className="font-bold text-gray-900 text-sm">Add New Product</h4>
                    <form onSubmit={handleAdd} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Product Title</label>
                        <input 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          placeholder="e.g. Silk Printed Dupatta" 
                          required
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none focus:border-[#967850]"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-500 font-bold mb-1">Price (₹)</label>
                          <input 
                            value={price || ""} 
                            onChange={(e) => setPrice(Number(e.target.value))} 
                            type="number" 
                            placeholder="e.g. 1499" 
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none focus:border-[#967850]"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 font-bold mb-1">Stock Qty</label>
                          <input 
                            value={stock || ""} 
                            onChange={(e) => setStock(Number(e.target.value))} 
                            type="number" 
                            placeholder="e.g. 50" 
                            required
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none focus:border-[#967850]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Description</label>
                        <textarea 
                          value={description} 
                          onChange={(e) => setDescription(e.target.value)} 
                          placeholder="Write product specifications here..." 
                          rows={3}
                          required
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none focus:border-[#967850]"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none focus:border-[#967850]"
                        >
                          {categoriesData.map((c) => (
                            <option key={c.slug} value={c.slug}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-500 font-bold mb-1">Upload Product Image</label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                          className="w-full bg-gray-50 text-[10px] text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#967850]/10 file:text-[#967850] hover:file:bg-[#967850]/20"
                        />
                      </div>

                      <button className="w-full bg-navy-700 hover:bg-navy-800 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition mt-2">
                        <Plus size={16} /> Save Product
                      </button>
                    </form>
                  </div>

                </div>

                {/* Right Side: Edit Product details */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                      <div>
                        <h4 className="font-bold text-gray-900">Edit Product Panel</h4>
                        <p className="text-xs text-gray-400">Modify properties of the selected product</p>
                      </div>
                      <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold border border-blue-100">
                        Selected ID: #{selectedId}
                      </span>
                    </div>

                    {selectedId ? (
                      <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 text-xs">
                          <div>
                            <label className="block text-gray-500 font-bold mb-1">Title</label>
                            <input 
                              value={editing.title} 
                              onChange={(e) => setEditing(s => ({...s, title: e.target.value}))} 
                              className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none focus:border-[#967850]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-gray-500 font-bold mb-1">Price (₹)</label>
                              <input 
                                value={editing.price || ""} 
                                onChange={(e) => setEditing(s => ({...s, price: Number(e.target.value)}))} 
                                type="number" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none focus:border-[#967850]"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-500 font-bold mb-1">Stock Level</label>
                              <input 
                                value={editing.stock || ""} 
                                onChange={(e) => setEditing(s => ({...s, stock: Number(e.target.value)}))} 
                                type="number" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none focus:border-[#967850]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-gray-500 font-bold mb-1">Description</label>
                            <textarea 
                              value={editing.description} 
                              onChange={(e) => setEditing(s => ({...s, description: e.target.value}))} 
                              rows={4}
                              className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none focus:border-[#967850]"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-500 font-bold mb-1">Upload New Image (Optional)</label>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                              className="w-full bg-gray-50 text-[10px] text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#967850]/10 file:text-[#967850] hover:file:bg-[#967850]/20"
                            />
                          </div>

                          <div className="pt-2 flex items-center gap-3">
                            <button className="bg-[#967850] hover:bg-[#7d6340] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-1.5 transition">
                              <Edit size={16} /> Update Details
                            </button>
                            <button
                              type="button"
                              onClick={() => selectedId && handleDeleteProduct(selectedId, editing.title)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg font-bold flex items-center gap-1.5 transition"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </div>

                        {/* Image Preview Panel */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Images Gallery</h5>
                          <div className="grid grid-cols-2 gap-3">
                            {editing.images && editing.images.map((img: string, i: number) => (
                              <div key={i} className="border border-gray-100 rounded-lg overflow-hidden relative group aspect-video bg-gray-50 flex items-center justify-center">
                                <img src={getImgUrl(img)} alt={img} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-10 text-gray-400 font-medium">Select a product on the left to start editing.</div>
                    )}
                  </div>
                </div>

              </div>

              {/* Subtab Panel 2: Inventory Stock Manager */}
              <div id="panel-inventory" className="hidden bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900">Inventory Stock Levels</h4>
                  <p className="text-xs text-gray-400">View and update stock counts for all catalog products directly</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50">
                        <th className="py-3.5 px-4 w-16 text-center">ID</th>
                        <th className="py-3.5 px-4 w-20">Preview</th>
                        <th className="py-3.5 px-4">Product Name</th>
                        <th className="py-3.5 px-4">Price</th>
                        <th className="py-3.5 px-4 w-36 text-center">Status</th>
                        <th className="py-3.5 px-4 w-48 text-center">Stock Count</th>
                        <th className="py-3.5 px-4 w-40 text-center">Quick Adjust</th>
                        <th className="py-3.5 px-4 w-20 text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const stockVal = p.stock ?? 0;
                        const statusColor = 
                          stockVal >= 15 ? "bg-green-50 text-green-700 border-green-200" :
                          stockVal > 0 ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-red-50 text-red-700 border-red-200";
                        const statusLabel =
                          stockVal >= 15 ? "In Stock" :
                          stockVal > 0 ? "Low Stock" :
                          "Out of Stock";
                        
                        return (
                          <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/20 transition">
                            <td className="py-3 px-4 font-bold text-gray-500 text-center">#{p.id}</td>
                            <td className="py-3 px-4">
                              <div className="w-10 h-10 rounded border border-gray-100 overflow-hidden bg-gray-50">
                                <img src={getImgUrl(p.image)} alt={p.title} className="w-full h-full object-cover" />
                              </div>
                            </td>
                            <td className="py-3 px-4 font-semibold text-gray-800">{p.title}</td>
                            <td className="py-3 px-4 font-bold text-gray-900">₹{p.price}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusColor}`}>
                                {statusLabel}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <input 
                                id={`stock-input-${p.id}`}
                                type="number" 
                                defaultValue={stockVal}
                                className="w-20 bg-gray-50 border border-gray-100 rounded text-center py-1 font-bold focus:outline-none focus:border-[#967850]"
                              />
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button 
                                  onClick={() => {
                                    const input = document.getElementById(`stock-input-${p.id}`) as HTMLInputElement;
                                    if(input) {
                                      const newVal = Math.max(0, Number(input.value) - 1);
                                      input.value = String(newVal);
                                      handleUpdateStock(p.id, newVal);
                                    }
                                  }}
                                  className="w-7 h-7 bg-gray-50 border border-gray-100 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"
                                >
                                  <Minus size={12} />
                                </button>
                                <button 
                                  onClick={() => {
                                    const input = document.getElementById(`stock-input-${p.id}`) as HTMLInputElement;
                                    if(input) {
                                      const newVal = Number(input.value) + 1;
                                      input.value = String(newVal);
                                      handleUpdateStock(p.id, newVal);
                                    }
                                  }}
                                  className="w-7 h-7 bg-gray-50 border border-gray-100 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500 transition"
                                >
                                  <Plus size={12} />
                                </button>
                                <button 
                                  onClick={() => {
                                    const input = document.getElementById(`stock-input-${p.id}`) as HTMLInputElement;
                                    if(input) {
                                      handleUpdateStock(p.id, Number(input.value));
                                    }
                                  }}
                                  className="ml-1 px-2.5 py-1 bg-navy-700 hover:bg-navy-800 text-white rounded text-[10px] font-bold transition flex items-center gap-0.5"
                                >
                                  <Check size={10} /> Set
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                className="w-7 h-7 mx-auto bg-red-50 border border-red-200 rounded flex items-center justify-center hover:bg-red-100 text-red-600 transition"
                                title="Delete product"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: MOCK TABS (CATEGORIES, CUSTOMERS, ETC.) */}
          {activeTab === "Categories" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h4 className="font-bold text-gray-900">Product Categories</h4>
                <p className="text-xs text-gray-400">Classify products into taxonomies</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_CATEGORIES.map(cat => (
                  <div key={cat.name} className="border border-gray-100 rounded-xl p-5 shadow-sm space-y-2 relative overflow-hidden bg-gray-50/50">
                    <span className="text-xs font-bold text-[#967850] uppercase tracking-wider">Taxonomy</span>
                    <h5 className="font-bold text-lg text-gray-900">{cat.name}</h5>
                    <p className="text-xs text-gray-400">{cat.count} listings items</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Customers" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h4 className="font-bold text-gray-900">Customer Accounts</h4>
                <p className="text-xs text-gray-400">List of registered buyers</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Registration</th>
                      <th className="py-3 px-4">Total Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="py-3 px-4 font-bold text-gray-800">Priya Sharma</td>
                      <td className="py-3 px-4 text-gray-500">priya@gmail.com | 9876543210</td>
                      <td className="py-3 px-4 text-gray-400">May 2024</td>
                      <td className="py-3 px-4 font-bold text-gray-800">12 orders</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-3 px-4 font-bold text-gray-800">Ankit Verma</td>
                      <td className="py-3 px-4 text-gray-500">ankit@gmail.com | 9822114455</td>
                      <td className="py-3 px-4 text-gray-400">Apr 2024</td>
                      <td className="py-3 px-4 font-bold text-gray-800">4 orders</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-3 px-4 font-bold text-gray-800">Neha Singh</td>
                      <td className="py-3 px-4 text-gray-500">neha@gmail.com | 9192837465</td>
                      <td className="py-3 px-4 text-gray-400">May 2024</td>
                      <td className="py-3 px-4 font-bold text-gray-800">7 orders</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Coupons" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h4 className="font-bold text-gray-900">Active Coupons</h4>
                <p className="text-xs text-gray-400">Manage promo codes and discounts</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_COUPONS.map(c => (
                  <div key={c.code} className="border border-gray-100 rounded-xl p-5 shadow-sm bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#967850]/10 text-[#967850] text-xs font-black px-2.5 py-1 rounded border border-[#967850]/20 tracking-wider">
                        {c.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === "Active" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-400 border border-gray-200"
                      }`}>{c.status}</span>
                    </div>
                    <div>
                      <h5 className="font-black text-xl text-gray-900">{c.discount} Off</h5>
                      <p className="text-[10px] text-gray-400 mt-1">Expiry date: {c.expiry}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h4 className="font-bold text-gray-900">User Reviews</h4>
                <p className="text-xs text-gray-400">Feedback submitted by customers</p>
              </div>
              <div className="divide-y divide-gray-100">
                {MOCK_REVIEWS.map((r, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-800">{r.author}</span>
                        <span className="text-[10px] text-gray-400 font-medium">on product: {r.product}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx}>{idx < r.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium leading-relaxed">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Payments" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h4 className="font-bold text-gray-900">Payment Transactions</h4>
                <p className="text-xs text-gray-400">Real-time payment history and invoices</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50">
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Gateway</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Invoice Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">pay_H8f9Hndn0n</td>
                      <td className="py-3.5 px-4 text-gray-600 font-semibold">Razorpay</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-bold">Success</td>
                      <td className="py-3.5 px-4 font-black text-gray-900">₹2,499</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-3.5 px-4 font-bold text-gray-900">pay_H884ndu891</td>
                      <td className="py-3.5 px-4 text-gray-600 font-semibold">Razorpay</td>
                      <td className="py-3.5 px-4 text-emerald-600 font-bold">Success</td>
                      <td className="py-3.5 px-4 font-black text-gray-900">₹3,249</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h4 className="font-bold text-gray-900">Analytics Reports</h4>
                <p className="text-xs text-gray-400">Monthly conversion and metrics reporting</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                  <h5 className="font-bold text-gray-800 text-sm">Monthly Growth Rate</h5>
                  <div className="h-40 flex items-end gap-3 justify-center pb-2">
                    <div className="w-10 bg-[#967850]/20 h-16 rounded-t flex flex-col items-center justify-end pb-1 text-[9px] font-bold text-[#967850]"><span>Jan</span></div>
                    <div className="w-10 bg-[#967850]/40 h-24 rounded-t flex flex-col items-center justify-end pb-1 text-[9px] font-bold text-[#967850]"><span>Feb</span></div>
                    <div className="w-10 bg-[#967850]/60 h-28 rounded-t flex flex-col items-center justify-end pb-1 text-[9px] font-bold text-[#967850]"><span>Mar</span></div>
                    <div className="w-10 bg-[#967850]/80 h-32 rounded-t flex flex-col items-center justify-end pb-1 text-[9px] font-bold text-white"><span>Apr</span></div>
                    <div className="w-10 bg-[#967850] h-36 rounded-t flex flex-col items-center justify-end pb-1 text-[9px] font-bold text-white"><span>May</span></div>
                  </div>
                </div>
                <div className="border border-gray-100 rounded-xl p-5 shadow-sm space-y-3 flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-emerald-500" size={32} />
                    <div>
                      <h6 className="font-bold text-gray-900">Conversion Rate: 3.4%</h6>
                      <p className="text-xs text-gray-400">Higher than typical industry average (2.1%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <h4 className="font-bold text-gray-900">General Settings</h4>
                <p className="text-xs text-gray-400">Configure admin and store configurations</p>
              </div>
              <form className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Store Name</label>
                  <input defaultValue="Shanya Store" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Admin Email Notify</label>
                  <input defaultValue="admin@shanya.com" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Currency Symbol</label>
                  <input defaultValue="INR (₹)" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 focus:outline-none" disabled />
                </div>
                <button type="button" onClick={() => setMessage("Settings saved (Simulated)")} className="bg-[#967850] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#7d6340] transition">
                  Save Configurations
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </main>
  );
}

// Chart Components declared in file (avoids hydration and build issues)
function SalesChart({ points }: { points: { label: string; val: number }[] }) {
  const data = points && points.length ? points : [{ label: "", val: 0 }];
  const x0 = 40, x1 = 480, yTop = 40, yBottom = 200;
  const maxVal = Math.max(...data.map((d) => d.val), 1);
  const niceMax = Math.ceil(maxVal / 4) * 4 || 4;
  const step = data.length > 1 ? (x1 - x0) / (data.length - 1) : 0;
  const coords = data.map((d, i) => {
    const x = x0 + step * i;
    const y = yBottom - (d.val / niceMax) * (yBottom - yTop);
    return { x, y, ...d };
  });

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
          <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#purpleGrad)" />
        <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

        {coords.map((c, i) => (
          <circle key={i} cx={c.x} cy={c.y} r="5" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2.5" />
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
  const C = 2 * Math.PI * 36; // circumference for r=36
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
                cx="50"
                cy="50"
                r="36"
                stroke={s.color}
                strokeWidth="14"
                fill="transparent"
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

      <div className="flex flex-col gap-2.5 text-xs text-gray-600 font-medium">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="w-16">{s.key}</span>
            <span className="text-gray-900 font-semibold">{s.value}</span>
            <span className="text-gray-400 text-[10px]">({(s.frac * 100).toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
