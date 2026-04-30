import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscriptions, pushTokens } from "@/lib/db/schema";
import { eq, and, lte, gte } from "drizzle-orm";

// Vercel Cron: günde bir çalışır (vercel.json'da tanımlanır)
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in3Days = new Date(now);
  in3Days.setDate(in3Days.getDate() + 3);

  // 0-3 gün içinde yenilenen aktif abonelikler
  const upcoming = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.isActive, true),
        gte(subscriptions.nextBillingDate, now),
        lte(subscriptions.nextBillingDate, in3Days)
      )
    );

  if (upcoming.length === 0) return NextResponse.json({ sent: 0 });

  // Kullanıcı başına grupla
  const byUser: Record<string, typeof upcoming> = {};
  for (const sub of upcoming) {
    if (!byUser[sub.userId]) byUser[sub.userId] = [];
    byUser[sub.userId].push(sub);
  }

  const messages: object[] = [];

  for (const [userId, subs] of Object.entries(byUser)) {
    const tokens = await db
      .select()
      .from(pushTokens)
      .where(eq(pushTokens.userId, userId));

    for (const tokenRow of tokens) {
      for (const sub of subs) {
        const daysLeft = Math.ceil(
          (new Date(sub.nextBillingDate).getTime() - now.getTime()) / 86400000
        );

        messages.push({
          to: tokenRow.token,
          sound: "default",
          title: `${sub.name} yenileniyor 🔔`,
          body: `${daysLeft} gün kaldı · ${Number(sub.amount).toFixed(2)} ${sub.currency}`,
          data: { subscriptionId: sub.id, type: "renewal_reminder" },
          channelId: "reminders",
        });
      }
    }
  }

  if (messages.length === 0) return NextResponse.json({ sent: 0 });

  // Expo Push API'ye gönder (100'lü batch'ler)
  const batches: object[][] = [];
  for (let i = 0; i < messages.length; i += 100) {
    batches.push(messages.slice(i, i + 100));
  }

  let sent = 0;
  for (const batch of batches) {
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(batch),
    });
    if (res.ok) sent += batch.length;
  }

  return NextResponse.json({ sent, total: messages.length });
}
