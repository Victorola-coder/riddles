"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "../ui";
import { useAuthStore } from "@/lib/store/auth";
import { Trophy, Award, TrendingUp, ShoppingBag, Calendar, Gift, PenTool } from "lucide-react";
import { useUserStore } from "@/lib/store/user-store";
import {
  GemCounter,
  StreakCounter,
  SoundToggle,
  ThemeToggle,
} from "../molecules";

interface GameHeaderProps {
  gems: number;
  level: number;
  solvedCount: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  gems,
  level,
  solvedCount,
}) => {
  const currentStreak = useUserStore((state) => state.currentStreak);
  const longestStreak = useUserStore((state) => state.longestStreak);
  const { user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by only rendering avatar after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center">
      {/* Level Info - Clickable to Levels Page */}
      <Link
        href="/levels"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
        title="View Level Selection"
      >
        <Trophy
          className="text-purple group-hover:scale-110 transition-transform"
          size={24}
        />
        <div className="flex flex-col">
          <span className="text-xs text-[var(--text-muted)] font-inter">
            Level
          </span>
          <span className="text-lg font-cinzel font-semibold text-white">
            {level}
          </span>
        </div>
      </Link>

      {/* Streak Counter */}
      <div className="flex items-center">
        <div className="sm:hidden">
          <StreakCounter
            streak={currentStreak}
            longestStreak={longestStreak}
            size="sm"
            showLongest={false}
          />
        </div>
        <div className="hidden sm:block">
          <StreakCounter
            streak={currentStreak}
            longestStreak={longestStreak}
            size="md"
            showLongest
          />
        </div>
      </div>

      {/* Solved Count (Desktop Only) */}
      <div className="hidden md:flex flex-col items-center">
        <span className="text-xs text-[var(--text-muted)] font-inter">
          Solved
        </span>
        <span className="text-lg font-inter font-semibold text-white">
          {solvedCount}
        </span>
      </div>

      {/* Daily Challenge Link (Desktop Only) */}
      <Link
        href="/daily-challenge"
        className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent-secondary)]/10 hover:bg-[var(--accent-secondary)]/20 transition-colors cursor-pointer group"
        title="Daily Challenge"
      >
        <Calendar
          className="text-[var(--accent-secondary)] group-hover:scale-110 transition-transform"
          size={18}
        />
        <span className="text-xs font-inter text-white/80 group-hover:text-white">
          Daily
        </span>
      </Link>

      {/* Mystery Boxes Link (Desktop Only) */}
      <Link
        href="/mystery-boxes"
        className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple/10 hover:bg-purple/20 transition-colors cursor-pointer group"
        title="Mystery Boxes"
      >
        <Gift
          className="text-purple group-hover:scale-110 transition-transform"
          size={18}
        />
        <span className="text-xs font-inter text-white/80 group-hover:text-white">
          Mystery
        </span>
      </Link>

      {/* Riddle Creator Link (Desktop Only) */}
      <Link
        href="/riddle-creator"
        className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors cursor-pointer group"
        title="Riddle Creator"
      >
        <PenTool
          className="text-blue-400 group-hover:scale-110 transition-transform"
          size={18}
        />
        <span className="text-xs font-inter text-white/80 group-hover:text-white">
          Create
        </span>
      </Link>

      {/* Achievements Link (Mobile Hidden) */}
      <Link
        href="/achievements"
        className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple/10 hover:bg-purple/20 transition-colors cursor-pointer group"
        title="View Achievements"
      >
        <Award
          className="text-gold group-hover:scale-110 transition-transform"
          size={18}
        />
        <span className="text-xs font-inter text-white/80 group-hover:text-white">
          Badges
        </span>
      </Link>

      {/* Leaderboard Link (Mobile: Icon Only) */}
      {/* Leaderboard Link (Desktop Only) */}
      <Link
        href="/leaderboard"
        className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple/10 hover:bg-purple/20 transition-colors cursor-pointer group"
        title="View Leaderboard"
      >
        <TrendingUp
          className="text-purple group-hover:scale-110 transition-transform"
          size={18}
        />
        <span className="text-xs font-inter text-white/80 group-hover:text-white">
          Ranks
        </span>
      </Link>

      {/* Shop Link (Desktop Only) */}
      <Link
        href="/shop"
        className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 transition-colors cursor-pointer group ml-2"
        title="Item Shop"
      >
        <ShoppingBag
          className="text-pink-400 group-hover:scale-110 transition-transform"
          size={18}
        />
        <span className="text-xs font-inter text-white/80 group-hover:text-white">
          Shop
        </span>
      </Link>

      {/* Sound Toggle */}
      <div className="hidden md:flex items-center gap-2">
        <ThemeToggle size="md" />
        <SoundToggle size="md" />
      </div>

      {/* Gem Counter */}
      <GemCounter gems={gems} size="md" />

      {/* Profile Link (Desktop Only) */}
      {isMounted && (
        <Link
          href="/profile"
          className="ml-2 cursor-pointer hover:opacity-80 transition-opacity hidden md:block"
          title={user ? "My Profile" : "Guest Profile"}
        >
          <Avatar
            alt={user?.username || "Guest"}
            size="sm"
            className={`ring-2 ${
              user ? "ring-purple-500/50" : "ring-gray-500/50"
            }`}
          />
        </Link>
      )}
      {!isMounted && (
        <div className="ml-2 w-10 h-10 rounded-full bg-purple/20 animate-pulse" />
      )}
    </header>
  );
};
