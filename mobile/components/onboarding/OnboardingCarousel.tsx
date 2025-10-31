import {
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from "react-native";
import { OnboardingSlide } from "./OnboardingSlide";
import { OnboardingCarouselProps } from "./types";

const { width } = Dimensions.get("window");

export const OnboardingCarousel = ({
  slides,
  onScroll,
  scrollRef,
}: OnboardingCarouselProps) => {
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    onScroll(currentIndex);
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      scrollEventThrottle={16}
      onScroll={handleScroll}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      scrollEnabled={true}
      decelerationRate="fast"
    >
      {slides.map((slide, index) => (
        <OnboardingSlide key={index} slide={slide} />
      ))}
    </ScrollView>
  );
};
