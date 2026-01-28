"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, TrendingUp, Layers, User, ShoppingBag, Trophy, Gift } from "lucide-react";
import { motion } from "framer-motion";

export const MobileNav = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Play",
      href: "/game",
      icon: Gamepad2,
    },
    {
      label: "Daily",
      href: "/daily-challenge",
      icon: Trophy,
    },
    {
      label: "Mystery",
      href: "/mystery-boxes",
      icon: Gift,
    },
    {
      label: "Ranks",
      href: "/leaderboard",
      icon: TrendingUp,
    },
    {
      label: "Levels",
      href: "/levels",
      icon: Layers,
    },
    {
      label: "Shop",
      href: "/shop",
      icon: ShoppingBag,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="bg-[var(--bg-card)]/80 backdrop-blur-xl border-t border-[var(--border-default)] px-6 py-2 pb-5">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center gap-1 p-2 min-w-[64px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active"
                    className="absolute inset-x-0 -top-3 h-[2px] bg-[var(--accent-primary)] shadow-[0_2px_10px] shadow-[var(--accent-primary)]/50"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                
                <item.icon
                  size={24}
                  className={`transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--accent-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="absolute inset-0 bg-[var(--accent-primary)]/5 blur-xl -z-10 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
