"use client";

/**
 * Client-side authentication token management
 * Handles user authentication tokens (separate from admin tokens)
 * Follows adesina.io patterns
 */

const AUTH_TOKEN_KEY = "auth_token";

/**
 * Get user authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Set user authentication token
 */
export function setAuthToken(token: string, user?: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Remove user authentication token
 */
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}
