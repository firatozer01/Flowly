"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Subscription } from "@/lib/db/schema";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import { AddSubscriptionModal, type SubscriptionFormData } from "@/components/subscriptions/add-subscription-modal";
import { GlassButton } from "@/components/ui/glass-button";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  async function fetchSubscriptions() {
    const res = await fetch("/api/subscriptions");
    const data = await res.json();
    setSubscriptions(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function handleAdd(data: SubscriptionFormData) {
    const res = await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("Abonelik eklendi");
      fetchSubscriptions();
    } else {
      toast.error("Bir hata oluştu");
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Abonelik silindi");
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Abonelikler</h1>
          <p className="text-white/40">{subscriptions.length} aktif abonelik</p>
        </div>
        <GlassButton variant="primary" onClick={() => setModalOpen(true)}>
          <Plus size={18} />
          Abonelik Ekle
        </GlassButton>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card animate-pulse h-20" />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card text-center py-16"
        >
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-white font-semibold mb-2">Henüz abonelik yok</h3>
          <p className="text-white/40 text-sm mb-6">
            "Abonelik Ekle" ile başlayın veya Gmail'inizi bağlayın
          </p>
          <GlassButton variant="primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            İlk Aboneliği Ekle
          </GlassButton>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} onDelete={handleDelete} />
            ))}
          </div>
        </AnimatePresence>
      )}

      <AddSubscriptionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
