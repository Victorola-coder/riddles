"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Eye, Plus, RefreshCw, Trash2, Users } from "lucide-react";
import Modal from "@/app/components/ui/modal";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import { Skeleton, AlertDialog } from "@/app/components/ui";
import {
  useAdminDailyChallenges,
  useAdminDeleteDailyChallenge,
  useAdminSeedDailyChallenges,
  useAdminUpsertDailyChallenge,
  useAdminRiddles,
  useAdminDailyChallengeEntries,
} from "@/lib/hooks/use-admin";

type DailyChallengeRow = {
  id: string;
  date: string; // YYYY-MM-DD
  riddleId: string;
  bonusGems: number;
  riddle: { id: string; question: string; difficulty: string; isActive: boolean };
};

function formatDateLabel(date: string): string {
  // YYYY-MM-DD -> readable (kept simple to avoid timezone surprises)
  return date;
}

export default function AdminDailyChallengePage() {
  const [rangeDays, setRangeDays] = useState(30);

  const { from, to } = useMemo(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const fromIso = today.toISOString().slice(0, 10);
    const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + (rangeDays - 1), 0, 0, 0, 0));
    const toIso = end.toISOString().slice(0, 10);
    return { from: fromIso, to: toIso };
  }, [rangeDays]);

  const { data, isLoading, isFetching, refetch } = useAdminDailyChallenges({ from, to });
  const challenges: DailyChallengeRow[] = (data as any)?.challenges ?? [];

  const seedMutation = useAdminSeedDailyChallenges();
  const upsertMutation = useAdminUpsertDailyChallenge();
  const deleteMutation = useAdminDeleteDailyChallenge();

  const [seedModalOpen, setSeedModalOpen] = useState(false);
  const [seedDays, setSeedDays] = useState(30);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editing, setEditing] = useState<DailyChallengeRow | null>(null);
  const [editBonusGems, setEditBonusGems] = useState<number>(20);
  const [editDate, setEditDate] = useState<string>("");

  // Riddle picker inside edit modal
  const [riddleSearch, setRiddleSearch] = useState("");
  const [debouncedRiddleSearch, setDebouncedRiddleSearch] = useState("");
  const [selectedRiddleId, setSelectedRiddleId] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedRiddleSearch(riddleSearch), 300);
    return () => clearTimeout(t);
  }, [riddleSearch]);

  const { data: riddleResults, isFetching: riddlesFetching } = useAdminRiddles(
    1,
    12,
    debouncedRiddleSearch || undefined,
    "all"
  );

  const [entriesModalOpen, setEntriesModalOpen] = useState(false);
  const [entriesDate, setEntriesDate] = useState<string>("");
  const { data: entriesData, isLoading: entriesLoading } = useAdminDailyChallengeEntries(
    entriesDate,
    entriesModalOpen && !!entriesDate
  );
  const entries = (entriesData as any)?.entries ?? [];

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState<DailyChallengeRow | null>(null);

  const openCreate = () => {
    setEditing(null);
    setEditDate(from);
    setEditBonusGems(20);
    setRiddleSearch("");
    setDebouncedRiddleSearch("");
    setSelectedRiddleId("");
    setEditModalOpen(true);
  };

  const openEdit = (row: DailyChallengeRow) => {
    setEditing(row);
    setEditDate(row.date);
    setEditBonusGems(row.bonusGems);
    setSelectedRiddleId(row.riddleId);
    setRiddleSearch("");
    setDebouncedRiddleSearch("");
    setEditModalOpen(true);
  };

  const saveChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDate || !selectedRiddleId) return;
    await upsertMutation.mutateAsync({
      date: editDate,
      riddleId: selectedRiddleId,
      bonusGems: editBonusGems,
    });
    setEditModalOpen(false);
  };

  const confirmDelete = () => {
    if (!challengeToDelete) return;
    deleteMutation.mutate(challengeToDelete.id);
    setDeleteConfirmOpen(false);
    setChallengeToDelete(null);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            Daily Challenge
          </h1>
          <p className="text-gray-400">
            Manage daily riddle assignments and view solver entries
            {isFetching && !isLoading && (
              <span className="ml-2 text-xs text-gray-500">(refreshing...)</span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setSeedModalOpen(true)}
            className="px-4 py-2 bg-[#161616] border border-[#FFFFFF1A] text-white rounded-lg hover:bg-[#222] transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Seed
          </button>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create / Override
          </button>
        </div>
      </div>

      {/* Range selector */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="bg-[#161616] border border-[#FFFFFF1A] rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-gray-300">Show next</span>
          <Input
            type="number"
            value={rangeDays}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRangeDays(Math.max(7, Math.min(120, parseInt(e.target.value) || 30)))
            }
            className="w-24 bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
          />
          <span className="text-sm text-gray-300">days</span>
          <span className="text-xs text-gray-500">
            ({from} → {to})
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] overflow-hidden">
        {isLoading || !data ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B0B0B] border-b border-[#FFFFFF1A]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Riddle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Bonus
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFFFFF1A]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="hover:bg-[#1A1A1A]">
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-80" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
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
        ) : challenges.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium text-white mb-2">
              No daily challenges scheduled
            </p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Use <span className="text-white">Seed</span> to generate upcoming challenges, or{" "}
              <span className="text-white">Create / Override</span> to assign a specific riddle to a date.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B0B0B] border-b border-[#FFFFFF1A]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Riddle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Bonus
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFFFFF1A]">
                {challenges.map((row) => (
                  <tr key={row.id} className="hover:bg-[#1A1A1A]">
                    <td className="px-6 py-4 text-gray-200 font-mono text-sm">
                      {formatDateLabel(row.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xl">
                        <p className="text-white font-medium line-clamp-2">
                          {row.riddle?.question ?? "—"}
                        </p>
                        {!row.riddle?.isActive && (
                          <p className="text-xs text-red-400 mt-1">
                            This riddle is inactive
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          row.riddle?.difficulty === "easy"
                            ? "bg-green-600 text-white"
                            : row.riddle?.difficulty === "medium"
                            ? "bg-yellow-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {(row.riddle?.difficulty || "—").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      +{row.bonusGems} gems
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEntriesDate(row.date);
                            setEntriesModalOpen(true);
                          }}
                          className="p-2 hover:bg-[#FFFFFF1A] rounded-lg transition-colors"
                          title="View entries"
                        >
                          <Users className="w-4 h-4 text-gray-300" />
                        </button>
                        <button
                          onClick={() => openEdit(row)}
                          className="p-2 hover:bg-[#FFFFFF1A] rounded-lg transition-colors"
                          title="Edit / Override"
                        >
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => {
                            setChallengeToDelete(row);
                            setDeleteConfirmOpen(true);
                          }}
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
        )}
      </div>

      {/* Seed modal */}
      <Modal isOpen={seedModalOpen} onClose={() => setSeedModalOpen(false)} title="Seed Daily Challenges">
        <div className="space-y-4">
          <p className="text-gray-300">
            Generate daily challenges for upcoming dates. Existing dates will be skipped.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Days</span>
            <Input
              type="number"
              value={seedDays}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSeedDays(Math.max(1, Math.min(365, parseInt(e.target.value) || 30)))
              }
              className="w-32 bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
            <Button
              onClick={() => setSeedModalOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={seedMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                await seedMutation.mutateAsync(seedDays);
                setSeedModalOpen(false);
              }}
              className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black hover:opacity-90"
              disabled={seedMutation.isPending}
            >
              {seedMutation.isPending ? "Seeding..." : "Seed"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit/Create modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditing(null);
        }}
        title={editing ? `Edit Daily Challenge (${editing.date})` : "Create / Override Daily Challenge"}
      >
        <form onSubmit={saveChallenge} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Date (UTC)</label>
              <Input
                type="text"
                value={editDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDate(e.target.value)}
                placeholder="YYYY-MM-DD"
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Bonus Gems</label>
              <Input
                type="number"
                value={editBonusGems}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditBonusGems(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-sm font-medium text-white">Pick a riddle</p>
                <p className="text-xs text-gray-400">
                  Search and select one riddle for the chosen date.
                </p>
              </div>
              {selectedRiddleId ? (
                <span className="text-xs text-gray-400 font-mono">
                  selected: {selectedRiddleId.slice(0, 8)}
                </span>
              ) : null}
            </div>
            <Input
              type="text"
              value={riddleSearch}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRiddleSearch(e.target.value)}
              placeholder="Search riddles…"
              className="w-full bg-[#161616] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
            />
            <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
              {riddlesFetching && !riddleResults ? (
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                (riddleResults?.riddles ?? []).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRiddleId(r.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedRiddleId === r.id
                        ? "border-[#8b5cf6] bg-[#8b5cf6]/10"
                        : "border-[#FFFFFF1A] bg-[#161616] hover:bg-[#1f1f1f]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium line-clamp-2">
                          {r.question}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {String(r.difficulty).toUpperCase()}
                          {r.category ? ` • ${r.category}` : ""}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {r.id.slice(0, 8)}
                      </span>
                    </div>
                  </button>
                ))
              )}
              {!riddlesFetching && (riddleResults?.riddles ?? []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-6">
                  No riddles found.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
            <Button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={upsertMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black hover:opacity-90"
              disabled={upsertMutation.isPending || !editDate || !selectedRiddleId}
            >
              {upsertMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Entries modal */}
      <Modal
        isOpen={entriesModalOpen}
        onClose={() => setEntriesModalOpen(false)}
        title={`Daily Challenge Entries (${entriesDate || "—"})`}
      >
        <div className="space-y-3">
          {entriesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">
              No entries for this date yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto">
              {entries.map((e: any, idx: number) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#0f0f0f] border border-[#FFFFFF1A]"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {e.username || e.email || `User ${String(e.userId).slice(0, 8)}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {e.isCorrect ? "Correct" : "Incorrect"} • {e.completedAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-200 font-mono">
                      {e.solveTimeMs ? `${e.solveTimeMs}ms` : "—"}
                    </p>
                    {e.isCorrect && (
                      <p className="text-[10px] text-gray-500">rank #{idx + 1}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setChallengeToDelete(null);
        }}
        title="Delete Daily Challenge"
        description="Are you sure you want to delete this daily challenge? This does not delete the riddle, only the schedule entry."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="error"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

