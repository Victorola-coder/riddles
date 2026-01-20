"use client";

import { toast } from "sonner";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, Loader2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { RiddleCard, AnswerInput, HintPanel } from "@/app/components/organisms";
import Skeleton from "@/app/components/ui/skeleton";
import { useGameStore } from "@/lib/store/game-store";
import { useUserStore } from "@/lib/store/user-store";
import { useCurrentUser } from "@/lib/hooks/use-auth";
import {
  useGameSession,
  useSolveRiddle,
  useGetHint,
  useUpdateGameSession,
} from "@/lib/hooks/use-game";
import { riddlesApi } from "@/lib/api/riddles";
import { soundManager } from "@/lib/utils/sound-manager";
import { getGuestId } from "@/lib/utils/guest-session";
import { GAME_CONFIG } from "@/lib/constants/game-config";
import type { Riddle } from "@/types/riddle";

// Constants
const RIDDLE_LIMIT = 100;
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes
const CONFETTI_COLORS: string[] = ["#8b5cf6", "#fbbf24", "#10b981"];
const SUCCESS_TOAST_DURATION = 3000;
const ERROR_TOAST_DURATION = 2000;

// Type for hint result
type HintResult = {
  hint: string;
  gemsSpent: number;
  remainingGems: number;
};

export default function GamePage() {
  // Get user ID (authenticated or guest)
  const { data: currentUser } = useCurrentUser();
  const [userId, setUserId] = useState<string | null>(null);

  // Get guest ID only on client to avoid hydration mismatch
  useEffect(() => {
    if (!currentUser?.id) {
      setUserId(getGuestId());
    } else {
      setUserId(currentUser.id);
    }
  }, [currentUser?.id]);

  // Fetch game session from backend
  const { data: sessionData, isLoading: sessionLoading } = useGameSession(
    userId || undefined
  );

  // Shared query options for riddles (extracted to avoid recreation)
  const riddleQueryOptions = useMemo(
    () => ({
      staleTime: Infinity,
      gcTime: CACHE_TIME,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }),
    []
  );

  // Shared query function factory
  const createRiddleQueryFn = useCallback(
    (difficulty: "easy" | "medium" | "hard") => async () => {
      const response = await riddlesApi.getRiddles({
        difficulty,
        limit: RIDDLE_LIMIT,
      });
      return response.riddles;
    },
    []
  );

  // Prefetch riddles by difficulty in parallel for optimal performance
  const { data: easyRiddles = [], isLoading: easyLoading } = useQuery({
    queryKey: ["riddles", "easy"],
    queryFn: createRiddleQueryFn("easy"),
    ...riddleQueryOptions,
  });

  const { data: mediumRiddles = [], isLoading: mediumLoading } = useQuery({
    queryKey: ["riddles", "medium"],
    queryFn: createRiddleQueryFn("medium"),
    ...riddleQueryOptions,
  });

  const { data: hardRiddles = [], isLoading: hardLoading } = useQuery({
    queryKey: ["riddles", "hard"],
    queryFn: createRiddleQueryFn("hard"),
    ...riddleQueryOptions,
  });

  // Organize riddles by difficulty for ordered progression
  const riddlesByDifficulty = useMemo(() => {
    return {
      easy: easyRiddles,
      medium: mediumRiddles,
      hard: hardRiddles,
    };
  }, [easyRiddles, mediumRiddles, hardRiddles]);

  // Combine all riddles for the map (for quick lookup)
  const allRiddlesData = useMemo(() => {
    return [...easyRiddles, ...mediumRiddles, ...hardRiddles];
  }, [easyRiddles, mediumRiddles, hardRiddles]);

  const riddlesLoading = easyLoading || mediumLoading || hardLoading;

  // Game store state - individual selectors for optimal performance
  const currentRiddleId = useGameStore((state) => state.currentRiddleId);
  const solvedRiddles = useGameStore((state) => state.solvedRiddles);
  const skippedRiddles = useGameStore((state) => state.skippedRiddles);
  const userGems = useGameStore((state) => state.userGems);
  const hasUsedHint = useGameStore((state) => state.hasUsedHint);
  const tickTimer = useGameStore((state) => state.tickTimer);
  const isTimerActive = useGameStore((state) => state.isTimerActive);
  const timeLeft = useGameStore((state) => state.timeLeft);
  const spendGems = useGameStore((state) => state.spendGems);

  // User store actions - individual selectors (actions are stable references)
  const incrementTotalSolved = useUserStore(
    (state) => state.incrementTotalSolved
  );
  const incrementNoHintSolves = useUserStore(
    (state) => state.incrementNoHintSolves
  );
  const incrementPerfectStreak = useUserStore(
    (state) => state.incrementPerfectStreak
  );
  const resetPerfectStreak = useUserStore((state) => state.resetPerfectStreak);
  const updateFastestTime = useUserStore((state) => state.updateFastestTime);
  const addGemsEarned = useUserStore((state) => state.addGemsEarned);
  const updateStreak = useUserStore((state) => state.updateStreak);

  // Mutations
  const solveMutation = useSolveRiddle();
  const hintMutation = useGetHint();
  const updateSessionMutation = useUpdateGameSession();
  const queryClient = useQueryClient();

  // Local state
  const [showError, setShowError] = useState(false);
  const [revealedHints, setRevealedHints] = useState<{
    hint1?: string;
    hint2?: string;
    answer?: string;
  }>({});
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  // Convert API riddle to app riddle format - optimized map for O(1) lookup
  const riddlesMap = useMemo(() => {
    if (!allRiddlesData.length) return new Map<string, Riddle>();

    const map = new Map<string, Riddle>();
    allRiddlesData.forEach((apiRiddle) => {
      map.set(apiRiddle.id, {
        id: apiRiddle.id,
        question: apiRiddle.question,
        answer: "", // Will be validated server-side
        difficulty: apiRiddle.difficulty,
        category: apiRiddle.category,
        hint1: apiRiddle.hint1,
        hint2: apiRiddle.hint2,
        tags: apiRiddle.tags,
      });
    });
    return map;
  }, [allRiddlesData]);

  // Helper function to get next riddle in progression order (Easy → Medium → Hard)
  const getNextRiddleInProgression = useCallback(
    (solvedIds: string[], skippedIds: string[]) => {
      const solvedSet = new Set(solvedIds);
      const skippedSet = new Set(skippedIds);

      // Check Easy riddles first
      for (const riddle of riddlesByDifficulty.easy) {
        if (!solvedSet.has(riddle.id) && !skippedSet.has(riddle.id)) {
          return riddle;
        }
      }

      // Then Medium riddles
      for (const riddle of riddlesByDifficulty.medium) {
        if (!solvedSet.has(riddle.id) && !skippedSet.has(riddle.id)) {
          return riddle;
        }
      }

      // Finally Hard riddles
      for (const riddle of riddlesByDifficulty.hard) {
        if (!solvedSet.has(riddle.id) && !skippedSet.has(riddle.id)) {
          return riddle;
        }
      }

      return null; // All riddles completed
    },
    [riddlesByDifficulty]
  );

  // Get current riddle
  const currentRiddle = currentRiddleId
    ? riddlesMap.get(currentRiddleId)
    : null;

  // Prefetch next riddles while user is playing for instant transitions
  useEffect(() => {
    if (currentRiddle && allRiddlesData.length > 0) {
      // Prefetch next riddle in background for instant loading
      const nextRiddle = getNextRiddleInProgression(
        solvedRiddles || [],
        skippedRiddles || []
      );

      if (nextRiddle) {
        // Prefetch the next riddle's data (already in cache, but ensure it's fresh)
        queryClient.prefetchQuery({
          queryKey: ["riddles", nextRiddle.difficulty],
          queryFn: async () => {
            const response = await riddlesApi.getRiddles({
              difficulty: nextRiddle.difficulty,
              limit: 100,
            });
            return response.riddles;
          },
          staleTime: Infinity,
        });
      }
    }
  }, [
    currentRiddle,
    solvedRiddles,
    skippedRiddles,
    getNextRiddleInProgression,
    queryClient,
    allRiddlesData.length,
  ]);

  // Track if we've initialized the session to prevent infinite loops
  const hasInitialized = useRef(false);

  // Initialize session and get next riddle in progression order
  // ALWAYS ensure it starts with Easy difficulty
  useEffect(() => {
    if (
      !userId ||
      hasInitialized.current ||
      sessionLoading ||
      !sessionData?.session ||
      riddlesLoading ||
      !allRiddlesData.length
    ) {
      return;
    }

    const session = sessionData.session;
    const totalEasyRiddles = riddlesByDifficulty.easy.length;
    const easySolvedCount = (session.solvedRiddles || []).filter(
      (id: string) => {
        const riddle = riddlesMap.get(id);
        return riddle?.difficulty === "easy";
      }
    ).length;

    // Check if user has completed all Easy riddles
    const hasCompletedEasy = easySolvedCount >= totalEasyRiddles;

    // Get current riddle if it exists
    const currentRiddleFromSession = session.currentRiddleId
      ? riddlesMap.get(session.currentRiddleId)
      : null;

    // If no current riddle OR current riddle is not Easy and user hasn't completed Easy yet
    if (
      !session.currentRiddleId ||
      (currentRiddleFromSession &&
        currentRiddleFromSession.difficulty !== "easy" &&
        !hasCompletedEasy)
    ) {
      // Always start with Easy if not all Easy riddles are completed
      const nextRiddle = getNextRiddleInProgression(
        session.solvedRiddles || [],
        session.skippedRiddles || []
      );

      if (nextRiddle) {
        // Ensure it's Easy if user hasn't completed Easy yet
        if (!hasCompletedEasy && nextRiddle.difficulty !== "easy") {
          // Force first Easy riddle
          const firstEasyRiddle = riddlesByDifficulty.easy.find(
            (r) =>
              !(session.solvedRiddles || []).includes(r.id) &&
              !(session.skippedRiddles || []).includes(r.id)
          );

          if (firstEasyRiddle) {
            hasInitialized.current = true;
            updateSessionMutation.mutate({
              userId,
              currentRiddleId: firstEasyRiddle.id,
            });
            return;
          }
        }

        hasInitialized.current = true;
        updateSessionMutation.mutate({
          userId,
          currentRiddleId: nextRiddle.id,
        });
      }
    } else if (session.currentRiddleId) {
      // Validate current riddle is appropriate for progression
      if (
        currentRiddleFromSession &&
        !hasCompletedEasy &&
        currentRiddleFromSession.difficulty !== "easy"
      ) {
        // Force back to Easy if somehow got a non-Easy riddle
        const firstEasyRiddle = riddlesByDifficulty.easy.find(
          (r) =>
            !(session.solvedRiddles || []).includes(r.id) &&
            !(session.skippedRiddles || []).includes(r.id)
        );

        if (firstEasyRiddle) {
          updateSessionMutation.mutate({
            userId,
            currentRiddleId: firstEasyRiddle.id,
          });
        }
      }

      // Mark as initialized if we already have a riddle
      hasInitialized.current = true;
    }
  }, [
    sessionLoading,
    sessionData,
    riddlesLoading,
    allRiddlesData.length,
    userId,
    getNextRiddleInProgression,
    riddlesByDifficulty,
    riddlesMap,
  ]);

  // Track processed riddle to prevent infinite loops
  const processedRiddleId = useRef<string | null>(null);

  // Reset hints and timer when riddle changes
  useEffect(() => {
    if (
      currentRiddleId &&
      currentRiddle &&
      processedRiddleId.current !== currentRiddleId
    ) {
      processedRiddleId.current = currentRiddleId;

      setRevealedHints({});
      setShowError(false);
      setWrongAttempts(0);
      startTimeRef.current = Date.now();
      updateStreak();

      // Initialize timer based on difficulty
      const timerDuration = GAME_CONFIG.TIMER[currentRiddle.difficulty];
      if (timerDuration > 0) {
        useGameStore.setState({
          timeLeft: timerDuration,
          totalTime: timerDuration,
          isTimerActive: true,
        });
      } else {
        // Easy riddles have infinite time (0 = no timer)
        useGameStore.setState({
          timeLeft: 0,
          totalTime: 0,
          isTimerActive: false,
        });
      }
    }
  }, [currentRiddleId, currentRiddle, updateStreak]);

  // Timer Tick Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, tickTimer]);

  // Memoize hint check to avoid repeated calls
  const usedNoHints = useMemo(() => {
    if (!currentRiddle) return false;
    return (
      !hasUsedHint(currentRiddle.id, 1) &&
      !hasUsedHint(currentRiddle.id, 2) &&
      !hasUsedHint(currentRiddle.id, 3)
    );
  }, [currentRiddle, hasUsedHint]);

  const handleSubmit = useCallback(
    async (answer: string) => {
      if (isSubmitting || !userId || !currentRiddle) return;

      setIsSubmitting(true);

      try {
        const solveTime = (Date.now() - startTimeRef.current) / 1000;

        // Submit to backend
        const result = await solveMutation.mutateAsync({
          userId,
          riddleId: currentRiddle.id,
          answer,
        });

        if (result.correct) {
          // Correct answer!
          const gemsEarned = result.gemsEarned || 0;

          // Update store optimistically for instant UI feedback
          useGameStore.setState((state) => ({
            solvedRiddles: [...state.solvedRiddles, currentRiddle.id],
            userGems: state.userGems + gemsEarned,
            isTimerActive: false, // Stop timer on solve
          }));

          // Play success sounds
          soundManager.play("success");
          soundManager.play("gem");

          // Track achievements
          incrementTotalSolved();
          addGemsEarned(gemsEarned);
          updateFastestTime(solveTime);

          if (usedNoHints) {
            incrementNoHintSolves();
          }

          if (wrongAttempts === 0) {
            incrementPerfectStreak();
          } else {
            resetPerfectStreak();
          }

          // Confetti animation
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: CONFETTI_COLORS,
          });

          toast.success(
            <div className="flex items-center gap-2 flex-nowrap">
              <CheckCircle2 className="text-green-400" />
              <div>
                <p className="font-semibold">Correct! +{gemsEarned} gems</p>
                <p className="text-sm text-[var(--text-muted)]">Well done!</p>
              </div>
            </div>,
            { duration: SUCCESS_TOAST_DURATION }
          );

          // Get next riddle in progression order (Easy → Medium → Hard)
          const nextRiddle = getNextRiddleInProgression(
            [...solvedRiddles, currentRiddle.id],
            skippedRiddles || []
          );

          // Check if user unlocked a new difficulty tier
          const currentDifficulty = currentRiddle.difficulty;
          const nextDifficulty = nextRiddle?.difficulty;
          const unlockedNewTier =
            nextRiddle &&
            nextDifficulty &&
            currentDifficulty !== nextDifficulty;

          // Celebrate difficulty unlock!
          if (unlockedNewTier && nextDifficulty) {
            setTimeout(() => {
              confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.5 },
                colors: CONFETTI_COLORS,
              });
              toast.success(
                <div className="flex items-center gap-2">
                  <Trophy className="text-gold" size={20} />
                  <div>
                    <p className="font-semibold">
                      🎉 Unlocked {nextDifficulty.toUpperCase()} Difficulty!
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Ready for a bigger challenge?
                    </p>
                  </div>
                </div>,
                { duration: 4000 }
              );
              soundManager.play("achievement");
            }, 500);
          }

          // Update session with next riddle
          if (nextRiddle) {
            await updateSessionMutation.mutateAsync({
              userId,
              currentRiddleId: nextRiddle.id,
              solvedRiddles: [...solvedRiddles, currentRiddle.id],
              userGems: userGems + gemsEarned,
            });
          } else {
            // All riddles solved
            await updateSessionMutation.mutateAsync({
              userId,
              solvedRiddles: [...solvedRiddles, currentRiddle.id],
              userGems: userGems + gemsEarned,
              currentRiddleId: undefined,
            });
          }

          // Session update will trigger re-render with next riddle
        } else {
          // Wrong answer
          setWrongAttempts((prev) => prev + 1);
          setShowError(true);
          setTimeout(() => setShowError(false), 500);

          // Play error sound
          soundManager.play("error");

          toast.error(
            <div className="flex items-center gap-2">
              <XCircle className="text-red-400" />
              <span>Not quite! Try again.</span>
            </div>,
            { duration: ERROR_TOAST_DURATION }
          );
        }
      } catch (error) {
        console.error("Failed to submit answer:", error);
        toast.error("Failed to submit answer. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      userId,
      currentRiddle,
      solveMutation,
      usedNoHints,
      wrongAttempts,
      solvedRiddles,
      skippedRiddles,
      userGems,
      getNextRiddleInProgression,
      updateSessionMutation,
      incrementTotalSolved,
      addGemsEarned,
      updateFastestTime,
      incrementNoHintSolves,
      incrementPerfectStreak,
      resetPerfectStreak,
    ]
  );

  // Optimized hint handler factory
  const createHintHandler = useCallback(
    (hintLevel: 1 | 2 | 3, hintKey: "hint1" | "hint2" | "answer") =>
      async () => {
        if (!userId || isSubmitting || !currentRiddle) return;

        // Check if user has enough gems before making API call
        const costKey =
          `hint${hintLevel}` as keyof typeof GAME_CONFIG.GEM_COSTS;
        const cost = GAME_CONFIG.GEM_COSTS[costKey];

        if (userGems < cost) {
          // Only show error if not already shown (prevent duplicates)
          toast.error("Not enough gems", {
            duration: 3000,
            id: `insufficient-gems-${hintLevel}`, // Use toast ID to prevent duplicates
          });
          return;
        }

        try {
          const result = await hintMutation.mutateAsync({
            userId,
            riddleId: currentRiddle.id,
            hintLevel,
          });

          const hint = (result as unknown as HintResult).hint;
          setRevealedHints((prev) => ({ ...prev, [hintKey]: hint }));
          soundManager.play("hint");

          if (hintLevel === 1) {
            toast.info(`Hint: First letter is "${hint}"`);
          } else if (hintLevel === 2) {
            toast.info(`Hint: ${hint}`);
          } else {
            toast.warning(`Answer: ${hint}`, { duration: 5000 });
          }
        } catch (error) {
          // Error is already handled in useGetHint hook, just log here
          console.error(`Failed to get hint ${hintLevel}:`, error);
        }
      },
    [userId, isSubmitting, currentRiddle, hintMutation, userGems]
  );

  const handleHint1 = useMemo(
    () => createHintHandler(1, "hint1"),
    [createHintHandler]
  );
  const handleHint2 = useMemo(
    () => createHintHandler(2, "hint2"),
    [createHintHandler]
  );
  const handleReveal = useMemo(
    () => createHintHandler(3, "answer"),
    [createHintHandler]
  );

  const handleSkip = useCallback(async () => {
    if (!userId || isSubmitting || !currentRiddle) return;

    try {
      // Get next riddle in progression order after skipping
      const nextRiddle = getNextRiddleInProgression(solvedRiddles || [], [
        ...skippedRiddles,
        currentRiddle.id,
      ]);

      await updateSessionMutation.mutateAsync({
        userId,
        skippedRiddles: [...skippedRiddles, currentRiddle.id],
        currentRiddleId: nextRiddle?.id,
      });

      toast.info("Riddle skipped");
    } catch (error) {
      console.error("Failed to skip riddle:", error);
      toast.error("Failed to skip riddle");
    }
  }, [
    userId,
    isSubmitting,
    currentRiddle,
    solvedRiddles,
    skippedRiddles,
    getNextRiddleInProgression,
    updateSessionMutation,
  ]);

  const hint1Used = currentRiddle ? hasUsedHint(currentRiddle.id, 1) : false;
  const hint2Used = currentRiddle ? hasUsedHint(currentRiddle.id, 2) : false;

  // Handle timer expiration - deduct gems, reveal answer, and auto-advance
  const hasTimedOut = useRef(false);
  useEffect(() => {
    // Check if this riddle even has a timer (easy mode has no timer)
    const hasTimer = currentRiddle && GAME_CONFIG.TIMER[currentRiddle.difficulty] > 0;
    
    if (
      hasTimer && // Only trigger timeout if riddle has a timer
      !isTimerActive &&
      timeLeft === 0 &&
      currentRiddle &&
      !revealedHints.answer &&
      !hasTimedOut.current &&
      userId
    ) {
      hasTimedOut.current = true;

      const timeoutPenalty =
        (GAME_CONFIG.GEM_COSTS as Record<string, number>).timeout || 25;
      const currentGems = useGameStore.getState().userGems;

      // Deduct gems (ensure we don't go below 0)
      const gemsToDeduct = Math.min(timeoutPenalty, currentGems);
      if (gemsToDeduct > 0) {
        spendGems(gemsToDeduct);

        // Update backend session with gem loss
        updateSessionMutation.mutate({
          userId,
          userGems: currentGems - gemsToDeduct,
        });
      }

      // Time's up! Auto-reveal the answer
      handleReveal();

      // Show timeout notification with gem loss - larger and more readable
      toast.error(
        <div className="flex items-start gap-3 p-2">
          <XCircle className="text-red-500 w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-lg font-bold text-white mb-1">⏰ Time's Up!</p>
            <p className="text-base text-white/90 leading-relaxed">
              {gemsToDeduct > 0
                ? `You lost ${gemsToDeduct} gems as a penalty. Moving to next question...`
                : "Moving to next question..."}
            </p>
          </div>
        </div>,
        {
          duration: 5000, // Show for 5 seconds before auto-advancing
          className: "!bg-red-950/95 !border-red-500/50 !text-white",
          style: {
            fontSize: "16px",
            minWidth: "320px",
            maxWidth: "500px",
          },
        }
      );

      // Play timeout sound
      soundManager.play("error");

      // Auto-advance to next question after 5 seconds
      setTimeout(async () => {
        const nextRiddle = getNextRiddleInProgression(
          solvedRiddles || [],
          [...(skippedRiddles || []), currentRiddle.id]
        );

        if (nextRiddle) {
          await updateSessionMutation.mutateAsync({
            userId,
            skippedRiddles: [...(skippedRiddles || []), currentRiddle.id],
            currentRiddleId: nextRiddle.id,
          });
        } else {
          // No more riddles
          await updateSessionMutation.mutateAsync({
            userId,
            skippedRiddles: [...(skippedRiddles || []), currentRiddle.id],
            currentRiddleId: undefined,
          });
        }
      }, 5000);
    }

    // Reset timeout flag when riddle changes
    if (currentRiddleId) {
      hasTimedOut.current = false;
    }
  }, [
    isTimerActive,
    timeLeft,
    currentRiddle,
    currentRiddleId,
    revealedHints.answer,
    handleReveal,
    userId,
    spendGems,
    updateSessionMutation,
    solvedRiddles,
    skippedRiddles,
    getNextRiddleInProgression,
  ]);


  // Calculate progress per difficulty tier - optimized with Set for O(1) lookups
  const progressByDifficulty = useMemo(() => {
    const solvedSet = new Set(solvedRiddles || []);

    // Count solved riddles efficiently - single pass
    const countSolved = (riddles: typeof easyRiddles) => {
      let count = 0;
      for (const riddle of riddles) {
        if (solvedSet.has(riddle.id)) count++;
      }
      return count;
    };

    return {
      easy: {
        solved: countSolved(riddlesByDifficulty.easy),
        total: riddlesByDifficulty.easy.length,
      },
      medium: {
        solved: countSolved(riddlesByDifficulty.medium),
        total: riddlesByDifficulty.medium.length,
      },
      hard: {
        solved: countSolved(riddlesByDifficulty.hard),
        total: riddlesByDifficulty.hard.length,
      },
    };
  }, [solvedRiddles, riddlesByDifficulty]);

  // Loading state - wait for userId to be set
  if (!userId || sessionLoading || riddlesLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
        {/* Riddle Card Skeleton */}
        <div className="glass-card p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="flex justify-between items-center pt-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Input Skeleton */}
        <div className="glass-card p-2 flex items-center gap-2">
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="h-14 w-14 rounded-xl" />
        </div>

        {/* Hint Panel Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // No riddles available
  if (!allRiddlesData || allRiddlesData.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-cinzel text-white mb-4">
          No Riddles Available
        </h1>
        <p className="text-xl text-[var(--text-secondary)] font-inter">
          Please check back later!
        </p>
      </div>
    );
  }

  // No current riddle (all solved or loading next)
  if (!currentRiddle) {
    const nextRiddle = getNextRiddleInProgression(
      solvedRiddles || [],
      skippedRiddles || []
    );

    if (!nextRiddle) {
      // All riddles completed
      return (
        <div className="text-center">
          <h1 className="text-4xl font-cinzel text-white mb-4">
            🎉 Congratulations!
          </h1>
          <p className="text-xl text-[var(--text-secondary)] font-inter">
            You've completed all available riddles!
          </p>
        </div>
      );
    }

    // Set next riddle in progression order
    if (userId && !hasInitialized.current) {
      updateSessionMutation.mutate({
        userId,
        currentRiddleId: nextRiddle.id,
      });
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Progress Indicator */}

      {/* Riddle Card */}
      <AnimatePresence mode="wait">
        <RiddleCard key={currentRiddle.id} riddle={currentRiddle} />
      </AnimatePresence>

      {/* Revealed Hints Display */}
      {(revealedHints.hint1 || revealedHints.hint2 || revealedHints.answer) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 text-center"
        >
          <div className="flex flex-wrap justify-center gap-4 text-sm font-inter">
            {revealedHints.hint1 && (
              <span className="text-[var(--text-secondary)]">
                First letter:{" "}
                <span className="text-purple font-semibold">
                  {revealedHints.hint1}
                </span>
              </span>
            )}
            {revealedHints.hint2 && (
              <span className="text-[var(--text-secondary)]">
                Length:{" "}
                <span className="text-purple font-semibold">
                  {revealedHints.hint2}
                </span>
              </span>
            )}
            {revealedHints.answer && (
              <span className="text-[var(--text-secondary)]">
                Answer:{" "}
                <span className="text-gold font-semibold">
                  {revealedHints.answer}
                </span>
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Answer Input */}
      <AnswerInput
        onSubmit={handleSubmit}
        showError={showError}
        disabled={isSubmitting}
      />

      {/* Hint Panel */}
      <HintPanel
        onHint1={handleHint1}
        onHint2={handleHint2}
        onReveal={handleReveal}
        onSkip={handleSkip}
        hint1Used={hint1Used}
        hint2Used={hint2Used}
        userGems={userGems}
        disabled={isSubmitting}
      />
    </div>
  );
}
