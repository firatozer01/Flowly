import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  async function handleEmailAuth() {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      Alert.alert("Hata", err.errors?.[0]?.message ?? "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      const { createdSessionId, setActive: sa } = await startOAuthFlow();
      if (createdSessionId && sa) await sa({ session: createdSessionId });
    } catch (err: any) {
      Alert.alert("Hata", "Google ile giriş başarısız");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#080c14" }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", padding: 24 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 48 }}>
          <LinearGradient
            colors={["#4f8ef7", "#a78bfa", "#22d3ee"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 16 }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>F</Text>
          </LinearGradient>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800", letterSpacing: -0.5 }}>Flowly</Text>
          <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 4 }}>
            Aboneliklerini tek yerden yönet
          </Text>
        </View>

        {/* Google */}
        <TouchableOpacity
          onPress={handleGoogle}
          style={{
            flexDirection: "row", alignItems: "center", justifyContent: "center",
            gap: 10, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16,
            borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", padding: 16, marginBottom: 20,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Google ile Devam Et</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
          <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>veya e-posta ile</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
        </View>

        {/* Email */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="E-posta"
          placeholderTextColor="rgba(255,255,255,0.3)"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14,
            borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
            padding: 16, color: "#fff", fontSize: 16, marginBottom: 12,
          }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Şifre"
          placeholderTextColor="rgba(255,255,255,0.3)"
          secureTextEntry
          style={{
            backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14,
            borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
            padding: 16, color: "#fff", fontSize: 16, marginBottom: 20,
          }}
        />

        <TouchableOpacity
          onPress={handleEmailAuth}
          disabled={loading}
          style={{ borderRadius: 16, overflow: "hidden" }}
        >
          <LinearGradient
            colors={["#4f8ef7", "#6366f1"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ padding: 18, alignItems: "center" }}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Giriş Yap</Text>
            }
          </LinearGradient>
        </TouchableOpacity>

        <Text style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 24, fontSize: 13 }}>
          Hesabın yok mu?{" "}
          <Text
            style={{ color: "#4f8ef7" }}
            onPress={() => router.push("/(auth)/sign-up" as any)}
          >
            Kayıt Ol
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
