import { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
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

export default function SubscriptionsScreen() {
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

  async function handleDelete(id: string, name: string) {
    Alert.alert(
      "Aboneliği Sil",
      `${name} aboneliğini silmek istediğine emin misin?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await api.subscriptions.delete(id);
              setSubs((prev) => prev.filter((s) => s.id !== id));
            } catch {
              Alert.alert("Hata", "Silme işlemi başarısız.");
            }
          },
        },
      ]
    );
  }

  const monthlyTotal = subs.reduce((sum, s) => {
    const a = Number(s.amount);
    if (s.billingCycle === "monthly") return sum + a;
    if (s.billingCycle === "yearly") return sum + a / 12;
    if (s.billingCycle === "weekly") return sum + a * 4.33;
    return sum;
  }, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#080c14" }} edges={["top"]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.06)",
        }}
      >
        <View>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>Abonelikler</Text>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 2 }}>
            {subs.length} aktif ·{" "}
            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(monthlyTotal)}/ay
          </Text>
        </View>
        {/* "Ekle" web'e yönlendirir — mobilde sadece görüntüleme + ödendi */}
        <BlurView
          intensity={20}
          tint="dark"
          style={{
            borderRadius: 14,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(79,142,247,0.3)",
          }}
        >
          <TouchableOpacity
            style={{ paddingHorizontal: 14, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 6 }}
            onPress={() =>
              Alert.alert("Abonelik Ekle", "Yeni abonelik eklemek için web uygulamasını kullan.", [{ text: "Tamam" }])
            }
          >
            <Plus size={16} color="#4f8ef7" />
            <Text style={{ color: "#4f8ef7", fontWeight: "600", fontSize: 14 }}>Ekle</Text>
          </TouchableOpacity>
        </BlurView>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f8ef7" />
        }
      >
        {subs.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 60 }}>
            <Text style={{ color: "rgba(255,255,255,0.2)", fontSize: 48, marginBottom: 12 }}>📭</Text>
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, fontWeight: "600" }}>
              Henüz abonelik yok
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, marginTop: 6, textAlign: "center" }}>
              Web uygulamasından ekleyebilir{"\n"}veya Gmail'ini bağlayabilirsin
            </Text>
          </View>
        ) : (
          subs.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              sub={sub}
              onPress={() => router.push(`/subscription/${sub.id}`)}
              onDelete={() => handleDelete(sub.id, sub.name)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
