'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Riddle } from '@/types/riddle';
import { DifficultyBadge } from '../molecules';
import { cardEntranceVariants } from '@/lib/constants/animations';
import { getFullAnswer } from '@/lib/utils/riddle-validator';

interface RiddleCardProps {
  riddle: Riddle;
  className?: string;
}

import { useGameStore } from '@/lib/store/game-store';
import { Timer } from '../molecules';

export const RiddleCard: React.FC<RiddleCardProps> = ({ riddle, className }) => {
  const { timeLeft, totalTime, isTimerActive, activeModifier } = useGameStore();
  
  // In REVERSE mode, show the answer and ask for the riddle/question
  const isReverse = activeModifier === 'REVERSE';
  const displayText = isReverse ? getFullAnswer(riddle) : riddle.question;
  const promptText = isReverse ? "What riddle has this answer?" : null;

  return (
    <motion.div
      className={`glass-card p-8 md:p-12 ${className || ''}`}
      variants={cardEntranceVariants}
      initial="hidden"
      animate="visible"
      key={riddle.id}
    >
      <div className="flex flex-col gap-6">
        {/* Difficulty Badge & Timer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <DifficultyBadge difficulty={riddle.difficulty} />
            <Timer 
              timeLeft={timeLeft} 
              totalTime={totalTime} 
              isActive={isTimerActive} 
            />
          </div>
          {riddle.category && (
            <span className="text-sm text-[var(--text-muted)] font-inter">
              {riddle.category}
            </span>
          )}
        </div>

        {/* Riddle Question (or Answer in REVERSE mode) */}
        <div className="text-center">
          {isReverse && (
            <p className="text-sm text-[var(--accent-secondary)] font-inter mb-3 uppercase tracking-wide">
              {promptText}
            </p>
          )}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-cinzel text-[var(--text-primary)] leading-relaxed">
            {displayText}
          </h2>
          {isReverse && (
            <p className="text-xs text-[var(--text-muted)] font-inter mt-3 italic">
              Hint: Think of a riddle that would have this as the answer
            </p>
          )}
        </div>

        {/* Decorative line */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent mx-auto" />
      </div>
    </motion.div>
  );
};
