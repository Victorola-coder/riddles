import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/auth-token";

/**
 * Server-side admin auth helper for `/api/admin/*` routes.
 *
 * Admin tokens are JWTs signed by `signAuthToken` and include `{ type: 'admin' }`.
 * We accept either:
 * - `decoded.type === 'admin'` (preferred)
 * - `decoded.userId === 'admin'` (back-compat)
 */
export function requireAdminAuth(
  req: NextRequest
): { userId: string; type?: string } | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  const decoded = verifyAuthToken(token);
  if (!decoded) return null;

  if (decoded.type !== "admin" && decoded.userId !== "admin") return null;

  return decoded;
}

