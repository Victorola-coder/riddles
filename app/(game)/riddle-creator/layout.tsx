import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riddle Creator | RiddleQuest",
  description: "Submit your own riddles and vote on community creations",
};

export default function RiddleCreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
