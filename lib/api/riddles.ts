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
  answer?: string | string[]; // Included when includeAnswers=true for instant validation
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
    includeAnswers?: boolean; // For game use - enables instant client-side validation
  }) =>
    api.get<RiddlesResponse>('/api/riddles', {
      params: params ? {
        ...params,
        includeAnswers: params.includeAnswers ? 'true' : undefined,
      } : undefined,
    }),

  /**
   * Get a single riddle by ID (without answer)
   */
  getRiddle: (id: string) =>
    api.get<{ riddle: Riddle }>(`/api/riddles/${id}`),
};
