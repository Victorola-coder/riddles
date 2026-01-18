import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Riddle Quest - Gamified Riddle Platform",
    short_name: "Riddle Quest",
    description:
      "Solve riddles, earn gems, and progress through difficulty levels in this engaging gamified riddle platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#8b5cf6",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["games", "entertainment", "education"],
  };
}
