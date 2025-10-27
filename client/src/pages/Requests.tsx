import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { useConnection, type ConnectionRequest } from "@/hooks";
import { Loader2, Check, X, MessageSquare } from "lucide-react";

export const Requests = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { getReceivedRequests, respondToRequest, isLoading } = useConnection();
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setPageLoading(true);
        const data = await getReceivedRequests();
        setRequests(data);
      } catch (err) {
        // Error is already handled in the hook
      } finally {
        setPageLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRespond = async (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      setActionInProgress(requestId);
      await respondToRequest(requestId, status);
      // Remove request from list after successful response
      setRequests(requests.filter((req) => req.requestId !== requestId));
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
              Connection Requests
            </h1>
            <p className="text-base text-muted-foreground">
              Respond to requests from developers interested in connecting with you.
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
                    Loading requests...
                  </p>
                </div>
              </div>
            ) : requests.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <div className="mx-auto mb-4 w-14 h-14 bg-muted rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No pending requests
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    You don't have any connection requests yet. Discover developers to get started!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      {/* Left: User Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarFallback className="bg-muted text-foreground font-semibold">
                            {request.fromUserId?.userName?.[0]?.toUpperCase() ||
                              request.fromUserId?.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {request.fromUserId?.userName ||
                              request.fromUserId?.email?.split("@")[0] ||
                              "Developer"}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {request.fromUserId?.email}
                          </p>

                          {/* Info */}
                          <div className="mt-2 space-y-2">
                            {(request.fromUserId?.age ||
                              request.fromUserId?.gender) && (
                              <div className="text-xs text-muted-foreground">
                                {request.fromUserId?.age && (
                                  <span>{request.fromUserId.age}</span>
                                )}
                                {request.fromUserId?.age &&
                                  request.fromUserId?.gender && (
                                    <span> • </span>
                                  )}
                                {request.fromUserId?.gender && (
                                  <span>{request.fromUserId.gender}</span>
                                )}
                              </div>
                            )}

                            {request.fromUserId?.about && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {request.fromUserId.about}
                              </p>
                            )}

                            {request.fromUserId?.skills &&
                              request.fromUserId.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                  {request.fromUserId.skills
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
                                  {request.fromUserId.skills.length > 3 && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      +{request.fromUserId.skills.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex gap-3 sm:flex-col">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleRespond(request.requestId, "accepted")
                          }
                          disabled={actionInProgress === request.requestId}
                          className="flex-1 gap-2"
                        >
                          <Check
                            size={16}
                            className={
                              actionInProgress === request.requestId
                                ? "animate-pulse"
                                : ""
                            }
                          />
                          {actionInProgress === request.requestId
                            ? "..."
                            : "Accept"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleRespond(request.requestId, "rejected")
                          }
                          disabled={actionInProgress === request.requestId}
                          className="flex-1 gap-2"
                        >
                          <X size={16} />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
