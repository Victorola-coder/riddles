"use client";

import { toast } from "sonner";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useGameStore } from "@/lib/store/game-store";
import { useUserStore } from "@/lib/store/user-store";
import { motion, AnimatePresence } from "framer-motion";
import { soundManager } from "@/lib/utils/sound-manager";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { RiddleCard, AnswerInput, HintPanel } from "@/app/components/organisms";
import { useCurrentUser } from "@/lib/hooks/use-auth";
import { getGuestId } from "@/lib/utils/guest-session";
import {
  useGameSession,
  useSolveRiddle,
  useGetHint,
  useUpdateGameSession,
} from "@/lib/hooks/use-game";
import { riddlesApi, type Riddle as ApiRiddle } from "@/lib/api/riddles";
import { useQuery } from "@tanstack/react-query";
import type { Riddle } from "@/types/riddle";

export default function GamePage() {
  // Get user ID (authenticated or guest)
  const { data: currentUser } = useCurrentUser();
  const userId = currentUser?.id || getGuestId();

  // Fetch game session from backend
  const { data: sessionData, isLoading: sessionLoading } = useGameSession(userId);

  // Fetch all riddles from backend
  const { data: riddlesData, isLoading: riddlesLoading } = useQuery({
    queryKey: ["riddles", "all"],
    queryFn: async () => {
      const response = await riddlesApi.getRiddles({ limit: 100 });
      return response.riddles;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Game store state
  const {
    currentRiddleId,
    solvedRiddles,
    skippedRiddles,
    userGems,
    hasUsedHint,
    tickTimer,
    isTimerActive,
    nextRiddle: storeNextRiddle,
  } = useGameStore();

  const {
    incrementTotalSolved,
    incrementNoHintSolves,
    incrementPerfectStreak,
    resetPerfectStreak,
    updateFastestTime,
    addGemsEarned,
    updateStreak,
  } = useUserStore();

  // Mutations
  const solveMutation = useSolveRiddle();
  const hintMutation = useGetHint();
  const updateSessionMutation = useUpdateGameSession();

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

  // Convert API riddle to app riddle format
  const riddlesMap = useMemo(() => {
    if (!riddlesData) return new Map<string, Riddle>();
    
    const map = new Map<string, Riddle>();
    riddlesData.forEach((apiRiddle) => {
      // API doesn't return answer, so we'll need to handle validation server-side
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
  }, [riddlesData]);

  // Get current riddle
  const currentRiddle = currentRiddleId ? riddlesMap.get(currentRiddleId) : null;

  // Initialize session and get next riddle if needed
  useEffect(() => {
    if (!sessionLoading && sessionData?.session && riddlesData) {
      const session = sessionData.session;
      
      // If no current riddle, get the first unsolved one
      if (!session.currentRiddleId && riddlesData.length > 0) {
        const solvedSet = new Set(session.solvedRiddles || []);
        const skippedSet = new Set(session.skippedRiddles || []);
        
        const nextRiddle = riddlesData.find(
          (r) => !solvedSet.has(r.id) && !skippedSet.has(r.id)
        );
        
        if (nextRiddle) {
          // Update session with first riddle
          updateSessionMutation.mutate({
            userId,
            currentRiddleId: nextRiddle.id,
          });
        }
      }
    }
  }, [sessionLoading, sessionData, riddlesData, userId, updateSessionMutation]);

  // Reset hints and timer when riddle changes
  useEffect(() => {
    if (currentRiddleId) {
      setRevealedHints({});
      setShowError(false);
      setWrongAttempts(0);
      startTimeRef.current = Date.now();
      updateStreak();
    }
  }, [currentRiddleId, updateStreak]);

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

  // Loading state
  if (sessionLoading || riddlesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple mx-auto mb-4" />
          <p className="text-[var(--text-secondary)] font-inter">
            Loading game...
          </p>
        </div>
      </div>
    );
  }

  // No riddles available
  if (!riddlesData || riddlesData.length === 0) {
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

  // No current riddle (all solved)
  if (!currentRiddle) {
    const solvedSet = new Set(solvedRiddles || []);
    const allSolved = riddlesData.every((r) => solvedSet.has(r.id));
    
    if (allSolved) {
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

    // Find next unsolved riddle
    const solvedSet2 = new Set(solvedRiddles || []);
    const skippedSet = new Set(skippedRiddles || []);
    const nextRiddle = riddlesData.find(
      (r) => !solvedSet2.has(r.id) && !skippedSet.has(r.id)
    );

    if (nextRiddle) {
      // Set next riddle
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

  const handleSubmit = async (answer: string) => {
    if (isSubmitting || !userId) return;
    
    setIsSubmitting(true);
    
    try {
      const solveTime = (Date.now() - startTimeRef.current) / 1000;
      const usedNoHints =
        !hasUsedHint(currentRiddle.id, 1) &&
        !hasUsedHint(currentRiddle.id, 2) &&
        !hasUsedHint(currentRiddle.id, 3);

      // Submit to backend
      const result = await solveMutation.mutateAsync({
        userId,
        riddleId: currentRiddle.id,
        answer,
      });

      if (result.isCorrect) {
        // Correct answer!
        const gemsEarned = result.gemsEarned || 0;

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
          colors: ["#8b5cf6", "#fbbf24", "#10b981"],
        });

        toast.success(
          <div className="flex items-center gap-2 flex-nowrap">
            <CheckCircle2 className="text-green-400" />
            <div>
              <p className="font-semibold">Correct! +{gemsEarned} gems</p>
              <p className="text-sm text-[var(--text-muted)]">
                {result.message || "Well done!"}
              </p>
            </div>
          </div>,
          { duration: 3000 }
        );

        // Get next riddle
        const solvedSet = new Set([...solvedRiddles, currentRiddle.id]);
        const skippedSet = new Set(skippedRiddles || []);
        const nextRiddle = riddlesData.find(
          (r) => !solvedSet.has(r.id) && !skippedSet.has(r.id)
        );

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
            currentRiddleId: null,
          });
        }

        // Move to next riddle after delay
        setTimeout(() => {
          storeNextRiddle();
        }, 1500);
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
            <span>{result.message || "Not quite! Try again."}</span>
          </div>,
          { duration: 2000 }
        );
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      toast.error("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHint1 = async () => {
    if (!userId || isSubmitting) return;

    try {
      const result = await hintMutation.mutateAsync({
        userId,
        riddleId: currentRiddle.id,
        hintLevel: 1,
      });

      setRevealedHints((prev) => ({ ...prev, hint1: result.hint }));
      soundManager.play("hint");
      toast.info(`Hint: First letter is "${result.hint}"`);
    } catch (error) {
      console.error("Failed to get hint:", error);
    }
  };

  const handleHint2 = async () => {
    if (!userId || isSubmitting) return;

    try {
      const result = await hintMutation.mutateAsync({
        userId,
        riddleId: currentRiddle.id,
        hintLevel: 2,
      });

      setRevealedHints((prev) => ({ ...prev, hint2: result.hint }));
      soundManager.play("hint");
      toast.info(`Hint: ${result.hint}`);
    } catch (error) {
      console.error("Failed to get hint:", error);
    }
  };

  const handleReveal = async () => {
    if (!userId || isSubmitting) return;

    try {
      const result = await hintMutation.mutateAsync({
        userId,
        riddleId: currentRiddle.id,
        hintLevel: 3,
      });

      setRevealedHints((prev) => ({ ...prev, answer: result.hint }));
      soundManager.play("hint");
      toast.warning(`Answer: ${result.hint}`, { duration: 5000 });
    } catch (error) {
      console.error("Failed to reveal answer:", error);
    }
  };

  const handleSkip = async () => {
    if (!userId || isSubmitting) return;

    try {
      const skippedSet = new Set([...skippedRiddles, currentRiddle.id]);
      const nextRiddle = riddlesData.find((r) => !skippedSet.has(r.id));

      await updateSessionMutation.mutateAsync({
        userId,
        skippedRiddles: [...skippedRiddles, currentRiddle.id],
        currentRiddleId: nextRiddle?.id || null,
      });

      toast.info("Riddle skipped");
      storeNextRiddle();
    } catch (error) {
      console.error("Failed to skip riddle:", error);
      toast.error("Failed to skip riddle");
    }
  };

  const hint1Used = hasUsedHint(currentRiddle.id, 1);
  const hint2Used = hasUsedHint(currentRiddle.id, 2);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
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
        disabled={!!revealedHints.answer || isSubmitting}
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
        disabled={!!revealedHints.answer || isSubmitting}
      />
    </div>
  );
}
