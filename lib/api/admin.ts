/**
 * Admin API Functions
 * Type-safe API calls for admin operations
 * 
 * Note: Types are defined globally in types.d.ts
 */

import { api } from "./client";

/**
 * Admin API endpoints
 */
export const adminApi = {
  /**
   * Get admin dashboard statistics
   */
  getStats: () =>
    api.get<{ stats: AdminStats }>("/api/admin/stats", { requireAuth: true }),

  /**
   * Get activity logs with pagination
   */
  getActivity: (params: {
    page?: number;
    pageSize?: number;
    type?: "admin" | "user";
    activityType?: string;
  }) =>
    api.get<ActivityResponse>("/api/admin/activity", {
      params,
      requireAuth: true,
    }),

  /**
   * Get riddles with pagination and filters
   */
  getRiddles: (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    difficulty?: "easy" | "medium" | "hard" | "all";
  }) =>
    api.get<AdminRiddlesResponse>("/api/admin/riddles", {
      params,
      requireAuth: true,
    }),

  /**
   * Get a single riddle by ID
   */
  getRiddle: (id: string) =>
    api.get<{ riddle: AdminRiddle }>(`/api/admin/riddles/${id}`, {
      requireAuth: true,
    }),

  /**
   * Create a new riddle
   */
  createRiddle: (data: CreateRiddleData) =>
    api.post<{ riddle: AdminRiddle }>("/api/admin/riddles", data, {
      requireAuth: true,
    }),

  /**
   * Update an existing riddle
   */
  updateRiddle: (id: string, data: UpdateRiddleData) =>
    api.patch<{ riddle: AdminRiddle }>(`/api/admin/riddles/${id}`, data, {
      requireAuth: true,
    }),

  /**
   * Delete a riddle
   */
  deleteRiddle: (id: string) =>
    api.delete<{ success: boolean }>(`/api/admin/riddles/${id}`, {
      requireAuth: true,
    }),

  /**
   * Get users with pagination
   */
  getUsers: (params: { page?: number; pageSize?: number; search?: string }) =>
    api.get<AdminUsersResponse>("/api/admin/users", {
      params,
      requireAuth: true,
    }),

  /**
   * Authenticate admin
   */
  authenticate: (accessCode: string) =>
    api.post<{ token: string; success: boolean }>("/api/admin/auth", {
      accessCode,
    }),

  /**
   * Get game settings
   */
  getSettings: () =>
    api.get<{
      settings: {
        gemRewards: { easy: number; medium: number; hard: number };
        gemCosts: { hint1: number; hint2: number; hint3: number; skip: number };
        initialGems: number;
      };
    }>("/api/admin/settings", { requireAuth: true }),

  /**
   * Update game settings
   */
  updateSettings: (data: {
    gemRewards: { easy: number; medium: number; hard: number };
    gemCosts: { hint1: number; hint2: number; hint3: number; skip: number };
    initialGems: number;
  }) =>
    api.post<{
      success: boolean;
      message: string;
      settings: {
        gemRewards: { easy: number; medium: number; hard: number };
        gemCosts: { hint1: number; hint2: number; hint3: number; skip: number };
        initialGems: number;
      };
    }>("/api/admin/settings", data, { requireAuth: true }),
};
