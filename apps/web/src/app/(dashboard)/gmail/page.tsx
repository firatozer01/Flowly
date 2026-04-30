"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Scan, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { getLogoUrl, formatCurrency } from "@/lib/utils";

interface ScannedItem {
  name: string;
  amount: number;
  currency: string;
  domain?: string;
  category?: string;
  color?: string;
}

export default function GmailPage() {
  const [connecting, setConnecting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState<ScannedItem[]>([]);
  const [imported, setImported] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true") {
      setConnected(true);
      toast.success("Gmail başarıyla bağlandı!");
      window.history.replaceState({}, "", "/gmail");
    }
  }, []);

  async function handleConnect() {
    setConnecting(true);
    try {
      const res = await fetch("/api/gmail/connect");
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      toast.error("Gmail bağlantısı başlatılamadı");
      setConnecting(false);
    }
  }

  async function handleScan() {
    setScanning(true);
    setScanned([]);
    try {
      const res = await fetch("/api/gmail/scan", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        if (data.error === "Gmail bağlı değil") {
          toast.error("Önce Gmail'i bağlayın");
        } else {
          toast.error("Tarama başarısız");
        }
        return;
      }
      setScanned(data.items || []);
      setImported(true);
      if (data.imported > 0) {
        toast.success(`${data.imported} abonelik içe aktarıldı`);
      } else if (data.found === 0) {
        toast.info("Fatura e-postası bulunamadı");
      }
    } catch {
      toast.error("Bir hata oluştu");
    } finally {
      setScanning(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Gmail Tarama</h1>
        <p className="text-white/40">
          Fatura e-postalarından aboneliklerinizi otomatik keşfedin
        </p>
      </div>

      {/* Bağlantı kartı */}
      <GlassCard>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Mail size={22} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Gmail Hesabı Bağla</h3>
            <p className="text-white/40 text-sm mb-4">
              Flowly yalnızca okuma izni ister. Şifrenizi görmez, e-posta içeriklerinizi
              saklamaz — sadece fatura bilgilerini tarar.
            </p>
            <div className="flex gap-3">
              <GlassButton
                variant="primary"
                onClick={handleConnect}
                loading={connecting}
              >
                <ExternalLink size={16} />
                {connected ? "Yeniden Bağla" : "Google ile Bağla"}
              </GlassButton>
              {connected && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} />
                  Bağlandı
                </div>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Tarama */}
      <GlassCard>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Scan size={22} className="text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Abonelik Tara</h3>
            <p className="text-white/40 text-sm mb-4">
              Son 90 günün fatura e-postalarını tarar. Bulunan abonelikler otomatik
              eklenir, siz onaylarsınız.
            </p>
            <GlassButton
              variant="primary"
              onClick={handleScan}
              loading={scanning}
            >
              <Scan size={16} />
              {scanning ? "Taranıyor..." : "Taramayı Başlat"}
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Sonuçlar */}
      {scanned.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-400" />
            {scanned.length} abonelik bulundu ve içe aktarıldı
          </h2>
          <div className="space-y-2">
            {scanned.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card flex items-center gap-3"
              >
                {item.domain && (
                  <div className="w-9 h-9 rounded-lg overflow-hidden glass flex items-center justify-center flex-shrink-0">
                    <Image
                      src={getLogoUrl(item.domain)}
                      alt={item.name}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{item.name}</div>
                  <div className="text-white/40 text-xs">{item.category}</div>
                </div>
                <div className="text-white font-semibold text-sm">
                  {formatCurrency(item.amount, item.currency)}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {imported && scanned.length === 0 && (
        <GlassCard className="text-center py-8">
          <AlertCircle size={32} className="text-white/30 mx-auto mb-3" />
          <p className="text-white/40">
            Fatura e-postası bulunamadı. Gmail'de farklı bir hesap deneyin veya
            abonelikleri manuel ekleyin.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
