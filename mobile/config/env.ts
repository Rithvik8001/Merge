/**
 * Environment Configuration
 *
 * This file provides a single source of truth for environment variables
 * Different values are loaded based on:
 * - .env (default development)
 * - .env.local (local machine overrides, gitignored)
 * - .env.production (production builds)
 */

export const Config = {
  // API Configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
    socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000",
  },

  // Debug Configuration
  debug: process.env.EXPO_PUBLIC_DEBUG === "true",

  // Environment Detection
  isDevelopment: __DEV__,
  isProduction: !__DEV__,

  // Logging helper
  log: (message: string, data?: any) => {
    if (Config.debug && __DEV__) {
      console.log(`[Config] ${message}`, data || "");
    }
  },

  // Print current configuration (development only)
  printConfig: () => {
    if (__DEV__) {
      console.log("=== Environment Configuration ===");
      console.log("API URL:", Config.api.baseUrl);
      console.log("Socket URL:", Config.api.socketUrl);
      console.log("Debug Mode:", Config.debug);
      console.log(
        "Environment:",
        Config.isDevelopment ? "Development" : "Production",
      );
      console.log("==================================");
    }
  },
};

// Print config on app start (development only)
if (__DEV__) {
  Config.printConfig();
}
