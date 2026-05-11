import { NextResponse } from "next/server";
import { MOCK_GRANTS } from "@/lib/mockData";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const ministry = searchParams.get("ministry");
    const search = searchParams.get("search");

    const { default: prisma } = await import("@/lib/prisma");
    const grants = await prisma.grant.findMany({
      where: {
        isActive: true,
        ...(category ? { category } : {}),
        ...(ministry ? { ministry } : {}),
        ...(search ? { OR: [{ name: { contains: search } }, { description: { contains: search } }] } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    if (grants.length > 0) {
      return NextResponse.json({ grants, source: "database" });
    }
    return NextResponse.json({ grants: MOCK_GRANTS, source: "mock" });
  } catch {
    return NextResponse.json({ grants: MOCK_GRANTS, source: "mock" });
  }
}
