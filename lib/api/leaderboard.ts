/**
 * Leaderboard API Functions
 * Type-safe API calls for leaderboard operations
 */

import { api } from './client';

// LeaderboardEntry is defined globally in types.d.ts

/**
 * Leaderboard API endpoints
 */
export const leaderboardApi = {
  /**
   * Get leaderboard data
   */
  getLeaderboard: (params: {
    type?: 'global' | 'weekly' | 'daily';
    limit?: number;
    offset?: number;
  }) =>
    api.get<{
      leaderboard: LeaderboardEntry[];
      meta: {
        total: number;
        limit: number;
        offset: number;
      };
    }>('/api/leaderboard', { params }),
};
