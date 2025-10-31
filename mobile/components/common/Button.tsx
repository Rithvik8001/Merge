import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
}

export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "medium",
}: ButtonProps) => {
  const isPrimary = variant === "primary";
  const isSmall = size === "small";
  const isMedium = size === "medium";
  const isLarge = size === "large";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        paddingVertical: isSmall ? 10 : isMedium ? 14 : 16,
        paddingHorizontal: isSmall ? 12 : isMedium ? 16 : 20,
        borderRadius: 8,
        backgroundColor: isPrimary
          ? disabled || loading
            ? "#d1d5db"
            : "#000000"
          : "#ffffff",
        borderWidth: !isPrimary ? 1 : 0,
        borderColor: !isPrimary ? "#e5e7eb" : undefined,
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? "#ffffff" : "#000000"}
          size="small"
        />
      ) : (
        <Text
          style={{
            fontSize: isSmall ? 13 : isMedium ? 16 : 16,
            fontWeight: "600",
            color: isPrimary ? "#ffffff" : "#1f2937",
            letterSpacing: 0.3,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
