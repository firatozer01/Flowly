import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle, Calendar, RefreshCw, Tag } from "lucide-react-native";
import { api } from "@/lib/api";

interface Sub {
  id: string;
  name: string;
  domain?: string | null;
  color: string;
  amount: string;
  currency: string;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    .format(new Date(dateStr));
}

function formatAmount(amount: string, currency: string) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency }).format(Number(amount));
}

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [sub, setSub] = useState<Sub | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    api.subscriptions.list().then((list: Sub[]) => {
      const found = list.find((s) => s.id === id);
      if (found) setSub(found);
    });
  }, [id]);

  async function handleMarkPaid() {
    if (!sub) return;
    Alert.alert(
      "Ödendi mi?",
      `${sub.name} için ${formatAmount(sub.amount, sub.currency)} ödemesini onaylıyor musun?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet, Ödendi",
          style: "default",
          onPress: async () => {
            setPaying(true);
            try {
              const result = await api.subscriptions.pay(sub.id);
              setPaid(true);
              setSub((prev) =>
                prev ? { ...prev, nextBillingDate: result.nextBillingDate } : prev
              );
            } catch {
              Alert.alert("Hata", "İşlem başarısız. Tekrar dene.");
            } finally {
              setPaying(false);
            }
          },
        },
      ]
    );
  }

  if (!sub) {
    return (
      <View style={{ flex: 1, backgroundColor: "#080c14", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#4f8ef7" size="large" />
      </View>
    );
  }

  const days = daysUntil(sub.nextBillingDate);
  const urgent = days <= 3 && days >= 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#080c14" }} edges={["bottom"]}>
      <View style={{ flex: 1, padding: 20 }}>

        {/* Hero */}
        <LinearGradient
          colors={[sub.color + "30", sub.color + "08", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 28, marginBottom: 20 }}
        >
          <BlurView
            intensity={20}
            tint="dark"
            style={{
              borderRadius: 28,
              padding: 28,
              alignItems: "center",
              borderWidth: 1,
              borderColor: sub.color + "30",
              overflow: "hidden",
            }}
          >
            {/* Logo */}
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 22,
                backgroundColor: sub.color + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                borderWidth: 1,
                borderColor: sub.color + "40",
              }}
            >
              {sub.domain ? (
                <Image
                  source={{ uri: `https://logo.clearbit.com/${sub.domain}` }}
                  style={{ width: 56, height: 56 }}
                  resizeMode="contain"
                />
              ) : (
                <Text style={{ color: "#fff", fontSize: 32, fontWeight: "700" }}>
                  {sub.name[0]}
                </Text>
              )}
            </View>

            <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800", marginBottom: 4 }}>
              {sub.name}
            </Text>
            <Text style={{ color: sub.color, fontSize: 15, fontWeight: "600", marginBottom: 20 }}>
              {sub.category}
            </Text>

            <Text style={{ color: "#fff", fontSize: 42, fontWeight: "900", letterSpacing: -1 }}>
              {formatAmount(sub.amount, sub.currency)}
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 4 }}>
              {sub.billingCycle === "monthly" ? "aylık" : sub.billingCycle === "yearly" ? "yıllık" : "haftalık"}
            </Text>
          </BlurView>
        </LinearGradient>

        {/* Detaylar */}
        <BlurView
          intensity={15}
          tint="dark"
          style={{
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          {[
            {
              icon: <Calendar size={16} color="rgba(255,255,255,0.5)" />,
              label: "Sonraki Ödeme",
              value: formatDate(sub.nextBillingDate),
              valueColor: urgent ? "#f87171" : "#fff",
            },
            {
              icon: <RefreshCw size={16} color="rgba(255,255,255,0.5)" />,
              label: "Döngü",
              value: sub.billingCycle === "monthly" ? "Aylık" : sub.billingCycle === "yearly" ? "Yıllık" : "Haftalık",
              valueColor: "#fff",
            },
            {
              icon: <Tag size={16} color="rgba(255,255,255,0.5)" />,
              label: "Kalan Gün",
              value: days < 0 ? "Geçti" : days === 0 ? "Bugün!" : `${days} gün`,
              valueColor: urgent ? "#f87171" : days <= 7 ? "#fb923c" : "#fff",
            },
          ].map((row, i, arr) => (
            <View
              key={row.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 16,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                borderBottomColor: "rgba(255,255,255,0.06)",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                {row.icon}
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{row.label}</Text>
              </View>
              <Text style={{ color: row.valueColor, fontSize: 14, fontWeight: "600" }}>
                {row.value}
              </Text>
            </View>
          ))}
        </BlurView>

        {/* Ödendi butonu */}
        {paid ? (
          <View
            style={{
              borderRadius: 18,
              padding: 20,
              alignItems: "center",
              backgroundColor: "rgba(52,211,153,0.15)",
              borderWidth: 1,
              borderColor: "rgba(52,211,153,0.3)",
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <CheckCircle size={22} color="#34d399" />
            <Text style={{ color: "#34d399", fontSize: 16, fontWeight: "700" }}>
              Ödeme kaydedildi!
            </Text>
          </View>
        ) : (
          <TouchableOpacity onPress={handleMarkPaid} disabled={paying} activeOpacity={0.85}>
            <LinearGradient
              colors={["#22c55e", "#16a34a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 18,
                padding: 20,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 10,
                opacity: paying ? 0.6 : 1,
              }}
            >
              {paying ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <CheckCircle size={22} color="#fff" />
              )}
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>
                {paying ? "Kaydediliyor..." : "Ödendi ✓"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center", marginTop: 12 }}>
          Ödendi dedikten sonra sonraki tarih otomatik güncellenir
        </Text>
      </View>
    </SafeAreaView>
  );
}
