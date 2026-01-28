"use client";

import { useState } from "react";
import {
  useAdminUserRiddles,
  useAdminApproveRiddle,
  useAdminRejectRiddle,
} from "@/lib/hooks/use-admin";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import { Skeleton, AlertDialog } from "@/app/components/ui";
import { CheckCircle2, XCircle, Clock, User, ThumbsUp, ThumbsDown } from "lucide-react";
import Modal from "@/app/components/ui/modal";

const STATUS_COLORS = {
  PENDING: "bg-yellow-600/20 text-yellow-400 border-yellow-600/50",
  APPROVED: "bg-green-600/20 text-green-400 border-green-600/50",
  REJECTED: "bg-red-600/20 text-red-400 border-red-600/50",
};

const PAGE_SIZE = 20;

export default function AdminRiddleCreatorPage() {
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [page, setPage] = useState(1);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRiddle, setSelectedRiddle] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading, refetch } = useAdminUserRiddles({
    status: statusFilter,
    page,
    pageSize: PAGE_SIZE,
  });

  const approveMutation = useAdminApproveRiddle();
  const rejectMutation = useAdminRejectRiddle();

  const handleApprove = (riddle: any) => {
    approveMutation.mutate(riddle.id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleRejectClick = (riddle: any) => {
    setSelectedRiddle(riddle);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleReject = () => {
    if (!selectedRiddle) return;
    rejectMutation.mutate(
      {
        id: selectedRiddle.id,
        reason: rejectionReason || undefined,
      },
      {
        onSuccess: () => {
          setRejectModalOpen(false);
          setSelectedRiddle(null);
          refetch();
        },
      }
    );
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            Community Riddles
          </h1>
          <p className="text-gray-400">
            Review and approve user-submitted riddles
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-[#161616] border border-[#FFFFFF1A] rounded-lg text-white"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Riddles List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : !data?.riddles || data.riddles.length === 0 ? (
        <div className="text-center py-16 bg-[#161616] rounded-lg border border-[#FFFFFF1A]">
          <Clock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg font-medium text-white mb-2">
            No riddles found
          </p>
          <p className="text-sm text-gray-400">
            {statusFilter === "PENDING"
              ? "No pending submissions"
              : "No riddles with this status"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.riddles.map((riddle: any) => (
              <div
                key={riddle.id}
                className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] p-6 hover:border-[#FFFFFF33] transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">
                      {riddle.question}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${STATUS_COLORS[riddle.status as keyof typeof STATUS_COLORS]}`}
                      >
                        {riddle.status === "PENDING" && (
                          <Clock className="w-3 h-3 inline mr-1" />
                        )}
                        {riddle.status === "APPROVED" && (
                          <CheckCircle2 className="w-3 h-3 inline mr-1" />
                        )}
                        {riddle.status === "REJECTED" && (
                          <XCircle className="w-3 h-3 inline mr-1" />
                        )}
                        {riddle.status}
                      </span>
                      <span className="text-xs text-gray-400 capitalize">
                        {riddle.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-sm text-gray-400">Answer: </span>
                    <span className="text-sm text-white font-medium">
                      {Array.isArray(riddle.answer)
                        ? riddle.answer.join(", ")
                        : riddle.answer}
                    </span>
                  </div>
                  {riddle.hint1 && (
                    <div>
                      <span className="text-sm text-gray-400">Hint 1: </span>
                      <span className="text-sm text-white">{riddle.hint1}</span>
                    </div>
                  )}
                  {riddle.hint2 && (
                    <div>
                      <span className="text-sm text-gray-400">Hint 2: </span>
                      <span className="text-sm text-white">{riddle.hint2}</span>
                    </div>
                  )}
                  {riddle.category && (
                    <div>
                      <span className="text-sm text-gray-400">Category: </span>
                      <span className="text-sm text-white">
                        {riddle.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4 pt-4 border-t border-[#FFFFFF1A]">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{riddle.author.username || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{riddle.totalVotes}</span>
                    </div>
                    <div>{riddle.playCount} plays</div>
                  </div>
                </div>

                {riddle.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-600/10 border border-red-600/50 rounded-lg">
                    <p className="text-sm text-red-400">
                      <strong>Rejection reason:</strong> {riddle.rejectionReason}
                    </p>
                  </div>
                )}

                {riddle.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(riddle)}
                      disabled={approveMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleRejectClick(riddle)}
                      disabled={rejectMutation.isPending}
                      variant="danger"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                )}

                {riddle.status === "APPROVED" && (
                  <div className="text-sm text-green-400">
                    ✓ Approved and added to game
                  </div>
                )}

                {riddle.status === "REJECTED" && (
                  <div className="text-sm text-red-400">
                    ✗ Rejected
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.meta && data.meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm text-gray-400">
                Page {page} of {data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setPage((p) => Math.min(data.meta.totalPages, p + 1))
                }
                disabled={page === data.meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedRiddle(null);
          setRejectionReason("");
        }}
        title="Reject Riddle"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to reject this riddle?
          </p>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Rejection Reason (optional)
            </label>
            <Input
              value={rejectionReason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRejectionReason(e.target.value)}
              placeholder="e.g., Too similar to existing riddle"
              className="bg-[#0f0f0f] border-[#FFFFFF1A]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
            <Button
              variant="ghost"
              onClick={() => {
                setRejectModalOpen(false);
                setSelectedRiddle(null);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
