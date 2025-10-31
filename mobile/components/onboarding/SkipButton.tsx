import { View, TouchableOpacity, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SkipButtonProps {
  onSkip: () => void;
  show: boolean;
}

export const SkipButton = ({ onSkip, show }: SkipButtonProps) => {
  const insets = useSafeAreaInsets();

  if (!show) return null;

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingTop: insets.top + 12,
        paddingBottom: 12,
        zIndex: 10,
      }}
    >
      <TouchableOpacity
        onPress={onSkip}
        activeOpacity={0.5}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 12,
        }}
      >
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
