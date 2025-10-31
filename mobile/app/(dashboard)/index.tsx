import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#000000",
                letterSpacing: -0.8,
              }}
            >
              Merge
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#6b7280",
                fontWeight: "500",
              }}
            >
              Developer Network
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#f3f4f6",
            }}
          >
            <Ionicons name="log-out" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#000000",
              marginBottom: 8,
              letterSpacing: -0.6,
            }}
          >
            Welcome,{"\n"}
            <Text style={{ color: "#3b82f6" }}>
              {user?.userName || user?.email?.split("@")[0] || "User"}
            </Text>
            ! 👋
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: "#6b7280",
              fontWeight: "400",
              lineHeight: 22,
            }}
          >
            You have successfully verified your email and logged in. Start
            exploring and connecting with developers!
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: "#f0f9ff",
              borderRadius: 12,
              padding: 16,
              borderLeftWidth: 4,
              borderLeftColor: "#3b82f6",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "#3b82f6",
                  borderRadius: 24,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#ffffff",
                  }}
                >
                  {user?.userName?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#1f2937",
                  }}
                >
                  {user?.userName || "User Account"}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    fontWeight: "400",
                  }}
                >
                  {user?.email}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    fontWeight: "500",
                    marginBottom: 4,
                  }}
                >
                  Connections
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#3b82f6",
                  }}
                >
                  0
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    fontWeight: "500",
                    marginBottom: 4,
                  }}
                >
                  Requests
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#10b981",
                  }}
                >
                  0
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    fontWeight: "500",
                    marginBottom: 4,
                  }}
                >
                  Messages
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: "#f59e0b",
                  }}
                >
                  0
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#000000",
              marginBottom: 12,
            }}
          >
            Quick Actions
          </Text>

          <View style={{ gap: 8 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#dbeafe",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="person-add" size={20} color="#3b82f6" />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Discover Developers
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#dcfce7",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="people" size={20} color="#10b981" />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                View Connections
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#fef3c7",
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="chatbubbles" size={20} color="#f59e0b" />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                View Messages
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status */}
        <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
          <View
            style={{
              backgroundColor: "#f0fdf4",
              borderRadius: 8,
              padding: 12,
              borderLeftWidth: 4,
              borderLeftColor: "#10b981",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text
              style={{
                fontSize: 14,
                color: "#166534",
                fontWeight: "500",
                marginLeft: 8,
              }}
            >
              Email verified ✓
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
