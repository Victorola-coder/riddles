/**
 * Daily Challenge Configuration
 * Streak bonuses for consecutive daily challenge completions
 */

export const DAILY_CHALLENGE_CONFIG = {
  // Streak bonus tiers (gems awarded on top of base reward)
  STREAK_BONUSES: {
    3: 10,   // 3-day streak: +10 gems
    7: 25,   // 7-day streak: +25 gems
    14: 50,  // 14-day streak: +50 gems
    30: 100, // 30-day streak: +100 gems
  } as Record<number, number>,

  // Base bonus gems for completing daily challenge
  BASE_BONUS: 20,

  // Maximum solve time for leaderboard (in milliseconds)
  MAX_SOLVE_TIME_MS: 10 * 60 * 1000, // 10 minutes

  // Leaderboard limit
  LEADERBOARD_LIMIT: 100,
} as const;

/**
 * Get streak bonus gems for a given streak count
 */
export function getStreakBonus(streak: number): number {
  // Find the highest tier the streak qualifies for
  const tiers = Object.keys(DAILY_CHALLENGE_CONFIG.STREAK_BONUSES)
    .map(Number)
    .sort((a, b) => b - a); // Descending order

  for (const tier of tiers) {
    if (streak >= tier) {
      return DAILY_CHALLENGE_CONFIG.STREAK_BONUSES[tier];
    }
  }

  return 0;
}
