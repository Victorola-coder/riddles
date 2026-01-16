'use client';

import React from 'react';
import Link from 'next/link';
import { GameHeader } from '../components/organisms';
import { useGameStore } from '@/lib/store/game-store';
import { ArrowLeft } from 'lucide-react';

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userGems, currentLevel, solvedRiddles } = useGameStore();

  return (
    <div className="min-h-screen bg-midnight flex flex-col">
      <div className="w-full py-2 px-4 border-b border-white/10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>
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
