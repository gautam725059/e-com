import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { filename, dataUrl } = body as { filename: string; dataUrl: string };
    if (!filename || !dataUrl) return new Response('Invalid', { status: 400 });

    // dataUrl looks like: data:<mime>;base64,<data>
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) return new Response('Bad data', { status: 400 });
    const base64 = match[2];
    const buffer = Buffer.from(base64, 'base64');

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    // ensure unique filename
    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/${safeName}`;
    return new Response(JSON.stringify({ path: publicPath }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response('Server error', { status: 500 });
  }
}
