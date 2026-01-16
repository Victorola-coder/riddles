import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: [],
      },
    ],
    sitemap: "https://riddle-quest.vercel.app/sitemap.xml",
  };
}
