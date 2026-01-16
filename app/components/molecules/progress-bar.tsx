'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  showPercentage = true,
  className,
}) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={`w-full ${className || ''}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2 text-sm font-inter">
          {label && <span className="text-[var(--text-secondary)]">{label}</span>}
          {showPercentage && (
            <span className="text-[var(--text-muted)] font-mono">
              {current}/{total} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-midnight-light rounded-full overflow-hidden border border-[var(--border-default)]">
        <motion.div
          className="h-full bg-gradient-to-r from-purple to-purple-light rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
