"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/app/components/atoms";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        const errorMessage = data.error || "Failed to reset password";
        setError(errorMessage);
        
        // If password validation failed, show requirements
        if (errorMessage.includes("Password") || errorMessage.includes("password") || data.details) {
          const requirements = [
            "At least 8 characters long",
            "At least one uppercase letter (A-Z)",
            "At least one lowercase letter (a-z)",
            "At least one number (0-9)",
          ];
          setPasswordErrors(data.details || requirements);
          if (data.details) {
            data.details.forEach((detail: string) => toast.error(detail));
          }
        } else {
          setPasswordErrors([]);
        }
      }
    } catch (error) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-card p-8 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-cinzel font-bold text-white mb-2">
            Invalid Link
          </h2>
          <p className="text-white/60 font-inter mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block text-purple hover:text-purple/80 transition-colors font-inter"
          >
            Request a new link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-2">
            Reset Password
          </h1>
          <p className="text-[var(--text-muted)] font-inter">
            Enter your new password
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card p-6 md:p-8">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-cinzel font-bold text-white mb-2">
                Password Reset!
              </h2>
              <p className="text-white/60 font-inter mb-6">
                Your password has been reset successfully. Redirecting to
                login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm font-inter">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-inter text-white/80 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    size={20}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // Clear errors when user starts typing
                      if (passwordErrors.length > 0) {
                        setPasswordErrors([]);
                      }
                      if (error) {
                        setError("");
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-white/60 font-inter mb-1">
                    Password must contain:
                  </p>
                  <ul className="text-xs text-white/50 font-inter space-y-0.5 ml-4 list-disc">
                    <li>At least 8 characters</li>
                    <li>One uppercase letter (A-Z)</li>
                    <li>One lowercase letter (a-z)</li>
                    <li>One number (0-9)</li>
                  </ul>
                </div>
                {passwordErrors.length > 0 && (
                  <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-sm font-semibold text-red-400 mb-1 font-inter">
                      Password requirements not met:
                    </p>
                    <ul className="text-xs text-red-300 font-inter space-y-0.5 ml-4 list-disc">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-inter text-white/80 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    size={20}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={8}
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
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-white/60 hover:text-white transition-colors font-inter"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
