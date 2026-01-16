'use client';

import {
  LayoutDashboard,
  Users,
  HelpCircle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Activity,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader } from '@/app/components/global';
import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAdminToken, removeAdminToken } from '@/lib/admin-auth';
import Modal from '@/app/components/ui/modal';
import Button from '@/app/components/ui/button';

interface NavGroup {
  label: string;
  icon: typeof LayoutDashboard;
  items: Array<{
    href: string;
    label: string;
    icon: typeof LayoutDashboard;
  }>;
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    icon: BarChart3,
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/activity', label: 'Activity Log', icon: Activity },
    ],
  },
  {
    label: 'Content Management',
    icon: HelpCircle,
    items: [
      { href: '/admin/riddles', label: 'Riddles', icon: HelpCircle },
    ],
  },
  {
    label: 'User Management',
    icon: Users,
    items: [{ href: '/admin/users', label: 'Users', icon: Users }],
  },
  {
    label: 'Settings',
    icon: Settings,
    items: [
      { href: '/admin/settings', label: 'Game Config', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    new Set(navGroups.map((group) => group.label))
  );

  useEffect(() => {
    // Don't check auth on login page
    if (pathname === '/admin') {
      setChecking(false);
      return;
    }

    // Check for both admin token and authenticated flag
    const token = getAdminToken();
    const authenticated = sessionStorage.getItem('admin_authenticated');

    if (token && authenticated === 'true') {
      setIsAuthenticated(true);
    } else {
      // Clear any stale auth data
      removeAdminToken();
      router.push('/admin');
    }
    setChecking(false);
  }, [pathname, router]);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    removeAdminToken();
    router.push('/admin');
    toast.success('Logged out successfully.');
  };

  // Don't show layout on login page
  if (pathname === '/admin') {
    return <>{children}</>;
  }

  // Show loader while checking auth
  if (checking) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <Loader size="small" />
      </div>
    );
  }

  // Don't show layout if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Mobile Header */}
      <div className="md:hidden border-b border-[#FFFFFF1A] bg-[#0f0f0f] px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white p-2 hover:bg-[#FFFFFF1A] rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="text-lg font-bold bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
          Admin
        </h1>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="px-3 py-1.5 bg-[#ef4444] text-white rounded-lg text-sm hover:bg-[#ef4444]/80 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0f0f0f] border-r border-[#FFFFFF1A] transition-transform duration-300 md:transition-none`}
        >
          <div className="h-full flex flex-col">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-3 px-6 py-8 border-b border-[#FFFFFF1A]">
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
                🧩 Admin
              </h1>
            </div>

            {/* Mobile Header in Sidebar */}
            <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-[#FFFFFF1A]">
              <h1 className="text-lg font-bold bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
                🧩 Admin
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white p-2 hover:bg-[#FFFFFF1A] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-8 overflow-y-auto">
              <ul className="flex flex-col gap-1">
                {navGroups.map((group) => {
                  const GroupIcon = group.icon;
                  const isOpen = openGroups.has(group.label);
                  const hasActiveItem = group.items.some(
                    (item) => pathname === item.href
                  );

                  return (
                    <li key={group.label}>
                      {/* Group Header */}
                      <button
                        onClick={() => {
                          const newOpenGroups = new Set(openGroups);
                          if (isOpen) {
                            newOpenGroups.delete(group.label);
                          } else {
                            newOpenGroups.add(group.label);
                          }
                          setOpenGroups(newOpenGroups);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
                          hasActiveItem
                            ? 'text-white bg-[#FFFFFF1A]'
                            : 'text-gray-300 hover:bg-[#FFFFFF1A] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <GroupIcon className="w-4 h-4" />
                          <span className="text-sm">{group.label}</span>
                        </div>
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      {/* Group Items */}
                      {isOpen && (
                        <ul className="ml-4 mt-1 space-y-1 border-l border-[#FFFFFF1A] pl-4">
                          {group.items.map((item) => {
                            const isActive = pathname === item.href;
                            const ItemIcon = item.icon;
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                                    isActive
                                      ? 'font-semibold text-white bg-[#FFFFFF1A]'
                                      : 'text-gray-400 hover:bg-[#FFFFFF1A] hover:text-white'
                                  }`}
                                >
                                  <ItemIcon className="w-4 h-4" />
                                  <span>{item.label}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Desktop Logout */}
            <div className="hidden md:block px-6 py-4 border-t border-[#FFFFFF1A]">
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setSidebarOpen(false);
                }}
                className="w-full px-4 py-2 bg-[#ef4444] text-white rounded-lg hover:bg-[#ef4444]/80 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Logout */}
            <div className="md:hidden px-6 py-4 border-t border-[#FFFFFF1A]">
              <button
                onClick={() => {
                  setShowLogoutConfirm(true);
                  setSidebarOpen(false);
                }}
                className="w-full px-4 py-2 bg-[#ef4444] text-white rounded-lg hover:bg-[#ef4444]/80 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to logout? You'll need to enter your access
            code again to access the admin panel.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#FFFFFF1A]">
            <Button
              onClick={() => setShowLogoutConfirm(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowLogoutConfirm(false);
                handleLogout();
              }}
              className="bg-[#ef4444] hover:bg-[#ef4444]/80 text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
