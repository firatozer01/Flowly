import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert("Hata", err.errors?.[0]?.message ?? "Kayıt başarısız");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      Alert.alert("Hata", err.errors?.[0]?.message ?? "Doğrulama başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#080c14" }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center", padding: 24 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ alignItems: "center", marginBottom: 48 }}>
          <LinearGradient
            colors={["#4f8ef7", "#a78bfa", "#22d3ee"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 16 }}
          >
            <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>F</Text>
          </LinearGradient>
          <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>Hesap Oluştur</Text>
        </View>

        {!pendingVerification ? (
          <>
            <TextInput
              value={email} onChangeText={setEmail}
              placeholder="E-posta" placeholderTextColor="rgba(255,255,255,0.3)"
              autoCapitalize="none" keyboardType="email-address"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", padding: 16, color: "#fff", fontSize: 16, marginBottom: 12 }}
            />
            <TextInput
              value={password} onChangeText={setPassword}
              placeholder="Şifre (min 8 karakter)" placeholderTextColor="rgba(255,255,255,0.3)"
              secureTextEntry
              style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", padding: 16, color: "#fff", fontSize: 16, marginBottom: 20 }}
            />
            <TouchableOpacity onPress={handleSignUp} disabled={loading} style={{ borderRadius: 16, overflow: "hidden" }}>
              <LinearGradient colors={["#4f8ef7", "#6366f1"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ padding: 18, alignItems: "center" }}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Kayıt Ol</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginBottom: 24 }}>
              {email} adresine doğrulama kodu gönderdik
            </Text>
            <TextInput
              value={code} onChangeText={setCode}
              placeholder="6 haneli kod" placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="numeric" maxLength={6}
              style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", padding: 16, color: "#fff", fontSize: 24, textAlign: "center", letterSpacing: 8, marginBottom: 20 }}
            />
            <TouchableOpacity onPress={handleVerify} disabled={loading} style={{ borderRadius: 16, overflow: "hidden" }}>
              <LinearGradient colors={["#4f8ef7", "#6366f1"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ padding: 18, alignItems: "center" }}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>Doğrula</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        <Text style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 24, fontSize: 13 }}>
          Zaten hesabın var mı?{" "}
          <Text style={{ color: "#4f8ef7" }} onPress={() => router.back()}>Giriş Yap</Text>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
