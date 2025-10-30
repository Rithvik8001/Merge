import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmailVerification } from "@/hooks/useEmailVerification";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyEmailOtp, resendVerificationOtp, isLoading } = useEmailVerification();

  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle resend countdown
  useEffect(() => {
    if (resendCountdown <= 0) return;

    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCountdown]);

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-border/50">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-2xl font-bold">Error</CardTitle>
            <CardDescription>No email provided</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/signup")} className="w-full">
              Back to Signup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }

    try {
      setIsVerifying(true);
      await verifyEmailOtp(email, otp);
      // On success, redirect to success page
      navigate("/verify-email-success");
    } catch {
      // Error handled in hook
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendVerificationOtp(email);
      setResendCountdown(60);
      setOtp(""); // Clear OTP input
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            We sent a 6-digit OTP to <span className="font-semibold text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-foreground">
                Enter OTP
              </label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(value);
                }}
                disabled={isLoading || isVerifying}
                maxLength={6}
                className="h-12 text-center text-2xl tracking-widest font-mono"
              />
            </div>

            {/* Help text */}
            <div className="text-xs text-muted-foreground">
              Check your email inbox or spam folder for the OTP. If you don't see it, try requesting a new one below.
            </div>

            {/* Verify Button */}
            <Button
              type="submit"
              disabled={isLoading || isVerifying || otp.length !== 6}
              className="w-full h-10"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            {/* Resend OTP Section */}
            <div className="border-t border-border pt-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">Didn't receive the OTP?</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={isLoading || resendCountdown > 0}
                  className="w-full"
                >
                  {resendCountdown > 0 ? (
                    <>Resend in {resendCountdown}s</>
                  ) : isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </Button>
              </div>
            </div>

            {/* Change Email Link */}
            <div className="text-center">
              <Link
                to="/signup"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Use a different email
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
