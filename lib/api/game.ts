/**
 * Game API Functions
 * Type-safe API calls for game operations
 */

import { api } from './client';

/**
 * Game API endpoints
 */
export const gameApi = {
  /**
   * Get or create game session
   */
  getSession: (userId?: string) =>
    api.get<{
      user: {
        id: string;
        username?: string;
        totalGems: number;
        currentLevel: number;
      };
      session: {
        id: string;
        currentRiddleId?: string;
        solvedRiddles: string[];
        skippedRiddles: string[];
        userGems: number;
        currentLevel: number;
        hintsUsed: Record<string, number[]>;
      };
    }>('/api/game/session', {
      params: userId ? { userId } : undefined,
    }),

  /**
   * Update game session
   */
  updateSession: (data: {
    userId: string;
    currentRiddleId?: string;
    solvedRiddles?: string[];
    skippedRiddles?: string[];
    userGems?: number;
    currentLevel?: number;
  }) =>
    api.post<{ session: unknown }>('/api/game/session', data),

  /**
   * Submit answer to solve a riddle
   */
  solveRiddle: (data: {
    userId: string;
    riddleId: string;
    answer: string;
    modifier?: string;
  }) =>
    api.post<{
      correct: boolean;
      gemsEarned: number;
      message: string;
    }>('/api/game/solve', data),

  /**
   * Get a hint for a riddle
   */
  getHint: (data: {
    userId: string;
    riddleId: string;
    hintLevel: number;
  }) =>
    api.post<{
      hint: string;
      gemsSpent: number;
      remainingGems: number;
    }>('/api/game/hint', data),

  /**
   * Record a riddle attempt
   */
  recordAttempt: (data: {
    userId: string;
    riddleId: string;
    answer: string;
    isCorrect: boolean;
  }) =>
    api.post<{ success: boolean }>('/api/game/attempt', data),

  /**
   * Get user's attempt history
   */
  getAttempts: (userId: string, params?: { riddleId?: string; limit?: number }) =>
    api.get<{
      attempts: Array<{
        id: string;
        riddleId: string;
        isCorrect: boolean;
        answerGiven: string;
        gemsEarned: number;
        createdAt: string;
      }>;
    }>('/api/game/attempt', {
      params: { userId, ...params },
    }),
};
