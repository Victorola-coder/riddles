"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  MoreVertical,
  Gem,
  RotateCcw,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { useQueryClient } from "@tanstack/react-query";

interface UserActionsMenuProps {
  user: {
    id: string;
    username?: string;
    email?: string;
    totalGems: number;
  };
  onOpenGemModal: () => void;
}

export function UserActionsMenu({ user, onOpenGemModal }: UserActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleResetProgress = async () => {
    if (
      !confirm(
        `Are you sure you want to reset all progress for ${user.username || user.email}? This cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await adminApi.updateUser(user.id, { action: "reset_progress" });
      toast.success("User progress reset successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset progress");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (
      !confirm(
        `Are you sure you want to DELETE ${user.username || user.email}? This will permanently delete their account and all data. This cannot be undone.`
      )
    ) {
      return;
    }

    // Double confirmation for delete
    if (
      !confirm(
        "This is your final warning. Type DELETE in the next prompt to confirm."
      )
    ) {
      return;
    }

    const confirmation = prompt('Type "DELETE" to confirm:');
    if (confirmation !== "DELETE") {
      toast.error("Deletion cancelled");
      return;
    }

    setIsLoading(true);
    try {
      await adminApi.deleteUser(user.id);
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
        ) : (
          <MoreVertical className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-[#161616] border border-[#FFFFFF1A] rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={() => {
                onOpenGemModal();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
            >
              <Gem className="w-4 h-4 text-[#fbbf24]" />
              Adjust Gems
            </button>

            <button
              onClick={handleResetProgress}
              className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 text-orange-400" />
              Reset Progress
            </button>

            <div className="border-t border-[#FFFFFF1A]" />

            <button
              onClick={handleDeleteUser}
              className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );
}
