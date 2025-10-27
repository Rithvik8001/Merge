import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/authStore";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { changePassword, isLoading } = useProfile();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
    match: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Validate password requirements
  useEffect(() => {
    const password = passwordForm.newPassword;
    const confirm = passwordForm.confirmPassword;

    setValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      match: password.length > 0 && password === confirm,
    });
  }, [passwordForm.newPassword, passwordForm.confirmPassword]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleShowPassword = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!passwordForm.currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!passwordForm.newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Check if all validations pass
    if (!Object.values(validations).every((v) => v)) {
      toast.error("Password does not meet all requirements");
      return;
    }

    try {
      setIsSaving(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      // Clear form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password changed successfully!");
    } catch (err) {
      // Error handled in hook
    } finally {
      setIsSaving(false);
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Settings
            </h1>
            <p className="text-base text-muted-foreground">
              Manage your account security and preferences
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 sm:px-8 py-8 sm:py-12 max-w-4xl mx-auto w-full">
            {/* Change Password Card */}
            <div className="bg-card border border-border rounded-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Change Password
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                Update your password to keep your account secure. Use a strong
                password with a mix of characters.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter your current password"
                      disabled={isSaving}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword("current")}
                      disabled={isSaving}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPasswords.current ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter your new password"
                      disabled={isSaving}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword("new")}
                      disabled={isSaving}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPasswords.new ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Password must contain:
                    </p>
                    <div className="space-y-1.5">
                      <div
                        className={cn(
                          "flex items-center gap-2 text-xs",
                          validations.length
                            ? "text-green-600 dark:text-green-500"
                            : "text-muted-foreground",
                        )}
                      >
                        {validations.length ? (
                          <Check size={14} />
                        ) : (
                          <AlertCircle size={14} />
                        )}
                        <span>At least 8 characters</span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2 text-xs",
                          validations.uppercase
                            ? "text-green-600 dark:text-green-500"
                            : "text-muted-foreground",
                        )}
                      >
                        {validations.uppercase ? (
                          <Check size={14} />
                        ) : (
                          <AlertCircle size={14} />
                        )}
                        <span>One uppercase letter</span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2 text-xs",
                          validations.number
                            ? "text-green-600 dark:text-green-500"
                            : "text-muted-foreground",
                        )}
                      >
                        {validations.number ? (
                          <Check size={14} />
                        ) : (
                          <AlertCircle size={14} />
                        )}
                        <span>One number</span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2 text-xs",
                          validations.special
                            ? "text-green-600 dark:text-green-500"
                            : "text-muted-foreground",
                        )}
                      >
                        {validations.special ? (
                          <Check size={14} />
                        ) : (
                          <AlertCircle size={14} />
                        )}
                        <span>One special character (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your new password"
                      disabled={isSaving}
                      className={cn(
                        "pr-10",
                        passwordForm.confirmPassword &&
                          !validations.match &&
                          "border-red-500 focus:ring-red-500",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword("confirm")}
                      disabled={isSaving}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {passwordForm.confirmPassword && !validations.match && (
                    <p className="text-xs text-red-500 mt-2">
                      Passwords do not match
                    </p>
                  )}

                  {passwordForm.confirmPassword && validations.match && (
                    <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                      Passwords match
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button
                    type="submit"
                    disabled={
                      isSaving ||
                      isLoading ||
                      !Object.values(validations).every((v) => v) ||
                      !passwordForm.currentPassword
                    }
                    className="flex-1"
                  >
                    {isSaving || isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      })
                    }
                    variant="outline"
                    disabled={isSaving || isLoading}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </form>
            </div>

            {/* Additional Security Info */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Password Security Tips
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>
                  • Use a unique password that you don't use on other websites
                </li>
                <li>• Never share your password with anyone</li>
                <li>• Change your password regularly for better security</li>
                <li>
                  • If your account feels compromised, change your password
                  immediately
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
