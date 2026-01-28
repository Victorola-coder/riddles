import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dailyChallengeApi } from '@/lib/api/daily-challenge';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Trophy, Gem } from 'lucide-react';

/**
 * Hook to fetch today's daily challenge
 */
export function useDailyChallenge(userId?: string) {
  return useQuery({
    queryKey: ['daily-challenge', 'today'],
    queryFn: () => dailyChallengeApi.getToday(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });
}

/**
 * Hook to submit answer for daily challenge
 */
export function useSubmitDailyChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; answer: string }) =>
      dailyChallengeApi.submitAnswer(data),
    onSuccess: (data) => {
      // Invalidate queries to refresh challenge state
      queryClient.invalidateQueries({ queryKey: ['daily-challenge'] });
      queryClient.invalidateQueries({ queryKey: ['game', 'session'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });

      if (data.isCorrect) {
        // Show success toast with gem rewards
        toast.success(
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-gold" />
              <span className="font-semibold">Daily Challenge Complete!</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Gem className="w-4 h-4 text-[var(--accent-secondary)]" />
              <span>
                +{data.gemsEarned} gems
                {data.streakBonus > 0 && (
                  <span className="text-[var(--accent-secondary)]">
                    {' '}(+{data.streakBonus} streak bonus)
                  </span>
                )}
              </span>
            </div>
            {data.newStreak > 1 && (
              <div className="text-xs text-[var(--text-muted)]">
                {data.newStreak}-day streak! 🔥
              </div>
            )}
          </div>,
          { duration: 5000 }
        );

        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        toast.error('Incorrect answer. Try again tomorrow!', {
          duration: 4000,
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit answer');
    },
  });
}

/**
 * Hook to fetch daily challenge leaderboard
 */
export function useDailyChallengeLeaderboard() {
  return useQuery({
    queryKey: ['daily-challenge', 'leaderboard'],
    queryFn: () => dailyChallengeApi.getLeaderboard(),
    staleTime: 1000 * 60, // 1 minute
  });
}
