import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileModal } from "@/components/ProfileModal";
import { useAuthStore } from "@/store/authStore";
import { useFeed, useConnection, useProfileModal } from "@/hooks";
import { Loader2, Heart, X, MessageSquare, Zap } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { users, pagination, isLoading, fetchFeed, removeUserFromFeed } =
    useFeed();
  const { sendConnectionRequest } = useConnection();
  const { selectedUserId, isOpen, openProfile, closeProfile } =
    useProfileModal();
  const [currentPage, setCurrentPage] = useState(1);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch feed on component mount
  useEffect(() => {
    fetchFeed(1);
  }, []);

  const handleConnect = async (
    targetUserId: string,
    status: "interested" | "ignored",
  ) => {
    try {
      setActionInProgress(targetUserId);
      await sendConnectionRequest(targetUserId, status);
      // Remove user from list after successful connection
      removeUserFromFeed(targetUserId);
    } catch (err) {
      // Error is already handled in the hook
    } finally {
      setActionInProgress(null);
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
              Discover Developers
            </h1>
            <p className="text-base text-muted-foreground">
              Find and connect with talented developers in your network.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-8 py-8 sm:py-12 max-w-6xl mx-auto w-full">
            {isLoading && users.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading developers...
                  </p>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <div className="mx-auto mb-4 w-14 h-14 bg-muted rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No more developers
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    You've reviewed all available developers. Check back soon
                    for new profiles!
                  </p>
                  <Button
                    onClick={() => {
                      setCurrentPage(1);
                      fetchFeed(1);
                    }}
                    className="gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {users.map((dev) => (
                    <div
                      key={dev.id}
                      className="flex flex-col bg-card border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
                    >
                      {/* Card Body */}
                      <div className="p-6 flex flex-col h-full">
                        {/* User Header */}
                        <div className="flex items-start gap-4 mb-5">
                          <button
                            onClick={() => openProfile(dev.id)}
                            className="flex-shrink-0 hover:opacity-80 transition-opacity"
                          >
                            <Avatar className="w-14 h-14">
                              <AvatarFallback className="bg-muted text-foreground font-semibold">
                                {dev.userName?.[0]?.toUpperCase() ||
                                  dev.email[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => openProfile(dev.id)}
                              className="hover:text-primary transition-colors text-left"
                            >
                              <h3 className="font-semibold text-foreground line-clamp-1">
                                {dev.userName || "Developer"}
                              </h3>
                            </button>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {dev.email}
                            </p>
                          </div>
                        </div>

                        {/* User Details */}
                        <div className="mb-5 space-y-3 flex-1">
                          {/* Age/Gender */}
                          {(dev.age || dev.gender) && (
                            <div className="text-xs text-muted-foreground">
                              {dev.age && <span>{dev.age}</span>}
                              {dev.age && dev.gender && <span> • </span>}
                              {dev.gender && <span>{dev.gender}</span>}
                            </div>
                          )}

                          {/* Bio */}
                          {dev.about && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {dev.about}
                            </p>
                          )}

                          {/* Skills */}
                          {dev.skills && dev.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {dev.skills.slice(0, 3).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                              {dev.skills.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{dev.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-5 border-t border-border">
                          <Button
                            size="sm"
                            onClick={() => handleConnect(dev.id, "interested")}
                            disabled={actionInProgress === dev.id}
                            className="flex-1 gap-2"
                          >
                            <Heart
                              size={16}
                              className={
                                actionInProgress === dev.id
                                  ? "animate-pulse"
                                  : ""
                              }
                            />
                            {actionInProgress === dev.id ? "..." : "Connect"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConnect(dev.id, "ignored")}
                            disabled={actionInProgress === dev.id}
                            className="flex-1 gap-2"
                          >
                            <X size={16} />
                            Pass
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      disabled={!pagination.hasPreviousPage || isLoading}
                      onClick={() => {
                        const newPage = currentPage - 1;
                        setCurrentPage(newPage);
                        fetchFeed(newPage);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Previous
                    </Button>

                    <div className="text-sm text-muted-foreground">
                      Page{" "}
                      <span className="font-semibold text-foreground">
                        {pagination.currentPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-foreground">
                        {pagination.totalPages}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      disabled={!pagination.hasNextPage || isLoading}
                      onClick={() => {
                        const newPage = currentPage + 1;
                        setCurrentPage(newPage);
                        fetchFeed(newPage);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        userId={selectedUserId}
        isOpen={isOpen}
        onClose={closeProfile}
        onConnect={(userId) => handleConnect(userId, "interested")}
        isConnecting={actionInProgress === selectedUserId}
      />
    </DashboardLayout>
  );
};
