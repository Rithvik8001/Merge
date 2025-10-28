import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Heart, X, Mail, Briefcase } from "lucide-react";

interface ProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (userId: string) => void;
  isConnecting?: boolean;
}

export const ProfileModal = ({
  userId,
  isOpen,
  onClose,
  onConnect,
  isConnecting = false,
}: ProfileModalProps) => {
  const { viewProfile, isLoading } = useProfile();
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchProfile = async () => {
        try {
          setError(null);
          const data = await viewProfile(userId);
          setProfile(data);
        } catch (err) {
          setError("Failed to load profile");
        }
      };
      fetchProfile();
    }
  }, [isOpen, userId]);

  const handleClose = () => {
    setProfile(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading profile...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-sm text-destructive font-medium mb-4">
                {error}
              </p>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
            </DialogHeader>

            {/* Avatar and Header */}
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 flex-shrink-0">
                {profile.photoUrl ? (
                  <AvatarImage src={profile.photoUrl} alt={profile.userName} />
                ) : null}
                <AvatarFallback className="bg-muted text-foreground font-semibold text-lg">
                  {profile.userName?.[0]?.toUpperCase() ||
                    profile.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground line-clamp-1">
                  {profile.userName || "Developer"}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {profile.email}
                </p>

                {/* Info */}
                <div className="mt-3 space-y-2">
                  {(profile.age || profile.gender) && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>
                        {profile.age && <span>{profile.age}</span>}
                        {profile.age && profile.gender && <span> • </span>}
                        {profile.gender && <span>{profile.gender}</span>}
                      </span>
                    </div>
                  )}

                  {profile.createdAt && (
                    <div className="text-xs text-muted-foreground">
                      Joined{" "}
                      {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.about && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {profile.about}
                </p>
              </div>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              {onConnect && (
                <>
                  <Button
                    className="flex-1 gap-2"
                    disabled={isConnecting}
                    onClick={() => {
                      onConnect(userId!);
                      handleClose();
                    }}
                  >
                    <Heart
                      size={16}
                      className={isConnecting ? "animate-pulse" : ""}
                    />
                    {isConnecting ? "..." : "Connect"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    disabled={isConnecting}
                    onClick={handleClose}
                  >
                    <X size={16} />
                    Close
                  </Button>
                </>
              )}
              {!onConnect && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleClose}
                >
                  <Mail size={16} />
                  Message
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
