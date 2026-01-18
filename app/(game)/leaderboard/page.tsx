"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  TrendingUp,
  Medal,
  Crown,
  Loader2,
  Gem,
  Zap,
  Flame,
  User,
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
        return <Crown className="text-[#fbbf24]" size={28} />;
      case 2:
        return <Medal className="text-[#94a3b8]" size={24} />;
      case 3:
        return <Medal className="text-[#f59e0b]" size={24} />;
      default:
        return (
          <span className="text-[var(--text-muted)] font-cinzel font-bold text-xl">
            #{rank}
          </span>
        );
    }
  };

  const getTopThree = () => {
    return currentLeaderboard.slice(0, 3);
  };

  const getRestOfLeaderboard = () => {
    return currentLeaderboard.slice(3);
  };

  const getMaxGems = () => {
    if (currentLeaderboard.length === 0) return 1;
    return Math.max(...currentLeaderboard.map((e) => e.totalGems), 1);
  };

  const getProgressPercentage = (gems: number) => {
    const max = getMaxGems();
    return Math.min((gems / max) * 100, 100);
  };

  const topThree = getTopThree();
  const restOfLeaderboard = getRestOfLeaderboard();
  const maxGems = getMaxGems();

  return (
    <div className="min-h-screen bg-[var(--bg-midnight)] relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-transparent to-[var(--accent-secondary)]/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-12"
          >
            <Link
              href="/game"
              className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-sm mb-6 group"
            >
              <ArrowLeft
                size={16}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to Game</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] blur-xl opacity-50 rounded-full" />
                    <Trophy className="relative text-[var(--accent-secondary)]" size={40} />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-cinzel font-bold bg-gradient-to-r from-[var(--text-primary)] via-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                    Leaderboard
                  </h1>
                </div>
                <p className="text-[var(--text-secondary)] font-inter text-base md:text-lg ml-14">
                  Compete with solvers worldwide and climb the ranks
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-3 bg-[var(--bg-card)] backdrop-blur-xl rounded-xl p-1.5 border border-[var(--border-default)]">
                <button
                  onClick={() => setActiveTab("global")}
                  className={`relative px-6 py-2.5 rounded-lg font-inter font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === "global"
                      ? "text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {activeTab === "global" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Trophy
                    size={18}
                    className={`relative z-10 ${
                      activeTab === "global" ? "text-white" : ""
                    }`}
                  />
                  <span className="relative z-10 hidden sm:inline">Global</span>
                </button>
                <button
                  onClick={() => setActiveTab("weekly")}
                  className={`relative px-6 py-2.5 rounded-lg font-inter font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === "weekly"
                      ? "text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  {activeTab === "weekly" && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <TrendingUp
                    size={18}
                    className={`relative z-10 ${
                      activeTab === "weekly" ? "text-white" : ""
                    }`}
                  />
                  <span className="relative z-10 hidden sm:inline">This Week</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Top 3 Podium */}
          {!isLoading && topThree.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 md:mb-12"
            >
              <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
                {/* 2nd Place */}
                {topThree[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="order-2 md:order-1"
                  >
                    <div className="relative bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card-hover)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-default)] hover:border-[#94a3b8]/50 transition-all hover:shadow-lg hover:shadow-[#94a3b8]/20">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-[#94a3b8]/20 blur-xl rounded-full" />
                          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#94a3b8]/30 to-[#64748b]/30 flex items-center justify-center border-2 border-[#94a3b8]/50">
                            <User className="text-[#94a3b8]" size={32} />
                          </div>
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                            <Medal className="text-[#94a3b8]" size={24} />
                          </div>
                        </div>
                        <div className="text-2xl font-cinzel font-bold text-[#94a3b8] mb-1">
                          #{topThree[1].rank}
                        </div>
                        <h3 className="font-cinzel font-semibold text-[var(--text-primary)] text-lg mb-2 truncate w-full">
                          {topThree[1].username}
                        </h3>
                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-center gap-1 text-[var(--accent-secondary)]">
                            <Gem size={14} />
                            <span className="font-semibold text-sm">
                              {topThree[1].totalGems.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-1 text-[var(--text-secondary)] text-xs">
                            <Flame size={12} />
                            <span>{topThree[1].currentStreak} streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="order-1 md:order-2 -mt-4 md:-mt-8"
                  >
                    <div className="relative bg-gradient-to-br from-[var(--accent-secondary)]/20 via-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 backdrop-blur-xl rounded-2xl p-6 md:p-8 border-2 border-[var(--accent-secondary)]/50 hover:border-[var(--accent-secondary)] transition-all hover:shadow-2xl hover:shadow-[var(--accent-secondary)]/30">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[var(--accent-secondary)] blur-xl rounded-full opacity-50" />
                          <Crown className="relative text-[var(--accent-secondary)]" size={32} />
                        </div>
                      </div>
                      <div className="flex flex-col items-center text-center mt-4">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-[var(--accent-secondary)]/30 blur-2xl rounded-full" />
                          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[var(--accent-secondary)]/40 to-[var(--accent-primary)]/40 flex items-center justify-center border-2 border-[var(--accent-secondary)]">
                            <User className="text-[var(--accent-secondary)]" size={40} />
                          </div>
                        </div>
                        <div className="text-3xl font-cinzel font-bold text-[var(--accent-secondary)] mb-1">
                          #{topThree[0].rank}
                        </div>
                        <h3 className="font-cinzel font-semibold text-[var(--text-primary)] text-xl mb-3 truncate w-full">
                          {topThree[0].username}
                        </h3>
                        <div className="space-y-2 w-full">
                          <div className="flex items-center justify-center gap-2 text-[var(--accent-secondary)]">
                            <Gem size={16} />
                            <span className="font-bold text-lg">
                              {topThree[0].totalGems.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)] text-sm">
                            <Flame size={14} />
                            <span>{topThree[0].currentStreak} day streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="order-3"
                  >
                    <div className="relative bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-card-hover)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border-default)] hover:border-[#f59e0b]/50 transition-all hover:shadow-lg hover:shadow-[#f59e0b]/20">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 bg-[#f59e0b]/20 blur-xl rounded-full" />
                          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#f59e0b]/30 to-[#d97706]/30 flex items-center justify-center border-2 border-[#f59e0b]/50">
                            <User className="text-[#f59e0b]" size={32} />
                          </div>
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                            <Medal className="text-[#f59e0b]" size={24} />
                          </div>
                        </div>
                        <div className="text-2xl font-cinzel font-bold text-[#f59e0b] mb-1">
                          #{topThree[2].rank}
                        </div>
                        <h3 className="font-cinzel font-semibold text-[var(--text-primary)] text-lg mb-2 truncate w-full">
                          {topThree[2].username}
                        </h3>
                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-center gap-1 text-[var(--accent-secondary)]">
                            <Gem size={14} />
                            <span className="font-semibold text-sm">
                              {topThree[2].totalGems.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-1 text-[var(--text-secondary)] text-xs">
                            <Flame size={12} />
                            <span>{topThree[2].currentStreak} streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Rest of Leaderboard */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[var(--bg-card)] backdrop-blur-xl rounded-2xl p-12 flex flex-col items-center justify-center border border-[var(--border-default)]"
              >
                <Loader2
                  className="animate-spin text-[var(--accent-primary)] mb-4"
                  size={40}
                />
                <p className="text-[var(--text-secondary)] font-inter">
                  Loading leaderboard...
                </p>
              </motion.div>
            ) : currentLeaderboard.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[var(--bg-card)] backdrop-blur-xl rounded-2xl p-12 text-center border border-[var(--border-default)]"
              >
                <Trophy className="mx-auto mb-4 text-[var(--text-muted)]" size={48} />
                <p className="text-[var(--text-secondary)] font-inter text-lg">
                  No data available yet. Start solving riddles!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {restOfLeaderboard.map((entry: LeaderboardEntry, index: number) => {
                  const progress = getProgressPercentage(entry.totalGems);
                  return (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className={`group relative bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-card-hover)] backdrop-blur-xl rounded-xl p-4 md:p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                        entry.isCurrentUser
                          ? "border-[var(--accent-primary)]/50 bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 ring-2 ring-[var(--accent-primary)]/30"
                          : "border-[var(--border-default)] hover:border-[var(--accent-primary)]/30"
                      }`}
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        {/* Rank */}
                        <div className="w-12 md:w-16 flex items-center justify-center flex-shrink-0">
                          {getRankIcon(entry.rank)}
                        </div>

                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/30 to-[var(--accent-secondary)]/30 flex items-center justify-center border border-[var(--border-default)]">
                            <User
                              className={`${
                                entry.isCurrentUser
                                  ? "text-[var(--accent-primary)]"
                                  : "text-[var(--text-muted)]"
                              }`}
                              size={entry.isCurrentUser ? 28 : 24}
                            />
                          </div>
                          {entry.isCurrentUser && (
                            <div className="absolute -bottom-1 -right-1 bg-[var(--accent-primary)] rounded-full p-1">
                              <Zap className="text-white" size={12} />
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-cinzel font-semibold text-[var(--text-primary)] text-base md:text-lg truncate">
                              {entry.username}
                            </h3>
                            {entry.isCurrentUser && (
                              <span className="px-2.5 py-1 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white text-xs rounded-full font-inter font-medium flex-shrink-0">
                                You
                              </span>
                            )}
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-2">
                            <div className="h-1.5 bg-[var(--bg-midnight-light)] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, delay: index * 0.05 }}
                                className={`h-full rounded-full ${
                                  entry.isCurrentUser
                                    ? "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]"
                                    : "bg-gradient-to-r from-[var(--accent-primary)]/60 to-[var(--accent-secondary)]/60"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Mobile Stats */}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 md:hidden text-xs text-[var(--text-muted)] font-inter">
                            <span className="flex items-center gap-1">
                              <Gem size={12} />
                              {entry.totalGems.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap size={12} />
                              {entry.riddlesSolved}
                            </span>
                            <span className="flex items-center gap-1">
                              <Flame size={12} />
                              {entry.currentStreak}
                            </span>
                          </div>
                        </div>

                        {/* Desktop Stats */}
                        <div className="hidden md:flex items-center gap-6">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-[var(--accent-secondary)] font-semibold mb-1">
                              <Gem size={16} />
                              <span>{entry.totalGems.toLocaleString()}</span>
                            </div>
                            <div className="text-[var(--text-muted)] text-xs">Gems</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-[var(--text-primary)] font-semibold mb-1">
                              <Zap size={16} />
                              <span>{entry.riddlesSolved}</span>
                            </div>
                            <div className="text-[var(--text-muted)] text-xs">Solved</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-[#f59e0b] font-semibold mb-1">
                              <Flame size={16} />
                              <span>{entry.currentStreak}</span>
                            </div>
                            <div className="text-[var(--text-muted)] text-xs">Streak</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 md:mt-12 bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-card-hover)] backdrop-blur-xl rounded-2xl p-6 md:p-8 text-center border border-[var(--border-default)]"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              {activeTab === "global" ? (
                <>
                  <div className="text-2xl">🌍</div>
                  <p className="text-[var(--text-primary)] font-inter font-medium text-base md:text-lg">
                    Rankings update in real-time. Keep solving to climb the ladder!
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl">📅</div>
                  <p className="text-[var(--text-primary)] font-inter font-medium text-base md:text-lg">
                    Weekly rankings reset every Monday. Race to the top!
                  </p>
                </>
              )}
            </div>
            <p className="text-[var(--text-muted)] font-inter text-sm">
              Sign in to compete globally and save your progress
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
