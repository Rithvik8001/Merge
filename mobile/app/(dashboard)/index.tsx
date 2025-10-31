import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Color palette - Premium minimal
const COLORS = {
  background: "#ffffff",
  surface: "#f9fafb",
  text: {
    primary: "#111827",
    secondary: "#6b7280",
    tertiary: "#9ca3af",
  },
  accent: "#3b82f6",
  border: "#f3f4f6",
  success: "#10b981",
  warning: "#f59e0b",
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const initials = (user?.userName || user?.email || "U")
    .substring(0, 1)
    .toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Premium & Minimal */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 32 }}>
          {/* Header Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            {/* Logo */}
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: COLORS.text.primary,
                  letterSpacing: -1,
                }}
              >
                merge
              </Text>
              <View
                style={{
                  width: 20,
                  height: 2,
                  backgroundColor: COLORS.accent,
                  borderRadius: 1,
                  marginTop: 4,
                }}
              />
            </View>

            {/* Settings Button */}
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: COLORS.surface,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={COLORS.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Profile Card - Floating */}
          <View
            style={{
              backgroundColor: COLORS.surface,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              {/* Avatar */}
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  backgroundColor: COLORS.accent,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: "#ffffff",
                    letterSpacing: -0.5,
                  }}
                >
                  {initials}
                </Text>
              </View>

              {/* User Info */}
              <View style={{ flex: 1, paddingTop: 2 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: COLORS.text.primary,
                    marginBottom: 2,
                  }}
                  numberOfLines={1}
                >
                  {user?.userName || "User"}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.text.secondary,
                    fontWeight: "400",
                  }}
                  numberOfLines={1}
                >
                  {user?.email}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: COLORS.success,
                      marginRight: 6,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: COLORS.success,
                      fontWeight: "500",
                    }}
                  >
                    Active
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section - Premium Cards */}
        <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.text.tertiary,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            Your Network
          </Text>

          {/* Stats Grid */}
          <View style={{ gap: 12 }}>
            {/* Connections Card */}
            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.text.secondary,
                      fontWeight: "500",
                      marginBottom: 6,
                    }}
                  >
                    Connections
                  </Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: COLORS.accent,
                      letterSpacing: -0.8,
                    }}
                  >
                    0
                  </Text>
                </View>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: `${COLORS.accent}10`,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="people" size={24} color={COLORS.accent} />
                </View>
              </View>
            </View>

            {/* Requests Card */}
            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.text.secondary,
                      fontWeight: "500",
                      marginBottom: 6,
                    }}
                  >
                    Requests
                  </Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: COLORS.success,
                      letterSpacing: -0.8,
                    }}
                  >
                    0
                  </Text>
                </View>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: `${COLORS.success}10`,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="person-add"
                    size={24}
                    color={COLORS.success}
                  />
                </View>
              </View>
            </View>

            {/* Messages Card */}
            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: COLORS.text.secondary,
                      fontWeight: "500",
                      marginBottom: 6,
                    }}
                  >
                    Messages
                  </Text>
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "700",
                      color: COLORS.warning,
                      letterSpacing: -0.8,
                    }}
                  >
                    0
                  </Text>
                </View>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: `${COLORS.warning}10`,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="chatbubble"
                    size={24}
                    color={COLORS.warning}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions - Minimal Buttons */}
        <View style={{ paddingHorizontal: 16, marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.text.tertiary,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            Explore
          </Text>

          <View style={{ gap: 10 }}>
            {/* Browse Developers */}
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.background,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: `${COLORS.accent}10`,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="person-add" size={18} color={COLORS.accent} />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    color: COLORS.text.primary,
                  }}
                >
                  Discover Developers
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.text.tertiary}
              />
            </TouchableOpacity>

            {/* View Connections */}
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.background,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: `${COLORS.success}10`,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="people" size={18} color={COLORS.success} />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    color: COLORS.text.primary,
                  }}
                >
                  View Connections
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.text.tertiary}
              />
            </TouchableOpacity>

            {/* View Messages */}
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.background,
                borderWidth: 1,
                borderColor: COLORS.border,
                borderRadius: 12,
                paddingVertical: 14,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: `${COLORS.warning}10`,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="chatbubble" size={18} color={COLORS.warning} />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    color: COLORS.text.primary,
                  }}
                >
                  View Messages
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.text.tertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Completion */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: `${COLORS.success}08`,
              borderRadius: 12,
              padding: 12,
              borderWidth: 1,
              borderColor: `${COLORS.success}20`,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: `${COLORS.success}15`,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Ionicons name="checkmark" size={16} color={COLORS.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: `${COLORS.success}`,
                }}
              >
                Email Verified
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: COLORS.text.secondary,
                  marginTop: 1,
                }}
              >
                Your account is fully verified
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: `#ef444410`,
              borderWidth: 1,
              borderColor: `#ef444420`,
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="log-out"
              size={18}
              color="#ef4444"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: "#ef4444",
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
