import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add request interceptor to include JWT token from SecureStore
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Failed to retrieve token:", err);
  }
  return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear token and redirect to login
      SecureStore.deleteItemAsync("jwt_token").catch(() => {});
    }
    return Promise.reject(error);
  },
);

export const setAuthToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("jwt_token", token);
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } catch (err) {
    console.error("Failed to store token:", err);
  }
};

export const clearAuthToken = async () => {
  try {
    await SecureStore.deleteItemAsync("jwt_token");
    delete apiClient.defaults.headers.common.Authorization;
  } catch (err) {
    console.error("Failed to clear token:", err);
  }
};
