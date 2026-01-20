"use client";

import {
  Users,
  HelpCircle,
  Gem,
  TrendingUp,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useAdminStats, useAdminActivity } from "@/lib/hooks/use-admin";
import { Skeleton } from "@/app/components/ui";

export default function DashboardPage() {
  const {
    data: stats,
    isLoading: loading,
    isFetching,
    refetch,
  } = useAdminStats({ realTime: true }); // Enable real-time updates
  const { data: activitiesData, isLoading: activitiesLoading } =
    useAdminActivity({ page: 1, pageSize: 4, realTime: true }); // Enable real-time updates

  const activities: ActivityItem[] =
    (activitiesData as ActivityResponse | undefined)?.activities ?? [];

  // Type assertion for stats
  const statsData = stats as AdminStats | undefined;

  // Show cached data immediately while refetching in background
  const isRefreshing = isFetching && !loading;

  const statCards = [
    {
      title: "Total Users",
      value: statsData?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-600",
      link: "/admin/users",
    },
    {
      title: "Total Riddles",
      value: statsData?.totalRiddles || 0,
      icon: HelpCircle,
      color: "bg-purple-600",
      link: "/admin/riddles",
    },
    {
      title: "Riddles Solved",
      value: statsData?.totalSolved || 0,
      icon: TrendingUp,
      color: "bg-green-600",
      link: "/admin/riddles",
    },
    {
      title: "Total Gems Earned",
      value: statsData?.totalGemsEarned || 0,
      icon: Gem,
      color: "bg-yellow-600",
      link: "/admin/users",
    },
    {
      title: "Active Sessions",
      value: statsData?.activeSessions || 0,
      icon: BarChart3,
      color: "bg-indigo-600",
      link: "/admin/users",
    },
  ];

  // Show page immediately with cached/placeholder data
  // Data will update when ready

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Overview of your platform statistics and key metrics
            {isRefreshing && (
              <span className="ml-2 text-xs text-gray-500">
                (refreshing...)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          {isFetching ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        {loading ? (
          // Skeleton loaders for stat cards
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-[#161616] rounded-lg p-6 border border-[#FFFFFF1A]"
            >
              <Skeleton className="w-12 h-12 rounded-lg mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))
        ) : (
          statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link
                key={index}
                href={card.link}
                className="bg-[#161616] rounded-lg p-6 border border-[#FFFFFF1A] hover:border-[#8b5cf6] transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-gray-400 text-sm mb-2">{card.title}</h3>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </Link>
            );
          })
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161616] rounded-lg p-6 border border-[#FFFFFF1A]">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/riddles?action=create"
              className="block w-full px-4 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] text-black rounded-lg hover:opacity-90 transition-opacity font-medium text-center"
            >
              Create New Riddle
            </Link>
            <Link
              href="/admin/settings"
              className="block w-full px-4 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium text-center"
            >
              Configure Game Settings
            </Link>
          </div>
        </div>

        <div className="bg-[#161616] rounded-lg p-6 border border-[#FFFFFF1A]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Link
              href="/admin/activity"
              className="text-sm text-[#8b5cf6] hover:text-[#8b5cf6]/80 font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          {activitiesLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-[#1a1a1a] border border-[#FFFFFF0A]"
                >
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-gray-400 text-sm space-y-2">
              <p>No recent activity to display</p>
              <p className="text-xs text-gray-500">
                Activity logs will appear here as you manage content
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity: ActivityItem) => {
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

                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-[#FFFFFF0A] hover:border-[#FFFFFF1A] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">
                        {activity.title}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {activity.description}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
