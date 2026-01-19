/**
 * Auth API Functions
 * Type-safe API calls for authentication operations
 */

import { api } from "./client";

/**
 * Auth API endpoints
 */
export const authApi: {
  login: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    token: string;
    user: {
      id: string;
      email: string;
      username: string;
      totalGems: number;
      currentLevel: number;
    };
  }>;
  signup: (data: { email: string; password: string; username?: string }) => Promise<{
    success: boolean;
    token: string;
    user: {
      id: string;
      email: string;
      username?: string;
      totalGems?: number;
      currentLevel?: number;
    };
  }>;
  getMe: () => Promise<{
    user: {
      id: string;
      email: string;
      username: string;
      totalGems: number;
      currentLevel: number;
    };
  }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (data: { token: string; password: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: {
    username?: string;
    password?: string;
    confirmPassword?: string;
  }) => Promise<{
    success: boolean;
    user: {
      id: string;
      email: string;
      username?: string;
      totalGems: number;
      currentLevel: number;
    };
    message: string;
  }>;
} = {
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

  /**
   * Logout user
   * Clears server-side session and cookies
   */
  logout: () =>
    api.post<{ success: boolean; message: string }>(
      "/api/auth/logout",
      {},
      { requireAuth: false } // Allow logout even if token is invalid
    ),

  /**
   * Update user profile
   */
  updateProfile: (data: {
    username?: string;
    password?: string;
    confirmPassword?: string;
  }) =>
    api.patch<{
      success: boolean;
      user: {
        id: string;
        email: string;
        username?: string;
        totalGems: number;
        currentLevel: number;
      };
      message: string;
    }>("/api/auth/me", data, { requireAuth: true }),
};
