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
   * Get a single user by ID with detailed information
   */
  getUser: (id: string) =>
    api.get<{
      user: AdminUser & {
        recentAttempts?: any[];
        session?: any;
      };
    }>(`/api/admin/users/${id}`, {
      requireAuth: true,
    }),

  /**
   * Adjust user gems (add or deduct)
   */
  adjustGems: (id: string, data: { amount: number; reason: string }) =>
    api.post<{
      success: boolean;
      user: { id: string; username?: string; email?: string; totalGems: number };
      message: string;
    }>(`/api/admin/users/${id}/gems`, data, {
      requireAuth: true,
    }),

  /**
   * Update user (reset progress, etc.)
   */
  updateUser: (id: string, data: { action: string; [key: string]: any }) =>
    api.patch<{
      success: boolean;
      user: AdminUser;
      message: string;
    }>(`/api/admin/users/${id}`, data, {
      requireAuth: true,
    }),

  /**
   * Delete a user account
   */
  deleteUser: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/admin/users/${id}`, {
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
    
  /**
   * Store Management
   */
  store: {
    getItems: () => api.get<any[]>("/api/admin/store/items", { requireAuth: true }),
    
    createItem: (data: any) => 
      api.post<any>("/api/admin/store/items", data, { requireAuth: true }),
      
    updateItem: (id: string, data: any) =>
      api.put<any>(`/api/admin/store/items/${id}`, data, { requireAuth: true }),
      
    deleteItem: (id: string) =>
      api.delete<{ success: boolean }>(`/api/admin/store/items/${id}`, { requireAuth: true }),
      
    seedItems: () => api.post<{ success: boolean; message: string }>("/api/admin/store/seed", {}, { requireAuth: true }),
  },
  
  riddles: {
    seedRiddles: () => api.post<{ success: boolean; message: string }>("/api/admin/riddles/seed", {}, { requireAuth: true }),
  },
};
