import fs from "fs/promises";
import path from "path";

// Verify an admin password. In production set ADMIN_PASSWORD as an env var so
// the secret never lives in the repo. Falls back to admins.json for local dev.
export async function verifyAdminPass(pass: string | null | undefined): Promise<boolean> {
  if (!pass) return false;
  if (process.env.ADMIN_PASSWORD && pass === process.env.ADMIN_PASSWORD) return true;
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "src", "data", "admins.json"), "utf-8");
    const admins = JSON.parse(raw) as { username?: string; password: string }[];
    return admins.some((a) => a.password === pass);
  } catch {
    return false;
  }
}

// Auth check for admin API routes (password sent in the x-admin-pass header).
export async function isAdminRequest(req: Request): Promise<boolean> {
  return verifyAdminPass(req.headers.get("x-admin-pass"));
}
