'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Riddle } from '@/types/riddle';
import { DifficultyBadge } from '../molecules';
import { cardEntranceVariants } from '@/lib/constants/animations';

interface RiddleCardProps {
  riddle: Riddle;
  className?: string;
}

import { useGameStore } from '@/lib/store/game-store';
import { Timer } from '../molecules';

export const RiddleCard: React.FC<RiddleCardProps> = ({ riddle, className }) => {
  const { timeLeft, totalTime, isTimerActive } = useGameStore();

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

        {/* Riddle Question */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-cinzel text-white leading-relaxed">
            {riddle.question}
          </h2>
        </div>

        {/* Decorative line */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple to-transparent mx-auto" />
      </div>
    </motion.div>
  );
};
