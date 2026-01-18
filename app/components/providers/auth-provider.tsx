"use client";

import { useAuthStore } from "@/lib/store/auth";
import { useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/client-auth";
import { useCurrentUser } from "@/lib/hooks/use-auth";

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setInitializing = useAuthStore((state) => state.setInitializing);
  const hasInitialized = useRef(false);
  const lastUrlToken = useRef<string | null>(null);

  const searchParams = useSearchParams();
  const urlToken = searchParams?.get("token");

  // Handle URL token (OAuth callback, etc.)
  useEffect(() => {
    if (urlToken && urlToken !== lastUrlToken.current) {
      lastUrlToken.current = urlToken;
      setAuthToken(urlToken);
      hasInitialized.current = false;
    } else if (!urlToken) {
      lastUrlToken.current = null;
    }
  }, [urlToken]);

  // Fetch current user using React Query
  const { data: user, isLoading, isError } = useCurrentUser();

  // Sync React Query user data to Zustand store
  useEffect(() => {
    if (hasInitialized.current && !urlToken) {
      return;
    }

    if (isLoading) {
      setInitializing(true);
      return;
    }

    if (isError) {
      // Auth error - clear token and user
      removeAuthToken();
      setUser(null);
      setInitializing(false);
      hasInitialized.current = true;
      return;
    }

    // Sync user data to Zustand
    if (user) {
      setUser(user);
    } else {
      // No user data - clear auth
      removeAuthToken();
      setUser(null);
    }

    setInitializing(false);
    hasInitialized.current = true;
  }, [user, isLoading, isError, setUser, setInitializing, urlToken]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </Suspense>
  );
}
