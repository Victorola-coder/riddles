import { api } from './client';
import type { Riddle } from '@/types/riddle';

export interface DailyChallenge {
  id: string;
  riddleId: string;
  riddle: Riddle;
  date: string; // YYYY-MM-DD
  bonusGems: number;
}

export interface DailyChallengeEntry {
  id: string;
  userId: string;
  solveTimeMs: number | null;
  isCorrect: boolean;
  completedAt: string;
  user?: {
    id: string;
    username: string | null;
  };
}

export interface DailyChallengeResponse {
  challenge: DailyChallenge | null;
  userEntry: DailyChallengeEntry | null;
  userStreak: number;
}

export interface DailyChallengeLeaderboardEntry {
  rank: number;
  userId: string;
  username: string | null;
  solveTimeMs: number;
  completedAt: string;
}

export interface DailyChallengeLeaderboard {
  entries: DailyChallengeLeaderboardEntry[];
  totalEntries: number;
}

export const dailyChallengeApi = {
  /**
   * Get today's daily challenge
   */
  async getToday(): Promise<DailyChallengeResponse> {
    return api.get<DailyChallengeResponse>('/daily-challenge');
  },

  /**
   * Submit answer for today's daily challenge
   */
  async submitAnswer(data: {
    userId: string;
    answer: string;
  }): Promise<{
    isCorrect: boolean;
    gemsEarned: number;
    streakBonus: number;
    newStreak: number;
    solveTimeMs?: number;
  }> {
    return api.post('/daily-challenge/submit', data);
  },

  /**
   * Get today's leaderboard
   */
  async getLeaderboard(): Promise<DailyChallengeLeaderboard> {
    return api.get<DailyChallengeLeaderboard>('/daily-challenge/leaderboard');
  },
};
