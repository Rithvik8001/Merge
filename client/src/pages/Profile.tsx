import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { useProfile, type UserProfile } from "@/hooks/useProfile";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { Loader2, Mail, Edit2, X, Camera } from "lucide-react";
import { toast } from "sonner";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { viewProfile, editProfile, isLoading } = useProfile();
  const { uploadPhoto, isLoading: isUploading } = usePhotoUpload();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    age: "",
    gender: "",
    about: "",
    skills: "" as string,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load profile on mount
  useEffect(() => {
    if (user?.userId) {
      const loadProfile = async () => {
        try {
          const data = await viewProfile(user.userId);
          setProfile(data);
          setFormData({
            userName: data.userName || "",
            age: data.age?.toString() || "",
            gender: data.gender || "",
            about: data.about || "",
            skills: data.skills?.join(", ") || "",
          });
        } catch (err) {
          // Error handled in hook
        }
      };
      loadProfile();
    }
  }, [user?.userId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Parse skills
      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      await editProfile({
        userName: formData.userName || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        about: formData.about || undefined,
        skills: skills.length > 0 ? skills : undefined,
      });

      // Refresh profile
      if (user?.userId) {
        const data = await viewProfile(user.userId);
        setProfile(data);
      }

      setIsEditing(false);
      toast.success("Profile saved successfully!");
    } catch (err) {
      // Error handled in hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        userName: profile.userName || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        about: profile.about || "",
        skills: profile.skills?.join(", ") || "",
      });
    }
    setIsEditing(false);
    setPhotoPreview(null);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please select a photo first");
      return;
    }

    const photoUrl = await uploadPhoto(file);
    if (photoUrl && user?.userId) {
      // Refresh profile with new photo
      const data = await viewProfile(user.userId);
      setProfile(data);
      setPhotoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading && !profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="px-4 sm:px-8 py-6 sm:py-8 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              My Profile
            </h1>
            <p className="text-base text-muted-foreground">
              View and manage your profile information
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-8 py-8 sm:py-12 max-w-4xl mx-auto w-full">
            {profile ? (
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 pb-8 border-b border-border">
                    <div className="relative">
                      <Avatar className="w-20 h-20 flex-shrink-0">
                        {photoPreview || profile.photoUrl ? (
                          <AvatarImage src={photoPreview || profile.photoUrl} alt="Profile" />
                        ) : null}
                        <AvatarFallback className="bg-muted text-foreground font-semibold text-lg">
                          {profile.userName?.[0]?.toUpperCase() ||
                            profile.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90 transition-colors"
                          disabled={isUploading}
                        >
                          <Camera size={14} />
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-2">
                        Email
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <Mail size={18} className="text-muted-foreground" />
                        <p className="text-foreground break-all">
                          {profile.email}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Member since{" "}
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {!isEditing && (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="gap-2 self-start sm:self-auto"
                      >
                        <Edit2 size={16} />
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  {/* Profile Information */}
                  {isEditing ? (
                    <div className="space-y-6">
                      {/* Username */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Username
                        </label>
                        <Input
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={handleInputChange}
                          placeholder="Enter your username"
                          className="w-full"
                        />
                      </div>

                      {/* Age */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Age
                        </label>
                        <Input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          placeholder="Enter your age"
                          className="w-full"
                          min="18"
                          max="120"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      </div>

                      {/* About */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          About
                        </label>
                        <textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself..."
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          rows={4}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.about.length}/200 characters
                        </p>
                      </div>

                      {/* Skills */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Skills
                        </label>
                        <textarea
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          placeholder="Enter your skills separated by commas (e.g., React, TypeScript, Node.js)"
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Separate multiple skills with commas
                        </p>
                      </div>

                      {/* Photo Upload Section */}
                      {photoPreview && (
                        <div className="bg-muted p-4 rounded-md border border-border">
                          <p className="text-sm text-muted-foreground mb-3">
                            Photo selected. Click below to upload.
                          </p>
                          <Button
                            onClick={handlePhotoUpload}
                            disabled={isUploading}
                            className="w-full"
                            variant="secondary"
                          >
                            {isUploading ? "Uploading..." : "Upload Photo"}
                          </Button>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-6 border-t border-border">
                        <Button
                          onClick={handleSave}
                          disabled={isSaving || isUploading}
                          className="flex-1"
                        >
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          disabled={isSaving || isUploading}
                          className="flex-1 gap-2"
                        >
                          <X size={16} />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Username */}
                      {profile.userName && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Username
                          </p>
                          <p className="text-foreground font-medium">
                            {profile.userName}
                          </p>
                        </div>
                      )}

                      {/* Age & Gender */}
                      {(profile.age || profile.gender) && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Demographics
                          </p>
                          <p className="text-foreground">
                            {profile.age && (
                              <span>{profile.age} years old</span>
                            )}
                            {profile.age && profile.gender && <span> • </span>}
                            {profile.gender && <span>{profile.gender}</span>}
                          </p>
                        </div>
                      )}

                      {/* About */}
                      {profile.about && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            About
                          </p>
                          <p className="text-foreground whitespace-pre-wrap">
                            {profile.about}
                          </p>
                        </div>
                      )}

                      {/* Skills */}
                      {profile.skills && profile.skills.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-3">
                            Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills.map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Password Change Section */}
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Security
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    To change your password, visit the Settings page.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/settings")}
                  >
                    Go to Settings
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
