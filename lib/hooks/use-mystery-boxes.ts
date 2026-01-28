import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

type AdminListBoxesResponse = { boxes: MysteryBox[] };
type AdminSeedResponse = { message: string; created: number };

type AdminListRewardsResponse = { rewards: MysteryBoxReward[] };
type AdminCreateBoxResponse = { box: MysteryBox };
type AdminUpdateBoxResponse = { box: MysteryBox };
type AdminCreateRewardResponse = { reward: MysteryBoxReward };
type AdminUpdateRewardResponse = { reward: MysteryBoxReward };

export function useAdminMysteryBoxes() {
  return useQuery<MysteryBox[]>({
    queryKey: ["admin", "mystery-boxes"],
    queryFn: async () => {
      const response = (await adminApi.mysteryBox.listBoxes()) as unknown as AdminListBoxesResponse;
      return response.boxes;
    },
  });
}

export function useCreateMysteryBox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMysteryBoxData) => {
      return (await adminApi.mysteryBox.createBox(data)) as unknown as AdminCreateBoxResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mystery-boxes"] });
      toast.success("Mystery box created");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to create mystery box"));
    },
  });
}

export function useUpdateMysteryBox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMysteryBoxData }) => {
      return (await adminApi.mysteryBox.updateBox(id, data)) as unknown as AdminUpdateBoxResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mystery-boxes"] });
      toast.success("Mystery box updated");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update mystery box"));
    },
  });
}

export function useDeleteMysteryBox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return (await adminApi.mysteryBox.deleteBox(id)) as unknown as { success: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mystery-boxes"] });
      toast.success("Mystery box deleted");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete mystery box"));
    },
  });
}

export function useSeedMysteryBoxes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return (await adminApi.mysteryBox.seed()) as unknown as AdminSeedResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mystery-boxes"] });
      toast.success(data.message || `Seeded ${data.created} mystery boxes`);
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to seed mystery boxes"));
    },
  });
}

export function useAddMysteryBoxReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMysteryBoxRewardData) => {
      const { mysteryBoxId, ...payload } = data;
      return (await adminApi.mysteryBox.createReward(mysteryBoxId, payload)) as unknown as AdminCreateRewardResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mystery-boxes"] });
      toast.success("Reward added");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to add reward"));
    },
  });
}

export function useUpdateMysteryBoxReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMysteryBoxRewardData }) => {
      return (await adminApi.mysteryBox.updateReward(id, data)) as unknown as AdminUpdateRewardResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mystery-boxes"] });
      toast.success("Reward updated");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update reward"));
    },
  });
}

export function useDeleteMysteryBoxReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return (await adminApi.mysteryBox.deleteReward(id)) as unknown as { success: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "mystery-boxes"] });
      toast.success("Reward deleted");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete reward"));
    },
  });
}

export function useAdminMysteryBoxRewards(boxId?: string) {
  return useQuery<MysteryBoxReward[]>({
    queryKey: ["admin", "mystery-boxes", "rewards", boxId],
    queryFn: async () => {
      if (!boxId) return [];
      const response = (await adminApi.mysteryBox.listRewards(boxId)) as unknown as AdminListRewardsResponse;
      return response.rewards;
    },
    enabled: !!boxId,
  });
}

