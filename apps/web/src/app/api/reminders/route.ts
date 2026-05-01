import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUpcomingRenewals } from "@/lib/db/queries";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") ?? "30");

  const subs = await getUpcomingRenewals(userId, days);
  return NextResponse.json(subs);
}
