"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Gift } from "lucide-react";
import confetti from "canvas-confetti";

interface OpeningAnimationProps {
  isOpen: boolean;
  boxName: string;
  boxRarity: MysteryBoxRarity;
  reward: {
    type: MysteryBoxRewardType;
    rarity: MysteryBoxRarity;
    data: any;
  } | null;
  onComplete: () => void;
}

const RARITY_COLORS = {
  COMMON: {
    bg: "from-gray-600 to-gray-700",
    glow: "shadow-gray-500/50",
    particle: "#9ca3af",
  },
  RARE: {
    bg: "from-blue-600 to-blue-700",
    glow: "shadow-blue-500/50",
    particle: "#3b82f6",
  },
  EPIC: {
    bg: "from-purple-600 to-purple-700",
    glow: "shadow-purple-500/50",
    particle: "#a855f7",
  },
  LEGENDARY: {
    bg: "from-yellow-500 to-yellow-600",
    glow: "shadow-yellow-500/50",
    particle: "#eab308",
  },
};

export function OpeningAnimation({
  isOpen,
  boxName,
  boxRarity,
  reward,
  onComplete,
}: OpeningAnimationProps) {
  const [stage, setStage] = useState<"opening" | "revealing" | "complete">("opening");

  useEffect(() => {
    if (!isOpen) {
      setStage("opening");
      return;
    }

    // Stage 1: Box shake animation (1.5s)
    const shakeTimer = setTimeout(() => {
      setStage("revealing");
      
      // Trigger confetti based on rarity
      const particleCount = {
        COMMON: 50,
        RARE: 100,
        EPIC: 150,
        LEGENDARY: 200,
      }[reward?.rarity || "COMMON"];

      confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.6 },
        colors: [RARITY_COLORS[reward?.rarity || "COMMON"].particle],
      });
    }, 1500);

    // Stage 2: Reveal animation (2s)
    const revealTimer = setTimeout(() => {
      setStage("complete");
    }, 3500);

    // Auto-close after showing reward (3s)
    const closeTimer = setTimeout(() => {
      onComplete();
    }, 6500);

    return () => {
      clearTimeout(shakeTimer);
      clearTimeout(revealTimer);
      clearTimeout(closeTimer);
    };
  }, [isOpen, reward, onComplete]);

  if (!isOpen || !reward) return null;

  const rarityStyle = RARITY_COLORS[reward.rarity];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
          if (stage === "complete") {
            e.stopPropagation();
            onComplete();
          }
        }}
      >
        <div className="relative flex flex-col items-center">
          {/* Opening Stage: Shaking Box */}
          {stage === "opening" && (
            <motion.div
              animate={{
                rotate: [-5, 5, -5, 5, 0],
                scale: [1, 1.05, 1, 1.05, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: 3,
                ease: "easeInOut",
              }}
              className={`relative p-8 rounded-2xl bg-gradient-to-br ${rarityStyle.bg} shadow-2xl ${rarityStyle.glow}`}
            >
              <Gift className="w-32 h-32 text-white" />
              <motion.div
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl bg-white/20"
              />
            </motion.div>
          )}

          {/* Revealing Stage: Particles and Glow */}
          {stage === "revealing" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              {/* Particle effects */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                  }}
                  animate={{
                    x: Math.cos((i * 30 * Math.PI) / 180) * 150,
                    y: Math.sin((i * 30 * Math.PI) / 180) * 150,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeOut",
                  }}
                  className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                  style={{ backgroundColor: rarityStyle.particle }}
                />
              ))}

              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                }}
                className={`p-12 rounded-2xl bg-gradient-to-br ${rarityStyle.bg} shadow-2xl ${rarityStyle.glow}`}
              >
                <Sparkles className="w-32 h-32 text-white" />
              </motion.div>
            </motion.div>
          )}

          {/* Complete Stage: Show Reward */}
          {stage === "complete" && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                damping: 15,
                stiffness: 300,
              }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`inline-block px-8 py-6 rounded-2xl bg-gradient-to-br ${rarityStyle.bg} shadow-2xl ${rarityStyle.glow} mb-6`}
              >
                {reward.type === "GEMS" ? (
                  <div className="flex items-center gap-4">
                    <Sparkles className="w-16 h-16 text-white" />
                    <div className="text-left">
                      <p className="text-6xl font-bold text-white">
                        {reward.data.amount}
                      </p>
                      <p className="text-xl text-white/80">Gems</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Gift className="w-16 h-16 text-white" />
                    <div className="text-left">
                      <p className="text-2xl font-bold text-white">Store Item</p>
                      <p className="text-sm text-white/80 font-mono">
                        {reward.data.itemId?.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <p className="text-2xl font-bold text-white">{boxName}</p>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-bold ${
                      reward.rarity === "COMMON"
                        ? "bg-gray-600 text-white"
                        : reward.rarity === "RARE"
                        ? "bg-blue-600 text-white"
                        : reward.rarity === "EPIC"
                        ? "bg-purple-600 text-white"
                        : "bg-yellow-600 text-black"
                    }`}
                  >
                    {reward.rarity}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Click anywhere to continue
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
