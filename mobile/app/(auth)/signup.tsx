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
import { useSignup } from "../../hooks/useSignup";

export default function SignupScreen() {
  const router = useRouter();
  const { signup, isLoading, error } = useSignup();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show error alert when error changes
  useEffect(() => {
    if (error) {
      Alert.alert("Signup Failed", error);
    }
  }, [error]);

  const handleSignup = async () => {
    const success = await signup({
      userName,
      email,
      password,
      confirmPassword,
    });
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
            justifyContent: "flex-start",
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 32, alignSelf: "flex-start" }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#000000",
                letterSpacing: 0.2,
              }}
            >
              ← Back
            </Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#000000",
                letterSpacing: -0.8,
                marginBottom: 8,
              }}
            >
              Create Account
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#6b7280",
                fontWeight: "400",
                lineHeight: 22,
              }}
            >
              Join our community of developers and start making connections
            </Text>
          </View>

          {/* Form */}
          <View>
            <TextInput
              label="Username"
              placeholder="johndoe"
              value={userName}
              onChangeText={setUserName}
              autoCapitalize="none"
            />

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

            <TextInput
              label="Confirm Password"
              placeholder="••••••••"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
            />

            {/* Sign Up Button */}
            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              size="large"
            />
          </View>

          {/* Terms & Privacy */}
          <View
            style={{
              marginTop: 32,
              marginBottom: 32,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
                textAlign: "center",
                fontWeight: "400",
                lineHeight: 18,
              }}
            >
              By signing up, you agree to our{" "}
              <Text style={{ fontWeight: "600", color: "#1f2937" }}>
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text style={{ fontWeight: "600", color: "#1f2937" }}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/* Sign In Link */}
          <View
            style={{
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
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#000000",
                  letterSpacing: 0.2,
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
