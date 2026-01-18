"use client";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, ApiClientError } from "@/lib/api";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/client-auth";

export { getAuthToken, setAuthToken };

export function clearAuthToken() {
  removeAuthToken();
}

/**
 * Get current authenticated user
 * Follows adesina.io pattern
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
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
        throw error;
      }
    },
    enabled: !!getAuthToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on tab switch
    onError: (error: Error) => {
      // Only show error if it's not a 401 (auth issue)
      if (!error.message.includes("401") && !error.message.includes("unauthorized")) {
        toast.error(error.message || "Failed to load user data");
      }
    },
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
          error instanceof ApiClientError
            ? error.message
            : "Signup failed";
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
          error instanceof ApiClientError
            ? error.message
            : "Login failed";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      setAuthToken(data.token, data.user);
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      toast.success("Login successful!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed. Please check your credentials.");
    },
  });
}

/**
 * Logout user
 * Clears auth state and queries
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return async () => {
    try {
      // Call server to clear session
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear client state
      clearAuthToken();
      queryClient.clear();
      // Redirect to login
      window.location.href = "/login";
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
