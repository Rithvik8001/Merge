import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileModal } from "@/components/ProfileModal";
import { useAuthStore } from "@/store/authStore";
import { useChat } from "@/hooks/useChat";
import { toast } from "sonner";
import {
  useConnection,
  useProfileModal,
  type AcceptedConnection,
} from "@/hooks";
import { Loader2, MessageCircle, MessageSquare } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const Connections = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { getAcceptedConnections } = useConnection();
  const { selectConversation } = useChat();
  const { selectedUserId, isOpen, openProfile, closeProfile } =
    useProfileModal();
  const [connections, setConnections] = useState<AcceptedConnection[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch connections on component mount
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setPageLoading(true);
        const data = await getAcceptedConnections();
        setConnections(data);
      } catch (err) {
        // Error is already handled in the hook
      } finally {
        setPageLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleMessageClick = async (connection: AcceptedConnection) => {
    try {
      // Get or create conversation with this user
      const response = await axios.post(
        `${API_URL}/api/v1/chat/conversations/with/${connection.connectedUser.id}`,
        {},
        {
          withCredentials: true,
        },
      );

      const conversationId = response.data.data.id;

      // Select the conversation and open chat
      selectConversation(conversationId, {
        id: connection.connectedUser.id,
        userName: connection.connectedUser.userName,
        email: connection.connectedUser.email,
        photoUrl: connection.connectedUser.photoUrl,
      });

      // Navigate to dashboard with messages (Messages button will handle opening chat)
      navigate("/dashboard?view=messages");
    } catch (error) {
      console.error("Error initiating conversation:", error);
      toast.error("Failed to start conversation. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="px-4 sm:px-8 py-6 sm:py-8 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              My Connections
            </h1>
            <p className="text-base text-muted-foreground">
              All the developers you've successfully connected with.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-8 py-8 sm:py-12 max-w-6xl mx-auto w-full">
            {pageLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading connections...
                  </p>
                </div>
              </div>
            ) : connections.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <div className="mx-auto mb-4 w-14 h-14 bg-muted rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No connections yet
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start discovering and connecting with developers to build
                    your network!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div
                    key={connection.connectionId}
                    className="bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      {/* Left: User Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <button
                          onClick={() =>
                            openProfile(connection.connectedUser.id)
                          }
                          className="flex-shrink-0 hover:opacity-80 transition-opacity"
                        >
                          <Avatar className="w-12 h-12">
                            {connection.connectedUser?.photoUrl ? (
                              <AvatarImage
                                src={connection.connectedUser.photoUrl}
                                alt={connection.connectedUser.userName}
                              />
                            ) : null}
                            <AvatarFallback className="bg-muted text-foreground font-semibold">
                              {connection.connectedUser?.userName?.[0]?.toUpperCase() ||
                                connection.connectedUser?.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </button>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {connection.connectedUser?.userName ||
                              connection.connectedUser?.email?.split("@")[0] ||
                              "Developer"}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {connection.connectedUser?.email}
                          </p>

                          {/* Info */}
                          <div className="mt-2 space-y-2">
                            {(connection.connectedUser?.age ||
                              connection.connectedUser?.gender) && (
                              <div className="text-xs text-muted-foreground">
                                {connection.connectedUser?.age && (
                                  <span>{connection.connectedUser.age}</span>
                                )}
                                {connection.connectedUser?.age &&
                                  connection.connectedUser?.gender && (
                                    <span> • </span>
                                  )}
                                {connection.connectedUser?.gender && (
                                  <span>{connection.connectedUser.gender}</span>
                                )}
                              </div>
                            )}

                            {connection.connectedUser?.about && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {connection.connectedUser.about}
                              </p>
                            )}

                            {connection.connectedUser?.skills &&
                              connection.connectedUser.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {connection.connectedUser.skills
                                    .slice(0, 3)
                                    .map((skill) => (
                                      <Badge
                                        key={skill}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  {connection.connectedUser.skills.length >
                                    3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +
                                      {connection.connectedUser.skills.length -
                                        3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Message Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 w-full sm:w-auto"
                        onClick={() => handleMessageClick(connection)}
                      >
                        <MessageSquare size={16} />
                        Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        userId={selectedUserId}
        isOpen={isOpen}
        onClose={closeProfile}
      />
    </DashboardLayout>
  );
};
