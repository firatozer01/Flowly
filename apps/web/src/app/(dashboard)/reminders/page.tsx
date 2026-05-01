"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import type { Subscription } from "@/lib/db/schema";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";

export default function RemindersPage() {
  const [week, setWeek] = useState<Subscription[]>([]);
  const [month, setMonth] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    const [r7, r30] = await Promise.all([
      fetch("/api/reminders?days=7").then((r) => r.json()),
      fetch("/api/reminders?days=30").then((r) => r.json()),
    ]);
    setWeek(r7);
    setMonth(r30.filter((s: Subscription) => !r7.find((u: Subscription) => u.id === s.id)));
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Abonelik silindi");
      fetchAll();
    } else {
      toast.error("Silinemedi");
    }
  }

  if (loading) {
    return (
      <div className="space-y-3 max-w-2xl">
        {[...Array(3)].map((_, i) => <div key={i} className="glass-card animate-pulse h-20" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Hatırlatıcılar</h1>
        <p className="text-white/40">Yaklaşan yenileme tarihleri</p>
      </div>

      {week.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Bell size={14} />
            Bu Hafta ({week.length})
          </h2>
          <div className="space-y-3">
            {week.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {month.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Bell size={14} />
            Bu Ay ({month.length})
          </h2>
          <div className="space-y-3">
            {month.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {week.length === 0 && month.length === 0 && (
        <div className="glass-card text-center py-12 text-white/30">
          Önümüzdeki 30 günde yenileme yok.
        </div>
      )}
    </div>
  );
}
