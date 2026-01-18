"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { RIDDLES } from "@/lib/constants/riddles";
import { DifficultyLevel } from "@/types/riddle";
import { useGameStore } from "@/lib/store/game-store";
import { ProgressBar } from "@/app/components/molecules";
import { Lock, CheckCircle, Circle, ChevronRight } from "lucide-react";

interface LevelTier {
  difficulty: DifficultyLevel;
  title: string;
  description: string;
  color: string;
  bgGradient: string;
  minLevel: number;
  maxLevel: number;
}

const LEVEL_TIERS: LevelTier[] = [
  {
    difficulty: "easy",
    title: "Easy",
    description: "Perfect for beginners",
    color: "text-green-400",
    bgGradient: "from-green-600/20 to-green-800/20",
    minLevel: 1,
    maxLevel: 10,
  },
  {
    difficulty: "medium",
    title: "Medium",
    description: "Challenge your mind",
    color: "text-yellow-400",
    bgGradient: "from-yellow-600/20 to-yellow-800/20",
    minLevel: 11,
    maxLevel: 25,
  },
  {
    difficulty: "hard",
    title: "Hard",
    description: "For master riddlers",
    color: "text-red-400",
    bgGradient: "from-red-600/20 to-red-800/20",
    minLevel: 26,
    maxLevel: 50,
  },
];

export default function LevelsPage() {
  const router = useRouter();
  const { solvedRiddles, currentLevel } = useGameStore();

  const getRiddlesByDifficulty = (difficulty: DifficultyLevel) => {
    return RIDDLES.filter((r) => r.difficulty === difficulty);
  };

  const getSolvedCount = (difficulty: DifficultyLevel) => {
    const riddlesInTier = getRiddlesByDifficulty(difficulty);
    return riddlesInTier.filter((r) => solvedRiddles.includes(r.id)).length;
  };

  const isLevelUnlocked = (tier: LevelTier) => {
    // Easy is always unlocked
    if (tier.difficulty === "easy") return true;

    // Medium unlocked after 70% of easy
    if (tier.difficulty === "medium") {
      const easyRiddles = getRiddlesByDifficulty("easy");
      const easySolved = getSolvedCount("easy");
      return easySolved >= Math.ceil(easyRiddles.length * 0.7);
    }

    // Hard unlocked after 70% of medium
    if (tier.difficulty === "hard") {
      const mediumRiddles = getRiddlesByDifficulty("medium");
      const mediumSolved = getSolvedCount("medium");
      return mediumSolved >= Math.ceil(mediumRiddles.length * 0.7);
    }

    return false;
  };

  const handleTierClick = (tier: LevelTier) => {
    if (!isLevelUnlocked(tier)) {
      return;
    }

    // Navigate to first unsolved riddle in this tier
    const riddlesInTier = getRiddlesByDifficulty(tier.difficulty);
    const unsolvedRiddle = riddlesInTier.find(
      (r) => !solvedRiddles.includes(r.id)
    );

    if (unsolvedRiddle) {
      router.push("/");
    } else {
      // All solved, go to first riddle in tier
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-midnight p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-4">
            Level Selection
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Choose your difficulty and start solving riddles
          </p>
        </div>

        {/* Current Progress */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-cinzel font-bold text-white">
                Your Progress
              </h2>
              <p className="text-[var(--text-muted)] text-sm">
                Current Level: {currentLevel}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple">
                {solvedRiddles.length}
              </p>
              <p className="text-[var(--text-muted)] text-sm">Riddles Solved</p>
            </div>
          </div>
          <ProgressBar
            current={solvedRiddles.length}
            total={RIDDLES.length}
            label="Overall Progress"
          />
        </div>

        {/* Level Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LEVEL_TIERS.map((tier, index) => {
            const riddlesInTier = getRiddlesByDifficulty(tier.difficulty);
            const solvedCount = getSolvedCount(tier.difficulty);
            const totalCount = riddlesInTier.length;
            const isUnlocked = isLevelUnlocked(tier);
            const completionPercentage = Math.round(
              (solvedCount / totalCount) * 100
            );

            return (
              <motion.div
                key={tier.difficulty}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTierClick(tier)}
                className={`relative glass-card p-6 cursor-pointer transition-all ${
                  isUnlocked
                    ? "hover:border-purple hover:scale-105"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Lock Overlay */}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-midnight/50 backdrop-blur-sm rounded-lg z-10">
                    <div className="text-center">
                      <Lock className="text-gray-500 mx-auto mb-2" size={48} />
                      <p className="text-gray-400 text-sm">
                        Complete more {index === 1 ? "Easy" : "Medium"} riddles
                        to unlock
                      </p>
                    </div>
                  </div>
                )}

                {/* Tier Header */}
                <div
                  className={`bg-gradient-to-br ${tier.bgGradient} rounded-lg p-4 mb-4`}
                >
                  <h3
                    className={`text-2xl font-cinzel font-bold ${tier.color} mb-1`}
                  >
                    {tier.title}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm">
                    {tier.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)] text-sm">
                      Progress
                    </span>
                    <span className="text-white font-semibold">
                      {solvedCount}/{totalCount}
                    </span>
                  </div>

                  <ProgressBar
                    current={solvedCount}
                    total={totalCount}
                    showPercentage={false}
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)] text-sm">
                      Completion
                    </span>
                    <span className={`font-bold ${tier.color}`}>
                      {completionPercentage}%
                    </span>
                  </div>

                  {/* Riddle List Preview */}
                  <div className="border-t border-[var(--border-default)] pt-4 mt-4">
                    <p className="text-xs text-[var(--text-muted)] mb-2">
                      Riddles:
                    </p>
                    <div className="space-y-1">
                      {riddlesInTier.slice(0, 3).map((riddle) => {
                        const isSolved = solvedRiddles.includes(riddle.id);
                        return (
                          <div
                            key={riddle.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            {isSolved ? (
                              <CheckCircle
                                className="text-green-400"
                                size={14}
                              />
                            ) : (
                              <Circle className="text-gray-500" size={14} />
                            )}
                            <span
                              className={
                                isSolved
                                  ? "text-gray-400 line-through"
                                  : "text-white"
                              }
                            >
                              {riddle.question.substring(0, 30)}...
                            </span>
                          </div>
                        );
                      })}
                      {riddlesInTier.length > 3 && (
                        <p className="text-xs text-[var(--text-muted)] pl-6">
                          +{riddlesInTier.length - 3} more
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  {isUnlocked && (
                    <button className="w-full mt-4 px-4 py-2 bg-purple text-white rounded-lg hover:bg-purple-dark transition-colors flex items-center justify-center gap-2 font-inter font-medium">
                      {solvedCount === totalCount ? "Review" : "Continue"}
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Back to Game Button */}
        {/* <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-midnight-light text-white rounded-lg hover:bg-[var(--border-default)] transition-colors font-inter"
          >
            ← Back to Current Riddle
          </button>
        </div> */}
      </div>
    </div>
  );
}
