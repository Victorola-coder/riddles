'use client';

import { useAdminUsers } from '@/lib/hooks/use-admin';
import { Search, Users, Gem, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Loader } from '@/app/components/global';

const PAGE_SIZE = 12;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const {
    data: paginatedUsers,
    isLoading: loading,
    isFetching,
    refetch,
  } = useAdminUsers(page, PAGE_SIZE, debouncedSearch || undefined);

  const users = paginatedUsers?.users ?? [];
  const meta = paginatedUsers?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalUsers = meta?.total ?? 0;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="medium" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
            Users {totalUsers > 0 ? `(${totalUsers})` : ''}
          </h1>
          <p className="text-gray-400">
            View and manage user accounts
            {isFetching && !loading && (
              <span className="ml-2 text-xs text-gray-500">(refreshing...)</span>
            )}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by email or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2 bg-[#161616] border border-[#FFFFFF1A] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#161616] rounded-lg border border-[#FFFFFF1A] overflow-hidden">
        {users.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium text-white mb-2">No users found</p>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              {searchQuery
                ? `No users match your search for "${debouncedSearch}".`
                : 'Users will appear here once they start playing.'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B0B0B] border-b border-[#FFFFFF1A]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Gems
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Solved
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Streak
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Level
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Last Played
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FFFFFF1A]">
                  {users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-[#1A1A1A]">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {user.username || user.email || 'Anonymous'}
                          </p>
                          {user.email && (
                            <p className="text-gray-400 text-xs">{user.email}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[#fbbf24]">
                          <Gem className="w-4 h-4" />
                          <span className="font-medium">{user.totalGems}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          {user.totalRiddlesSolved}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-xs font-medium">
                          {user.currentStreak} days
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        Level {user.currentLevel}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {user.lastPlayedDate
                          ? new Date(user.lastPlayedDate).toLocaleDateString()
                          : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalUsers > 0 && (
              <div className="mt-4 p-4 border-t border-[#FFFFFF1A] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-gray-400">
                  Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalUsers)} of {totalUsers} users
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
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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
