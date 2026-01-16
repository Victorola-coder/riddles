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

export const RiddleCard: React.FC<RiddleCardProps> = ({ riddle, className }) => {
  return (
    <motion.div
      className={`glass-card p-8 md:p-12 ${className || ''}`}
      variants={cardEntranceVariants}
      initial="hidden"
      animate="visible"
      key={riddle.id}
    >
      <div className="flex flex-col gap-6">
        {/* Difficulty Badge */}
        <div className="flex justify-between items-center">
          <DifficultyBadge difficulty={riddle.difficulty} />
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
