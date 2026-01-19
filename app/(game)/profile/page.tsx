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
} from "lucide-react";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { removeAuthToken, getAuthToken } from "@/lib/client-auth";
import { useMutation } from "@tanstack/react-query";
import { authApi, ApiClientError } from "@/lib/api";
import { useUserStore } from "@/lib/store/user-store";
import { Avatar, Button, Input, Card } from "@/app/components/ui";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { totalRiddlesSolved, currentStreak, totalGemsEarned } = useUserStore();
  const currentLevel = user?.currentLevel || 1;

  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    password: "",
    confirmPassword: "",
  });

  // Password requirement checks (computed from formData)
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

      // If password validation failed, show requirements
      if (message.includes("Password") || message.includes("password")) {
        const requirements = [
          "At least 8 characters long",
          "At least one uppercase letter (A-Z)",
          "At least one lowercase letter (a-z)",
          "At least one number (0-9)",
        ];
        setPasswordErrors(requirements);
        toast.error(`Password requirements:\n${requirements.join("\n")}`);
      } else {
        setPasswordErrors([]);
        toast.error(message);
      }
    },
  });

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    router.push("/auth");
    toast.success("Logged out successfully");
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
      return;
    }

    updateProfile.mutate(updateData);
  };

  // Client-side protection: redirect to login if not authenticated
  useEffect(() => {
    const token = getAuthToken();
    if (!token || !user) {
      router.push("/auth");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            alt={user.username || user.email || "Guest"}
            size="xl"
            className="ring-1 ring-[var(--border-default)]"
          />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.username || user.email}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-gradient-to-b from-blue-900/20 to-transparent border-blue-500/20">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <span className="text-2xl font-bold text-white">
            {totalRiddlesSolved}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Solved
          </span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-gradient-to-b from-orange-900/20 to-transparent border-orange-500/20">
          <Flame className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold text-white">{currentStreak}</span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Day Streak
          </span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-gradient-to-b from-purple-900/20 to-transparent border-purple-500/20">
          <Star className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">
            {totalGemsEarned}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Gems
          </span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-gradient-to-b from-green-900/20 to-transparent border-green-500/20">
          <UserIcon className="w-8 h-8 text-green-400" />
          <span className="text-2xl font-bold text-white">
            Lvl {currentLevel}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Level
          </span>
        </Card>
      </div>

      {/* Settings Form */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Account Settings</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Username
            </label>
            <Input
              value={formData.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Your username"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                New Password
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFormData({ ...formData, password: e.target.value });
                  // Clear errors when user starts typing
                  if (passwordErrors.length > 0) {
                    setPasswordErrors([]);
                  }
                }}
                placeholder="Leave blank to keep current"
              />
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground mb-2">
                    Password requirements:
                  </p>
                  <div className="space-y-1.5">
                    <div
                      className={`flex items-center gap-2 text-xs font-inter transition-colors ${
                        passwordRequirements.minLength
                          ? "text-green-400"
                          : "text-muted-foreground/70"
                      }`}
                    >
                      {passwordRequirements.minLength ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <X size={14} className="text-muted-foreground/50" />
                      )}
                      <span>At least 8 characters</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs font-inter transition-colors ${
                        passwordRequirements.hasUppercase
                          ? "text-green-400"
                          : "text-muted-foreground/70"
                      }`}
                    >
                      {passwordRequirements.hasUppercase ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <X size={14} className="text-muted-foreground/50" />
                      )}
                      <span>One uppercase letter (A-Z)</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs font-inter transition-colors ${
                        passwordRequirements.hasLowercase
                          ? "text-green-400"
                          : "text-muted-foreground/70"
                      }`}
                    >
                      {passwordRequirements.hasLowercase ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <X size={14} className="text-muted-foreground/50" />
                      )}
                      <span>One lowercase letter (a-z)</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-xs font-inter transition-colors ${
                        passwordRequirements.hasNumber
                          ? "text-green-400"
                          : "text-muted-foreground/70"
                      }`}
                    >
                      {passwordRequirements.hasNumber ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <X size={14} className="text-muted-foreground/50" />
                      )}
                      <span>One number (0-9)</span>
                    </div>
                  </div>
                </div>
              )}
              {passwordErrors.length > 0 && (
                <div className="mt-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-sm font-semibold text-red-400 mb-1">
                    Password requirements not met:
                  </p>
                  <ul className="text-xs text-red-300 space-y-0.5 ml-4 list-disc">
                    {passwordErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Confirm Password
              </label>
              <Input
                type="password"
                value={formData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={
                updateProfile.isPending ||
                (!formData.password && formData.username === user.username)
              }
            >
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
