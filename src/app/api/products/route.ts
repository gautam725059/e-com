import fs from 'fs/promises';
import path from 'path';

const productsPath = path.join(process.cwd(), 'src', 'data', 'products.json');

export async function GET() {
  try {
    const productsRaw = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(productsRaw) as any[];
    return new Response(JSON.stringify(products), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productsRaw = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(productsRaw) as any[];

    const maxId = products.reduce((m, p) => Math.max(m, p.id || 0), 0);
    const newProduct = { id: maxId + 1, ...body };
    products.push(newProduct);

    await fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf-8');
    return new Response(JSON.stringify(newProduct), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updates } = body as { id: number; [key: string]: any };
    if (!id) return new Response('Missing id', { status: 400 });

    const productsRaw = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(productsRaw) as any[];
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return new Response('Not found', { status: 404 });

    // merge updates
    products[idx] = { ...products[idx], ...updates };
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf-8');
    return new Response(JSON.stringify(products[idx]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!id) return new Response('Missing id', { status: 400 });

    const productsRaw = await fs.readFile(productsPath, 'utf-8');
    const products = JSON.parse(productsRaw) as any[];
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return new Response('Not found', { status: 404 });

    const [removed] = products.splice(idx, 1);
    await fs.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf-8');
    return new Response(JSON.stringify({ ok: true, id: removed.id }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}
