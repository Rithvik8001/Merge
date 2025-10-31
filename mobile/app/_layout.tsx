import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

export default function RootLayout() {
  const { hydrate, isHydrating, isAuthenticated } = useAuthStore();

  // Hydrate auth state on app launch (MUST complete before rendering routes)
  useEffect(() => {
    const initializeAuth = async () => {
      if (__DEV__) console.log("📱 RootLayout mounted, starting hydration...");

      // Give Zustand persist middleware a moment to rehydrate from AsyncStorage
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Then check SecureStore for token
      await hydrate();
    };

    initializeAuth();
  }, [hydrate]);

  // While hydrating, show nothing (or a splash screen)
  // This ensures we don't flash auth screen when user is actually logged in
  if (isHydrating) {
    return (
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    );
  }

  // After hydration complete, show appropriate stack
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth stack for unauthenticated users
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        ) : (
          // Dashboard stack for authenticated users
          <Stack.Screen
            name="(dashboard)"
            options={{ headerShown: false }}
          />
        )}
      </Stack>
    </SafeAreaProvider>
  );
}
