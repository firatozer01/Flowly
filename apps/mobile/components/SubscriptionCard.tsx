import { View, Text, TouchableOpacity, Image } from "react-native";
import { BlurView } from "expo-blur";
import { Calendar, Trash2 } from "lucide-react-native";

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

function formatAmount(amount: string, currency: string) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

interface Props {
  sub: Sub;
  onPress?: () => void;
  onDelete?: () => void;
}

export function SubscriptionCard({ sub, onPress, onDelete }: Props) {
  const days = daysUntil(sub.nextBillingDate);
  const urgent = days <= 3;
  const soon = days <= 7;

  const dayColor = urgent ? "#f87171" : soon ? "#fb923c" : "rgba(255,255,255,0.35)";
  const dayLabel =
    days === 0 ? "Bugün!" : days < 0 ? `${Math.abs(days)}g geçti` : `${days}g kaldı`;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="mb-3">
      <BlurView
        intensity={20}
        tint="dark"
        className="rounded-2xl overflow-hidden"
        style={{
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.10)",
        }}
      >
        {/* Sol renk çubuğu */}
        <View
          className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
          style={{ backgroundColor: sub.color }}
        />

        <View className="flex-row items-center gap-3 px-4 py-3.5 pl-5">
          {/* Logo */}
          <View
            className="w-11 h-11 rounded-xl overflow-hidden items-center justify-center"
            style={{ backgroundColor: sub.color + "20" }}
          >
            {sub.domain ? (
              <Image
                source={{ uri: `https://logo.clearbit.com/${sub.domain}` }}
                className="w-8 h-8"
                resizeMode="contain"
              />
            ) : (
              <Text className="text-white font-bold text-lg">
                {sub.name[0]}
              </Text>
            )}
          </View>

          {/* Info */}
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">{sub.name}</Text>
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <Calendar size={11} color="rgba(255,255,255,0.35)" />
              <Text style={{ color: dayColor, fontSize: 12 }}>{dayLabel}</Text>
              <Text className="text-white/30 text-xs">·</Text>
              <Text className="text-white/35 text-xs">{sub.category}</Text>
            </View>
          </View>

          {/* Amount */}
          <View className="items-end">
            <Text className="text-white font-bold text-base">
              {formatAmount(sub.amount, sub.currency)}
            </Text>
            <Text className="text-white/35 text-xs capitalize">
              {sub.billingCycle === "monthly"
                ? "aylık"
                : sub.billingCycle === "yearly"
                ? "yıllık"
                : "haftalık"}
            </Text>
          </View>

          {onDelete && (
            <TouchableOpacity
              onPress={onDelete}
              className="p-2 ml-1"
              hitSlop={8}
            >
              <Trash2 size={16} color="rgba(255,255,255,0.25)" />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}
