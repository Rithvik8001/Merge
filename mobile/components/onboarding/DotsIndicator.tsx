import { View, TouchableOpacity } from "react-native";
import { DotsIndicatorProps } from "./types";

export const DotsIndicator = ({
  slides,
  currentSlide,
  onDotPress,
}: DotsIndicatorProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 18,
      }}
    >
      {slides.map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onDotPress(index)}
          activeOpacity={0.6}
          style={{
            width: currentSlide === index ? 8 : 5.5,
            height: 5.5,
            borderRadius: 2.75,
            backgroundColor: currentSlide === index ? "#000000" : "#d1d5db",
          }}
        />
      ))}
    </View>
  );
};
