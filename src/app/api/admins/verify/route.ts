import { verifyAdminPass } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body as { username: string; password: string };
    if (!username || !password) return new Response("Missing", { status: 400 });

    const ok = await verifyAdminPass(password);
    if (!ok) return new Response("Unauthorized", { status: 401 });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Server error", { status: 500 });
  }
}
