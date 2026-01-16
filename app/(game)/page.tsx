"use client";

import {
  validateAnswer,
  getFullAnswer,
  getFirstLetterHint,
  getWordLengthHint,
} from "@/lib/utils/riddle-validator";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useGameStore } from "@/lib/store/game-store";
import { motion, AnimatePresence } from "framer-motion";
import { getRiddleById } from "@/lib/constants/riddles";
import { RiddleCard, AnswerInput, HintPanel } from "../components/organisms";
import { calculateGemsEarned } from "@/lib/utils/gem-calculator";

export default function GamePage() {
  const {
    currentRiddleId,
    solveRiddle,
    skipRiddle,
    useHint,
    nextRiddle,
    userGems,
    hasUsedHint,
    hintsUsed,
  } = useGameStore();

  const [showError, setShowError] = useState(false);
  const [revealedHints, setRevealedHints] = useState<{
    hint1?: string;
    hint2?: string;
    answer?: string;
  }>({});

  const currentRiddle = currentRiddleId ? getRiddleById(currentRiddleId) : null;

  // Reset hints when riddle changes
  useEffect(() => {
    setRevealedHints({});
    setShowError(false);
  }, [currentRiddleId]);

  if (!currentRiddle) {
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

  const handleSubmit = (answer: string) => {
    if (validateAnswer(answer, currentRiddle)) {
      // Correct answer!
      const gemsEarned = calculateGemsEarned(currentRiddle.difficulty);
      solveRiddle(currentRiddle.id, gemsEarned);

      // Confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#fbbf24", "#10b981"],
      });

      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-400" />
          <div>
            <p className="font-semibold">Correct! +{gemsEarned} gems</p>
            <p className="text-sm text-[var(--text-muted)]">
              {getFullAnswer(currentRiddle)}
            </p>
          </div>
        </div>,
        { duration: 3000 }
      );

      // Move to next riddle after delay
      setTimeout(() => {
        nextRiddle();
      }, 1500);
    } else {
      // Wrong answer
      setShowError(true);
      setTimeout(() => setShowError(false), 500);

      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="text-red-400" />
          <span>Not quite! Try again.</span>
        </div>,
        { duration: 2000 }
      );
    }
  };

  const handleHint1 = () => {
    useHint(currentRiddle.id, 1);
    const hint = getFirstLetterHint(currentRiddle);
    setRevealedHints((prev) => ({ ...prev, hint1: hint }));
    toast.info(`Hint: First letter is "${hint}"`);
  };

  const handleHint2 = () => {
    useHint(currentRiddle.id, 2);
    const hint = getWordLengthHint(currentRiddle);
    setRevealedHints((prev) => ({ ...prev, hint2: hint }));
    toast.info(`Hint: ${hint}`);
  };

  const handleReveal = () => {
    useHint(currentRiddle.id, 3);
    const answer = getFullAnswer(currentRiddle);
    setRevealedHints((prev) => ({ ...prev, answer }));
    toast.warning(`Answer: ${answer}`, { duration: 5000 });
  };

  const handleSkip = () => {
    skipRiddle(currentRiddle.id);
    toast.info("Riddle skipped");
    nextRiddle();
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
        disabled={!!revealedHints.answer}
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
        disabled={!!revealedHints.answer}
      />
    </div>
  );
}
