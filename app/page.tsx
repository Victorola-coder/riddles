'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Since route groups are invisible in URLs, we just need to force a client-side navigation
    // The (game) folder will handle the actual rendering
    router.replace('/');
  }, [router]);

  return null;
}
