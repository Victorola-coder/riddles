"use client";

import Link from "next/link";
import { toast } from "sonner";
import React, { useState } from "react";
import { Button } from "@/app/components/atoms";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Password reset link sent!");

        // In development, show the reset link
        if (data.resetLink) {
          console.log("Reset link:", data.resetLink);
          toast.info("Check console for reset link (dev mode)");
        }
      } else {
        toast.error(data.error || "Failed to send reset link");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-[var(--text-muted)] font-inter">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-card p-6 md:p-8">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-cinzel font-bold text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-white/60 font-inter mb-6">
                If an account exists with <strong>{email}</strong>, you'll
                receive a password reset link shortly.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-purple hover:text-purple/80 transition-colors font-inter"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-inter text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-purple transition-colors"
                    placeholder="your@email.com"
                    required
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
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth"
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
