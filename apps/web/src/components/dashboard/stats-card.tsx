"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { formatCurrency } from "@/lib/utils";
import type { Subscription } from "@/lib/db/schema";

export function StatsCards({ subscriptions }: { subscriptions: Subscription[] }) {
  const active = subscriptions.filter((s) => s.isActive);

  const monthlyTotal = active.reduce((sum, s) => {
    const a = Number(s.amount);
    if (s.billingCycle === "monthly") return sum + a;
    if (s.billingCycle === "yearly")  return sum + a / 12;
    if (s.billingCycle === "weekly")  return sum + a * 4.33;
    return sum;
  }, 0);

  const upcoming = active.filter((s) => {
    const d = Math.ceil((new Date(s.nextBillingDate).getTime() - Date.now()) / 86400000);
    return d >= 0 && d <= 7;
  });

  const stats = [
    { label: "Aylık Toplam",      value: formatCurrency(monthlyTotal),          sub: `Yıllık: ${formatCurrency(monthlyTotal * 12)}`, color: "#4f8ef7" },
    { label: "Aktif Abonelik",    value: active.length.toString(),               sub: "Servis",                                       color: "#a78bfa" },
    { label: "Bu Hafta Yenilenen",value: upcoming.length.toString(),             sub: upcoming.length > 0 ? "Dikkat" : "Yok",         color: upcoming.length > 0 ? "#fb923c" : "#22d3ee" },
    { label: "Bu Ay Harcama",     value: formatCurrency(active.filter((s) => { const d = new Date(s.nextBillingDate); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).reduce((sum, s) => sum + Number(s.amount), 0)), sub: "Fatura kesilenler", color: "#34d399" },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
          <GlassCard className="relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ backgroundColor: stat.color }} />
            <div className="text-xs text-white/40 font-medium uppercase tracking-wider mb-2">{stat.label}</div>
            <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs text-white/40">{stat.sub}</div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
