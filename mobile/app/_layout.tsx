import { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const router = useRouter();
  const navigationAttempted = useRef(false);

  // Subscribe to the entire store to ensure re-renders
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Hydrate auth state on app launch
  useEffect(() => {
    const initializeAuth = async () => {
      if (__DEV__) console.log("📱 RootLayout mounted, starting hydration...");

      // Give Zustand persist middleware a moment to rehydrate from AsyncStorage
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Then check SecureStore for token
      await hydrate();

      if (__DEV__) console.log("📱 Hydration complete");
    };

    initializeAuth();
  }, []); // Run only once on mount

  // Handle navigation after hydration completes
  useEffect(() => {
    // Only navigate once and only after hydration is complete
    if (isHydrating || navigationAttempted.current) {
      return;
    }

    navigationAttempted.current = true;

    if (__DEV__) {
      console.log("✅ Hydration complete, navigating...");
      console.log(`   isAuthenticated: ${isAuthenticated}`);
    }

    // Navigate to the appropriate screen
    if (isAuthenticated) {
      if (__DEV__) console.log("🔀 Going to dashboard");
      router.replace("/(dashboard)");
    } else {
      if (__DEV__) console.log("🔀 Going to login");
      router.replace("/(auth)/login");
    }
  }, [isHydrating, isAuthenticated]);

  if (isHydrating) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: "#ffffff" }} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
