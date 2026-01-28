import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements - Riddle Quest",
  description: "Track your achievements and unlock new badges in Riddle Quest.",
};

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
