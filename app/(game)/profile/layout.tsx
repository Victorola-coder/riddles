import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - Riddle Quest",
  description: "View your stats, streaks, and game progress.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
