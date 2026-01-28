import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop - Riddle Quest",
  description: "Browse and purchase avatars, badges, and consumables with your gems.",
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
