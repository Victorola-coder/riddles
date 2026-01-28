'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  const prevGemsRef = useRef(gems);
  const [animationKey, setAnimationKey] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  useEffect(() => {
    if (gems !== prevGemsRef.current && showAnimation) {
      setDirection(gems > prevGemsRef.current ? 'up' : 'down');
      setAnimationKey((prev) => prev + 1);
      prevGemsRef.current = gems;
    }
  }, [gems, showAnimation]);

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

  const isUp = direction === 'up';

  return (
    <motion.div
      className={`flex items-center ${sizeStyles[size]} font-inter font-semibold`}
      key={animationKey}
      variants={showAnimation ? gemCounterVariants : undefined}
      animate={showAnimation ? (isUp ? 'increment' : 'decrement') : undefined}
    >
      <Gem
        size={iconSizes[size]}
        className="text-gold fill-gold"
        strokeWidth={2}
      />
      <AnimatePresence mode="wait">
        <motion.span
          key={gems}
          initial={{ opacity: 0, y: isUp ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: isUp ? -10 : 10 }}
          transition={{ duration: 0.2 }}
          className="text-gold"
        >
          {formatGemCount(gems)}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};
