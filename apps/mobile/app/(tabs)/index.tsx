import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { usePushNotifications } from "@/hooks/usePushNotifications";
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
  isActive: boolean;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [subs, setSubs] = useState<Sub[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleNotificationTap = useCallback(
    (subscriptionId: string) => {
      router.push(`/subscription/${subscriptionId}`);
    },
    [router]
  );

  usePushNotifications(handleNotificationTap);

  async function load() {
    try {
      const data = await api.subscriptions.list();
      setSubs(data);
    } catch {}
  }

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const active = subs.filter((s) => s.isActive);
  const monthlyTotal = active.reduce((sum, s) => {
    const a = Number(s.amount);
    if (s.billingCycle === "monthly") return sum + a;
    if (s.billingCycle === "yearly") return sum + a / 12;
    if (s.billingCycle === "weekly") return sum + a * 4.33;
    return sum;
  }, 0);

  const upcoming = active.filter((s) => {
    const d = Math.ceil((new Date(s.nextBillingDate).getTime() - Date.now()) / 86400000);
    return d >= 0 && d <= 7;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#080c14" }} edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f8ef7" />}
      >
        {/* Hero kart */}
        <LinearGradient
          colors={["rgba(79,142,247,0.25)", "rgba(167,139,250,0.15)", "rgba(34,211,238,0.08)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24, marginBottom: 20 }}
        >
          <BlurView
            intensity={20}
            tint="dark"
            style={{
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.12)",
              overflow: "hidden",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 4 }}>
              Bu ay toplam harcama
            </Text>
            <Text style={{ color: "#fff", fontSize: 40, fontWeight: "800", letterSpacing: -1 }}>
              {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(monthlyTotal)}
            </Text>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
              {[
                { label: "Aktif Abonelik", value: active.length, color: "#4f8ef7" },
                { label: "Bu Hafta", value: upcoming.length, color: upcoming.length > 0 ? "#fb923c" : "#22d3ee" },
              ].map((stat) => (
                <BlurView
                  key={stat.label}
                  intensity={15}
                  tint="dark"
                  style={{
                    flex: 1,
                    borderRadius: 16,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <Text style={{ color: stat.color, fontSize: 24, fontWeight: "700" }}>
                    {stat.value}
                  </Text>
                  <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                    {stat.label}
                  </Text>
                </BlurView>
              ))}
            </View>
          </BlurView>
        </LinearGradient>

        {/* Yaklaşan yenilemeler */}
        {upcoming.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Bell size={15} color="#fb923c" />
              <Text style={{ color: "#fb923c", fontWeight: "700", fontSize: 13, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Bu Hafta Yenileniyor
              </Text>
            </View>
            {upcoming.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                sub={sub}
                onPress={() => router.push(`/subscription/${sub.id}`)}
              />
            ))}
          </View>
        )}

        {/* Tüm abonelikler */}
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
          Tüm Abonelikler
        </Text>
        {active.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              Henüz abonelik yok
            </Text>
          </View>
        ) : (
          active.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              sub={sub}
              onPress={() => router.push(`/subscription/${sub.id}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
