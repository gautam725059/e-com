import fs from 'fs/promises';
import path from 'path';

const adminsPath = path.join(process.cwd(), 'src', 'data', 'admins.json');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body as { username: string; password: string };
    if (!username || !password) return new Response('Missing', { status: 400 });

    const raw = await fs.readFile(adminsPath, 'utf-8');
    const admins = JSON.parse(raw) as any[];
    const found = admins.find(a => a.username === username && a.password === password);
    if (!found) return new Response('Unauthorized', { status: 401 });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}
