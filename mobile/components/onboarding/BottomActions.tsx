import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomActionsProps } from "./types";

export const BottomActions = ({
  currentSlide,
  totalSlides,
  onNext,
}: BottomActionsProps) => {
  const isLastSlide = currentSlide === totalSlides - 1;

  if (isLastSlide) {
    return (
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 40,
          paddingTop: 8,
          gap: 12,
        }}
      >
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{
              backgroundColor: "#000000",
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Get started
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity
            activeOpacity={0.75}
            style={{
              backgroundColor: "#ffffff",
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Text
              style={{
                color: "#000000",
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Sign in
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 8,
      }}
    >
      <TouchableOpacity
        onPress={onNext}
        activeOpacity={0.75}
        style={{
          backgroundColor: "#000000",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 15,
            fontWeight: "600",
          }}
        >
          Next
        </Text>
        <MaterialCommunityIcons name="arrow-right" size={18} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};
