'use client';

import React from 'react';
import { Badge } from '../atoms';
import { DifficultyLevel } from '@/types/riddle';
import { Star } from 'lucide-react';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  showStars?: boolean;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({
  difficulty,
  showStars = true,
  className,
}) => {
  const starCount = {
    easy: 1,
    medium: 3,
    hard: 5,
  }[difficulty];

  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Badge variant="difficulty" difficulty={difficulty}>
        {difficultyLabel}
      </Badge>
      {showStars && (
        <div className="flex gap-0.5">
          {Array.from({ length: starCount }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={`${
                difficulty === 'easy'
                  ? 'text-green-400 fill-green-400'
                  : difficulty === 'medium'
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-red-400 fill-red-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
