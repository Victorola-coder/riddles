/**
 * Admin API Functions
 * Type-safe API calls for admin operations
 */

import { api } from "./client";

// Import types from types.d.ts
type AdminStats = {
  totalUsers: number;
  totalRiddles: number;
  totalSolved: number;
  totalGemsEarned: number;
  activeSessions: number;
};

type ActivityResponse = {
  activities: ActivityItem[];
  meta: PaginationMeta;
};

type ActivityItem = {
  id: string;
  type: string;
  category: "admin" | "user" | "system";
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown> | null;
};

type PaginationMeta = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type AdminRiddle = {
  id: string;
  question: string;
  answer: string | string[];
  difficulty: string;
  category?: string;
  hint1?: string;
  hint2?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type AdminRiddlesResponse = {
  riddles: AdminRiddle[];
  meta: PaginationMeta;
};

type AdminUser = {
  id: string;
  email?: string;
  username?: string;
  totalGems: number;
  totalRiddlesSolved: number;
  currentStreak: number;
  currentLevel: number;
  lastPlayedDate?: string;
  createdAt: string;
};

type AdminUsersResponse = {
  users: AdminUser[];
  meta: PaginationMeta;
};

type CreateRiddleData = {
  question: string;
  answer: string | string[];
  difficulty: "easy" | "medium" | "hard";
  category?: string;
  hint1?: string;
  hint2?: string;
  tags?: string[];
};

type UpdateRiddleData = {
  question?: string;
  answer?: string | string[];
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
  hint1?: string;
  hint2?: string;
  tags?: string[];
  isActive?: boolean;
};

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
};
