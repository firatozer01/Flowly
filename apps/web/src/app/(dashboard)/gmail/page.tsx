"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Scan, CheckCircle, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
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
  const [connected, setConnected] = useState<boolean | null>(null); // null = yükleniyor

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true") {
      setConnected(true);
      toast.success("Gmail başarıyla bağlandı!");
      window.history.replaceState({}, "", "/gmail");
      return;
    }
    if (params.get("error")) {
      toast.error("Gmail bağlantısı başarısız, tekrar deneyin");
      window.history.replaceState({}, "", "/gmail");
    }
    fetch("/api/gmail/status")
      .then((r) => r.json())
      .then((d) => setConnected(!!d.connected))
      .catch(() => setConnected(false));
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
        toast.error("Tarama başarısız");
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
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${connected ? "bg-green-500/20" : "bg-red-500/20"}`}>
            {connected === null ? (
              <Loader2 size={22} className="text-white/40 animate-spin" />
            ) : connected ? (
              <CheckCircle size={22} className="text-green-400" />
            ) : (
              <Mail size={22} className="text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">
              {connected ? "Gmail Bağlandı" : "Gmail Hesabı Bağla"}
            </h3>
            <p className="text-white/40 text-sm mb-4">
              {connected
                ? "Gmail hesabınız bağlı. Abonelikleri taramaya başlayabilirsiniz."
                : "Flowly yalnızca okuma izni ister. Şifrenizi görmez, e-posta içeriklerinizi saklamaz — sadece fatura bilgilerini tarar."}
            </p>
            <GlassButton
              variant={connected ? "ghost" : "primary"}
              onClick={handleConnect}
              loading={connecting}
            >
              <ExternalLink size={16} />
              {connected ? "Farklı Hesapla Bağla" : "Google ile Bağla"}
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Tarama kartı */}
      <GlassCard>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${connected ? "bg-purple-500/20" : "bg-white/5"}`}>
            <Scan size={22} className={connected ? "text-purple-400" : "text-white/20"} />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${connected ? "text-white" : "text-white/40"}`}>
              Abonelik Tara
            </h3>
            <p className="text-white/40 text-sm mb-4">
              Son 90 günün fatura e-postalarını tarar. Bulunan abonelikler otomatik eklenir.
            </p>
            {connected === false ? (
              <div className="flex items-center gap-2 text-amber-400/80 text-sm bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                <AlertCircle size={15} />
                Taramak için önce Gmail hesabınızı bağlayın
              </div>
            ) : (
              <GlassButton
                variant="primary"
                onClick={handleScan}
                loading={scanning}
                disabled={!connected}
              >
                <Scan size={16} />
                {scanning ? "Taranıyor..." : "Taramayı Başlat"}
              </GlassButton>
            )}
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
                  <Image
                    src={getLogoUrl(item.domain)}
                    alt={item.name}
                    width={32}
                    height={32}
                    className="rounded-lg object-contain flex-shrink-0"
                  />
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
            Fatura e-postası bulunamadı. Gmail&apos;de farklı bir hesap deneyin veya
            abonelikleri manuel ekleyin.
          </p>
        </GlassCard>
      )}
    </div>
  );
}
