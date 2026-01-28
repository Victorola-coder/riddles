import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play - Riddle Quest",
  description: "Solve riddles, earn gems, and climb the ranks in Riddle Quest.",
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
