"use client";

import {
  LogOut,
  User as UserIcon,
  Shield,
  Trophy,
  Flame,
  Star,
  Check,
  X,
  Camera,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth";
import { removeAuthToken, getAuthToken } from "@/lib/client-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, ApiClientError } from "@/lib/api";
import { useUserStore } from "@/lib/store/user-store";
import { Avatar, Button } from "@/app/components/ui";
import { cardEntranceVariants, fadeVariants } from "@/lib/constants/animations";

import Skeleton from "@/app/components/ui/skeleton";

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const { totalRiddlesSolved, currentStreak, totalGemsEarned } = useUserStore();
  const currentLevel = user?.currentLevel || 1;

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    confirmPassword: "",
  });

  // Password requirement checks
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      return await authApi.updateProfile(data);
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully");
      if (data.user) {
        setUser(data.user);
      }
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Failed to update profile";

      if (message.includes("Password") || message.includes("password")) {
        const requirements = [
          "At least 8 characters long",
          "At least one uppercase letter (A-Z)",
          "At least one lowercase letter (a-z)",
          "At least one number (0-9)",
        ];
        setPasswordErrors(requirements);
        toast.error(`Password requirements not met`);
      } else {
        setPasswordErrors([]);
        toast.error(message);
      }
    },
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout API call failed:", error);
      toast.success("Logged out successfully");
    } finally {
      removeAuthToken();
      setUser(null);
      queryClient.clear();
      window.location.href = "/auth";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const updateData: any = {};
    if (formData.username !== user?.username)
      updateData.username = formData.username;
    if (formData.password) {
      updateData.password = formData.password;
      updateData.confirmPassword = formData.confirmPassword;
    }

    if (Object.keys(updateData).length === 0) {
      toast.info("No changes to save");
      return;
    }

    updateProfile.mutate(updateData);
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !user) {
      router.push("/auth");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="container max-w-5xl mx-auto p-4 md:p-8 space-y-12 pb-32">
        {/* Header Skeleton */}
        <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full">
            <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
            <div className="space-y-4 text-center md:text-left flex-1">
              <Skeleton className="h-10 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-20 rounded-full mx-auto md:mx-0" />
            </div>
          </div>
          <Skeleton className="h-12 w-32" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 flex flex-col items-center justify-center space-y-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>

        {/* Settings Form Skeleton */}
        <div className="glass-card p-8 md:p-10 space-y-8">
           <Skeleton className="h-8 w-48" />
           <div className="space-y-8 max-w-2xl">
              <div className="space-y-3">
                 <Skeleton className="h-4 w-24" />
                 <Skeleton className="h-14 w-full rounded-xl" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                 </div>
                 <div className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-14 w-full rounded-xl" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
      className="container max-w-5xl mx-auto p-4 md:p-8 space-y-12 pb-32"
    >
      {/* Header Section */}
      <motion.div 
        variants={cardEntranceVariants}
        className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="relative">
            <Avatar
              alt={user.username || user.email || "Guest"}
              size="xl"
              className="ring-4 ring-primary/20 w-24 h-24 md:w-32 md:h-32 shadow-xl"
            />
            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors shadow-lg">
              <Camera size={16} />
            </div>
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-bold font-cinzel bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              {user.username || "Adventurer"}
            </h1>
            <p className="text-[var(--text-secondary)] font-medium flex items-center justify-center md:justify-start gap-2">
              <Shield size={16} className="text-primary" />
              {user.email}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary tracking-wider uppercase">
              Member
            </div>
          </div>
        </div>

        <Button
          variant="danger"
          onClick={handleLogout}
          className="relative z-10 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 shadow-none hover:shadow-red-500/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Trophy, label: "Riddles Solved", value: totalRiddlesSolved, color: "text-yellow-400", bg: "from-yellow-500/10", border: "border-yellow-500/20" },
          { icon: Flame, label: "Day Streak", value: currentStreak, color: "text-orange-500", bg: "from-orange-500/10", border: "border-orange-500/20" },
          { icon: Star, label: "Total Gems", value: totalGemsEarned, color: "text-purple-400", bg: "from-purple-500/10", border: "border-purple-500/20" },
          { icon: UserIcon, label: "Current Level", value: currentLevel, color: "text-green-400", bg: "from-green-500/10", border: "border-green-500/20" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={cardEntranceVariants}
            custom={index}
            className={`glass-card p-6 flex flex-col items-center justify-center space-y-3 bg-gradient-to-b ${stat.bg} to-transparent ${stat.border} hover:scale-105 transition-transform duration-300`}
          >
            <stat.icon className={`w-8 h-8 ${stat.color} drop-shadow-glow`} />
            <span className="text-3xl font-bold font-cinzel text-[var(--text-primary)]">
              {stat.value}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Settings Form */}
      <motion.div 
        variants={cardEntranceVariants}
        className="glass-card p-8 md:p-10 space-y-8 relative overflow-hidden"
      >
        <div className="flex items-center gap-3 border-b border-[var(--border-default)] pb-6">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold font-cinzel text-[var(--text-primary)]">Account Settings</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide ml-1">
              DisplayName
            </label>
            <input
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Your username"
              className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide ml-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (passwordErrors.length > 0) setPasswordErrors([]);
                  }}
                  placeholder="••••••••"
                  className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
                />
              </div>
              
              {/* Password Requirements Popover styled inline */}
              {formData.password && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-[var(--bg-secondary)]/50 p-4 rounded-lg border border-[var(--border-default)] space-y-2 mt-2"
                >
                  <p className="text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wide">
                    Security Strength
                  </p>
                  <div className="space-y-2">
                    {Object.entries(passwordRequirements).map(([key, valid]) => (
                      <div key={key} className={`flex items-center gap-2 text-xs font-medium transition-colors ${valid ? "text-green-400" : "text-[var(--text-muted)]"}`}>
                        {valid ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-current opacity-50" />}
                        <span>
                          {key === "minLength" && "8+ Characters"}
                          {key === "hasUppercase" && "Uppercase Letter"}
                          {key === "hasLowercase" && "Lowercase Letter"}
                          {key === "hasNumber" && "Number"}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wide ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-300"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--border-default)] flex justify-end">
            <Button
              type="submit"
              disabled={updateProfile.isPending || (!formData.password && formData.username === user.username)}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
