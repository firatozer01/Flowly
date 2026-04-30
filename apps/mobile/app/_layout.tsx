import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { tokenCache } from "@/lib/clerk-token-cache";

function AuthGuard() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!isSignedIn && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
    } else if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, isLoaded, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <AuthGuard />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#080c14" },
              headerTintColor: "#f0f4ff",
              headerTitleStyle: { fontWeight: "700" },
              contentStyle: { backgroundColor: "#080c14" },
              animation: "ios_from_right",
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="subscription/[id]"
              options={{ title: "Abonelik Detayı", presentation: "modal" }}
            />
          </Stack>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
