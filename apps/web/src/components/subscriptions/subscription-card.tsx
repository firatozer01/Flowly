"use client";

import { motion } from "framer-motion";
import { Calendar, Trash2 } from "lucide-react";
import type { Subscription } from "@/lib/db/schema";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ServiceLogo } from "@/components/ui/service-logo";

interface SubscriptionCardProps {
  subscription: Subscription;
  onDelete?: (id: string) => void;
}

export function SubscriptionCard({ subscription, onDelete }: SubscriptionCardProps) {
  const days = daysUntil(subscription.nextBillingDate);
  const isUrgent = days <= 3;
  const isSoon = days <= 7;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="glass-card glass-shimmer group relative"
    >
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full" style={{ backgroundColor: subscription.color }} />

      <div className="flex items-center gap-4 pl-3">
        <div className="w-12 h-12 rounded-xl glass flex-shrink-0 flex items-center justify-center overflow-hidden">
          {subscription.domain ? (
            <ServiceLogo domain={subscription.domain} name={subscription.name} color={subscription.color} size={36} />
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: subscription.color }}>
              {subscription.name[0]}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold truncate">{subscription.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full border flex-shrink-0" style={{ backgroundColor: subscription.color + "20", borderColor: subscription.color + "40", color: subscription.color }}>
              {subscription.category}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-white/40">
            <Calendar size={12} />
            <span>{formatDate(subscription.nextBillingDate)}</span>
            <span className={cn("ml-1 font-medium", isUrgent ? "text-red-400" : isSoon ? "text-amber-400" : "text-white/40")}>
              {days === 0 ? "Bugün!" : days < 0 ? `${Math.abs(days)} gün geçti` : `${days} gün kaldı`}
            </span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-white font-bold text-lg">{formatCurrency(Number(subscription.amount), subscription.currency)}</div>
          <div className="text-xs text-white/40">
            {subscription.billingCycle === "monthly" ? "aylık" : subscription.billingCycle === "yearly" ? "yıllık" : "haftalık"}
          </div>
        </div>

        {onDelete && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400"
            onClick={() => onDelete(subscription.id)}
          >
            <Trash2 size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
