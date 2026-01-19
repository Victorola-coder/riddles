/**
 * Auth API Functions
 * Type-safe API calls for authentication operations
 */

import { api } from "./client";

/**
 * Auth API endpoints
 */
export const authApi = {
  /**
   * Login user
   */
  login: (credentials: { email: string; password: string }) =>
    api.post<{
      success: boolean;
      token: string;
      user: {
        id: string;
        email: string;
        username: string;
        totalGems: number;
        currentLevel: number;
      };
    }>("/api/auth/login", credentials),

  /**
   * Sign up new user
   */
  signup: (data: { email: string; password: string; username?: string }) =>
    api.post<{
      success: boolean;
      token: string;
      user: {
        id: string;
        email: string;
        username?: string;
        totalGems?: number;
        currentLevel?: number;
      };
    }>("/api/auth/signup", data),

  /**
   * Get current user info
   */
  getMe: () =>
    api.get<{
      user: {
        id: string;
        email: string;
        username: string;
        totalGems: number;
        currentLevel: number;
      };
    }>("/api/auth/me", { requireAuth: true }),

  /**
   * Request password reset
   */
  forgotPassword: (email: string) =>
    api.post<{ success: boolean; message: string }>(
      "/api/auth/forgot-password",
      {
        email,
      }
    ),

  /**
   * Reset password with token
   */
  resetPassword: (data: { token: string; password: string }) =>
    api.post<{ success: boolean; message: string }>(
      "/api/auth/reset-password",
      data
    ),
};
