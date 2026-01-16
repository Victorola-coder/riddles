import React from 'react';
import clsx from 'clsx';
import { DifficultyLevel } from '@/types/riddle';

interface BadgeProps {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'difficulty';
  difficulty?: DifficultyLevel;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  difficulty,
  children,
  className,
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-inter';

  const variantStyles = {
    default: 'bg-midnight-light text-[var(--text-secondary)] border border-[var(--border-default)]',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    difficulty: getDifficultyStyles(difficulty),
  };

  return (
    <span className={clsx(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
};

function getDifficultyStyles(difficulty?: DifficultyLevel): string {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case 'hard':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-midnight-light text-[var(--text-secondary)] border border-[var(--border-default)]';
  }
}
