import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, isLoading } = useForgotPassword();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch {
      // Error handled in hook
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="space-y-3 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <p className="mb-2">
                The reset link will expire in <span className="font-semibold">10 minutes</span>.
              </p>
              <p>If you don't see the email, check your spam folder or request a new link.</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="w-full"
              >
                Try Different Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
          <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>
            No worries! Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-10"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-10"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
