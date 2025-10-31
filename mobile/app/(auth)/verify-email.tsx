import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Alert,
  TextInput as RNTextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "../../components/common/Button";
import { useEmailVerification } from "../../hooks/useEmailVerification";
import { Ionicons } from "@expo/vector-icons";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyEmailOtp, resendVerificationOtp, isLoading, error } =
    useEmailVerification();

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert("Verification Failed", error);
    }
  }, [error]);

  // Handle missing email
  if (!email) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <View
          style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
            Error
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
            Email not found. Please signup again.
          </Text>
          <Button
            title="Go Back"
            onPress={() => router.push("/(auth)/signup")}
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleVerifyOtp = async () => {
    setOtpError("");

    if (!otp) {
      setOtpError("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError("OTP must contain only numbers");
      return;
    }

    const success = await verifyEmailOtp(email, otp);
    if (success) {
      Alert.alert(
        "Email Verified!",
        "Your email has been verified successfully. You can now login.",
        [
          {
            text: "Go to Login",
            onPress: () => router.replace("/(auth)/login"),
          },
        ],
      );
    }
  };

  const handleResendOtp = async () => {
    const success = await resendVerificationOtp(email);
    if (success) {
      Alert.alert(
        "OTP Resent",
        "A new OTP has been sent to your email address.",
      );
      setResendTimer(60);
      setOtp("");
      setOtpError("");
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
            justifyContent: "center",
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
          <View style={{ marginBottom: 48, alignItems: "center" }}>
            <View style={{ marginBottom: 20 }}>
              <Ionicons
                name="mail-outline"
                size={56}
                color="#3b82f6"
                style={{ alignSelf: "center" }}
              />
            </View>

            <Text
              style={{
                fontSize: 32,
                fontWeight: "700",
                color: "#000000",
                letterSpacing: -0.8,
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              Verify Email
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
              We've sent a verification code to{"\n"}
              <Text style={{ fontWeight: "600", color: "#1f2937" }}>
                {email}
              </Text>
            </Text>
          </View>

          {/* OTP Input */}
          <View style={{ marginBottom: 32 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: 12,
                letterSpacing: 0.2,
              }}
            >
              Enter OTP Code
            </Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: otpError ? "#ef4444" : "#e5e7eb",
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: "#ffffff",
              }}
            >
              <RNTextInput
                style={{
                  fontSize: 32,
                  fontWeight: "600",
                  color: "#1f2937",
                  textAlign: "center",
                  letterSpacing: 8,
                }}
                placeholder="000000"
                placeholderTextColor="#d1d5db"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                editable={!isLoading}
              />
            </View>

            {otpError && (
              <Text
                style={{
                  fontSize: 12,
                  color: "#ef4444",
                  marginTop: 8,
                  fontWeight: "500",
                }}
              >
                {otpError}
              </Text>
            )}

            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
                marginTop: 12,
                fontWeight: "400",
                lineHeight: 18,
              }}
            >
              Please enter the 6-digit code sent to your email. Check your spam
              folder if you don't see it.
            </Text>
          </View>

          {/* Verify Button */}
          <Button
            title="Verify Email"
            onPress={handleVerifyOtp}
            loading={isLoading}
            size="large"
          />

          {/* Resend OTP */}
          <View
            style={{
              marginTop: 32,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#6b7280",
                fontWeight: "400",
                marginBottom: 12,
              }}
            >
              Did not receive the code?
            </Text>

            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendTimer > 0 || isLoading}
              style={{
                opacity: resendTimer > 0 || isLoading ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: resendTimer > 0 ? "#9ca3af" : "#3b82f6",
                  letterSpacing: 0.2,
                }}
              >
                {resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : isLoading
                    ? "Sending..."
                    : "Resend OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
