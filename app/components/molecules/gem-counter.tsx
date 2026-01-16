'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem } from 'lucide-react';
import { formatGemCount } from '@/lib/utils/gem-calculator';
import { gemCounterVariants } from '@/lib/constants/animations';

interface GemCounterProps {
  gems: number;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const GemCounter: React.FC<GemCounterProps> = ({
  gems,
  showAnimation = true,
  size = 'md',
}) => {
  const [prevGems, setPrevGems] = useState(gems);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (gems !== prevGems && showAnimation) {
      setAnimationKey((prev) => prev + 1);
      setPrevGems(gems);
    }
  }, [gems, prevGems, showAnimation]);

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

  const isIncrement = gems > prevGems;

  return (
    <motion.div
      className={`flex items-center ${sizeStyles[size]} font-inter font-semibold`}
      key={animationKey}
      variants={showAnimation ? gemCounterVariants : undefined}
      animate={showAnimation ? (isIncrement ? 'increment' : 'decrement') : undefined}
    >
      <Gem
        size={iconSizes[size]}
        className="text-gold fill-gold"
        strokeWidth={2}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={gems}
          initial={{ opacity: 0, y: isIncrement ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isIncrement ? -10 : 10 }}
          transition={{ duration: 0.2 }}
          className="text-gold"
        >
          {formatGemCount(gems)}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};
