import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXTAUTH_URL ?? "https://hojokin-navi-ai.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/auth/signin`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/dashboard`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];
}
