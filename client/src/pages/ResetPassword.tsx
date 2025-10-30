import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useResetPassword } from "@/hooks/useResetPassword";
import {
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface PasswordRequirement {
  label: string;
  regex: RegExp;
}

const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "At least 8 characters", regex: /.{8,}/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One number", regex: /[0-9]/ },
  { label: "One special character (!@#$%^&*)", regex: /[!@#$%^&*]/ },
];

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyResetToken, resetPassword, isLoading } = useResetPassword();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isValidToken, setIsValidToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenError, setTokenError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenError("No reset token provided");
        setIsVerifying(false);
        return;
      }

      console.log("🔍 Verifying token on frontend:", token);
      const isValid = await verifyResetToken(token);
      console.log("Token valid result:", isValid);
      if (isValid) {
        setIsValidToken(true);
      } else {
        setTokenError("Invalid or expired reset token. Please request a new one.");
      }
      setIsVerifying(false);
    };

    verifyToken();
  }, [token]);

  const checkRequirement = (requirement: PasswordRequirement): boolean => {
    return requirement.regex.test(formData.password);
  };

  const allRequirementsMet = PASSWORD_REQUIREMENTS.every(checkRequirement);
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.password.length > 0;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRequirementsMet) {
      toast.error("Password does not meet all requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token!, formData.password, formData.confirmPassword);
      setResetSuccess(true);
    } catch {
      // Error handled in hook
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying reset token...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Invalid Token</CardTitle>
            <CardDescription>{tokenError}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/forgot-password")}
                className="w-full"
              >
                Request New Reset Link
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Password Reset Successful!</CardTitle>
            <CardDescription>
              Your password has been reset successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/login")}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Create a new password for your account
            {email && ` (${email})`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="h-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Password Requirements
              </p>
              <div className="space-y-2">
                {PASSWORD_REQUIREMENTS.map((requirement) => (
                  <div
                    key={requirement.label}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        checkRequirement(requirement)
                          ? "bg-green-500/20"
                          : "bg-muted"
                      }`}
                    >
                      {checkRequirement(requirement) && (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                    </div>
                    <span
                      className={
                        checkRequirement(requirement)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {requirement.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Password Match Indicator */}
            {formData.password && formData.confirmPassword && (
              <div
                className={`text-sm font-medium flex items-center gap-2 ${
                  passwordsMatch
                    ? "text-green-500"
                    : "text-destructive"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    passwordsMatch ? "bg-green-500" : "bg-destructive"
                  }`}
                />
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !allRequirementsMet || !passwordsMatch}
              className="w-full h-10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
