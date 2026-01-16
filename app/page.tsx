'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from './components/global';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to game page
    router.push('/(game)');
  }, [router]);

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center">
      <div className="text-center">
        <Loader size="large" />
        <p className="mt-4 text-[var(--text-secondary)] font-inter">
          Loading Riddle Quest...
        </p>
      </div>
    </div>
  );
}
