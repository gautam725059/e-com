import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

// Constant-time string compare — avoids leaking the password via response timing.
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/**
 * Verify an admin password.
 *  • If ADMIN_PASSWORD is set (production), that is the ONLY accepted password.
 *    This makes the env var authoritative and lets you rotate it without a deploy,
 *    and ensures any password committed to the repo cannot be used in production.
 *  • Only when ADMIN_PASSWORD is NOT set do we fall back to admins.json (local dev).
 */
export async function verifyAdminPass(pass: string | null | undefined): Promise<boolean> {
  if (!pass) return false;

  const envPass = process.env.ADMIN_PASSWORD;
  if (envPass) return safeEqual(pass, envPass);

  // Dev fallback only — never reached when ADMIN_PASSWORD is configured.
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "src", "data", "admins.json"), "utf-8");
    const admins = JSON.parse(raw) as { username?: string; password: string }[];
    return admins.some((a) => typeof a.password === "string" && safeEqual(pass, a.password));
  } catch {
    return false;
  }
}

// Auth check for admin API routes (password sent in the x-admin-pass header).
export async function isAdminRequest(req: Request): Promise<boolean> {
  return verifyAdminPass(req.headers.get("x-admin-pass"));
}
