import { GlassCard } from "@/components/ui/glass-card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Ayarlar</h1>
        <p className="text-white/40">Hesap ve uygulama ayarları</p>
      </div>
      <GlassCard className="text-center py-12">
        <Settings size={32} className="text-white/20 mx-auto mb-3" />
        <p className="text-white/30">Ayarlar yakında eklenecek</p>
      </GlassCard>
    </div>
  );
}
