"use client";

import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gameApi, ApiClientError } from "@/lib/api";
import { useGameStore } from "@/lib/store/game-store";
import { useUserStore } from "@/lib/store/user-store";

// Cache configuration constants
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const ATTEMPTS_STALE_TIME = 2 * 60 * 1000; // 2 minutes
const ATTEMPTS_CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Get or create game session
 * Syncs server state to Zustand store
 */
export function useGameSession(userId?: string) {
  const query = useQuery({
    queryKey: ["game", "session", userId],
    queryFn: async () => {
      try {
        const response = await gameApi.getSession(userId);
        return response;
      } catch (error) {
        // Log error but don't throw to prevent query from failing repeatedly
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to fetch game session";
        console.error("Game session fetch error:", message, error);
        // Return a default structure instead of throwing to prevent infinite retries
        throw new Error(message);
      }
    },
    enabled: !!userId,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    retry: (failureCount, error) => {
      // Only retry once and only for network errors, not for API errors
      if (failureCount < 1 && error instanceof Error && !error.message.includes("Failed to fetch game session")) {
        return true;
      }
      return false;
    },
  });

  // Sync server data to Zustand store when query succeeds
  // Use dataUpdatedAt and query.data as dependencies to avoid infinite loops
  const { dataUpdatedAt, data } = query;
  const sessionRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (data?.session) {
      const serverSession = data.session;
      const sessionKey = JSON.stringify({
        currentRiddleId: serverSession.currentRiddleId,
        solvedRiddles: serverSession.solvedRiddles,
        skippedRiddles: serverSession.skippedRiddles,
        userGems: serverSession.userGems,
        currentLevel: serverSession.currentLevel,
      });

      if (sessionRef.current !== sessionKey) {
        sessionRef.current = sessionKey;

        // Prefer whichever source has more progress (more riddles solved)
        // to avoid overwriting fresh localStorage state with stale server data
        const localState = useGameStore.getState();
        const serverSolved = (serverSession.solvedRiddles || []).length;
        const localSolved = (localState.solvedRiddles || []).length;

        if (serverSolved >= localSolved) {
          useGameStore.setState({
            currentRiddleId: serverSession.currentRiddleId || null,
            solvedRiddles: serverSession.solvedRiddles || [],
            skippedRiddles: serverSession.skippedRiddles || [],
            userGems: serverSession.userGems || 0,
            currentLevel: serverSession.currentLevel || 1,
            hintsUsed: serverSession.hintsUsed || {},
          });
        }
        // If local has more progress, keep local state — the auto-save
        // will sync it to the server shortly
      }
    }
  }, [dataUpdatedAt, data]);

  // Handle errors silently - don't throw to prevent query from failing repeatedly
  useEffect(() => {
    if (query.error) {
      // Don't show toast for session errors - handled gracefully
      console.error("Failed to load game session:", query.error);
    }
  }, [query.error]);

  return query;
}

/**
 * Update game session state
 */
export function useUpdateGameSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId: string;
      currentRiddleId?: string;
      solvedRiddles?: string[];
      skippedRiddles?: string[];
      userGems?: number;
      currentLevel?: number;
    }) => {
      try {
        return await gameApi.updateSession(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to update session";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["game", "session"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update session");
    },
  });
}

/**
 * Solve a riddle
 * Updates Zustand optimistically, syncs with server
 */
export function useSolveRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId: string;
      riddleId: string;
      answer: string;
    }) => {
      try {
        return await gameApi.solveRiddle(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to solve riddle";
        throw new Error(message);
      }
    },
    onSuccess: (response) => {
      if (response.correct) {
        // Gems and stats are already updated optimistically in the game page.
        // Only update streak (not tracked optimistically) and refresh queries
        // so the server-authoritative state syncs back.
        const { updateStreak } = useUserStore.getState();
        updateStreak();

        queryClient.invalidateQueries({ queryKey: ["game", "session"] });
        queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to solve riddle");
    },
  });
}

/**
 * Get a hint for a riddle
 */
export function useGetHint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId: string;
      riddleId: string;
      hintLevel: number;
    }) => {
      try {
        return await gameApi.getHint(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to get hint";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      // Gems already spent optimistically in game/page.tsx — just refresh session
      queryClient.invalidateQueries({ queryKey: ["game", "session"] });
    },
    onError: (error: Error, variables) => {
      // Use toast ID to prevent duplicate error messages
      const toastId = `hint-error-${variables.riddleId}-${variables.hintLevel}`;
      toast.error(error.message || "Failed to get hint", {
        id: toastId, // This prevents duplicate toasts with the same ID
        duration: 3000,
      });
    },
  });
}

/**
 * Record a riddle attempt
 */
export function useRecordAttempt() {
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      riddleId: string;
      answer: string;
      isCorrect: boolean;
    }) => {
      try {
        return await gameApi.recordAttempt(data);
      } catch (error) {
        // Silent fail - attempts are logged but not critical
        console.error("Failed to record attempt:", error);
        throw error;
      }
    },
  });
}

/**
 * Get user's attempt history
 */
export function useAttempts(userId: string, options?: { riddleId?: string; limit?: number }) {
  return useQuery({
    queryKey: ["game", "attempts", userId, options?.riddleId, options?.limit],
    queryFn: async () => {
      try {
        return await gameApi.getAttempts(userId, options);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to fetch attempts";
        throw new Error(message);
      }
    },
    enabled: !!userId,
    staleTime: ATTEMPTS_STALE_TIME,
    gcTime: ATTEMPTS_CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
