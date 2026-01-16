'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '@/types/achievement';
import { Lock, Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  progress?: number;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  unlocked,
  progress = 0,
  className,
}) => {
  const Icon = (LucideIcons as any)[achievement.icon] || LucideIcons.Award;
  const progressPercentage = Math.min((progress / achievement.requirement) * 100, 100);

  return (
    <motion.div
      className={`relative glass-card p-6 ${
        unlocked ? 'border-gold' : 'border-[var(--border-default)] opacity-60'
      } ${className || ''}`}
      whileHover={{ scale: unlocked ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Locked Overlay */}
      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-midnight/50 backdrop-blur-sm rounded-lg z-10">
          <Lock className="text-gray-500" size={32} />
        </div>
      )}

      {/* Unlocked Badge */}
      {unlocked && (
        <div className="absolute top-2 right-2 bg-gold rounded-full p-1">
          <Check className="text-midnight" size={16} />
        </div>
      )}

      {/* Icon */}
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto ${
          unlocked
            ? 'bg-gradient-to-br from-purple to-gold'
            : 'bg-midnight-light'
        }`}
      >
        <Icon className="text-white" size={32} />
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className={`text-lg font-cinzel font-semibold mb-1 ${
          unlocked ? 'text-white' : 'text-gray-400'
        }`}>
          {achievement.name}
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-3">
          {achievement.description}
        </p>

        {/* Progress Bar (for locked achievements) */}
        {!unlocked && progress > 0 && (
          <div className="mb-3">
            <div className="w-full h-2 bg-midnight-light rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple to-purple-light rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {progress} / {achievement.requirement}
            </p>
          </div>
        )}

        {/* Reward */}
        <div className={`text-sm font-inter ${
          unlocked ? 'text-gold' : 'text-gray-500'
        }`}>
          +{achievement.reward} gems
        </div>
      </div>
    </motion.div>
  );
};
