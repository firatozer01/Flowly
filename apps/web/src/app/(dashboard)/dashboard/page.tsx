import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { StatsCards } from "@/components/dashboard/stats-card";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";

export default async function DashboardPage() {
  const { userId } = await auth();
  const subs = userId
    ? await db.select().from(subscriptions).where(eq(subscriptions.userId, userId))
    : [];

  const upcoming = subs.filter((s) => {
    const days = Math.ceil((new Date(s.nextBillingDate).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 7;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-white/40">Aboneliklerinize genel bakış</p>
      </div>

      <StatsCards subscriptions={subs} />

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Bu Hafta Yenileniyor
          </h2>
          <div className="space-y-3">
            {upcoming.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-base font-semibold mb-4 text-white">Tüm Abonelikler</h2>
        {subs.length === 0 ? (
          <div className="glass-card text-center py-12 text-white/30">
            Henüz abonelik eklenmedi. Abonelikler sayfasından ekleyebilirsiniz.
          </div>
        ) : (
          <div className="space-y-3">
            {subs.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
