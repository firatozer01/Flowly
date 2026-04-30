import { StatsCards } from "@/components/dashboard/stats-card";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import type { Subscription } from "@/lib/db/schema";

const PREVIEW_SUBS: Subscription[] = [
  { id: "1", userId: "preview", name: "Netflix", serviceId: "netflix", domain: "netflix.com", category: "Eğlence", color: "#E50914", amount: "199.99", currency: "TRY", billingCycle: "monthly", nextBillingDate: new Date(Date.now() + 2 * 86400000), startDate: new Date(), isActive: true, notes: null, gmailMessageId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "2", userId: "preview", name: "Spotify", serviceId: "spotify", domain: "spotify.com", category: "Müzik", color: "#1DB954", amount: "59.99", currency: "TRY", billingCycle: "monthly", nextBillingDate: new Date(Date.now() + 12 * 86400000), startDate: new Date(), isActive: true, notes: null, gmailMessageId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "3", userId: "preview", name: "Adobe Creative Cloud", serviceId: "adobe-cc", domain: "adobe.com", category: "Yazılım", color: "#FF0000", amount: "599.99", currency: "TRY", billingCycle: "monthly", nextBillingDate: new Date(Date.now() + 20 * 86400000), startDate: new Date(), isActive: true, notes: null, gmailMessageId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "4", userId: "preview", name: "YouTube Premium", serviceId: "youtube-premium", domain: "youtube.com", category: "Eğlence", color: "#FF0000", amount: "79.99", currency: "TRY", billingCycle: "monthly", nextBillingDate: new Date(Date.now() + 5 * 86400000), startDate: new Date(), isActive: true, notes: null, gmailMessageId: null, createdAt: new Date(), updatedAt: new Date() },
  { id: "5", userId: "preview", name: "Microsoft 365", serviceId: "microsoft-365", domain: "microsoft.com", category: "Üretkenlik", color: "#D83B01", amount: "179.99", currency: "TRY", billingCycle: "monthly", nextBillingDate: new Date(Date.now() + 25 * 86400000), startDate: new Date(), isActive: true, notes: null, gmailMessageId: null, createdAt: new Date(), updatedAt: new Date() },
];

export default async function DashboardPage() {
  const subscriptions = PREVIEW_SUBS;
  const upcoming = PREVIEW_SUBS.filter((s) => {
    const days = Math.ceil((new Date(s.nextBillingDate).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 7;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: "#0f172a" }}>Dashboard</h1>
        <p style={{ color: "rgba(15,23,42,0.45)" }}>Aboneliklerinize genel bakış</p>
      </div>

      <StatsCards subscriptions={subscriptions} />

      {upcoming.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: "#0f172a" }}>
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
        <h2 className="text-base font-semibold mb-4" style={{ color: "#0f172a" }}>Tüm Abonelikler</h2>
        {subscriptions.length === 0 ? (
          <div className="glass-card text-center py-12" style={{ color: "rgba(15,23,42,0.30)" }}>
            Henüz abonelik eklenmedi.
          </div>
        ) : (
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
