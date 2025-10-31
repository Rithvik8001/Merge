import { View, TouchableOpacity, Text } from "react-native";

interface SkipButtonProps {
  onSkip: () => void;
  show: boolean;
}

/**
 * Skip button - minimal, text-only affordance
 */
export const SkipButton = ({ onSkip, show }: SkipButtonProps) => {
  if (!show) return null;

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingTop: 14,
        paddingBottom: 8,
        zIndex: 10,
      }}
    >
      <TouchableOpacity onPress={onSkip} activeOpacity={0.5}>
        <Text
          style={{
            color: "#9ca3af",
            fontSize: 14,
            fontWeight: "500",
            textAlign: "right",
          }}
        >
          Skip
        </Text>
      </TouchableOpacity>
    </View>
  );
};
