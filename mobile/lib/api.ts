import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
});

// Add request interceptor to include JWT token from SecureStore
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    if (__DEV__) console.error("Failed to retrieve token:", err);
  }
  return config;
});

// Add response interceptor to handle errors and token expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear token
      SecureStore.deleteItemAsync("jwt_token").catch(() => {});
    }
    return Promise.reject(error);
  },
);

/**
 * Store JWT token in SecureStore for secure encryption
 * Note: Server returns token in httpOnly cookie, so we extract it from response headers if available
 * or store manually when called from auth handlers
 */
export const setAuthToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("jwt_token", token);
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } catch (err) {
    if (__DEV__) console.error("Failed to store token:", err);
  }
};

/**
 * Clear JWT token from SecureStore
 */
export const clearAuthToken = async () => {
  try {
    await SecureStore.deleteItemAsync("jwt_token");
    delete apiClient.defaults.headers.common.Authorization;
  } catch (err) {
    if (__DEV__) console.error("Failed to clear token:", err);
  }
};
