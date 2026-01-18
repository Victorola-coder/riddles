'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Card from '@/app/components/ui/card';
import Button from '@/app/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  
  // In a real app we would read a token from searchParams
  // and call an API to verify it.
  // For this custom auth implementation which doesn't send emails yet,
  // we just simulate success if redirected here.
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {status === 'verifying' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <h1 className="text-2xl font-bold">Verifying Email...</h1>
              <p className="text-muted-foreground">Please wait while we verify your account.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <h1 className="text-2xl font-bold text-green-500">Verified!</h1>
              <p className="text-muted-foreground">Your email has been successfully verified.</p>
              <Button onClick={() => router.push('/game')} className="w-full">
                Continue to Game
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="w-16 h-16 text-red-500" />
              <h1 className="text-2xl font-bold text-red-500">Verification Failed</h1>
              <p className="text-muted-foreground">The link is invalid or expired.</p>
              <Button variant="outline" onClick={() => router.push('/login')} className="w-full">
                Back to Login
              </Button>
            </div>
          )}
        </motion.div>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
