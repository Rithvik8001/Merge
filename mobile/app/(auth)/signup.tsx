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
  const [fieldErrors, setFieldErrors] = useState<{
    userName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Show error alert when error changes
  useEffect(() => {
    if (error) {
      Alert.alert("Signup Failed", error);
    }
  }, [error]);

  const handleSignup = async () => {
    const newErrors: typeof fieldErrors = {};

    if (!userName) {
      newErrors.userName = "Username is required";
    } else if (userName.trim().length < 6) {
      newErrors.userName = "Username must be at least 6 characters";
    } else if (userName.length > 15) {
      newErrors.userName = "Username must be at most 15 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(userName)) {
      newErrors.userName =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain a lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain a number";
    } else if (!/[@$!%*?&]/.test(password)) {
      newErrors.password =
        "Password must contain a special character (@$!%*?&)";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Sending signup data:", {
        userName,
        email,
        password: "***",
        confirmPassword: "***",
      });
      const success = await signup({
        userName,
        email,
        password,
        confirmPassword,
      });
    }
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
              error={fieldErrors.userName}
              autoCapitalize="none"
            />

            <TextInput
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              error={fieldErrors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Password"
              placeholder="••••••••"
              isPassword
              value={password}
              onChangeText={setPassword}
              error={fieldErrors.password}
              autoCapitalize="none"
            />

            <TextInput
              label="Confirm Password"
              placeholder="••••••••"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={fieldErrors.confirmPassword}
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
