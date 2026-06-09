import fs from 'fs/promises';
import path from 'path';

const adminsPath = path.join(process.cwd(), 'src', 'data', 'admins.json');

export async function GET() {
  try {
    const raw = await fs.readFile(adminsPath, 'utf-8');
    const admins = JSON.parse(raw);
    // do not expose passwords in GET
    const safe = admins.map((a: any) => ({ id: a.id, username: a.username }));
    return new Response(JSON.stringify(safe), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body as { username: string; password: string };
    if (!username || !password) return new Response('Missing fields', { status: 400 });

    const raw = await fs.readFile(adminsPath, 'utf-8');
    const admins = JSON.parse(raw) as any[];
    if (admins.length >= 5) return new Response('Max admins reached', { status: 400 });

    const exists = admins.find(a => a.username === username);
    if (exists) return new Response('User exists', { status: 400 });

    const maxId = admins.reduce((m, a) => Math.max(m, a.id || 0), 0);
    const newAdmin = { id: maxId + 1, username, password };
    admins.push(newAdmin);
    await fs.writeFile(adminsPath, JSON.stringify(admins, null, 2), 'utf-8');
    return new Response(JSON.stringify({ id: newAdmin.id, username: newAdmin.username }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}
