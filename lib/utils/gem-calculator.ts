import { DifficultyLevel } from '@/types/riddle';
import { GAME_CONFIG } from '@/lib/constants/game-config';

/**
 * Calculates gems earned for solving a riddle
 */
export const calculateGemsEarned = (
  difficulty: DifficultyLevel,
  hintsUsed: number = 0
): number => {
  const baseReward = GAME_CONFIG.GEM_REWARDS[difficulty];

  // Reduce reward if hints were used (optional penalty)
  // For now, we give full reward regardless of hints
  return baseReward;
};

/**
 * Calculates total gems spent on a riddle
 */
export const calculateGemsSpent = (hintsUsed: number[]): number => {
  return hintsUsed.reduce((total, hintLevel) => {
    const costKey = `hint${hintLevel}` as keyof typeof GAME_CONFIG.GEM_COSTS;
    return total + GAME_CONFIG.GEM_COSTS[costKey];
  }, 0);
};

/**
 * Formats gem count for display
 */
export const formatGemCount = (gems: number): string => {
  if (gems >= 1000) {
    return `${(gems / 1000).toFixed(1)}k`;
  }
  return gems.toString();
};
