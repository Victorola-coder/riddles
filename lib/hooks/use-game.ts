"use client";

import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gameApi, ApiClientError } from "@/lib/api";
import { useGameStore } from "@/lib/store/game-store";
import { useUserStore } from "@/lib/store/user-store";

// Cache duration: 5 minutes
const CACHE_TIME = 5 * 60 * 1000;
const STALE_TIME = 5 * 60 * 1000;

/**
 * Get or create game session
 * Syncs server state to Zustand store
 */
export function useGameSession(userId?: string) {
  return useQuery({
    queryKey: ["game", "session", userId],
    queryFn: async () => {
      try {
        const response = await gameApi.getSession(userId);
        return response;
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to fetch game session";
        throw new Error(message);
      }
    },
    enabled: !!userId,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
    onSuccess: (data) => {
      // Sync server data to Zustand store
      if (data.session) {
        useGameStore.setState({
          currentRiddleId: data.session.currentRiddleId || null,
          solvedRiddles: data.session.solvedRiddles || [],
          skippedRiddles: data.session.skippedRiddles || [],
          userGems: data.session.userGems || 0,
          currentLevel: data.session.currentLevel || 1,
          hintsUsed: data.session.hintsUsed || {},
        });
      }
    },
    onError: (error: Error) => {
      // Don't show toast for session errors - handled gracefully
      console.error("Failed to load game session:", error);
    },
  });
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
    onSuccess: (response, variables) => {
      if (response.correct) {
        // Update Zustand stores from server response (following adesina.io pattern)
        const { solveRiddle, earnGems } = useGameStore.getState();
        const { incrementTotalSolved, addGemsEarned, updateStreak } = useUserStore.getState();

        solveRiddle(variables.riddleId, response.gemsEarned);
        earnGems(response.gemsEarned);
        incrementTotalSolved();
        addGemsEarned(response.gemsEarned);
        updateStreak();

        // Invalidate queries to refetch fresh data
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
    onSuccess: (response) => {
      // Update Zustand store with gems spent (following adesina.io pattern)
      if (response.gemsSpent > 0) {
        const { spendGems } = useGameStore.getState();
        spendGems(response.gemsSpent);
      }

      // Invalidate session to get updated gems
      queryClient.invalidateQueries({ queryKey: ["game", "session"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to get hint");
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
