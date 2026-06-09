"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState('admin');

  const [products, setProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editing, setEditing] = useState({ title: "", price: 0, description: "", images: [] as string[] });

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(data => {
      setProducts(data);
      if (data.length) {
        setSelectedId(data[0].id);
        setEditing({ title: data[0].title, price: data[0].price, description: data[0].description, images: data[0].images || [data[0].image] });
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const auth = sessionStorage.getItem('adminAuth');
      if (auth === 'true') setAuthorized(true);
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (selectedId == null) return;
    const p = products.find(x => x.id === selectedId);
    if (p) setEditing({ title: p.title, price: p.price, description: p.description, images: p.images || [p.image] });
  }, [selectedId, products]);

  async function handleUpload(): Promise<string | null> {
    if (!file) return null;
    const dataUrl = await new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(String(reader.result));
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

    const payload = { filename: file.name, dataUrl };
    const r = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error('Upload failed');
    const json = await r.json();
    return json.path as string;
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    try {
      setMessage('Uploading image...');
      const imagePath = await handleUpload();
      setMessage('Saving product...');
      const product = { title, price: Number(price), description, image: imagePath?.split('/').pop() || "" };
      const r = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(product) });
      if (!r.ok) throw new Error('Save failed');
      const saved = await r.json();
      setProducts(prev => [...prev, saved]);
      setMessage('Product saved');
      setTitle(''); setPrice(0); setDescription(''); setFile(null);
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  async function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return setMessage('No product selected');
    try {
      setMessage('Updating...');
      let uploaded: string | null = null;
      if (file) uploaded = await handleUpload();
      const body: any = { id: selectedId, title: editing.title, price: Number(editing.price), description: editing.description };
      if (uploaded) {
        const fn = uploaded.split('/').pop();
        body.images = [...(editing.images || []), fn];
      }
      const r = await fetch('/api/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error('Update failed');
      const updated = await r.json();
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setFile(null);
      setMessage('Product updated');
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await fetch('/api/admins/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      if (!r.ok) return setMessage('Invalid credentials');
      sessionStorage.setItem('adminAuth', 'true');
      setAuthorized(true);
      setMessage('Authorized');
    } catch (err: any) {
      setMessage(String(err.message || err));
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('adminAuth');
    setAuthorized(false);
    setPassword('');
    setMessage('Logged out');
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-3">
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full border px-3 py-2" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" className="w-full border px-3 py-2" />
            <div className="flex items-center justify-between">
              <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
              <div className="text-sm text-red-500">{message}</div>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div>
          <button onClick={handleLogout} className="bg-gray-200 px-3 py-1 rounded">Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-3">Products</h2>
            <select className="w-full border p-2" value={selectedId ?? undefined} onChange={(e) => setSelectedId(Number(e.target.value))}>
              {products.map(p => <option key={p.id} value={p.id}>{p.id} — {p.title}</option>)}
            </select>

            <div className="mt-4">
              <h3 className="text-sm font-medium">Add New Product</h3>
              <form onSubmit={handleAdd} className="space-y-2 mt-2">
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border px-3 py-2" />
                <input value={price} onChange={(e) => setPrice(Number(e.target.value))} type="number" placeholder="Price" className="w-full border px-3 py-2" />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border px-3 py-2" />
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                <button className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded">Add product</button>
              </form>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-2">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            {selectedId ? (
              <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input value={editing.title} onChange={(e) => setEditing(s => ({...s, title: e.target.value}))} className="w-full border px-3 py-2" />

                  <label className="block text-sm font-medium mt-3">Price</label>
                  <input value={editing.price} onChange={(e) => setEditing(s => ({...s, price: Number(e.target.value)}))} type="number" className="w-full border px-3 py-2" />

                  <label className="block text-sm font-medium mt-3">Description</label>
                  <textarea value={editing.description} onChange={(e) => setEditing(s => ({...s, description: e.target.value}))} className="w-full border px-3 py-2" />

                  <label className="block text-sm font-medium mt-3">Upload image</label>
                  <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />

                        <div className="mt-4">
                          <button className="bg-blue-600 text-white px-4 py-2 rounded">Update product</button>
                        </div>
                </div>

                <div>
                  <h3 className="font-medium">Preview</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {(editing.images || []).map((img: string, i: number) => (
                      <div key={i} className="border rounded overflow-hidden">
                        <img src={`/images/${img}`} alt={img} className="w-full h-32 object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              <div>Select a product to edit</div>
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 text-sm text-gray-700">{message}</div>
    </main>
  );
}
