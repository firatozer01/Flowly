import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getGmailTokens, createSubscription } from "@/lib/db/queries";
import { scanGmailForSubscriptions } from "@/lib/gmail-scanner";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tokens = await getGmailTokens(userId);
  if (!tokens) {
    return NextResponse.json({ error: "Gmail bağlı değil" }, { status: 400 });
  }

  const scanned = await scanGmailForSubscriptions(
    tokens.accessToken,
    tokens.refreshToken
  );

  const created = [];
  for (const item of scanned) {
    try {
      const sub = await createSubscription({
        userId,
        name: item.name,
        serviceId: item.serviceId,
        domain: item.domain,
        category: item.category ?? "Diğer",
        color: item.color ?? "#6366f1",
        amount: item.amount.toString(),
        currency: item.currency,
        billingCycle: "monthly",
        nextBillingDate: item.billingDate,
        gmailMessageId: item.gmailMessageId,
        isActive: true,
      });
      created.push(sub);
    } catch {
      continue;
    }
  }

  return NextResponse.json({ found: scanned.length, imported: created.length, items: scanned });
}
