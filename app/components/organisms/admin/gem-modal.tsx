"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Gem, Loader2, X } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { useQueryClient } from "@tanstack/react-query";

interface GemModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    username?: string;
    email?: string;
    totalGems: number;
  };
}

export function GemModal({ isOpen, onClose, user }: GemModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount === 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason");
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminApi.adjustGems(user.id, {
        amount: numAmount,
        reason: reason.trim(),
      });

      toast.success(result.message);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "user", user.id] });
      
      // Reset and close
      setAmount("");
      setReason("");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to adjust gems");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const numAmount = parseInt(amount) || 0;
  const isAdding = numAmount > 0;
  const newTotal = Math.max(0, user.totalGems + numAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#161616] border border-[#FFFFFF1A] rounded-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-[#fbbf24]" />
            <h2 className="text-xl font-bold text-white">Adjust Gems</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="mb-6 p-4 bg-[#0B0B0B] rounded-lg border border-[#FFFFFF1A]">
          <p className="text-sm text-gray-400 mb-1">User</p>
          <p className="text-white font-medium">
            {user.username || user.email || user.id}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Gem className="w-4 h-4 text-[#fbbf24]" />
            <span className="text-[#fbbf24] font-medium">
              {user.totalGems} gems
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (positive to add, negative to deduct)"
              className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#FFFFFF1A] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Use positive numbers to add gems, negative to deduct
            </p>
          </div>

          {/* Preview */}
          {amount && !isNaN(numAmount) && numAmount !== 0 && (
            <div className="p-3 bg-[#0B0B0B] rounded-lg border border-[#FFFFFF1A]">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Current:</span>
                <span className="text-white">{user.totalGems} gems</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-400">Change:</span>
                <span className={isAdding ? "text-green-400" : "text-red-400"}>
                  {isAdding ? "+" : ""}{numAmount} gems
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1 pt-2 border-t border-[#FFFFFF1A]">
                <span className="text-gray-400">New Total:</span>
                <span className="text-[#fbbf24] font-medium">
                  {newTotal} gems
                </span>
              </div>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you're adjusting gems..."
              rows={3}
              className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#FFFFFF1A] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#0B0B0B] hover:bg-[#1A1A1A] text-white rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] hover:opacity-90 text-white rounded-lg font-medium transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
