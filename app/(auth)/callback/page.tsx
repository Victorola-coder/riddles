'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/game');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
        <p className="text-white/60 font-inter">Completing sign in...</p>
      </div>
    </div>
  );
}
