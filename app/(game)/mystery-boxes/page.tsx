"use client";

import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth";
import { OpeningAnimation } from "@/app/components/organisms/mystery-box/OpeningAnimation";
import { toast } from "sonner";

type MysteryBoxListItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  rarity: MysteryBoxRarity;
  isActive: boolean;
  rewardCount: number;
  rarityChances: Record<string, number>;
};

const RARITY_COLORS = {
  COMMON: "from-gray-600 to-gray-700 border-gray-500",
  RARE: "from-blue-600 to-blue-700 border-blue-500",
  EPIC: "from-purple-600 to-purple-700 border-purple-500",
  LEGENDARY: "from-yellow-500 to-yellow-600 border-yellow-500",
};

export default function MysteryBoxesPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [openingBox, setOpeningBox] = useState<MysteryBoxListItem | null>(null);
  const [openingResult, setOpeningResult] = useState<OpenMysteryBoxResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // Fetch available boxes
  const { data: boxesData, isLoading } = useQuery<MysteryBoxListItem[]>({
    queryKey: ["mystery-boxes"],
    queryFn: async () => {
      const response = await api.get<{ boxes: MysteryBoxListItem[] }>("/api/mystery-box");
      return response.boxes;
    },
  });

  // Open box mutation
  const openMutation = useMutation({
    mutationFn: async (boxId: string) => {
      if (!user) throw new Error("Please log in to open mystery boxes");
      return await api.post<OpenMysteryBoxResult>("/api/mystery-box/open", {
        userId: user.id,
        boxId,
      });
    },
    onSuccess: (result) => {
      setOpeningResult(result);
      if (user) {
        useAuthStore.setState({
          user: { ...user, totalGems: result.userGems },
        });
      }
      setShowAnimation(true);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error: unknown) => {
      toast.error(error instanceof Error ? error.message : "Failed to open mystery box");
      setOpeningBox(null);
    },
  });

  const handleOpenBox = (box: MysteryBoxListItem) => {
    if (!user) {
      toast.error("Please log in to open mystery boxes");
      return;
    }

    if (user.totalGems < box.price) {
      toast.error("Insufficient gems");
      return;
    }

    setOpeningBox(box);
    openMutation.mutate(box.id);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setOpeningBox(null);
    setOpeningResult(null);
  };

  return (
    <div className="min-h-screen bg-midnight p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            Mystery Boxes
          </h1>
          <p className="text-gray-400">
            Try your luck and win amazing rewards!
          </p>
          {user && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161616] border border-[#FFFFFF1A]">
              <Sparkles className="w-5 h-5 text-[#fbbf24]" />
              <span className="text-lg font-bold text-white">{user.totalGems}</span>
              <span className="text-sm text-gray-400">gems</span>
            </div>
          )}
        </div>

        {/* Mystery Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] p-6 animate-pulse"
              >
                <div className="h-32 bg-gray-700 rounded-lg mb-4" />
                <div className="h-6 bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-700 rounded w-3/4" />
              </div>
            ))
          ) : !boxesData || boxesData.length === 0 ? (
            <div className="col-span-full py-16 px-6 text-center bg-[#161616] rounded-lg border border-[#FFFFFF1A]">
              <Gift className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg font-medium text-white mb-2">
                No mystery boxes available
              </p>
              <p className="text-sm text-gray-400">
                Check back later for new boxes!
              </p>
            </div>
          ) : (
            boxesData.map((box) => {
              const canAfford = user && user.totalGems >= box.price;
              const isOpening = openingBox?.id === box.id;

              return (
                <div
                  key={box.id}
                  className={`group relative bg-[#161616] rounded-lg border-2 overflow-hidden transition-all duration-300 hover:scale-105 ${
                    RARITY_COLORS[box.rarity]
                  }`}
                >
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${RARITY_COLORS[box.rarity].split(' ')[0]} ${RARITY_COLORS[box.rarity].split(' ')[1]} opacity-20 group-hover:opacity-30 transition-opacity`} />

                  <div className="relative p-6">
                    {/* Rarity badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          box.rarity === "COMMON"
                            ? "bg-gray-600 text-white"
                            : box.rarity === "RARE"
                            ? "bg-blue-600 text-white"
                            : box.rarity === "EPIC"
                            ? "bg-purple-600 text-white"
                            : "bg-yellow-600 text-black"
                        }`}
                      >
                        {box.rarity}
                      </span>
                    </div>

                    {/* Box icon */}
                    <div className="flex items-center justify-center mb-4 pt-4">
                      <div className="relative">
                        <Gift className="w-24 h-24 text-white" />
                        <Sparkles className="w-8 h-8 text-[#fbbf24] absolute -top-2 -right-2 animate-pulse" />
                      </div>
                    </div>

                    {/* Box info */}
                    <h3 className="text-xl font-bold text-white mb-2 text-center">
                      {box.name}
                    </h3>
                    {box.description && (
                      <p className="text-sm text-gray-400 mb-4 text-center line-clamp-2">
                        {box.description}
                      </p>
                    )}

                    {/* Price and button */}
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-center gap-2 text-2xl font-bold">
                        <Sparkles className="w-6 h-6 text-[#fbbf24]" />
                        <span className="text-white">{box.price}</span>
                        <span className="text-gray-400 text-sm">gems</span>
                      </div>

                      <button
                        onClick={() => handleOpenBox(box)}
                        disabled={!canAfford || isOpening || openMutation.isPending}
                        className={`w-full py-3 rounded-lg font-bold transition-all ${
                          canAfford && !isOpening
                            ? "bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black hover:opacity-90"
                            : "bg-gray-700 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isOpening
                          ? "Opening..."
                          : !user
                          ? "Login to Open"
                          : !canAfford
                          ? "Not Enough Gems"
                          : "Open Box"}
                      </button>

                      <p className="text-xs text-center text-gray-500">
                        {box.rewardCount} possible rewards
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* How it works section */}
        <div className="mt-12 bg-[#161616] rounded-lg border border-[#FFFFFF1A] p-6">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#fbbf24]" />
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] flex items-center justify-center text-black font-bold text-xl mb-3">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Choose a Box</h3>
              <p className="text-sm text-gray-400">
                Select a mystery box based on your budget and desired rarity.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] flex items-center justify-center text-black font-bold text-xl mb-3">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Open & Reveal</h3>
              <p className="text-sm text-gray-400">
                Watch the exciting animation as your reward is revealed!
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] flex items-center justify-center text-black font-bold text-xl mb-3">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Claim Rewards</h3>
              <p className="text-sm text-gray-400">
                Receive gems or exclusive store items instantly!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Opening Animation */}
      {openingBox && openingResult && (
        <OpeningAnimation
          isOpen={showAnimation}
          boxName={openingBox.name}
          boxRarity={openingBox.rarity}
          reward={openingResult.reward}
          onComplete={handleAnimationComplete}
        />
      )}
    </div>
  );
}
