export interface OnboardingSlide {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

export interface OnboardingCarouselProps {
  slides: OnboardingSlide[];
  currentSlide: number;
  onScroll: (index: number) => void;
  scrollRef: React.RefObject<any>;
}

export interface SlideProps {
  slide: OnboardingSlide;
}

export interface DotsIndicatorProps {
  slides: OnboardingSlide[];
  currentSlide: number;
  onDotPress: (index: number) => void;
}

export interface BottomActionsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onSkip: () => void;
}
