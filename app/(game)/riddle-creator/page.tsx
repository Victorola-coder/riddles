"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Skeleton } from "@/app/components/ui";
import {
  useUserRiddles,
  useMyRiddles,
  useSubmitRiddle,
  useVoteRiddle,
} from "@/lib/hooks/use-riddle-creator";
import { useAuthStore } from "@/lib/store/auth";
import { ThumbsUp, ThumbsDown, Plus, BookOpen, User, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import Modal from "@/app/components/ui/modal";

const STATUS_COLORS = {
  PENDING: "bg-yellow-600/20 text-yellow-400 border-yellow-600/50",
  APPROVED: "bg-green-600/20 text-green-400 border-green-600/50",
  REJECTED: "bg-red-600/20 text-red-400 border-red-600/50",
};

export default function RiddleCreatorPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("browse");
  const [statusFilter, setStatusFilter] = useState("APPROVED");
  const [sortBy, setSortBy] = useState("votes");
  const [page, setPage] = useState(1);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const { data: riddlesData, isLoading } = useUserRiddles({
    status: statusFilter,
    sort: sortBy,
    page,
    pageSize: 20,
  });

  const { data: myRiddlesData, isLoading: myRiddlesLoading } = useMyRiddles();

  const submitMutation = useSubmitRiddle();
  const voteMutation = useVoteRiddle();

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    difficulty: "easy" as "easy" | "medium" | "hard",
    category: "",
    hint1: "",
    hint2: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit riddles");
      return;
    }

    const answerArray = formData.answer
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    submitMutation.mutate(
      {
        question: formData.question,
        answer: answerArray.length > 0 ? answerArray : [formData.answer],
        difficulty: formData.difficulty,
        category: formData.category || undefined,
        hint1: formData.hint1 || undefined,
        hint2: formData.hint2 || undefined,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      },
      {
        onSuccess: () => {
          setIsSubmitModalOpen(false);
          setFormData({
            question: "",
            answer: "",
            difficulty: "easy",
            category: "",
            hint1: "",
            hint2: "",
            tags: "",
          });
          setActiveTab("my-riddles");
        },
      }
    );
  };

  const handleVote = (riddleId: string, value: 1 | -1) => {
    if (!user) {
      toast.error("Please log in to vote");
      return;
    }
    voteMutation.mutate({ userRiddleId: riddleId, value });
  };

  return (
    <div className="min-h-screen bg-midnight p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            Riddle Creator
          </h1>
          <p className="text-gray-400">
            Submit your own riddles and vote on community creations
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="submit">Submit</TabsTrigger>
            <TabsTrigger value="my-riddles">My Riddles</TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 bg-[#161616] border border-[#FFFFFF1A] rounded-lg text-white"
              >
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="all">All</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 bg-[#161616] border border-[#FFFFFF1A] rounded-lg text-white"
              >
                <option value="votes">Most Voted</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            {/* Riddles List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : !riddlesData?.riddles || riddlesData.riddles.length === 0 ? (
              <div className="text-center py-16 bg-[#161616] rounded-lg border border-[#FFFFFF1A]">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-lg font-medium text-white mb-2">
                  No riddles found
                </p>
                <p className="text-sm text-gray-400">
                  Be the first to submit a riddle!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riddlesData.riddles.map((riddle: any) => (
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
                              {riddle.status}
                            </span>
                            <span className="text-xs text-gray-400 capitalize">
                              {riddle.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#FFFFFF1A]">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {riddle.author.username || "Anonymous"}
                            </span>
                          </div>
                          <div className="text-sm text-gray-400">
                            {riddle.voteCount} votes
                          </div>
                        </div>

                        {user && riddle.status === "PENDING" && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(riddle.id, 1)}
                              disabled={voteMutation.isPending}
                              className={`${riddle.userVote === 1 ? "text-green-400" : ""}`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <span className="text-sm font-medium text-white">
                              {riddle.totalVotes > 0 ? "+" : ""}
                              {riddle.totalVotes}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(riddle.id, -1)}
                              disabled={voteMutation.isPending}
                              className={`${riddle.userVote === -1 ? "text-red-400" : ""}`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {riddlesData.meta && riddlesData.meta.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-sm text-gray-400">
                      Page {page} of {riddlesData.meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPage((p) =>
                          Math.min(riddlesData.meta.totalPages, p + 1)
                        )
                      }
                      disabled={page === riddlesData.meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Submit Tab */}
          <TabsContent value="submit">
            <div className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] p-6">
              {!user ? (
                <div className="text-center py-12">
                  <p className="text-lg font-medium text-white mb-4">
                    Sign in to submit riddles
                  </p>
                  <Button
                    onClick={() => {
                      window.location.href = "/auth";
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Submit a Riddle
                    </h2>
                    <Button
                      onClick={() => setIsSubmitModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Riddle
                    </Button>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Share your creativity! Submit riddles for the community to
                    enjoy. Approved riddles earn you 10 gems and 2 gems each
                    time someone plays them.
                  </p>
                </>
              )}
            </div>
          </TabsContent>

          {/* My Riddles Tab */}
          <TabsContent value="my-riddles">
            {!user ? (
              <div className="text-center py-12 bg-[#161616] rounded-lg border border-[#FFFFFF1A]">
                <p className="text-lg font-medium text-white mb-4">
                  Sign in to view your riddles
                </p>
                <Button
                  onClick={() => {
                    window.location.href = "/auth";
                  }}
                >
                  Sign In
                </Button>
              </div>
            ) : myRiddlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            ) : !myRiddlesData?.riddles || myRiddlesData.riddles.length === 0 ? (
              <div className="text-center py-16 bg-[#161616] rounded-lg border border-[#FFFFFF1A]">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-lg font-medium text-white mb-2">
                  No riddles submitted yet
                </p>
                <Button
                  onClick={() => {
                    setActiveTab("submit");
                    setIsSubmitModalOpen(true);
                  }}
                  className="mt-4"
                >
                  Submit Your First Riddle
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myRiddlesData.riddles.map((riddle: any) => (
                  <div
                    key={riddle.id}
                    className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] p-6"
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
                        </div>
                        {riddle.rejectionReason && (
                          <p className="text-sm text-red-400 mt-2">
                            Reason: {riddle.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#FFFFFF1A] text-sm text-gray-400">
                      <div>
                        {riddle.playCount} plays • {riddle.totalVotes} votes
                      </div>
                      {riddle.reviewedAt && (
                        <div>
                          Reviewed:{" "}
                          {new Date(riddle.reviewedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Submit Modal */}
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          title="Submit a Riddle"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Question *
              </label>
              <Input
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                placeholder="What has keys but no locks?"
                required
                className="bg-[#0f0f0f] border-[#FFFFFF1A]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Answer * (comma-separated for multiple)
              </label>
              <Input
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                placeholder="keyboard, piano"
                required
                className="bg-[#0f0f0f] border-[#FFFFFF1A]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as "easy" | "medium" | "hard",
                  })
                }
                className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg text-white"
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Category (optional)
              </label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Nature, Technology, etc."
                className="bg-[#0f0f0f] border-[#FFFFFF1A]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Hint 1 (optional)
              </label>
              <Input
                value={formData.hint1}
                onChange={(e) =>
                  setFormData({ ...formData, hint1: e.target.value })
                }
                placeholder="First letter or custom hint"
                className="bg-[#0f0f0f] border-[#FFFFFF1A]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Hint 2 (optional)
              </label>
              <Input
                value={formData.hint2}
                onChange={(e) =>
                  setFormData({ ...formData, hint2: e.target.value })
                }
                placeholder="Word length or custom hint"
                className="bg-[#0f0f0f] border-[#FFFFFF1A]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Tags (optional, comma-separated)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="funny, logic, wordplay"
                className="bg-[#0f0f0f] border-[#FFFFFF1A]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSubmitModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
