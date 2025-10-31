import { useState, useRef } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import {
  OnboardingCarousel,
  DotsIndicator,
  BottomActions,
  SkipButton,
} from "../components/onboarding";
import { ONBOARDING_SLIDES } from "../constants/onboarding";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (index: number) => {
    setCurrentSlide(index);
  };

  const goToSlide = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleNext = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    goToSlide(ONBOARDING_SLIDES.length - 1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <SkipButton
        show={currentSlide < ONBOARDING_SLIDES.length - 1}
        onSkip={handleSkip}
      />

      <OnboardingCarousel
        slides={ONBOARDING_SLIDES}
        currentSlide={currentSlide}
        onScroll={handleScroll}
        scrollRef={scrollViewRef}
      />

      <DotsIndicator
        slides={ONBOARDING_SLIDES}
        currentSlide={currentSlide}
        onDotPress={goToSlide}
      />

      <BottomActions
        currentSlide={currentSlide}
        totalSlides={ONBOARDING_SLIDES.length}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </View>
  );
}
