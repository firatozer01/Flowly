import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Bell, CheckCircle, Clock } from "lucide-react-native";
import { SubscriptionCard } from "@/components/SubscriptionCard";
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

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export default function RemindersScreen() {
  const router = useRouter();
  const [subs, setSubs] = useState<Sub[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const data = await api.subscriptions.list();
      setSubs(data.filter((s: Sub) => s.isActive));
    } catch {}
  }

  useEffect(() => { load(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const thisWeek = subs.filter((s) => {
    const d = daysUntil(s.nextBillingDate);
    return d >= 0 && d <= 7;
  });

  const thisMonth = subs.filter((s) => {
    const d = daysUntil(s.nextBillingDate);
    return d > 7 && d <= 30;
  });

  const overdue = subs.filter((s) => daysUntil(s.nextBillingDate) < 0);

  type Section = { label: string; color: string; icon: React.ReactNode; items: Sub[] };

  const sections: Section[] = [
    {
      label: "Geçmiş",
      color: "#f87171",
      icon: <Clock size={14} color="#f87171" />,
      items: overdue,
    },
    {
      label: "Bu Hafta",
      color: "#fb923c",
      icon: <Bell size={14} color="#fb923c" />,
      items: thisWeek,
    },
    {
      label: "Bu Ay",
      color: "#4f8ef7",
      icon: <CheckCircle size={14} color="#4f8ef7" />,
      items: thisMonth,
    },
  ].filter((s) => s.items.length > 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#080c14" }} edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f8ef7" />
        }
      >
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 4 }}>
          Hatırlatıcılar
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>
          Yaklaşan yenileme tarihleri
        </Text>

        {sections.length === 0 ? (
          <BlurView
            intensity={15}
            tint="dark"
            style={{
              borderRadius: 20,
              padding: 40,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}
          >
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🎉</Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, fontWeight: "600" }}>
              Yaklaşan yenileme yok
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, marginTop: 6, textAlign: "center" }}>
              Önümüzdeki 30 günde{"\n"}ödeme tarihi yok
            </Text>
          </BlurView>
        ) : (
          sections.map((section) => (
            <View key={section.label} style={{ marginBottom: 28 }}>
              {/* Section header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 12,
                }}
              >
                {section.icon}
                <Text
                  style={{
                    color: section.color,
                    fontWeight: "700",
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  {section.label} ({section.items.length})
                </Text>
              </View>

              {section.items.map((sub) => (
                <SubscriptionCard
                  key={sub.id}
                  sub={sub}
                  onPress={() => router.push(`/subscription/${sub.id}`)}
                />
              ))}
            </View>
          ))
        )}

        {/* Bildirim kutusu */}
        <BlurView
          intensity={15}
          tint="dark"
          style={{
            borderRadius: 20,
            padding: 18,
            marginTop: 8,
            borderWidth: 1,
            borderColor: "rgba(79,142,247,0.2)",
            overflow: "hidden",
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "rgba(79,142,247,0.2)",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Bell size={18} color="#4f8ef7" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14, marginBottom: 4 }}>
              Otomatik Bildirimler Açık
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 19 }}>
              Yenileme tarihinden 3 gün önce telefonuna otomatik bildirim gelir.
              Bildirimdeki "Ödendi" butonuyla hızlıca işaretleyebilirsin.
            </Text>
          </View>
        </BlurView>
      </ScrollView>
    </SafeAreaView>
  );
}
