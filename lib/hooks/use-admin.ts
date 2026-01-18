"use client";

import { toast } from "sonner";
import { getAdminToken } from "@/lib/admin-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Cache duration: 5 minutes (300000ms)
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const error = new Error(
            data.error || "Failed to fetch dashboard statistics"
          );
          toast.error(error.message);
          throw error;
        }
        const data = await res.json();
        return data.stats as AdminStats;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to load dashboard statistics");
        }
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    retry: 1,
  });
}

export function useAdminActivity(options?: {
  page?: number;
  pageSize?: number;
  type?: "admin" | "user";
  activityType?: string;
}) {
  const { page = 1, pageSize = 10, type, activityType } = options || {};

  return useQuery<ActivityResponse>({
    queryKey: ["admin", "activity", page, pageSize, type, activityType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (type) params.append("type", type);
      if (activityType) params.append("activityType", activityType);

      const res = await fetch(`/api/admin/activity?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch recent activities");
      }
      const data = await res.json();
      return {
        activities: data.activities as ActivityItem[],
        meta: data.meta as PaginationMeta,
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute - activities should be more fresh
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });
}

export function useAdminRiddles(
  page = 1,
  pageSize = 12,
  search?: string,
  difficulty?: "easy" | "medium" | "hard" | "all"
) {
  return useQuery<AdminRiddlesResponse>({
    queryKey: ["admin", "riddles", page, pageSize, search, difficulty],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (search) params.append("search", search);
      if (difficulty && difficulty !== "all") {
        params.append("difficulty", difficulty);
      }

      try {
        const res = await fetch(`/api/admin/riddles?${params.toString()}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const error = new Error(data.error || "Failed to fetch riddles");
          toast.error(error.message);
          throw error;
        }
        const data = await res.json();
        return {
          riddles: data.riddles as AdminRiddle[],
          meta: data.meta as PaginationMeta,
        };
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to fetch riddles");
        }
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    retry: 1,
  });
}

export function useAdminUsers(page = 1, pageSize = 12, search?: string) {
  return useQuery<AdminUsersResponse>({
    queryKey: ["admin", "users", page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (search) params.append("search", search);

      try {
        const res = await fetch(`/api/admin/users?${params.toString()}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const error = new Error(data.error || "Failed to fetch users");
          toast.error(error.message);
          throw error;
        }
        const data = await res.json();
        return {
          users: data.users as AdminUser[],
          meta: data.meta as PaginationMeta,
        };
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message || "Failed to fetch users");
        }
        throw error;
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    retry: 1,
  });
}

// Mutations
export function useCreateRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRiddleData) => {
      const res = await fetch("/api/admin/riddles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create riddle");
      }

      return res.json();
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
      const res = await fetch(`/api/admin/riddles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update riddle");
      }

      return res.json();
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
      const res = await fetch(`/api/admin/riddles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete riddle");
      }

      return res.json();
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
