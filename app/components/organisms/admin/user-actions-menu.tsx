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
import { ConfirmationModal } from "@/app/components/ui";
import Modal from "@/app/components/ui/modal";
import { Input } from "@/app/components/ui";

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
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const queryClient = useQueryClient();

  const handleResetProgress = async () => {
    setIsLoading(true);
    try {
      await adminApi.updateUser(user.id, { action: "reset_progress" });
      toast.success("User progress reset successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setIsOpen(false);
      setShowResetModal(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset progress");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      await adminApi.deleteUser(user.id);
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      setIsOpen(false);
      setShowDeleteModal(false);
      setShowDeleteConfirmModal(false);
      setDeleteConfirmation("");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setIsOpen(false);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    setShowDeleteConfirmModal(true);
  };

  const handleFinalDelete = () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error("Please type DELETE exactly to confirm");
      return;
    }
    handleDeleteUser();
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
              onClick={() => {
                setShowResetModal(true);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#1A1A1A] transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 text-orange-400" />
              Reset Progress
            </button>

            <div className="border-t border-[#FFFFFF1A]" />

            <button
              onClick={handleDeleteClick}
              className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </>
      )}

      {/* Reset Progress Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetProgress}
        title="Reset User Progress"
        description={`Are you sure you want to reset all progress for ${user.username || user.email}? This cannot be undone.`}
        confirmText="Reset Progress"
        cancelText="Cancel"
        variant="warning"
        loading={isLoading}
      />

      {/* Delete User - First Confirmation */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Account"
        description={`Are you sure you want to DELETE ${user.username || user.email}? This will permanently delete their account and all data. This cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="error"
        loading={false}
      />

      {/* Delete User - Final Confirmation with Input */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setDeleteConfirmation("");
        }}
        title="Final Confirmation"
        close={true}
      >
        <div className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            This is your final warning. Type <span className="font-bold text-red-400">DELETE</span> below to confirm deletion of <span className="font-semibold">{user.username || user.email}</span>.
          </p>
          <Input
            type="text"
            value={deleteConfirmation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteConfirmation(e.target.value)}
            placeholder='Type "DELETE" to confirm'
            className="w-full"
            autoFocus
          />
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => {
                setShowDeleteConfirmModal(false);
                setDeleteConfirmation("");
              }}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleFinalDelete}
              disabled={isLoading || deleteConfirmation !== "DELETE"}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Deleting..." : "Delete Forever"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
