"use client";

import React, { useState } from "react";
import { authApi, ApiClientError } from "@/lib/api";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/app/components/atoms";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const response = await authApi.signup({
          email: formData.email,
          password: formData.password,
          username: formData.username,
        });

        localStorage.setItem("auth_token", response.token);
        toast.success("Account created successfully!");
        router.push("/game");
      } else {
        const response = await authApi.login({
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("auth_token", response.token);
        toast.success("Welcome back!");
        router.push("/game");
      }
    } catch (error: any) {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Authentication failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${
            typeof window !== "undefined" ? window.location.origin : ""
          }/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed");
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    toast.info("Playing as guest - progress saved locally only");
    router.push("/game");
  };

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-2">
            Riddle Quest
          </h1>
          <p className="text-[var(--text-muted)] font-inter">
            {mode === "login" ? "Welcome back, solver!" : "Begin your journey"}
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card p-6 md:p-8">
          {/* Toggle Mode */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg font-inter font-medium transition-all ${
                mode === "login"
                  ? "bg-purple text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg font-inter font-medium transition-all ${
                mode === "signup"
                  ? "bg-purple text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-inter text-white/80 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    size={20}
                  />
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple transition-colors"
                    placeholder="Choose a username"
                    required={mode === "signup"}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-inter text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  size={20}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-inter text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  size={20}
                />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[var(--bg-card)] text-white/60 font-inter">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Auth */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-gray-100 text-gray-900 rounded-lg font-inter font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          {/* Guest Mode */}
          <button
            onClick={handleGuestMode}
            className="w-full mt-3 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg font-inter font-medium transition-colors"
          >
            Continue as Guest
          </button>
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-6">
          <Link
            href="/game"
            className="text-sm text-white/60 hover:text-white transition-colors font-inter"
          >
            ← Back to Game
          </Link>
        </div> */}
      </div>
    </div>
  );
}
