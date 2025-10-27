import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { useFeed, useConnection } from "@/hooks";
import { Loader2, Heart, X, MessageSquare } from "lucide-react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { users, pagination, isLoading, fetchFeed, removeUserFromFeed } = useFeed();
  const { sendConnectionRequest } = useConnection();
  const [currentPage, setCurrentPage] = useState(1);

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
      await sendConnectionRequest(targetUserId, status);
      // Remove user from list after successful connection
      removeUserFromFeed(targetUserId);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="px-8 py-6 border-b border-border">
          <h1 className="text-3xl font-bold text-foreground">
            Discover Developers
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            Find and connect with amazing developers in your network
          </p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-8 py-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading developers...</p>
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center max-w-sm">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    No more developers to discover
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    You've reviewed all available developers. Check back soon for new connections!
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPage(1);
                      fetchFeed(1);
                    }}
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Grid of Developer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((dev) => (
                    <Card
                      key={dev.id}
                      className="flex flex-col border border-border hover:border-primary/60 transition-all duration-200"
                    >
                      {/* Card Content */}
                      <div className="p-6 flex flex-col h-full">
                        {/* Header with Avatar */}
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="w-14 h-14">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                              {dev.userName?.[0]?.toUpperCase() ||
                                dev.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">
                              {dev.userName || "Developer"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {dev.email}
                            </p>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="space-y-3 flex-1 mb-6">
                          {/* Age and Gender */}
                          {(dev.age || dev.gender) && (
                            <div className="text-sm text-muted-foreground">
                              {dev.age && <span>{dev.age}</span>}
                              {dev.age && dev.gender && <span> • </span>}
                              {dev.gender && <span>{dev.gender}</span>}
                            </div>
                          )}

                          {/* About */}
                          {dev.about && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {dev.about}
                            </p>
                          )}

                          {/* Skills */}
                          {dev.skills && dev.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {dev.skills.slice(0, 4).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 gap-2"
                            onClick={() => handleConnect(dev.id, "interested")}
                          >
                            <Heart size={16} />
                            Connect
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-2"
                            onClick={() => handleConnect(dev.id, "ignored")}
                          >
                            <X size={16} />
                            Pass
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12 pt-8 border-t border-border">
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

                    <div className="text-sm text-muted-foreground px-4">
                      Page <span className="font-semibold text-foreground">{pagination.currentPage}</span> of{" "}
                      <span className="font-semibold text-foreground">{pagination.totalPages}</span>
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
    </DashboardLayout>
  );
};
