import { db } from "./index";
import { subscriptions, gmailTokens } from "./schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import type { NewSubscription } from "./schema";

export async function getSubscriptionsByUser(userId: string) {
  return db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.isActive, true)))
    .orderBy(desc(subscriptions.nextBillingDate));
}

export async function getSubscriptionDomainsByUser(userId: string): Promise<string[]> {
  const rows = await db
    .select({ domain: subscriptions.domain })
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.isActive, true)));
  return rows.map((r) => r.domain).filter(Boolean) as string[];
}

export async function createSubscription(data: NewSubscription) {
  const [created] = await db.insert(subscriptions).values(data).returning();
  return created;
}

export async function updateSubscription(
  id: string,
  userId: string,
  data: Partial<NewSubscription>
) {
  const [updated] = await db
    .update(subscriptions)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
    .returning();
  return updated;
}

export async function deleteSubscription(id: string, userId: string) {
  await db
    .update(subscriptions)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)));
}

export async function getUpcomingRenewals(userId: string, days = 7) {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);
  return db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.isActive, true),
        gte(subscriptions.nextBillingDate, now),
        lte(subscriptions.nextBillingDate, future),
      )
    )
    .orderBy(subscriptions.nextBillingDate);
}

export async function saveGmailTokens(
  userId: string,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: Date | null
) {
  await db
    .insert(gmailTokens)
    .values({ userId, accessToken, refreshToken, expiresAt })
    .onConflictDoUpdate({
      target: gmailTokens.userId,
      set: { accessToken, refreshToken, expiresAt },
    });
}

export async function getGmailTokens(userId: string) {
  const [tokens] = await db
    .select()
    .from(gmailTokens)
    .where(eq(gmailTokens.userId, userId));
  return tokens;
}
