"use client";

import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi, ApiClientError } from "@/lib/api";

// Cache duration: 5 minutes (300000ms)
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useAdminStats(options?: { realTime?: boolean }) {
  const { realTime = true } = options || {};
  
  return useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      try {
        const response = await adminApi.getStats();
        return response.stats;
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to load dashboard statistics";
        toast.error(message);
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    // Real-time updates: refetch every 10 seconds when enabled
    refetchInterval: realTime ? 10000 : false,
    retry: 1,
  });
}

export function useAdminActivity(options?: {
  page?: number;
  pageSize?: number;
  type?: "admin" | "user";
  activityType?: string;
  realTime?: boolean;
}) {
  const { page = 1, pageSize = 10, type, activityType, realTime = true } = options || {};

  return useQuery<ActivityResponse>({
    queryKey: ["admin", "activity", page, pageSize, type, activityType],
    queryFn: async () => {
      try {
        return await adminApi.getActivity({ page, pageSize, type, activityType });
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to fetch recent activities";
        console.error("Failed to load activities:", error);
        throw new Error(message);
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute - activities should be more fresh
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    // Real-time updates: refetch every 15 seconds when enabled
    refetchInterval: realTime ? 15000 : false,
    retry: 1,
  });
}

export function useAdminRiddles(
  page = 1,
  pageSize = 12,
  search?: string,
  difficulty?: "easy" | "medium" | "hard" | "all",
  options?: { realTime?: boolean }
) {
  const { realTime = false } = options || {}; // Riddles don't need real-time by default
  
  return useQuery<AdminRiddlesResponse>({
    queryKey: ["admin", "riddles", page, pageSize, search, difficulty],
    queryFn: async () => {
      try {
        return await adminApi.getRiddles({ page, pageSize, search, difficulty });
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to fetch riddles";
        toast.error(message);
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    // Real-time updates: refetch every 20 seconds when enabled
    refetchInterval: realTime ? 20000 : false,
    retry: 1,
  });
}

export function useAdminUsers(
  page = 1,
  pageSize = 12,
  search?: string,
  options?: { realTime?: boolean }
) {
  const { realTime = false } = options || {}; // Users don't need real-time by default
  
  return useQuery<AdminUsersResponse>({
    queryKey: ["admin", "users", page, pageSize, search],
    queryFn: async () => {
      try {
        return await adminApi.getUsers({ page, pageSize, search });
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to fetch users";
        toast.error(message);
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    // Real-time updates: refetch every 20 seconds when enabled
    refetchInterval: realTime ? 20000 : false,
    retry: 1,
  });
}

// Mutations
export function useCreateRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRiddleData) => {
      try {
        return await adminApi.createRiddle(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to create riddle";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "riddles"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity"] });
      toast.success("Riddle created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create riddle");
    },
  });
}

export function useUpdateRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRiddleData;
    }) => {
      try {
        return await adminApi.updateRiddle(id, data);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to update riddle";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "riddles"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity"] });
      toast.success("Riddle updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update riddle");
    },
  });
}

export function useDeleteRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await adminApi.deleteRiddle(id);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to delete riddle";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "riddles"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "activity"] });
      toast.success("Riddle deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete riddle");
    },
  });
}

/**
 * Daily Challenge (Admin)
 */
export function useAdminDailyChallenges(params: { from: string; to: string }) {
  return useQuery({
    queryKey: ["admin", "daily-challenge", "list", params.from, params.to],
    queryFn: async () => {
      return await adminApi.dailyChallenge.list(params);
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useAdminUpsertDailyChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { date: string; riddleId: string; bonusGems?: number }) => {
      try {
        return await adminApi.dailyChallenge.upsert(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError ? error.message : "Failed to save daily challenge";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "daily-challenge"] });
      toast.success("Daily challenge saved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save daily challenge");
    },
  });
}

export function useAdminDeleteDailyChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await adminApi.dailyChallenge.delete(id);
      } catch (error) {
        const message =
          error instanceof ApiClientError ? error.message : "Failed to delete daily challenge";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "daily-challenge"] });
      toast.success("Daily challenge deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete daily challenge");
    },
  });
}

export function useAdminSeedDailyChallenges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (days: number) => {
      try {
        return await adminApi.dailyChallenge.seed(days);
      } catch (error) {
        const message =
          error instanceof ApiClientError ? error.message : "Failed to seed daily challenges";
        throw new Error(message);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "daily-challenge"] });
      toast.success(data.message || "Seeded daily challenges");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to seed daily challenges");
    },
  });
}

export function useAdminDailyChallengeEntries(date: string, enabled = true) {
  return useQuery({
    queryKey: ["admin", "daily-challenge", "entries", date],
    queryFn: async () => {
      return await adminApi.dailyChallenge.entries(date);
    },
    enabled: enabled && !!date,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

/**
 * Riddle Creator (Admin)
 */
export function useAdminUserRiddles(params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["admin", "riddle-creator", params],
    queryFn: async () => {
      try {
        return await adminApi.riddleCreator.list(params);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to fetch user riddles";
        throw new Error(message);
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useAdminApproveRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        return await adminApi.riddleCreator.approve(id);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to approve riddle";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "riddle-creator"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "riddles"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      toast.success("Riddle approved and added to game!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to approve riddle");
    },
  });
}

export function useAdminRejectRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      try {
        return await adminApi.riddleCreator.reject(id, reason);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to reject riddle";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "riddle-creator"] });
      toast.success("Riddle rejected");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject riddle");
    },
  });
}
