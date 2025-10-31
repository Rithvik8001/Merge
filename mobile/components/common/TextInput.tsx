import { useState } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  isPassword?: boolean;
  error?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const TextInput = ({
  label,
  placeholder,
  isPassword = false,
  error,
  value,
  onChangeText,
  ...props
}: CustomTextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#1f2937",
            marginBottom: 8,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
      )}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: error ? "#ef4444" : "#e5e7eb",
          borderRadius: 8,
          paddingHorizontal: 16,
          backgroundColor: "#ffffff",
          height: 48,
        }}
      >
        <RNTextInput
          style={{
            flex: 1,
            fontSize: 16,
            color: "#1f2937",
            paddingVertical: 12,
            fontWeight: "400",
          }}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onChangeText={onChangeText}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#6b7280"
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          style={{
            fontSize: 12,
            color: "#ef4444",
            marginTop: 6,
            fontWeight: "500",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
