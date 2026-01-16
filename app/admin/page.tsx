'use client';

import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from '@/app/components/global';
import { getAdminToken, setAdminToken } from '@/lib/admin-auth';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Check if already authenticated in session
    const token = getAdminToken();
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (token && authenticated === 'true') {
      setIsAuthenticated(true);
      router.push('/admin/dashboard');
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Invalid access code. Please try again.');
        setAccessCode('');
        setIsAuthenticating(false);
        return;
      }

      // Store admin token
      if (data.token) {
        setAdminToken(data.token);
        setIsAuthenticated(true);
        toast.success('Access granted! Welcome to admin panel.');
        router.push('/admin/dashboard');
      } else {
        toast.error('Authentication failed. Please try again.');
        setAccessCode('');
      }
    } catch (error) {
      toast.error('Failed to authenticate. Please try again.');
      setAccessCode('');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <Loader size="small" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-4">
      <div className="bg-[#161616] rounded-lg p-6 sm:p-8 max-w-md w-full border border-[#FFFFFF1A]">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            🧩 Admin Access
          </h1>
          <p className="text-gray-400">
            Enter access code to continue
          </p>
        </div>

        <form onSubmit={handleAccessCodeSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              autoComplete="new-password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.slice(0, 4))}
              placeholder="Enter code"
              maxLength={4}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:border-[#8b5cf6] transition-colors"
              disabled={isAuthenticating}
              autoFocus
            />
          </div>
          <button
            type="submit"
            disabled={accessCode.length !== 4 || isAuthenticating}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isAuthenticating ? 'Verifying...' : 'Access Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
