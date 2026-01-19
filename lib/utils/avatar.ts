/**
 * DiceBear avatar helper (Adesina-style)
 *
 * Goals:
 * - Deterministic avatars for authenticated users (same seed => same avatar everywhere)
 * - Stable avatar for guests (persist a random seed in localStorage)
 * - Zero per-page plumbing: `Avatar` can derive a seed from a "hint" string
 */

const GUEST_SEED_STORAGE_KEY = "riddle-quest-avatar-seed";

function randomSeed(): string {
  // Short, URL-safe-ish seed
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Returns a stable seed:
 * - If a meaningful hint is provided (username/email/userId), use it.
 * - Otherwise, treat it as guest and persist a random seed on the client.
 */
export function getAvatarSeed(seedHint?: string | null): string {
  const trimmed = (seedHint || "").trim();

  // Treat generic placeholders as "guest"
  const isGuestHint =
    !trimmed ||
    trimmed.toLowerCase() === "guest" ||
    trimmed.toLowerCase() === "anonymous";

  if (!isGuestHint) return trimmed;

  // Server-side: no localStorage. Use a constant so SSR/edge doesn't crash.
  if (typeof window === "undefined") return "guest";

  const existing = window.localStorage.getItem(GUEST_SEED_STORAGE_KEY);
  if (existing) return existing;

  const created = `guest_${randomSeed()}`;
  window.localStorage.setItem(GUEST_SEED_STORAGE_KEY, created);
  return created;
}

/**
 * Generates a deterministic DiceBear avatar URL from a seed hint.
 */
export function getAvatarUrl(seedHint?: string | null): string {
  const seed = getAvatarSeed(seedHint);
  const safeSeed = encodeURIComponent(seed);

  // DiceBear v9 HTTP API
  // - thumbs: friendly, playful
  // - radius: rounded, works well in circles
  // - backgroundColor: aligned with our purple/yellow palette
  return `https://api.dicebear.com/9.x/thumbs/png?seed=${safeSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
}
