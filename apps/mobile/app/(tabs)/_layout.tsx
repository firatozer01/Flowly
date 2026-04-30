import { Tabs } from "expo-router";
import { LayoutDashboard, CreditCard, Bell } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "rgba(13,18,32,0.95)",
          borderTopColor: "rgba(255,255,255,0.08)",
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 20,
        },
        tabBarActiveTintColor: "#4f8ef7",
        tabBarInactiveTintColor: "rgba(255,255,255,0.35)",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        headerStyle: { backgroundColor: "#080c14" },
        headerTintColor: "#f0f4ff",
        headerTitleStyle: { fontWeight: "700", fontSize: 18 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="subscriptions"
        options={{
          title: "Abonelikler",
          tabBarIcon: ({ color, size }) => <CreditCard color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Hatırlatıcılar",
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
