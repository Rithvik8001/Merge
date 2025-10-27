import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, MessageSquare, Settings, ChevronRight } from "lucide-react";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Border Grid */}
        <section className="border-l border-r border-border max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-16 border-b border-border/50">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
              <span className="text-primary">Ship friendships</span>
              <br />
              <span className="scribble-underline">not bugs</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Where developers stop shipping bugs and start shipping
              friendships.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => navigate("/signup")}
            >
              Get started free <ChevronRight size={18} />
            </Button>
          </div>
        </section>

        {/* Features Grid Section */}
        <section
          id="features"
          className="border-l border-r border-border max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20 border-b border-border/50"
        >
          <div className="space-y-2 mb-12">
            <h2 className="text-4xl font-bold text-foreground">Features</h2>
            <p className="text-muted-foreground">
              Everything you need to build your network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-border">
            {[
              {
                icon: Users,
                title: "Smart Matching",
                description:
                  "Discover developers who share your interests and professional goals.",
              },
              {
                icon: MessageSquare,
                title: "Real-time Chat",
                description:
                  "Connect instantly with matched developers through our messaging system.",
              },
              {
                icon: Settings,
                title: "Profile Management",
                description:
                  "Customize your profile with skills and interests. Full control over what others see.",
              },
              {
                icon: Users,
                title: "Connection Requests",
                description:
                  "Send and receive connection requests. Build your network with the right people.",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              const isLastRow = index >= 2;
              const isRightCol = index % 2 === 1;
              return (
                <div
                  key={index}
                  className={`p-6 md:p-8 border-border ${isRightCol ? "border-l" : ""} ${!isLastRow ? "border-b" : ""}`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                      <Icon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="border-l border-r border-border max-w-4xl mx-auto px-6 md:px-12 py-16 md:py-20 border-b border-border"
        >
          <div className="space-y-2 mb-12">
            <h2 className="text-4xl font-bold text-foreground">How it works</h2>
            <p className="text-muted-foreground">
              Three simple steps to start building your network
            </p>
          </div>

          <div className="space-y-0 border border-border">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description:
                  "Sign up with your email and create a profile highlighting your skills and interests.",
              },
              {
                step: "02",
                title: "Discover & Connect",
                description:
                  "Browse curated matches and send connection requests to people you want to know.",
              },
              {
                step: "03",
                title: "Start Networking",
                description:
                  "Chat, share ideas, and build meaningful professional relationships in real-time.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`border-border p-6 md:p-8 flex gap-6 md:gap-8 ${index !== 2 ? "border-b" : ""}`}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary/20 w-20 flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1 py-2">
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
