"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  Medal,
  Crown,
  Loader2,
} from "lucide-react";
import { useUserStore } from "@/lib/store/user-store";
import { useGameStore } from "@/lib/store/game-store";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"global" | "weekly">("global");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { totalGemsEarned, totalRiddlesSolved, currentStreak } = useUserStore();
  const { solvedRiddles } = useGameStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/leaderboard?type=${activeTab}&limit=50`
      );
      const data = await response.json();

      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      // Fallback to mock data if API fails
      setLeaderboard(getMockData());
    } finally {
      setIsLoading(false);
    }
  };

  const getMockData = (): LeaderboardEntry[] => {
    return activeTab === "global"
      ? mockGlobalLeaderboard
      : mockWeeklyLeaderboard;
  };

  // Mock data for demonstration (will be replaced with Supabase data)
  const mockGlobalLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      username: "RiddleMaster",
      totalGems: 5420,
      riddlesSolved: 287,
      currentStreak: 45,
    },
    {
      rank: 2,
      username: "BrainTeaser",
      totalGems: 4890,
      riddlesSolved: 245,
      currentStreak: 32,
    },
    {
      rank: 3,
      username: "PuzzleWizard",
      totalGems: 4320,
      riddlesSolved: 216,
      currentStreak: 28,
    },
    {
      rank: 4,
      username: "You",
      totalGems: totalGemsEarned,
      riddlesSolved: solvedRiddles.length,
      currentStreak,
      isCurrentUser: true,
    },
    {
      rank: 5,
      username: "LogicLord",
      totalGems: 3650,
      riddlesSolved: 182,
      currentStreak: 15,
    },
    {
      rank: 6,
      username: "MindBender",
      totalGems: 3420,
      riddlesSolved: 171,
      currentStreak: 12,
    },
    {
      rank: 7,
      username: "ThinkTank",
      totalGems: 3180,
      riddlesSolved: 159,
      currentStreak: 9,
    },
    {
      rank: 8,
      username: "QuizKing",
      totalGems: 2950,
      riddlesSolved: 147,
      currentStreak: 7,
    },
  ];

  const mockWeeklyLeaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      username: "SpeedSolver",
      totalGems: 890,
      riddlesSolved: 45,
      currentStreak: 7,
    },
    {
      rank: 2,
      username: "DailyGrinder",
      totalGems: 820,
      riddlesSolved: 41,
      currentStreak: 7,
    },
    {
      rank: 3,
      username: "You",
      totalGems: Math.min(totalGemsEarned, 750),
      riddlesSolved: Math.min(solvedRiddles.length, 38),
      currentStreak,
      isCurrentUser: true,
    },
    {
      rank: 4,
      username: "WeekWarrior",
      totalGems: 680,
      riddlesSolved: 34,
      currentStreak: 6,
    },
    {
      rank: 5,
      username: "ConsistentSolver",
      totalGems: 620,
      riddlesSolved: 31,
      currentStreak: 5,
    },
  ];

  const currentLeaderboard = isLoading
    ? []
    : leaderboard.length > 0
    ? leaderboard
    : getMockData();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-gold" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-amber-600" size={24} />;
      default:
        return (
          <span className="text-white/60 font-cinzel font-bold text-lg">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-midnight p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/game"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-4"
          >
            <ArrowLeft size={16} />
            <span>Back to Game</span>
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <Trophy className="text-gold" size={32} />
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white">
              Leaderboard
            </h1>
          </div>
          <p className="text-[var(--text-muted)] font-inter text-sm md:text-base">
            Compete with solvers worldwide
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("global")}
            className={`flex-1 py-3 px-4 rounded-lg font-inter font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "global"
                ? "bg-purple text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <Trophy size={18} />
            <span className="hidden sm:inline">Global</span>
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex-1 py-3 px-4 rounded-lg font-inter font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "weekly"
                ? "bg-purple text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            <TrendingUp size={18} />
            <span className="hidden sm:inline">This Week</span>
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="glass-card p-8 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-purple mb-4" size={32} />
              <p className="text-white/60 font-inter">Loading leaderboard...</p>
            </div>
          ) : currentLeaderboard.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-white/60 font-inter">
                No data available yet. Start solving riddles!
              </p>
            </div>
          ) : (
            currentLeaderboard.map((entry: LeaderboardEntry) => (
              <div
                key={entry.rank}
                className={`glass-card p-4 md:p-5 transition-all hover:scale-[1.01] ${
                  entry.isCurrentUser ? "ring-2 ring-purple bg-purple/10" : ""
                }`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Rank */}
                  <div className="w-12 md:w-16 flex items-center justify-center flex-shrink-0">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-cinzel font-semibold text-white text-base md:text-lg truncate">
                        {entry.username}
                      </h3>
                      {entry.isCurrentUser && (
                        <span className="px-2 py-0.5 bg-purple/20 text-purple text-xs rounded-full font-inter flex-shrink-0">
                          You
                        </span>
                      )}
                    </div>

                    {/* Mobile Stats (stacked) */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 md:hidden text-xs text-white/60 font-inter">
                      <span>💎 {entry.totalGems.toLocaleString()}</span>
                      <span>🧩 {entry.riddlesSolved}</span>
                      <span>🔥 {entry.currentStreak}</span>
                    </div>
                  </div>

                  {/* Desktop Stats (horizontal) */}
                  <div className="hidden md:flex items-center gap-6 text-sm font-inter">
                    <div className="text-center">
                      <div className="text-gold font-semibold">
                        {entry.totalGems.toLocaleString()}
                      </div>
                      <div className="text-white/40 text-xs">Gems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold">
                        {entry.riddlesSolved}
                      </div>
                      <div className="text-white/40 text-xs">Solved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-orange-400 font-semibold">
                        {entry.currentStreak}
                      </div>
                      <div className="text-white/40 text-xs">Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Banner */}
        <div className="mt-8 glass-card p-4 md:p-6 text-center">
          <p className="text-white/60 font-inter text-sm md:text-base">
            {activeTab === "global"
              ? "🌍 Rankings update in real-time. Keep solving to climb the ladder!"
              : "📅 Weekly rankings reset every Monday. Race to the top!"}
          </p>
          <p className="text-white/40 font-inter text-xs mt-2">
            Sign in to compete globally and save your progress
          </p>
        </div>
      </div>
    </div>
  );
}
