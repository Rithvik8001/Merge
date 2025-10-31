import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { TextInput } from "../../components/common/TextInput";
import { Button } from "../../components/common/Button";
import { useLogin } from "../../hooks/useLogin";

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Show error alert when error changes
  useEffect(() => {
    if (error) {
      Alert.alert("Login Failed", error);
    }
  }, [error]);

  const handleLogin = async () => {
    const success = await login({ email, password });
    if (success) {
      router.replace("/(dashboard)");
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    Alert.alert("Coming Soon", "Password reset feature coming soon!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingVertical: 20,
            justifyContent: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: 48, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#000000",
                letterSpacing: -0.8,
                marginBottom: 8,
              }}
            >
              Welcome Back
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#6b7280",
                textAlign: "center",
                fontWeight: "400",
                lineHeight: 22,
              }}
            >
              Sign in to connect with developers and grow your network
            </Text>
          </View>

          <View>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Password"
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={{ alignSelf: "flex-end", marginBottom: 32 }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#3b82f6",
                  letterSpacing: 0.2,
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              size="large"
            />
          </View>

          <View
            style={{
              marginTop: 32,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#6b7280",
                fontWeight: "400",
              }}
            >
              Dont have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#000000",
                  letterSpacing: 0.2,
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
