"use client";

import {
  LogOut,
  User as UserIcon,
  Shield,
  Trophy,
  Flame,
  Star,
  Check,
  Camera,
  Loader2,
  Gem,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react";

import { toast } from "sonner";
import { useState, useEffect } from "react";
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

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const statCardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const totalRiddlesSolved = useUserStore((state) => state.totalRiddlesSolved);
  const currentStreak = useUserStore((state) => state.currentStreak);
  const totalGemsEarned = useUserStore((state) => state.totalGemsEarned);
  const syncWithServer = useUserStore((state) => state.syncWithServer);
  const currentLevel = user?.currentLevel || 1;

  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    confirmPassword: "",
  });

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
    } else {
      syncWithServer();
    }
  }, [user, router, syncWithServer]);

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-8 pb-32">
        <div className="glass-card overflow-hidden">
          <Skeleton className="h-32 w-full" />
          <div className="p-6 flex flex-col items-center -mt-12 space-y-3">
            <Skeleton className="w-20 h-20 rounded-full ring-4 ring-[var(--bg-card)]" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-5 flex flex-col items-center space-y-2">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        <div className="glass-card p-6 md:p-8 space-y-6">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="grid md:grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Trophy,
      label: "Riddles Solved",
      value: totalRiddlesSolved,
      color: "text-yellow-400",
      bgGradient: "from-yellow-500/20 via-yellow-500/5 to-transparent",
      iconBg: "bg-yellow-500/15",
      borderColor: "border-yellow-500/20",
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: currentStreak,
      color: "text-orange-500",
      bgGradient: "from-orange-500/20 via-orange-500/5 to-transparent",
      iconBg: "bg-orange-500/15",
      borderColor: "border-orange-500/20",
    },
    {
      icon: Gem,
      label: "Total Gems",
      value: totalGemsEarned,
      color: "text-purple-400",
      bgGradient: "from-purple-500/20 via-purple-500/5 to-transparent",
      iconBg: "bg-purple-500/15",
      borderColor: "border-purple-500/20",
    },
    {
      icon: Zap,
      label: "Current Level",
      value: currentLevel,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      iconBg: "bg-emerald-500/15",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
      className="container max-w-4xl mx-auto p-4 md:p-8 space-y-6 pb-32"
    >
      {/* Profile Hero Card */}
      <motion.div
        variants={cardEntranceVariants}
        className="glass-card overflow-hidden relative"
      >
        {/* Decorative banner */}
        <div className="h-28 md:h-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)] via-purple-600 to-indigo-700" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-3 left-[10%] w-20 h-20 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-0 right-[15%] w-32 h-32 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Sparkles className="w-6 h-6 text-white/20" />
            </div>
          </div>
          {/* Logout button in banner */}
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white/80 hover:text-white text-sm font-medium transition-all duration-200 border border-white/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* Avatar + Info */}
        <div className="px-6 md:px-8 pb-6 flex flex-col items-center text-center -mt-12 relative">
          <div className="relative mb-4">
            <Avatar
              alt={user.username || user.email || "Guest"}
              size="xl"
              className="ring-4 ring-[var(--bg-card)] w-24 h-24 shadow-xl"
            />
            <button className="absolute -bottom-1 -right-1 bg-[var(--accent-primary)] text-white p-1.5 rounded-full hover:bg-[var(--accent-primary-dark)] transition-colors shadow-lg shadow-purple-500/30">
              <Camera size={14} />
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-cinzel bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
            {user.username || "Adventurer"}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 flex items-center gap-1.5">
            <Shield size={14} className="text-[var(--accent-primary)]" />
            {user.email}
          </p>

          {/* Level badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--accent-primary)]/15 to-purple-500/10 border border-[var(--accent-primary)]/25">
            <Crown size={13} className="text-[var(--accent-secondary)]" />
            <span className="text-xs font-bold text-[var(--accent-primary)] tracking-wider uppercase">
              Level {currentLevel}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={statCardVariant}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`glass-card p-4 md:p-5 flex flex-col items-center justify-center space-y-2 bg-gradient-to-b ${stat.bgGradient} ${stat.borderColor} cursor-default`}
          >
            <div className={`p-2.5 rounded-xl ${stat.iconBg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-2xl md:text-3xl font-bold font-cinzel text-[var(--text-primary)]">
              {stat.value}
            </span>
            <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Account Settings */}
      <motion.div
        variants={cardEntranceVariants}
        className="glass-card p-6 md:p-8 space-y-6"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[var(--accent-primary)]/10">
            <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
          </div>
          <h2 className="text-xl font-bold font-cinzel text-[var(--text-primary)]">
            Account Settings
          </h2>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />

        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
          {/* Display Name */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">
              Display Name
            </label>
            <div className="relative">
              <UserIcon
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Your username"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/50 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Password Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">
                New Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (passwordErrors.length > 0) setPasswordErrors([]);
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/50 transition-all duration-200 text-sm"
              />

              {/* Password Requirements */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-3 rounded-lg bg-[var(--bg-secondary)]/60 border border-[var(--border-default)] space-y-1.5"
                >
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    Requirements
                  </p>
                  {Object.entries(passwordRequirements).map(([key, valid]) => (
                    <div
                      key={key}
                      className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                        valid
                          ? "text-emerald-400"
                          : "text-[var(--text-muted)]"
                      }`}
                    >
                      {valid ? (
                        <Check size={12} />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-current opacity-40" />
                      )}
                      <span>
                        {key === "minLength" && "8+ Characters"}
                        {key === "hasUppercase" && "Uppercase Letter"}
                        {key === "hasLowercase" && "Lowercase Letter"}
                        {key === "hasNumber" && "Number"}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)]/50 transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={
                updateProfile.isPending ||
                (!formData.password && formData.username === user.username)
              }
              className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-primary-dark)] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-200 disabled:opacity-40 disabled:shadow-none"
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
