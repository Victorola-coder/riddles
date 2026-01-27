"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: {
    id: string;
    email: string;
    username?: string;
    totalGems: number;
    currentLevel: number;
  } | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setInitializing: (value: boolean) => void;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitializing: true,
      setInitializing: (value) => set({ isInitializing: value }),
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isInitializing: false,
        });
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isInitializing: false,
        });
      },
    }),
    {
      name: "riddle-quest-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
