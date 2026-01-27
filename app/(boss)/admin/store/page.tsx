"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { Loader } from "@/app/components/global";
import Button from "@/app/components/ui/button";
import Modal from "@/app/components/ui/modal";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Tag,
  ShoppingBag,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Wand2,
} from "lucide-react";

export default function AdminStorePage() {
  const queryClient = useQueryClient();
  // ... (useState hooks)
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);

  // ... (formData state)
  const [formData, setFormData] = useState<CreateStoreItemData>({
    name: "",
    description: "",
    type: "AVATAR",
    rarity: "COMMON",
    price: 100,
    imageUrl: "",
  });

  // ... (useQuery)
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "store", "items"],
    queryFn: async () => {
      const res = await adminApi.store.getItems();
      return res;
    },
  });

  const seedMutation = useMutation({
    mutationFn: () => adminApi.store.seedItems(),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "store", "items"] });
      toast.success(data.message);
    },
    onError: () => toast.error("Failed to seed items"),
  });

  // ... (create/update/delete mutations)
  const createMutation = useMutation({
    mutationFn: (data: CreateStoreItemData) => adminApi.store.createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "store", "items"] });
      toast.success("Item created successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to create item");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.store.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "store", "items"] });
      toast.success("Item updated successfully");
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.store.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "store", "items"] });
      toast.success("Item deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete item");
    },
  });

  // ... (handlers)
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "AVATAR",
      rarity: "COMMON",
      price: 100,
      imageUrl: "",
    });
    setEditingItem(null);
  };

  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      type: item.type,
      rarity: item.rarity,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Filter items based on search
  const filteredItems = Array.isArray(items)
    ? items.filter((item: StoreItem) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-purple-400" />
            Store Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage avatars, badges, and items
          </p>
        </div>
        <div className="flex gap-2">
           <Button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            variant="ghost"
            className="border border-purple-500/20 text-purple-300 hover:bg-purple-500/10"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Seed Defaults
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 bg-[#FFFFFF0A] p-4 rounded-xl border border-[#FFFFFF1A]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item: StoreItem) => (
          <div
            key={item.id}
            className="bg-[#FFFFFF0A] border border-[#FFFFFF1A] rounded-xl p-4 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-[#FFFFFF1A] rounded-lg">
                <Tag className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 hover:bg-[#FFFFFF1A] rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">
              {item.description || "No description"}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded textxs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase text-[10px]`}>
                {item.type}
              </span>
              <span className={`px-2 py-0.5 rounded textxs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase text-[10px]`}>
                {item.rarity}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#FFFFFF1A]">
              <span className="text-2xl font-bold text-white flex items-center gap-1">
                {item.price} <span className="text-xs font-normal text-purple-400">GEMS</span>
              </span>
              <div className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400 border border-dashed border-[#FFFFFF1A] rounded-xl">
            <ShoppingBag className="w-12 h-12 mb-3 opacity-20" />
            <p>No items found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingItem ? "Edit Item" : "Create New Item"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Item Name
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g. King's Crown"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 min-h-[80px]"
              placeholder="Item description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="AVATAR">Avatar</option>
                <option value="BADGE">Badge</option>
                <option value="CONSUMABLE">Consumable</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Rarity
              </label>
              <select
                value={formData.rarity}
                onChange={(e) =>
                  setFormData({ ...formData, rarity: e.target.value })
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="COMMON">Common</option>
                <option value="RARE">Rare</option>
                <option value="EPIC">Epic</option>
                <option value="LEGENDARY">Legendary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Price (Gems)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseInt(e.target.value) })
                }
                className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Image URL / Icon
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full bg-[#0f0f0f] border border-[#FFFFFF1A] rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  placeholder="https://... or icon name"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#FFFFFF1A]">
             <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="bg-purple-600 hover:bg-purple-500 text-white"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Saving..."
                : editingItem
                ? "Update Item"
                : "Create Item"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
