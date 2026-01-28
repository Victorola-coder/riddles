"use client";

import { useState } from "react";
import { Gift, Plus, Edit, Trash2, Eye, EyeOff, Sparkles, RefreshCw } from "lucide-react";
import Modal from "@/app/components/ui/modal";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import { Skeleton, AlertDialog } from "@/app/components/ui";
import {
  useAdminMysteryBoxes,
  useCreateMysteryBox,
  useUpdateMysteryBox,
  useDeleteMysteryBox,
  useSeedMysteryBoxes,
  useAddMysteryBoxReward,
  useUpdateMysteryBoxReward,
  useDeleteMysteryBoxReward,
} from "@/lib/hooks/use-mystery-boxes";

const RARITY_COLORS = {
  COMMON: "bg-gray-600 text-white",
  RARE: "bg-blue-600 text-white",
  EPIC: "bg-purple-600 text-white",
  LEGENDARY: "bg-yellow-600 text-black",
};

const RARITY_OPTIONS: MysteryBoxRarity[] = ["COMMON", "RARE", "EPIC", "LEGENDARY"];
const REWARD_TYPE_OPTIONS: MysteryBoxRewardType[] = ["GEMS", "STORE_ITEM"];

export default function AdminMysteryBoxesPage() {
  const { data: boxes, isLoading, isFetching, refetch } = useAdminMysteryBoxes();
  const createMutation = useCreateMysteryBox();
  const updateMutation = useUpdateMysteryBox();
  const deleteMutation = useDeleteMysteryBox();
  const seedMutation = useSeedMysteryBoxes();

  const addRewardMutation = useAddMysteryBoxReward();
  const updateRewardMutation = useUpdateMysteryBoxReward();
  const deleteRewardMutation = useDeleteMysteryBoxReward();

  // Box modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<MysteryBox | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [boxToDelete, setBoxToDelete] = useState<MysteryBox | null>(null);

  // Box form state
  const [boxName, setBoxName] = useState("");
  const [boxDescription, setBoxDescription] = useState("");
  const [boxPrice, setBoxPrice] = useState(100);
  const [boxRarity, setBoxRarity] = useState<MysteryBoxRarity>("COMMON");

  // Reward modals
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null);
  const [editingReward, setEditingReward] = useState<MysteryBoxReward | null>(null);
  const [deleteRewardConfirmOpen, setDeleteRewardConfirmOpen] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<MysteryBoxReward | null>(null);

  // Reward form state
  const [rewardType, setRewardType] = useState<MysteryBoxRewardType>("GEMS");
  const [rewardValue, setRewardValue] = useState("");
  const [rewardRarity, setRewardRarity] = useState<MysteryBoxRarity>("COMMON");
  const [rewardWeight, setRewardWeight] = useState(1);

  const openCreateBox = () => {
    setBoxName("");
    setBoxDescription("");
    setBoxPrice(100);
    setBoxRarity("COMMON");
    setCreateModalOpen(true);
  };

  const openEditBox = (box: MysteryBox) => {
    setEditingBox(box);
    setBoxName(box.name);
    setBoxDescription(box.description || "");
    setBoxPrice(box.price);
    setBoxRarity(box.rarity);
    setEditModalOpen(true);
  };

  const handleCreateBox = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      name: boxName,
      description: boxDescription || undefined,
      price: boxPrice,
      rarity: boxRarity,
    });
    setCreateModalOpen(false);
  };

  const handleUpdateBox = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBox) return;
    await updateMutation.mutateAsync({
      id: editingBox.id,
      data: {
        name: boxName,
        description: boxDescription || undefined,
        price: boxPrice,
        rarity: boxRarity,
      },
    });
    setEditModalOpen(false);
    setEditingBox(null);
  };

  const confirmDeleteBox = () => {
    if (!boxToDelete) return;
    deleteMutation.mutate(boxToDelete.id);
    setDeleteConfirmOpen(false);
    setBoxToDelete(null);
  };

  const openRewardModal = (box: MysteryBox, reward?: MysteryBoxReward) => {
    setSelectedBox(box);
    if (reward) {
      setEditingReward(reward);
      setRewardType(reward.type);
      setRewardValue(reward.value);
      setRewardRarity(reward.rarity);
      setRewardWeight(reward.weight);
    } else {
      setEditingReward(null);
      setRewardType("GEMS");
      setRewardValue("");
      setRewardRarity("COMMON");
      setRewardWeight(1);
    }
    setRewardModalOpen(true);
  };

  const handleSaveReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBox) return;

    if (editingReward) {
      await updateRewardMutation.mutateAsync({
        id: editingReward.id,
        data: {
          type: rewardType,
          value: rewardValue,
          rarity: rewardRarity,
          weight: rewardWeight,
        },
      });
    } else {
      await addRewardMutation.mutateAsync({
        mysteryBoxId: selectedBox.id,
        type: rewardType,
        value: rewardValue,
        rarity: rewardRarity,
        weight: rewardWeight,
      });
    }
    setRewardModalOpen(false);
    setSelectedBox(null);
    setEditingReward(null);
  };

  const confirmDeleteReward = () => {
    if (!rewardToDelete) return;
    deleteRewardMutation.mutate(rewardToDelete.id);
    setDeleteRewardConfirmOpen(false);
    setRewardToDelete(null);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            Mystery Boxes
          </h1>
          <p className="text-gray-400">
            Manage gacha boxes and configure rewards
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
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="px-4 py-2 bg-[#161616] border border-[#FFFFFF1A] text-white rounded-lg hover:bg-[#222] transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {seedMutation.isPending ? "Seeding..." : "Seed"}
          </button>
          <button
            onClick={openCreateBox}
            className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Box
          </button>
        </div>
      </div>

      {/* Mystery Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))
        ) : !boxes || boxes.length === 0 ? (
          <div className="col-span-full py-16 px-6 text-center bg-[#161616] rounded-lg border border-[#FFFFFF1A]">
            <Gift className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium text-white mb-2">No mystery boxes yet</p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Create your first mystery box or use the seed button to generate defaults.
            </p>
          </div>
        ) : (
          boxes.map((box) => (
            <div
              key={box.id}
              className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] p-6 hover:border-[#FFFFFF33] transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white">{box.name}</h3>
                    {!box.isActive && (
                      <span className="px-2 py-0.5 rounded text-xs bg-red-600 text-white">
                        Inactive
                      </span>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${RARITY_COLORS[box.rarity]}`}>
                    {box.rarity}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditBox(box)}
                    className="p-2 hover:bg-[#FFFFFF1A] rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => {
                      setBoxToDelete(box);
                      setDeleteConfirmOpen(true);
                    }}
                    className="p-2 hover:bg-[#FFFFFF1A] rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {box.description && (
                <p className="text-sm text-gray-400 mb-4">{box.description}</p>
              )}

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#FFFFFF1A]">
                <span className="text-sm text-gray-400">Price</span>
                <span className="text-lg font-bold text-[#fbbf24]">{box.price} gems</span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    Rewards ({box._count?.rewards || 0})
                  </span>
                  <button
                    onClick={() => openRewardModal(box)}
                    className="text-xs text-[#8b5cf6] hover:text-[#a78bfa] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                {box.rewards && box.rewards.length > 0 && (
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {box.rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="flex items-center justify-between p-2 rounded bg-[#0f0f0f] text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${RARITY_COLORS[reward.rarity]}`}>
                            {reward.rarity}
                          </span>
                          <span className="text-gray-300 truncate">
                            {reward.type}: {reward.value}
                          </span>
                          <span className="text-gray-500">×{reward.weight}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openRewardModal(box, reward)}
                            className="p-1 hover:bg-[#FFFFFF1A] rounded"
                          >
                            <Edit className="w-3 h-3 text-blue-400" />
                          </button>
                          <button
                            onClick={() => {
                              setRewardToDelete(reward);
                              setDeleteRewardConfirmOpen(true);
                            }}
                            className="p-1 hover:bg-[#FFFFFF1A] rounded"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Box Modal */}
      <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Mystery Box">
        <form onSubmit={handleCreateBox} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <Input
              type="text"
              value={boxName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoxName(e.target.value)}
              placeholder="Starter Box"
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Description (optional)</label>
            <Input
              type="text"
              value={boxDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoxDescription(e.target.value)}
              placeholder="A basic mystery box for beginners"
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Price (gems)</label>
              <Input
                type="number"
                value={boxPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoxPrice(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Rarity</label>
              <select
                value={boxRarity}
                onChange={(e) => setBoxRarity(e.target.value as MysteryBoxRarity)}
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              >
                {RARITY_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
            <Button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black hover:opacity-90"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Box Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingBox(null);
        }}
        title={`Edit Mystery Box`}
      >
        <form onSubmit={handleUpdateBox} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <Input
              type="text"
              value={boxName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoxName(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <Input
              type="text"
              value={boxDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoxDescription(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Price</label>
              <Input
                type="number"
                value={boxPrice}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBoxPrice(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Rarity</label>
              <select
                value={boxRarity}
                onChange={(e) => setBoxRarity(e.target.value as MysteryBoxRarity)}
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              >
                {RARITY_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
            <Button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black hover:opacity-90"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Reward Modal */}
      <Modal
        isOpen={rewardModalOpen}
        onClose={() => {
          setRewardModalOpen(false);
          setSelectedBox(null);
          setEditingReward(null);
        }}
        title={editingReward ? "Edit Reward" : "Add Reward"}
      >
        <form onSubmit={handleSaveReward} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Type</label>
              <select
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value as MysteryBoxRewardType)}
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              >
                {REWARD_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Rarity</label>
              <select
                value={rewardRarity}
                onChange={(e) => setRewardRarity(e.target.value as MysteryBoxRarity)}
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              >
                {RARITY_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Value {rewardType === "GEMS" ? "(amount)" : "(store item ID)"}
            </label>
            <Input
              type="text"
              value={rewardValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRewardValue(e.target.value)}
              placeholder={rewardType === "GEMS" ? "50" : "clxxx..."}
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Weight (drop chance)</label>
            <Input
              type="number"
              value={rewardWeight}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRewardWeight(parseInt(e.target.value) || 1)}
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-sm text-white"
              min={1}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher weight = higher chance. Total weight is sum of all rewards.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
            <Button
              type="button"
              onClick={() => setRewardModalOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
              disabled={addRewardMutation.isPending || updateRewardMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black hover:opacity-90"
              disabled={addRewardMutation.isPending || updateRewardMutation.isPending}
            >
              {addRewardMutation.isPending || updateRewardMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Box Confirmation */}
      <AlertDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setBoxToDelete(null);
        }}
        title="Delete Mystery Box"
        description={`Are you sure you want to delete "${boxToDelete?.name}"? This will also delete all associated rewards.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteBox}
        variant="error"
        loading={deleteMutation.isPending}
      />

      {/* Delete Reward Confirmation */}
      <AlertDialog
        open={deleteRewardConfirmOpen}
        onClose={() => {
          setDeleteRewardConfirmOpen(false);
          setRewardToDelete(null);
        }}
        title="Delete Reward"
        description="Are you sure you want to delete this reward?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteReward}
        variant="error"
        loading={deleteRewardMutation.isPending}
      />
    </div>
  );
}
