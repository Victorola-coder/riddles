'use client';

import React from 'react';
import { GameHeader } from '../components/organisms';
import { useGameStore } from '@/lib/store/game-store';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userGems, currentLevel, solvedRiddles } = useGameStore();

  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <GameHeader
        gems={userGems}
        level={currentLevel}
        solvedCount={solvedRiddles.length}
      />
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
