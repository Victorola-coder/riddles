"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import { useAdminActivity } from "@/lib/hooks/use-admin";
import { Skeleton } from "@/app/components/ui";

const PAGE_SIZE = 20;

export default function ActivityPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<"admin" | "user" | "">("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("");

  const { data, isLoading, isFetching } = useAdminActivity({
    page,
    pageSize: PAGE_SIZE,
    type: typeFilter || undefined,
    activityType: activityTypeFilter || undefined,
  });

  const activities: ActivityItem[] =
    (data as ActivityResponse | undefined)?.activities ?? [];
  const meta = (data as ActivityResponse | undefined)?.meta ?? {
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: 1,
  };
  const totalPages = meta.totalPages;
  const total = meta.total;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Show page immediately - data loads in background

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
          Activity Log
        </h1>
        <p className="text-gray-400">View all platform activities and events</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setTypeFilter("");
              setActivityTypeFilter("");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === "" && activityTypeFilter === ""
              ? "bg-[#8b5cf6] text-white"
              : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => {
            setTypeFilter("admin");
              setActivityTypeFilter("");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === "admin" && activityTypeFilter === ""
              ? "bg-[#8b5cf6] text-white"
              : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => {
            setTypeFilter("user");
              setActivityTypeFilter("");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === "user" && activityTypeFilter === ""
              ? "bg-[#8b5cf6] text-white"
              : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
          }`}
        >
          User
        </button>
        </div>

        {/* Activity Type Filters */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-400 self-center mr-2">Type:</span>
          <button
            onClick={() => {
              setActivityTypeFilter("");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activityTypeFilter === ""
                ? "bg-[#8b5cf6] text-white"
                : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => {
              setActivityTypeFilter("riddle_created");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activityTypeFilter === "riddle_created"
                ? "bg-[#8b5cf6] text-white"
                : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
            }`}
          >
            Riddle Created
          </button>
          <button
            onClick={() => {
              setActivityTypeFilter("riddle_updated");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activityTypeFilter === "riddle_updated"
                ? "bg-[#8b5cf6] text-white"
                : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
            }`}
          >
            Riddle Updated
          </button>
          <button
            onClick={() => {
              setActivityTypeFilter("riddle_deleted");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activityTypeFilter === "riddle_deleted"
                ? "bg-[#8b5cf6] text-white"
                : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
            }`}
          >
            Riddle Deleted
          </button>
          <button
            onClick={() => {
              setActivityTypeFilter("riddle_solved");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activityTypeFilter === "riddle_solved"
                ? "bg-[#8b5cf6] text-white"
                : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
            }`}
          >
            Riddle Solved
          </button>
          <button
            onClick={() => {
              setActivityTypeFilter("hint_used");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activityTypeFilter === "hint_used"
                ? "bg-[#8b5cf6] text-white"
                : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
            }`}
          >
            Hint Used
          </button>
          <button
            onClick={() => {
              setActivityTypeFilter("settings_updated");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activityTypeFilter === "settings_updated"
                ? "bg-[#8b5cf6] text-white"
                : "bg-[#161616] text-white hover:bg-[#222] border border-[#FFFFFF1A]"
            }`}
          >
            Settings Updated
          </button>
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-[#FFFFFF1A]">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="w-5 h-5 rounded" />
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-3/4 ml-8 mb-2" />
                    <Skeleton className="h-3 w-24 ml-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium text-white mb-2">
              No activity found
            </p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Activity logs will appear here as events occur.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#FFFFFF1A]">
              {activities.map((activity: ActivityItem) => (
                <div
                  key={activity.id}
                  className="p-6 hover:bg-[#1A1A1A] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Activity className="w-5 h-5 text-[#8b5cf6]" />
                        <h3 className="text-white font-medium">
                          {activity.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activity.category === "admin"
                              ? "bg-purple-600/20 text-purple-400 border border-purple-600/30"
                              : activity.category === "user"
                              ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                              : "bg-gray-600/20 text-gray-400 border border-gray-600/30"
                          }`}
                        >
                          {activity.category}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#8b5cf6]/20 text-[#8b5cf6] border border-[#8b5cf6]/30">
                          {activity.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm ml-8">
                        {activity.description}
                      </p>
                      <p className="text-gray-500 text-xs mt-2 ml-8">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > 0 && (
              <div className="mt-4 p-4 border-t border-[#FFFFFF1A] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-gray-400">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, total)} of {total} activities
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
    </div>
  );
}
