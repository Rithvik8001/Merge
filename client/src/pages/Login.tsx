import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { ChevronRight, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, error, login } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-l border-r border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full max-w-4xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Merge" className="w-8 h-8 object-contain" />
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">New to Merge?</span>
            <Link to="/signup">
              <Button size="sm" variant="outline">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Login Card */}
        <div className="w-full max-w-md">
          <div className="border border-border rounded-sm p-8 md:p-12 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your Merge account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="border border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="border border-border/50 focus:border-primary"
                />
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in <ChevronRight size={18} />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  New to Merge?
                </span>
              </div>
            </div>

            {/* Sign up link */}
            <Link to="/signup">
              <Button variant="outline" className="w-full" size="lg">
                Create account
              </Button>
            </Link>

            {/* Footer link */}
            <div className="text-center pt-4">
              <Link
                to="/"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
