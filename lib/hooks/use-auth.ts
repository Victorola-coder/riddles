"use client";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, ApiClientError } from "@/lib/api";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/client-auth";

// Cache configuration constants
const USER_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const USER_STALE_TIME = 5 * 60 * 1000; // 5 minutes

export { getAuthToken, setAuthToken };

export function clearAuthToken() {
  removeAuthToken();
}

export type UserData = {
  id: string;
  email: string;
  username?: string;
  totalGems: number;
  totalRiddlesSolved?: number;
  currentStreak?: number;
  longestStreak?: number;
  currentLevel: number;
  lastPlayedDate?: string | Date | null;
  achievements?: string[];
};

/**
 * Get current authenticated user
 * Follows adesina.io pattern
 */
export function useCurrentUser() {
  return useQuery<UserData | null>({
    queryKey: ["user", "me"],
    queryFn: async (): Promise<UserData | null> => {
      const token = getAuthToken();
      if (!token) return null;

      try {
        const response = await authApi.getMe();
        return response.user;
      } catch (error) {
        // Clear invalid token
        if (error instanceof ApiClientError && error.status === 401) {
          clearAuthToken();
        }
        // Only show error if it's not a 401 (auth issue)
        if (
          error instanceof Error &&
          !error.message.includes("401") &&
          !error.message.includes("unauthorized")
        ) {
          toast.error(error.message || "Failed to load user data");
        }
        throw error;
      }
    },
    enabled: !!getAuthToken(),
    retry: false,
    staleTime: USER_STALE_TIME,
    gcTime: USER_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
}

/**
 * Sign up new user
 * Updates auth state on success
 */
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      username?: string;
    }) => {
      try {
        return await authApi.signup(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError ? error.message : "Signup failed";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      setAuthToken(data.token, data.user);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      toast.success("Account created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Signup failed. Please try again.");
    },
  });
}

/**
 * Login user
 * Updates auth state on success
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      rememberMe?: boolean;
    }) => {
      try {
        return await authApi.login(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError ? error.message : "Login failed";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      setAuthToken(data.token, data.user);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      toast.success("Login successful!");
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    },
  });
}

/**
 * Logout user
 * Clears auth state and queries, calls server to clear session
 * Returns a logout function that accepts an optional router for navigation
 * 
 * Usage in components:
 *   const logout = useLogout();
 *   const router = useRouter();
 *   await logout(router); // Pass router for fast client-side navigation
 * 
 * Or use router.push directly in components for better control
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return async (router?: { push: (path: string) => void }) => {
    try {
      // Call server to clear session and cookies
      await authApi.logout();
    } catch (error) {
      // Even if API call fails, continue with client-side cleanup
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear client state
      clearAuthToken();
      queryClient.clear();
      // Use Next.js router for fast client-side navigation if provided
      if (router) {
        router.push("/auth");
      } else if (typeof window !== "undefined") {
        // Fallback: use replace instead of href (doesn't add to history, slightly faster)
        // Components should pass router for optimal performance
        window.location.replace("/auth");
      }
    }
  };
}

/**
 * Request password reset
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      try {
        return await authApi.forgotPassword(email);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to send reset email";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast.success("Password reset email sent! Check your inbox.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send reset email");
    },
  });
}

/**
 * Reset password with token
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      try {
        return await authApi.resetPassword(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to reset password";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      toast.success("Password reset successfully! You can now login.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reset password");
    },
  });
}
