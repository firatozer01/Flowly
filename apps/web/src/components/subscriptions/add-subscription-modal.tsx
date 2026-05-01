"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check } from "lucide-react";
import { searchServices, type ServiceTemplate } from "@flowly/subscriptions-db";
import { GlassInput } from "@/components/ui/glass-input";
import { GlassButton } from "@/components/ui/glass-button";
import { ServiceLogo } from "@/components/ui/service-logo";

interface AddSubscriptionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: SubscriptionFormData) => Promise<void>;
}

export interface SubscriptionFormData {
  name: string;
  serviceId?: string;
  domain?: string;
  category: string;
  color: string;
  amount: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: string;
  notes?: string;
}

export function AddSubscriptionModal({ open, onClose, onAdd }: AddSubscriptionModalProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ServiceTemplate[]>([]);
  const [selected, setSelected] = useState<ServiceTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<SubscriptionFormData>({
    name: "",
    category: "Diğer",
    color: "#6366f1",
    amount: 0,
    currency: "TRY",
    billingCycle: "monthly",
    nextBillingDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (query.length >= 2) {
      const results = searchServices(query);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  function selectService(service: ServiceTemplate) {
    setSelected(service);
    setSuggestions([]);
    setQuery(service.name);
    setForm((prev) => ({
      ...prev,
      name: service.name,
      serviceId: service.id,
      domain: service.domain,
      category: service.category,
      color: service.color,
      amount: service.typical_price_try,
      currency: "TRY",
      billingCycle: service.billing_cycle,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd({ ...form, name: selected ? form.name : query || form.name });
      onClose();
      setQuery("");
      setSelected(null);
      setForm({
        name: "",
        category: "Diğer",
        color: "#6366f1",
        amount: 0,
        currency: "TRY",
        billingCycle: "monthly",
        nextBillingDate: new Date().toISOString().split("T")[0],
      });
    } catch {
      // error already shown via toast in handleAdd
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="glass rounded-2xl p-6 border border-white/15">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Abonelik Ekle</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Servis arama */}
                <div className="relative">
                  <GlassInput
                    label="Servis Adı"
                    placeholder="Netflix, Spotify, Adobe..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelected(null);
                      setForm((prev) => ({ ...prev, name: e.target.value }));
                    }}
                    icon={<Search size={16} />}
                  />

                  {/* Öneri dropdown */}
                  <AnimatePresence>
                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-white/10 overflow-hidden z-10 shadow-xl" style={{ background: "rgba(20,20,35,0.97)" }}
                      >
                        {suggestions.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => selectService(s)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/8 transition-colors text-left"
                          >
                            <ServiceLogo
                              domain={s.domain}
                              name={s.name}
                              color={s.color}
                              size={32}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-medium leading-tight">{s.name}</div>
                              <div className="text-white/40 text-xs leading-tight">{s.category}</div>
                            </div>
                            <div className="text-xs text-white/50 flex-shrink-0">
                              ≈ {s.typical_price_try.toFixed(0)} ₺
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Seçilen servis göstergesi */}
                {selected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20"
                  >
                    <Check size={14} className="text-green-400" />
                    <span className="text-green-300 text-xs">
                      {selected.name} otomatik dolduruldu
                    </span>
                  </motion.div>
                )}

                {/* Tutar + Para birimi */}
                <div className="grid grid-cols-2 gap-3">
                  <GlassInput
                    label="Tutar"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount || ""}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))
                    }
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                      Para Birimi
                    </label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm((prev) => ({ ...prev, currency: e.target.value }))}
                      className="glass rounded-xl px-4 py-3 text-sm text-white border border-white/10 focus:border-blue-400/40 focus:outline-none bg-transparent"
                    >
                      <option value="TRY" className="bg-gray-900">TRY ₺</option>
                      <option value="USD" className="bg-gray-900">USD $</option>
                      <option value="EUR" className="bg-gray-900">EUR €</option>
                    </select>
                  </div>
                </div>

                {/* Döngü + Tarih */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                      Ödeme Döngüsü
                    </label>
                    <select
                      value={form.billingCycle}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, billingCycle: e.target.value }))
                      }
                      className="glass rounded-xl px-4 py-3 text-sm text-white border border-white/10 focus:border-blue-400/40 focus:outline-none bg-transparent"
                    >
                      <option value="monthly" className="bg-gray-900">Aylık</option>
                      <option value="yearly" className="bg-gray-900">Yıllık</option>
                      <option value="weekly" className="bg-gray-900">Haftalık</option>
                    </select>
                  </div>
                  <GlassInput
                    label="Sonraki Ödeme"
                    type="date"
                    value={form.nextBillingDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, nextBillingDate: e.target.value }))
                    }
                    required
                  />
                </div>

                {/* Notlar */}
                <GlassInput
                  label="Not (isteğe bağlı)"
                  placeholder="Aile planı, iş hesabı..."
                  value={form.notes || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                />

                {/* Butonlar */}
                <div className="flex gap-3 pt-2">
                  <GlassButton
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={onClose}
                  >
                    İptal
                  </GlassButton>
                  <GlassButton
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    loading={loading}
                  >
                    Ekle
                  </GlassButton>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
