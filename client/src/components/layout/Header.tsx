import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { ModeToggle } from "@/components/mode-toggle";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-l border-r border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="w-full max-w-4xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between md:justify-between">
        <div className="flex items-center flex-1">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Merge" className="w-8 h-8 object-contain" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-muted rounded-sm transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("how-it-works")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            How it works
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
          <ModeToggle />
          <Link to="/login">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Get started</Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b border-border md:hidden">
            <nav className="flex flex-col gap-4 p-4">
              <a
                href="#features"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                How it works
              </a>
              <div className="border-t border-border/50 pt-4 mt-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-foreground">Theme</span>
                  <ModeToggle />
                </div>
              </div>
              <Link to="/login" className="w-full">
                <Button variant="outline" size="sm" className="justify-start w-full">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup" className="w-full">
                <Button size="sm" className="w-full">
                  Get started
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
