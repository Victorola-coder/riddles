/**
 * Riddles API Functions
 * Public API calls for fetching riddles
 */

import { api } from './client';

export interface Riddle {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
  hint1?: string;
  hint2?: string;
  tags: string[];
}

export interface RiddlesResponse {
  riddles: Riddle[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

/**
 * Public Riddles API endpoints
 */
export const riddlesApi = {
  /**
   * Get riddles with optional filtering
   */
  getRiddles: (params?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    limit?: number;
    offset?: number;
  }) =>
    api.get<RiddlesResponse>('/api/riddles', {
      params,
    }),

  /**
   * Get a single riddle by ID (without answer)
   */
  getRiddle: (id: string) =>
    api.get<{ riddle: Riddle }>(`/api/riddles/${id}`),
};
