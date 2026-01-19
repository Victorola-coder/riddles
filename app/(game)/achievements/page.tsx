"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { Achievement } from "@/types/achievement";
import { useUserStore } from "@/lib/store/user-store";
import { ACHIEVEMENTS } from "@/lib/constants/achievements";
import { Trophy, Award, Zap, Flame, Gem, Filter } from "lucide-react";
import { AchievementBadge } from "@/app/components/molecules/achievement-badge";

const typeIcons = {
  milestone: Trophy,
  skill: Award,
  speed: Zap,
  streak: Flame,
  collection: Gem,
};

export default function AchievementsPage() {
  const {
    achievements: unlockedIds,
    achievementProgress,
    totalRiddlesSolved,
    currentStreak,
  } = useUserStore();

  const [filter, setFilter] = useState<Achievement["type"] | "all">("all");

  const filteredAchievements = ACHIEVEMENTS.filter(
    (a) => filter === "all" || a.type === filter
  );

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-midnight p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-4">
            Achievements
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-6">
            Unlock badges by completing challenges and milestones
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="glass-card p-4">
              <p className="text-[var(--text-muted)] text-sm mb-1">Unlocked</p>
              <p className="text-2xl font-bold text-white">
                {unlockedCount}/{totalCount}
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-[var(--text-muted)] text-sm mb-1">
                Completion
              </p>
              <p className="text-2xl font-bold text-gold">
                {completionPercentage}%
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-[var(--text-muted)] text-sm mb-1">
                Riddles Solved
              </p>
              <p className="text-2xl font-bold text-purple">
                {totalRiddlesSolved}
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-[var(--text-muted)] text-sm mb-1">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-orange-500">
                {currentStreak} 🔥
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-inter text-sm transition-all ${
                filter === "all"
                  ? "bg-purple text-white"
                  : "bg-midnight-light text-[var(--text-secondary)] hover:bg-[var(--border-default)]"
              }`}
            >
              <Filter size={16} className="inline mr-2" />
              All
            </button>
            {Object.entries(typeIcons).map(([type, Icon]) => (
              <button
                key={type}
                onClick={() => setFilter(type as Achievement["type"])}
                className={`px-4 py-2 rounded-lg font-inter text-sm transition-all flex items-center gap-2 ${
                  filter === type
                    ? "bg-purple text-white"
                    : "bg-midnight-light text-[var(--text-secondary)] hover:bg-[var(--border-default)]"
                }`}
              >
                <Icon size={16} />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Achievement Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          layout
        >
          {filteredAchievements.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            const progress = achievementProgress[achievement.id] || 0;

            return (
              <motion.div
                key={achievement.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <AchievementBadge
                  achievement={achievement}
                  unlocked={isUnlocked}
                  progress={progress}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)] text-lg">
              No achievements found for this filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
