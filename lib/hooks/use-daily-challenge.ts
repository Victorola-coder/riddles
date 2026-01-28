import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dailyChallengeApi } from '@/lib/api/daily-challenge';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

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
        const streakPart =
          data.streakBonus > 0
            ? ` (+${data.streakBonus} streak bonus)`
            : '';
        const streakLabel =
          data.newStreak > 1 ? ` • ${data.newStreak}-day streak` : '';

        toast.success(
          `Daily Challenge complete! +${data.gemsEarned} gems${streakPart}${streakLabel}`,
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
