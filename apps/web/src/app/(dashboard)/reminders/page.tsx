import { auth } from "@clerk/nextjs/server";
import { getUpcomingRenewals } from "@/lib/db/queries";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { Bell } from "lucide-react";

export default async function RemindersPage() {
  const { userId } = await auth();
  const upcoming7 = await getUpcomingRenewals(userId!, 7);
  const upcoming30 = await getUpcomingRenewals(userId!, 30);
  const next30 = upcoming30.filter(
    (s) => !upcoming7.find((u) => u.id === s.id)
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Hatırlatıcılar</h1>
        <p className="text-white/40">Yaklaşan yenileme tarihleri</p>
      </div>

      {upcoming7.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Bell size={14} />
            Bu Hafta ({upcoming7.length})
          </h2>
          <div className="space-y-3">
            {upcoming7.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        </div>
      )}

      {next30.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Bell size={14} />
            Bu Ay ({next30.length})
          </h2>
          <div className="space-y-3">
            {next30.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        </div>
      )}

      {upcoming30.length === 0 && (
        <div className="glass-card text-center py-12 text-white/30">
          Önümüzdeki 30 günde yenileme yok.
        </div>
      )}
    </div>
  );
}
