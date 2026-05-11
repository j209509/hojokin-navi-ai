import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXTAUTH_URL ?? "https://hojokin-navi-ai.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/auth/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
