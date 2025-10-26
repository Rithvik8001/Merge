import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b border-l border-r border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="w-full max-w-4xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Merge" className="w-8 h-8 object-contain" />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-muted rounded-sm transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            How it works
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm">Get started</Button>
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
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
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
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                How it works
              </a>
              <Button variant="ghost" size="sm" className="justify-start">
                Sign in
              </Button>
              <Button size="sm" className="w-full">
                Get started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
