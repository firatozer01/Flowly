import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pushTokens } from "@/lib/db/schema";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token, platform = "expo" } = await req.json();
  if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

  await db.insert(pushTokens)
    .values({ userId, token, platform })
    .onConflictDoUpdate({ target: pushTokens.token, set: { userId } });

  return NextResponse.json({ success: true });
}
