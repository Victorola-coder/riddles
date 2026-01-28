"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Clock, Flame, Users, Loader2 } from "lucide-react";
import Skeleton from "@/app/components/ui/skeleton";
import { Button } from "@/app/components/atoms";
import { useCurrentUser } from "@/lib/hooks/use-auth";
import { getGuestId } from "@/lib/utils/guest-session";
import {
  useDailyChallenge,
  useSubmitDailyChallenge,
  useDailyChallengeLeaderboard,
} from "@/lib/hooks/use-daily-challenge";
import { AnswerInput } from "@/app/components/organisms";
import { RiddleCard } from "@/app/components/organisms";
import { formatTime } from "@/lib/utils/time-formatter";

export default function DailyChallengePage() {
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id || getGuestId();

  const { data: challengeData, isLoading } = useDailyChallenge(userId);
  const { data: leaderboard, isLoading: leaderboardLoading } =
    useDailyChallengeLeaderboard();
  const submitMutation = useSubmitDailyChallenge();

  const challenge = challengeData?.challenge;
  const userEntry = challengeData?.userEntry;
  const userStreak = challengeData?.userStreak || 0;
  const isSubmitting = submitMutation.isPending;

  const handleSubmit = async (answer: string) => {
    if (!answer.trim() || isSubmitting || !challenge) return;

    try {
      await submitMutation.mutateAsync({
        userId,
        answer: answer.trim(),
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-64 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 text-[var(--text-muted)] mx-auto" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            No Challenge Today
          </h1>
          <p className="text-[var(--text-secondary)]">
            Check back tomorrow for a new daily challenge!
          </p>
        </div>
      </div>
    );
  }

  const isCompleted = userEntry?.isCorrect === true;
  const canSubmit = !isCompleted && !isSubmitting;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold font-cinzel bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                Daily Challenge
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                Solve today's riddle and compete for the fastest time!
              </p>
            </div>
            {userStreak > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/30">
                <Flame className="w-5 h-5 text-[var(--accent-secondary)]" />
                <span className="font-semibold text-[var(--accent-secondary)]">
                  {userStreak}-day streak
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Challenge Card */}
        {isCompleted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 text-center space-y-4"
          >
            <Trophy className="w-16 h-16 text-gold mx-auto" />
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Challenge Complete! 🎉
            </h2>
            {userEntry.solveTimeMs && (
              <p className="text-[var(--text-secondary)]">
                You solved it in{" "}
                <span className="font-semibold text-[var(--accent-primary)]">
                  {formatTime(userEntry.solveTimeMs)}
                </span>
              </p>
            )}
            <p className="text-sm text-[var(--text-muted)]">
              Come back tomorrow for a new challenge!
            </p>
          </motion.div>
        ) : (
          <>
            <RiddleCard riddle={challenge.riddle} />
            <AnswerInput
              onSubmit={handleSubmit}
              showError={false}
              disabled={!canSubmit}
            />
          </>
        )}

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[var(--accent-primary)]" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Today's Leaderboard
            </h2>
          </div>

          {leaderboardLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : leaderboard && leaderboard.entries.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.entries.map((entry) => (
                <div
                  key={entry.userId}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]/50 border border-[var(--border-default)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center font-bold text-[var(--accent-primary)]">
                      {entry.rank}
                    </div>
                    <span className="font-medium text-[var(--text-primary)]">
                      {entry.username || `Player ${entry.userId.slice(0, 8)}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-sm">
                      {formatTime(entry.solveTimeMs)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-muted)] text-center py-8">
              No entries yet. Be the first to solve it!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
