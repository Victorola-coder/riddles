import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard - Riddle Quest",
  description: "See the top riddle solvers and compete for the highest rank.",
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
