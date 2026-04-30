"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CreditCard, Mail, BarChart3, Bell, ShieldCheck, Smartphone } from "lucide-react";
import { Background } from "@/components/layout/background";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { LogoMark } from "@/components/ui/logo";

const MOCK_SUBS = [
  { name: "Netflix", color: "#E50914", amount: "₺199", days: 2 },
  { name: "Spotify", color: "#1DB954", amount: "₺59", days: 8 },
  { name: "Adobe CC", color: "#FF0000", amount: "₺599", days: 15 },
  { name: "YouTube", color: "#FF0000", amount: "₺79", days: 21 },
];

const FEATURES = [
  {
    icon: Mail,
    title: "Gmail ile Otomatik Keşif",
    desc: "Fatura e-postalarından aboneliklerinizi tek tıkla içe aktarın.",
    color: "#4f8ef7",
    gradient: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: CreditCard,
    title: "Akıllı Otomatik Doldurma",
    desc: "200+ popüler servisi tanır — logo, kategori ve fiyat otomatik gelir.",
    color: "#a78bfa",
    gradient: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: Bell,
    title: "Mobil Bildirimler",
    desc: "Yenileme 2 gün kalmadan bildirim alın. Tıklayıp 'Ödendi' deyin.",
    color: "#fb923c",
    gradient: "from-orange-500/20 to-orange-500/5",
  },
  {
    icon: BarChart3,
    title: "Harcama Analizi",
    desc: "Aylık trendinizi görün, hangi kategori ne kadar yiyor öğrenin.",
    color: "#22d3ee",
    gradient: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli & Gizli",
    desc: "Şifrenizi görmeyiz. Gmail'de yalnızca okuma izni isteriz.",
    color: "#34d399",
    gradient: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    icon: Smartphone,
    title: "iOS & Android",
    desc: "Web ve mobilde senkronize. Her yerden erişin.",
    color: "#f472b6",
    gradient: "from-pink-500/20 to-pink-500/5",
  },
];

function MockPhone() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      animate={{ opacity: 1, y: 0, rotateY: -8 }}
      transition={{ duration: 0.9, delay: 0.3 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className="relative w-[260px] mx-auto"
    >
      {/* Glow */}
      <div className="absolute -inset-8 bg-blue-500/20 blur-3xl rounded-full" />

      {/* Phone frame */}
      <div className="relative glass rounded-[2.5rem] border border-white/20 overflow-hidden shadow-2xl"
           style={{ boxShadow: "0 25px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)" }}>
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/60 rounded-full z-10" />

        {/* Screen content */}
        <div className="bg-[#080c14] p-4 pt-10 pb-6 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] text-white/40">Bu ay toplam</div>
              <div className="text-xl font-bold text-white">₺937<span className="text-xs text-white/40">.97</span></div>
            </div>
            <LogoMark size={28} />
          </div>

          {/* Mini stat pills */}
          <div className="flex gap-2 mb-2">
            <div className="flex-1 glass rounded-xl p-2 text-center">
              <div className="text-[9px] text-white/40">Aktif</div>
              <div className="text-sm font-bold text-blue-400">4</div>
            </div>
            <div className="flex-1 glass rounded-xl p-2 text-center">
              <div className="text-[9px] text-white/40">Bu hafta</div>
              <div className="text-sm font-bold text-orange-400">1</div>
            </div>
          </div>

          {/* Sub cards */}
          {MOCK_SUBS.map((sub, i) => (
            <motion.div
              key={sub.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass rounded-xl px-3 py-2 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-lg flex-shrink-0" style={{ background: sub.color + "30", border: `1px solid ${sub.color}50` }}>
                <div className="w-full h-full rounded-lg" style={{ background: `linear-gradient(135deg, ${sub.color}60, ${sub.color}20)` }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-white truncate">{sub.name}</div>
                <div className="text-[9px] text-white/40">{sub.days}g kaldı</div>
              </div>
              <div className="text-[11px] font-bold text-white/80">{sub.amount}</div>
            </motion.div>
          ))}

          {/* Notification preview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="rounded-xl p-3 mt-1"
            style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.3)" }}
          >
            <div className="flex items-center gap-2">
              <Bell size={12} className="text-orange-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-[10px] font-semibold text-orange-300">Netflix yenileniyor</div>
                <div className="text-[9px] text-orange-200/60">2 gün kaldı · ₺199.99</div>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <div className="flex-1 rounded-lg py-1 text-center text-[9px] font-medium text-white/60"
                   style={{ background: "rgba(255,255,255,0.08)" }}>
                Yoksay
              </div>
              <div className="flex-1 rounded-lg py-1 text-center text-[9px] font-medium text-green-300"
                   style={{ background: "rgba(52,211,153,0.2)" }}>
                Ödendi ✓
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Home indicator */}
      <div className="w-24 h-1 bg-white/20 rounded-full mx-auto mt-2" />
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <>
      <Background />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4">
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2.5 border border-white/10">
          <LogoMark size={28} />
          <span className="text-white font-bold text-lg tracking-tight">Flowly</span>
        </div>
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-3 border border-white/10">
          <Link href="/sign-in">
            <span className="text-white/60 hover:text-white text-sm transition-colors">Giriş Yap</span>
          </Link>
          <Link href="/sign-up">
            <GlassButton variant="primary" size="sm">Ücretsiz Başla</GlassButton>
          </Link>
        </div>
      </nav>

      <main className="min-h-screen pt-24 pb-20 px-4 overflow-x-hidden">

        {/* HERO */}
        <section className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 pt-12 pb-24">
          {/* Sol: metin */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 border border-white/10 text-sm text-white/60 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Tamamen ücretsiz · Web & iOS & Android
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6"
            >
              Aboneliklerini
              <br />
              <span className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #22d3ee 100%)" }}>
                kontrol et
              </span>
              ,<br />
              parasını geri kazan
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/50 mb-8 max-w-lg"
            >
              Gmail'ini bağla, aboneliklerini otomatik keşfet. Yenileme tarihleri
              yaklaşınca telefonuna bildirim gelsin — tek tıkla ödendi de.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <Link href="/sign-up">
                <GlassButton variant="primary" size="lg" className="w-full sm:w-auto">
                  Hemen Başla — Ücretsiz
                  <ArrowRight size={18} />
                </GlassButton>
              </Link>
              <Link href="/dashboard">
                <GlassButton variant="ghost" size="lg" className="w-full sm:w-auto">
                  Demo'yu Gör
                </GlassButton>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8 mt-10 justify-center lg:justify-start"
            >
              {[
                { value: "200+", label: "Servis tanınır" },
                { value: "%100", label: "Ücretsiz" },
                { value: "iOS & Android", label: "Mobil uygulama" },
              ].map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/40">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Sağ: mock telefon */}
          <div className="flex-shrink-0">
            <MockPhone />
          </div>
        </section>

        {/* FEATURES */}
        <section className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-3">Her şey yerli yerinde</h2>
            <p className="text-white/40">Karmaşık değil, sadece işe yarıyor.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <GlassCard className={`h-full bg-gradient-to-br ${f.gradient}`} hover>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: f.color + "25", color: f.color }}
                  >
                    <f.icon size={21} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center mt-24"
        >
          <div className="glass-card border border-white/10 py-12"
               style={{ background: "linear-gradient(135deg, rgba(79,142,247,0.12), rgba(167,139,250,0.08))" }}>
            <LogoMark size={48} className="mx-auto mb-5" />
            <h2 className="text-3xl font-bold text-white mb-3">
              Kontrolü geri al
            </h2>
            <p className="text-white/40 mb-7 max-w-sm mx-auto">
              Kullanmadığın abonelikler için para ödemeyi bırak.
            </p>
            <Link href="/sign-up">
              <GlassButton variant="primary" size="lg">
                Ücretsiz Hesap Oluştur
                <ArrowRight size={18} />
              </GlassButton>
            </Link>
          </div>
        </motion.section>
      </main>
    </>
  );
}
