'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
  longestStreak?: number;
  size?: 'sm' | 'md' | 'lg';
  showLongest?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streak,
  longestStreak,
  size = 'md',
  showLongest = false,
}) => {
  const sizeStyles = {
    sm: 'text-sm gap-1',
    md: 'text-lg gap-2',
    lg: 'text-2xl gap-3',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  const flameColor = streak >= 7 ? 'text-orange-500' : streak >= 3 ? 'text-yellow-500' : 'text-gray-400';

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className={`flex items-center ${sizeStyles[size]} font-inter font-semibold`}
        animate={streak > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Flame
          size={iconSizes[size]}
          className={`${flameColor} ${streak > 0 ? 'fill-current' : ''}`}
          strokeWidth={2}
        />
        <span className={flameColor}>{streak}</span>
      </motion.div>

      {showLongest && longestStreak !== undefined && (
        <p className="text-xs text-[var(--text-muted)] font-inter">
          Best: {longestStreak}
        </p>
      )}
    </div>
  );
};
