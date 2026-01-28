import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Challenge - Riddle Quest",
  description: "Solve today's riddle and compete for the fastest time!",
};

export default function DailyChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
