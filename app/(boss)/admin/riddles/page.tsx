"use client";

import {
  useAdminRiddles,
  useCreateRiddle,
  useUpdateRiddle,
  useDeleteRiddle,
} from "@/lib/hooks/use-admin";
import {
  Search,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "@/app/components/ui/modal";
import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import { Skeleton, AlertDialog } from "@/app/components/ui";
import { useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 12;

export default function RiddlesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "easy" | "medium" | "hard" | "all"
  >("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRiddle, setEditingRiddle] = useState<AdminRiddle | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [riddleToDelete, setRiddleToDelete] = useState<string | null>(null);

  const {
    data: paginatedRiddles,
    isLoading: loading,
    isFetching,
    refetch,
  } = useAdminRiddles(
    page,
    PAGE_SIZE,
    debouncedSearch || undefined,
    difficultyFilter
  );

  const createRiddle = useCreateRiddle();
  const updateRiddle = useUpdateRiddle();
  const deleteRiddle = useDeleteRiddle();

  const riddles = paginatedRiddles?.riddles ?? [];
  const meta = paginatedRiddles?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalRiddles = meta?.total ?? 0;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    difficulty: "easy" as "easy" | "medium" | "hard",
    category: "",
    hint1: "",
    hint2: "",
    tags: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const answerArray = formData.answer
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    createRiddle.mutate(
      {
        question: formData.question,
        answer: answerArray.length > 0 ? answerArray : [formData.answer],
        difficulty: formData.difficulty,
        category: formData.category || undefined,
        hint1: formData.hint1 || undefined,
        hint2: formData.hint2 || undefined,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
      },
      {
        onSuccess: () => {
          setIsCreateModalOpen(false);
          setFormData({
            question: "",
            answer: "",
            difficulty: "easy",
            category: "",
            hint1: "",
            hint2: "",
            tags: "",
          });
        },
      }
    );
  };

  const handleEdit = (riddle: AdminRiddle) => {
    setEditingRiddle(riddle);
    setFormData({
      question: riddle.question,
      answer: Array.isArray(riddle.answer)
        ? riddle.answer.join(", ")
        : riddle.answer,
      difficulty: riddle.difficulty as "easy" | "medium" | "hard",
      category: riddle.category || "",
      hint1: riddle.hint1 || "",
      hint2: riddle.hint2 || "",
      tags: riddle.tags ? riddle.tags.join(", ") : "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRiddle) return;

    const answerArray = formData.answer
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    updateRiddle.mutate(
      {
        id: editingRiddle.id,
        data: {
          question: formData.question,
          answer: answerArray.length > 0 ? answerArray : [formData.answer],
          difficulty: formData.difficulty,
          category: formData.category || undefined,
          hint1: formData.hint1 || undefined,
          hint2: formData.hint2 || undefined,
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim())
            : [],
        },
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setEditingRiddle(null);
        },
      }
    );
  };

  const handleDelete = (riddleId: string) => {
    setRiddleToDelete(riddleId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (riddleToDelete) {
      deleteRiddle.mutate(riddleToDelete);
      setRiddleToDelete(null);
    }
  };

  const handleToggleActive = async (riddle: AdminRiddle) => {
    updateRiddle.mutate({
      id: riddle.id,
      data: { isActive: !riddle.isActive },
    });
  };

  // Show page immediately - data loads in background

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            Riddles {totalRiddles > 0 ? `(${totalRiddles})` : ""}
          </h1>
          <p className="text-gray-400">
            Manage riddles and their content
            {isFetching && !loading && (
              <span className="ml-2 text-xs text-gray-500">
                (refreshing...)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Riddle
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search riddles by question or category..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="w-full max-w-md pl-10 pr-4 py-2 bg-[#161616] border border-[#FFFFFF1A] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {(["all", "easy", "medium", "hard"] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => {
                setDifficultyFilter(diff);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                difficultyFilter === diff
                  ? "bg-[#8b5cf6] text-white"
                  : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
              }`}
            >
              {diff === "all"
                ? "All"
                : diff.charAt(0).toUpperCase() + diff.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Riddles Table */}
      <div className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] overflow-hidden">
        {loading || !paginatedRiddles ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B0B0B] border-b border-[#FFFFFF1A]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Question
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFFFFF1A]">
                {Array.from({ length: 8 }).map((_, index) => (
                  <tr key={index} className="hover:bg-[#1A1A1A]">
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <Skeleton className="h-5 w-full mb-2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : riddles.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium text-white mb-2">
              No riddles found
            </p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              {searchQuery || difficultyFilter !== "all"
                ? "No riddles match your search or filter criteria."
                : "Get started by creating your first riddle!"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B0B0B] border-b border-[#FFFFFF1A]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Question
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Difficulty
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFFFFF1A]">
                  {riddles.map((riddle: AdminRiddle) => (
                    <tr key={riddle.id} className="hover:bg-[#1A1A1A]">
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-white font-medium line-clamp-2">
                            {riddle.question}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            Answer:{" "}
                            {Array.isArray(riddle.answer)
                              ? riddle.answer.join(", ")
                              : riddle.answer}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            riddle.difficulty === "easy"
                              ? "bg-green-600 text-white"
                              : riddle.difficulty === "medium"
                              ? "bg-yellow-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {riddle.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {riddle.category || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            riddle.isActive
                              ? "bg-green-600 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {riddle.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleActive(riddle)}
                            className="p-2 hover:bg-[#FFFFFF1A] rounded-lg transition-colors"
                            title={riddle.isActive ? "Deactivate" : "Activate"}
                          >
                            {riddle.isActive ? (
                              <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Eye className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(riddle)}
                            className="p-2 hover:bg-[#FFFFFF1A] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(riddle.id)}
                            className="p-2 hover:bg-[#FFFFFF1A] rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalRiddles > 0 && (
              <div className="mt-4 p-4 border-t border-[#FFFFFF1A] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-gray-400">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, totalRiddles)} of {totalRiddles}{" "}
                  riddles
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1 || isFetching}
                    className="px-3 py-1.5 rounded-lg border border-[#FFFFFF1A] text-sm disabled:opacity-50 hover:bg-[#1f1f1f]"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={page >= totalPages || isFetching}
                    className="px-3 py-1.5 rounded-lg border border-[#FFFFFF1A] text-sm disabled:opacity-50 hover:bg-[#1f1f1f]"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Riddle"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, question: e.target.value }))
              }
              required
              rows={3}
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] resize-none"
              placeholder="Enter the riddle question..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Answer(s) * (comma-separated for multiple)
            </label>
            <Input
              type="text"
              value={formData.answer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, answer: e.target.value }))
              }
              required
              placeholder="echo, an echo"
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Difficulty *
            </label>
            <select
              value={formData.difficulty}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  difficulty: e.target.value as "easy" | "medium" | "hard",
                }))
              }
              required
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Category</label>
            <Input
              type="text"
              value={formData.category}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="Nature, Technology, etc."
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Hint 1 (First Letter)
              </label>
              <Input
                type="text"
                value={formData.hint1}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) =>
                  setFormData((prev) => ({ ...prev, hint1: e.target.value }))
                }
                placeholder="E"
                maxLength={1}
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Hint 2 (Word Length)
              </label>
              <Input
                type="text"
                value={formData.hint2}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) =>
                  setFormData((prev) => ({ ...prev, hint2: e.target.value }))
                }
                placeholder="4 letters"
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <Input
              type="text"
              value={formData.tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="sound, nature, puzzle"
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
            <Button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={createRiddle.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black hover:opacity-90"
              disabled={createRiddle.isPending}
            >
              {createRiddle.isPending ? "Creating..." : "Create Riddle"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRiddle(null);
        }}
        title="Edit Riddle"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Question *
            </label>
            <textarea
              value={formData.question}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, question: e.target.value }))
              }
              required
              rows={3}
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Answer(s) * (comma-separated)
            </label>
            <Input
              type="text"
              value={formData.answer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, answer: e.target.value }))
              }
              required
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Difficulty *
            </label>
            <select
              value={formData.difficulty}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData((prev) => ({
                  ...prev,
                  difficulty: e.target.value as "easy" | "medium" | "hard",
                }))
              }
              required
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Category</label>
            <Input
              type="text"
              value={formData.category}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hint 1</label>
              <Input
                type="text"
                value={formData.hint1}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) =>
                  setFormData((prev) => ({ ...prev, hint1: e.target.value }))
                }
                maxLength={1}
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hint 2</label>
              <Input
                type="text"
                value={formData.hint2}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                ) =>
                  setFormData((prev) => ({ ...prev, hint2: e.target.value }))
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Tags</label>
            <Input
              type="text"
              value={formData.tags}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#8b5cf6]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
            <Button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingRiddle(null);
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={updateRiddle.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black hover:opacity-90"
              disabled={updateRiddle.isPending}
            >
              {updateRiddle.isPending ? "Updating..." : "Update Riddle"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setRiddleToDelete(null);
        }}
        title="Delete Riddle"
        description="Are you sure you want to delete this riddle? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="error"
        loading={deleteRiddle.isPending}
      />
    </div>
  );
}
