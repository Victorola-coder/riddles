'use client';

import React from 'react';
import { GemCounter } from '../molecules';
import { Trophy } from 'lucide-react';

interface GameHeaderProps {
  gems: number;
  level: number;
  solvedCount: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  gems,
  level,
  solvedCount,
}) => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center">
      {/* Level Info */}
      <div className="flex items-center gap-2">
        <Trophy className="text-purple" size={24} />
        <div className="flex flex-col">
          <span className="text-xs text-[var(--text-muted)] font-inter">Level</span>
          <span className="text-lg font-cinzel font-semibold text-white">{level}</span>
        </div>
      </div>

      {/* Solved Count */}
      <div className="hidden md:flex flex-col items-center">
        <span className="text-xs text-[var(--text-muted)] font-inter">Solved</span>
        <span className="text-lg font-inter font-semibold text-white">{solvedCount}</span>
      </div>

      {/* Gem Counter */}
      <GemCounter gems={gems} size="md" />
    </header>
  );
};
