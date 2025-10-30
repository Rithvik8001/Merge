import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { useProfile, type UserProfile } from "@/hooks/useProfile";
import { usePhotoUpload } from "@/hooks/usePhotoUpload";
import { useWorkExperience, type WorkExperience } from "@/hooks/useWorkExperience";
import { useEducation, type Education } from "@/hooks/useEducation";
import { Loader2, Mail, Edit2, X, Camera, Trash2, Plus, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { viewProfile, editProfile, isLoading } = useProfile();
  const { uploadPhoto, isLoading: isUploading } = usePhotoUpload();
  const { addWorkExperience, editWorkExperience, deleteWorkExperience, isLoading: isWorkExperienceLoading } = useWorkExperience();
  const { addEducation, editEducation, deleteEducation, isLoading: isEducationLoading } = useEducation();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
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

  // Work Experience Form State
  const [workExperienceForm, setWorkExperienceForm] = useState<WorkExperience>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    isCurrentlyWorking: false,
    description: "",
  });

  // Education Form State
  const [educationForm, setEducationForm] = useState<Education>({
    school: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    isCurrentlyStudying: false,
    description: "",
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

  const handleDeleteWorkExperience = async (experienceId: string | undefined) => {
    if (!experienceId) return;

    try {
      await deleteWorkExperience(experienceId);
      // Refresh profile
      if (user?.userId) {
        const data = await viewProfile(user.userId);
        setProfile(data);
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleDeleteEducation = async (educationId: string | undefined) => {
    if (!educationId) return;

    try {
      await deleteEducation(educationId);
      // Refresh profile
      if (user?.userId) {
        const data = await viewProfile(user.userId);
        setProfile(data);
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleEditWorkExperience = (experience: WorkExperience & { id?: string }) => {
    setWorkExperienceForm({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate || "",
      isCurrentlyWorking: experience.isCurrentlyWorking,
      description: experience.description || "",
    });
    setEditingExperienceId(experience.id || "");
    setIsAddingExperience(true);
  };

  const handleSaveWorkExperience = async () => {
    if (!workExperienceForm.company || !workExperienceForm.position || !workExperienceForm.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingExperienceId) {
        // Update existing
        await editWorkExperience(editingExperienceId, workExperienceForm);
      } else {
        // Add new
        await addWorkExperience(workExperienceForm);
      }

      // Reset form
      setWorkExperienceForm({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        isCurrentlyWorking: false,
        description: "",
      });
      setEditingExperienceId(null);
      setIsAddingExperience(false);

      // Refresh profile
      if (user?.userId) {
        const data = await viewProfile(user.userId);
        setProfile(data);
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleEditEducation = (education: Education & { id?: string }) => {
    setEducationForm({
      school: education.school,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startDate: education.startDate,
      endDate: education.endDate || "",
      isCurrentlyStudying: education.isCurrentlyStudying,
      description: education.description || "",
    });
    setEditingEducationId(education.id || "");
    setIsAddingEducation(true);
  };

  const handleSaveEducation = async () => {
    if (!educationForm.school || !educationForm.degree || !educationForm.fieldOfStudy || !educationForm.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingEducationId) {
        // Update existing
        await editEducation(editingEducationId, educationForm);
      } else {
        // Add new
        await addEducation(educationForm);
      }

      // Reset form
      setEducationForm({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        isCurrentlyStudying: false,
        description: "",
      });
      setEditingEducationId(null);
      setIsAddingEducation(false);

      // Refresh profile
      if (user?.userId) {
        const data = await viewProfile(user.userId);
        setProfile(data);
      }
    } catch (err) {
      // Error handled in hook
    }
  };

  const handleCancelEdit = () => {
    setWorkExperienceForm({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrentlyWorking: false,
      description: "",
    });
    setEducationForm({
      school: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      isCurrentlyStudying: false,
      description: "",
    });
    setEditingExperienceId(null);
    setEditingEducationId(null);
    setIsAddingExperience(false);
    setIsAddingEducation(false);
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

                {/* Work Experience Section */}
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      Work Experience
                    </h2>
                    <Button
                      onClick={() => setIsAddingExperience(!isAddingExperience)}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus size={16} />
                      Add Experience
                    </Button>
                  </div>

                  {/* Add Work Experience Form */}
                  {isAddingExperience && (
                    <div className="bg-muted p-4 rounded-lg mb-6 space-y-4 border border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Company
                          </label>
                          <Input
                            value={workExperienceForm.company}
                            onChange={(e) =>
                              setWorkExperienceForm({
                                ...workExperienceForm,
                                company: e.target.value,
                              })
                            }
                            placeholder="e.g., Google"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Position
                          </label>
                          <Input
                            value={workExperienceForm.position}
                            onChange={(e) =>
                              setWorkExperienceForm({
                                ...workExperienceForm,
                                position: e.target.value,
                              })
                            }
                            placeholder="e.g., Software Engineer"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Start Date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {workExperienceForm.startDate
                                  ? format(new Date(workExperienceForm.startDate), "MMM dd, yyyy")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  workExperienceForm.startDate
                                    ? new Date(workExperienceForm.startDate)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setWorkExperienceForm({
                                    ...workExperienceForm,
                                    startDate: date ? format(date, "yyyy-MM-dd") : "",
                                  })
                                }
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1950-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            End Date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                disabled={workExperienceForm.isCurrentlyWorking}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {workExperienceForm.endDate
                                  ? format(new Date(workExperienceForm.endDate), "MMM dd, yyyy")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  workExperienceForm.endDate
                                    ? new Date(workExperienceForm.endDate)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setWorkExperienceForm({
                                    ...workExperienceForm,
                                    endDate: date ? format(date, "yyyy-MM-dd") : "",
                                  })
                                }
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1950-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={workExperienceForm.isCurrentlyWorking}
                            onChange={(e) =>
                              setWorkExperienceForm({
                                ...workExperienceForm,
                                isCurrentlyWorking: e.target.checked,
                                endDate: e.target.checked ? "" : workExperienceForm.endDate,
                              })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-foreground">I currently work here</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          value={workExperienceForm.description}
                          onChange={(e) =>
                            setWorkExperienceForm({
                              ...workExperienceForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe your role and responsibilities..."
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-border">
                        <Button
                          onClick={handleSaveWorkExperience}
                          disabled={isWorkExperienceLoading}
                          className="flex-1"
                        >
                          {isWorkExperienceLoading
                            ? (editingExperienceId ? "Updating..." : "Adding...")
                            : (editingExperienceId ? "Update Experience" : "Add Experience")}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Work Experience List */}
                  {profile.workExperience && profile.workExperience.length > 0 ? (
                    <div className="space-y-4">
                      {profile.workExperience.map((exp, index) => (
                        <div
                          key={index}
                          className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {exp.position}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {exp.company}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditWorkExperience(exp as any)}
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button
                                onClick={() => handleDeleteWorkExperience(exp.id)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {new Date(exp.startDate).toLocaleDateString()}{" "}
                            {exp.endDate || exp.isCurrentlyWorking
                              ? `- ${
                                  exp.isCurrentlyWorking
                                    ? "Present"
                                    : new Date(exp.endDate || "").toLocaleDateString()
                                }`
                              : ""}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No work experience added yet
                    </p>
                  )}
                </div>

                {/* Education Section */}
                <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">
                      Education
                    </h2>
                    <Button
                      onClick={() => setIsAddingEducation(!isAddingEducation)}
                      size="sm"
                      className="gap-2"
                    >
                      <Plus size={16} />
                      Add Education
                    </Button>
                  </div>

                  {/* Add Education Form */}
                  {isAddingEducation && (
                    <div className="bg-muted p-4 rounded-lg mb-6 space-y-4 border border-border">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            School/University
                          </label>
                          <Input
                            value={educationForm.school}
                            onChange={(e) =>
                              setEducationForm({
                                ...educationForm,
                                school: e.target.value,
                              })
                            }
                            placeholder="e.g., Stanford University"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Degree
                          </label>
                          <Input
                            value={educationForm.degree}
                            onChange={(e) =>
                              setEducationForm({
                                ...educationForm,
                                degree: e.target.value,
                              })
                            }
                            placeholder="e.g., Bachelor of Science"
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Field of Study
                        </label>
                        <Input
                          value={educationForm.fieldOfStudy}
                          onChange={(e) =>
                            setEducationForm({
                              ...educationForm,
                              fieldOfStudy: e.target.value,
                            })
                          }
                          placeholder="e.g., Computer Science"
                          className="w-full"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Start Date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {educationForm.startDate
                                  ? format(new Date(educationForm.startDate), "MMM dd, yyyy")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  educationForm.startDate
                                    ? new Date(educationForm.startDate)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setEducationForm({
                                    ...educationForm,
                                    startDate: date ? format(date, "yyyy-MM-dd") : "",
                                  })
                                }
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1950-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            End Date
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                disabled={educationForm.isCurrentlyStudying}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {educationForm.endDate
                                  ? format(new Date(educationForm.endDate), "MMM dd, yyyy")
                                  : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={
                                  educationForm.endDate
                                    ? new Date(educationForm.endDate)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  setEducationForm({
                                    ...educationForm,
                                    endDate: date ? format(date, "yyyy-MM-dd") : "",
                                  })
                                }
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1950-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={educationForm.isCurrentlyStudying}
                            onChange={(e) =>
                              setEducationForm({
                                ...educationForm,
                                isCurrentlyStudying: e.target.checked,
                                endDate: e.target.checked ? "" : educationForm.endDate,
                              })
                            }
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-foreground">I currently study here</span>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          value={educationForm.description}
                          onChange={(e) =>
                            setEducationForm({
                              ...educationForm,
                              description: e.target.value,
                            })
                          }
                          placeholder="Describe your studies, achievements, etc..."
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-border">
                        <Button
                          onClick={handleSaveEducation}
                          disabled={isEducationLoading}
                          className="flex-1"
                        >
                          {isEducationLoading
                            ? (editingEducationId ? "Updating..." : "Adding...")
                            : (editingEducationId ? "Update Education" : "Add Education")}
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Education List */}
                  {profile.education && profile.education.length > 0 ? (
                    <div className="space-y-4">
                      {profile.education.map((edu, index) => (
                        <div
                          key={index}
                          className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {edu.degree} in {edu.fieldOfStudy}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {edu.school}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditEducation(edu as any)}
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button
                                onClick={() => handleDeleteEducation(edu.id)}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {new Date(edu.startDate).toLocaleDateString()}{" "}
                            {edu.endDate || edu.isCurrentlyStudying
                              ? `- ${
                                  edu.isCurrentlyStudying
                                    ? "Present"
                                    : new Date(edu.endDate || "").toLocaleDateString()
                                }`
                              : ""}
                          </p>
                          {edu.description && (
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No education added yet
                    </p>
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
