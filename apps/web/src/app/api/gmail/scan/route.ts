import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getGmailTokens, createSubscription, getSubscriptionDomainsByUser } from "@/lib/db/queries";
import { scanGmailForSubscriptions } from "@/lib/gmail-scanner";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tokens = await getGmailTokens(userId);
  if (!tokens) {
    return NextResponse.json({ error: "Gmail bağlı değil" }, { status: 400 });
  }

  const [scanned, existingDomains] = await Promise.all([
    scanGmailForSubscriptions(tokens.accessToken, tokens.refreshToken),
    getSubscriptionDomainsByUser(userId),
  ]);

  const created = [];
  const skipped = [];

  for (const item of scanned) {
    // Fiyat 0 ise atla
    if (!item.amount || item.amount <= 0) {
      skipped.push({ name: item.name, reason: "no_price" });
      continue;
    }

    // Zaten eklenmiş domain ise atla
    if (item.domain && existingDomains.includes(item.domain)) {
      skipped.push({ name: item.name, reason: "duplicate" });
      continue;
    }

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

  return NextResponse.json({
    found: scanned.length,
    imported: created.length,
    skipped: skipped.length,
    items: created,
  });
}
