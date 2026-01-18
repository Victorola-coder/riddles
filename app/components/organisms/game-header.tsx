'use client';

import React from 'react';
import Link from 'next/link';
import { GemCounter, StreakCounter, SoundToggle, ThemeToggle } from '../molecules';
import { Trophy, Award, TrendingUp } from 'lucide-react';

import { useUserStore } from '@/lib/store/user-store';



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
  const { currentStreak, longestStreak } = useUserStore();

  return (
    <header className="w-full py-4 px-6 flex justify-between items-center">
      {/* Level Info - Clickable to Levels Page */}
      <Link 
        href="/levels" 
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
        title="View Level Selection"
      >
        <Trophy className="text-purple group-hover:scale-110 transition-transform" size={24} />
        <div className="flex flex-col">
          <span className="text-xs text-[var(--text-muted)] font-inter">Level</span>
          <span className="text-lg font-cinzel font-semibold text-white">{level}</span>
        </div>
      </Link>

      {/* Streak Counter (Mobile Hidden) */}
      <div className="hidden sm:block">
        <StreakCounter streak={currentStreak} longestStreak={longestStreak} size="md" showLongest />
      </div>

      {/* Solved Count (Desktop Only) */}
      <div className="hidden md:flex flex-col items-center">
        <span className="text-xs text-[var(--text-muted)] font-inter">Solved</span>
        <span className="text-lg font-inter font-semibold text-white">{solvedCount}</span>
      </div>

      {/* Achievements Link (Mobile Hidden) */}
      <Link 
        href="/achievements" 
        className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple/10 hover:bg-purple/20 transition-colors cursor-pointer group"
        title="View Achievements"
      >
        <Award className="text-gold group-hover:scale-110 transition-transform" size={18} />
        <span className="text-xs font-inter text-white/80 group-hover:text-white">Badges</span>
      </Link>

      {/* Leaderboard Link (Mobile: Icon Only) */}
      <Link 
        href="/leaderboard" 
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple/10 hover:bg-purple/20 transition-colors cursor-pointer group"
        title="View Leaderboard"
      >
        <TrendingUp className="text-purple group-hover:scale-110 transition-transform" size={18} />
        <span className="text-xs font-inter text-white/80 group-hover:text-white hidden sm:inline">Ranks</span>
      </Link>

      {/* Sound Toggle */}
      <div className="hidden md:flex items-center gap-2">
        <ThemeToggle size="md" />
        <SoundToggle size="md" />
      </div>



      {/* Gem Counter */}
      <GemCounter gems={gems} size="md" />
    </header>
  );
};

