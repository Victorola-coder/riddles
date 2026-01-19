/**
 * DiceBear avatar helper
 * Generates a deterministic avatar URL based on a seed (e.g., username or email)
 * Uses the "thumbs" sprite set for a friendly look that matches the playful brand.
 */
export function getAvatarUrl(seed: string): string {
  const safeSeed = encodeURIComponent(seed || "riddle-quest");
  return `https://api.dicebear.com/9.x/thumbs/png?seed=${safeSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;
}
