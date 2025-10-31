import { View, Text, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SlideProps } from "./types";

const { height, width } = Dimensions.get("window");

export const OnboardingSlide = ({ slide }: SlideProps) => {
  return (
    <View
      style={{
        width,
        height: height * 0.65,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 28,
      }}
    >
      <View style={{ marginBottom: 24 }}>
        <MaterialCommunityIcons
          name={slide.icon}
          size={56}
          color={slide.color}
          style={{ opacity: 0.95 }}
        />
      </View>

      <View style={{ alignItems: "center", maxWidth: 320 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: slide.color,
            marginBottom: 8,
            letterSpacing: 0.5,
            opacity: 0.85,
          }}
        >
          {slide.subtitle}
        </Text>

        <Text
          style={{
            fontSize: 38,
            fontWeight: "700",
            color: "#000000",
            marginBottom: 12,
            textAlign: "center",
            lineHeight: 46,
            letterSpacing: -0.8,
          }}
        >
          {slide.title}
        </Text>

        <Text
          style={{
            fontSize: 15,
            color: "#6b7280",
            textAlign: "center",
            lineHeight: 25,
            fontWeight: "400",
          }}
        >
          {slide.description}
        </Text>
      </View>
    </View>
  );
};
