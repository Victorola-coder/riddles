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
