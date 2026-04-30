import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscriptions, paymentLogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

function advanceDate(date: Date, cycle: string): Date {
  const next = new Date(date);
  if (cycle === "monthly") next.setMonth(next.getMonth() + 1);
  else if (cycle === "yearly") next.setFullYear(next.getFullYear() + 1);
  else if (cycle === "weekly") next.setDate(next.getDate() + 7);
  return next;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)));

  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const nextDate = advanceDate(new Date(sub.nextBillingDate), sub.billingCycle);

  await Promise.all([
    db.update(subscriptions)
      .set({ nextBillingDate: nextDate, updatedAt: new Date() })
      .where(eq(subscriptions.id, id)),
    db.insert(paymentLogs).values({
      subscriptionId: id,
      userId,
      amount: sub.amount,
      currency: sub.currency,
      paidAt: new Date(),
    }),
  ]);

  return NextResponse.json({ success: true, nextBillingDate: nextDate });
}
