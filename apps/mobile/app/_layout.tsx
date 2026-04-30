import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#080c14" },
          headerTintColor: "#f0f4ff",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#080c14" },
          animation: "ios_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="subscription/[id]"
          options={{ title: "Abonelik Detayı", presentation: "modal" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
