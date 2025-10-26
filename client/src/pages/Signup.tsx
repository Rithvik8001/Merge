import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.png";
import { ChevronRight } from "lucide-react";

export const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call backend signup API
    console.log("Signup:", formData);
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
            <span className="text-sm text-muted-foreground">Already have an account?</span>
            <Link to="/login">
              <Button size="sm" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Signup Card */}
        <div className="w-full max-w-md">
          <div className="border border-border rounded-sm p-8 md:p-12 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Join <span className="text-primary">Merge</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Create your account and start shipping friendships
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Username
                </label>
                <Input
                  type="text"
                  name="userName"
                  placeholder="Choose a username"
                  value={formData.userName}
                  onChange={handleChange}
                  className="border border-border/50 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  6-15 characters. Letters, numbers, and underscores only.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="border border-border/50 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Min 8 characters with uppercase, lowercase, number & special char
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="border border-border/50 focus:border-primary"
                />
              </div>

              <Button type="submit" className="w-full gap-2" size="lg">
                Create account <ChevronRight size={18} />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Already a member?
                </span>
              </div>
            </div>

            {/* Sign in link */}
            <Link to="/login">
              <Button variant="outline" className="w-full" size="lg">
                Sign in instead
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
