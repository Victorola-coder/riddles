"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client"; 
import { useAuthStore } from "@/lib/store/auth";
import { useUserStore } from "@/lib/store/user-store";
import { Loader } from "@/app/components/global";
import Button from "@/app/components/ui/button";
import { toast } from "sonner";
import { ShoppingBag, Lock, Sparkles, User as UserIcon, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cardEntranceVariants } from "@/lib/constants/animations";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  price: number;
  imageUrl: string;
}

export default function ShopPage() {
  const { user } = useAuthStore();
  const { syncWithServer } = useUserStore();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["store", "items"],
    queryFn: async () => {
      // Direct fetch or use api client if updated
      // Assuming api.get wrapper works
      const res = await api.get<{ items: ShopItem[] }>("/api/store");
      return res.items;
    },
  });

  const buyMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!user) throw new Error("Must be logged in");
      return await api.post("/api/store/buy", {
        userId: user.id,
        itemId,
      });
    },
    onSuccess: (data: any) => {
      toast.success("Item purchased successfully! 🎉");
      syncWithServer(); // Update gems in UI
      // Ideally refetch inventory too if we had that query
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to purchase item");
    },
  });

  const handleBuy = (item: ShopItem) => {
    if (!user) {
      toast.error("Please login to purchase items");
      return;
    }
    if (user.totalGems < item.price) {
      toast.error("Not enough gems!");
      return;
    }
    if (confirm(`Purchase ${item.name} for ${item.price} Gems?`)) {
      buyMutation.mutate(item.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f0f]">
        <Loader />
      </div>
    );
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "LEGENDARY": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case "EPIC": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "RARE": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-32">
      <div className="container max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
              <ShoppingBag className="text-purple-400" />
              Item Shop
            </h1>
            <p className="text-gray-400 mt-1">
              Spend your hard-earned gems on exclusive avatars and badges!
            </p>
          </div>
          
          {/* User Balance Display (Mobile/Desktop) */}
          {user && (
            <div className="flex items-center gap-2 px-4 py-2 bg-[#FFFFFF0A] rounded-full border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-white font-bold">{user.totalGems}</span>
              <span className="text-xs text-purple-300">GEMS</span>
            </div>
          )}
        </div>

        {/* Categories / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item: ShopItem, index: number) => (
            <motion.div
              key={item.id}
              variants={cardEntranceVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.05 }}
              className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#FFFFFF1A] hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Item Image Placeholder */}
              <div className="aspect-square bg-[#0f0f0f] flex items-center justify-center p-6 relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 {/* Try to render icon if name matches, else generic */}
                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center shadow-2xl ring-4 ring-[#0f0f0f]">
                    {item.type === "AVATAR" ? <UserIcon size={48} className="text-gray-500" /> : <Shield size={48} className="text-gray-500" />}
                 </div>
                 
                 {/* Rarity Badge */}
                 <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRarityColor(item.rarity)}`}>
                   {item.rarity}
                 </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xl font-bold text-white flex items-center gap-1">
                     {item.price} <Zap className="w-3 h-3 text-purple-400 fill-current" />
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleBuy(item)}
                    disabled={!user || user.totalGems < item.price || buyMutation.isPending}
                    className={`
                      ${!user || user.totalGems < item.price 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25'}
                    `}
                  >
                    {!user ? "Login" : buyMutation.isPending ? "Buying..." : user.totalGems < item.price ? "Need Gems" : "Buy Now"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">The shop is current empty.</p>
              <p className="text-sm">Check back later for new items!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
