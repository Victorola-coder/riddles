"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gameApi } from "@/lib/api";
import { ApiClientError } from "@/lib/api/client";

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 2 * 60 * 1000; // 2 minutes

/**
 * List user-submitted riddles
 */
export function useUserRiddles(params?: {
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["riddle-creator", "list", params],
    queryFn: async () => {
      try {
        return await gameApi.riddleCreator.list(params);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to fetch riddles";
        throw new Error(message);
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * Get current user's submitted riddles
 */
export function useMyRiddles() {
  return useQuery({
    queryKey: ["riddle-creator", "my-riddles"],
    queryFn: async () => {
      try {
        return await gameApi.riddleCreator.myRiddles();
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to fetch your riddles";
        throw new Error(message);
      }
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

/**
 * Submit a new riddle
 */
export function useSubmitRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      question: string;
      answer: string | string[];
      difficulty: string;
      category?: string;
      hint1?: string;
      hint2?: string;
      tags?: string | string[];
    }) => {
      try {
        return await gameApi.riddleCreator.submit(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to submit riddle";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riddle-creator"] });
      toast.success("Riddle submitted! It's pending admin review.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit riddle");
    },
  });
}

/**
 * Vote on a riddle
 */
export function useVoteRiddle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { userRiddleId: string; value: 1 | -1 }) => {
      try {
        return await gameApi.riddleCreator.vote(data);
      } catch (error) {
        const message =
          error instanceof ApiClientError
            ? error.message
            : "Failed to vote on riddle";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riddle-creator"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to vote");
    },
  });
}
