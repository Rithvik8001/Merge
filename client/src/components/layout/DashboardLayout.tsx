import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Compass,
  Users,
  Clock,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      title: "Discover",
      url: "/dashboard",
      icon: Compass,
    },
    {
      title: "Requests",
      url: "/requests",
      icon: Clock,
    },
    {
      title: "Connections",
      url: "/connections",
      icon: Users,
    },
    {
      title: "Messages",
      url: "/messages",
      icon: MessageCircle,
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleNavigation = (url: string) => {
    navigate(url);
    setMobileDrawerOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        {/* Modern Sidebar - Desktop Only */}
        <Sidebar className="hidden md:flex w-64 border-r border-border bg-white dark:bg-slate-950/50 text-foreground">
          <SidebarHeader className="px-6 py-4 border-b border-border" />

          <SidebarContent className="px-4 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;

                return (
                  <button
                    key={item.url}
                    onClick={() => navigate(item.url)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 shrink-0 transition-colors",
                        isActive ? "text-primary" : "",
                      )}
                    />
                    <span className="flex-1 text-left">{item.title}</span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-lg" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 mt-4 border-t border-border">
              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span className="flex-1 text-left">Settings</span>
              </button>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t border-border/40 px-4 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 h-auto hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      {user?.photoUrl ? (
                        <AvatarImage src={user.photoUrl} alt={user.userName} />
                      ) : null}
                      <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 border border-primary/20 text-xs font-bold text-primary">
                        {user?.userName?.[0]?.toUpperCase() ||
                          user?.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {user?.userName || "Developer"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="gap-2 cursor-pointer"
                >
                  <span className="text-base">👤</span>
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <div className="px-2 py-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                    Theme
                  </p>
                  <div className="flex justify-center">
                    <ModeToggle />
                  </div>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-linear-to-br from-background via-background to-muted/10">
          {/* Modern Top Bar */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-border/40 flex items-center justify-between bg-white/40 dark:bg-slate-900/20 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Mobile Menu Icon */}
              <div className="md:hidden">
                <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 rounded-lg p-0 hover:bg-muted"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="px-4 py-4 border-b border-border">
                      <SheetTitle>Navigation</SheetTitle>
                      <SheetDescription>Navigate to different sections of the app</SheetDescription>
                    </SheetHeader>
                    <nav className="flex flex-col gap-2 px-4 py-4">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.url;
                        return (
                          <button
                            key={item.url}
                            onClick={() => handleNavigation(item.url)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                            )}
                          >
                            <Icon
                              className={cn(
                                "w-5 h-5 shrink-0 transition-colors",
                                isActive ? "text-primary" : "",
                              )}
                            />
                            <span className="flex-1 text-left">{item.title}</span>
                          </button>
                        );
                      })}
                    </nav>
                    <div className="border-t border-border px-4 py-4">
                      <button
                        onClick={() => handleNavigation("/settings")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                      >
                        <Settings className="w-5 h-5 shrink-0" />
                        <span className="flex-1 text-left">Settings</span>
                      </button>
                    </div>
                    <div className="border-t border-border px-4 py-4">
                      <button
                        onClick={() => handleNavigation("/profile")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 mb-2"
                      >
                        <span className="text-base">👤</span>
                        <span className="flex-1 text-left">My Profile</span>
                      </button>
                      <div className="px-2 py-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                          Theme
                        </p>
                        <div className="flex justify-center">
                          <ModeToggle />
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="flex-1 text-left">Logout</span>
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span>
                  Welcome back,{" "}
                  <span className="font-semibold text-foreground">
                    {user?.userName ||
                      user?.email?.split("@")[0] ||
                      "Developer"}
                  </span>
                </span>
              </div>

              {/* Mobile Username */}
              <div className="sm:hidden flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {user?.userName || user?.email?.split("@")[0] || "Developer"}
                </p>
              </div>
            </div>

            {/* Mobile User Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-lg p-0 hover:bg-muted"
                  >
                    <Avatar className="w-6 h-6">
                      {user?.photoUrl ? (
                        <AvatarImage src={user.photoUrl} alt={user.userName} />
                      ) : null}
                      <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-xs font-bold text-primary rounded-md">
                        {user?.userName?.[0]?.toUpperCase() ||
                          user?.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => navigate("/dashboard")}
                    className="cursor-pointer gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Discover</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/requests")}
                    className="cursor-pointer gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Requests</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/connections")}
                    className="cursor-pointer gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Connections</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/messages")}
                    className="cursor-pointer gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer gap-2"
                  >
                    <span className="text-base">👤</span>
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="cursor-pointer gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
                      Theme
                    </p>
                    <div className="flex justify-center">
                      <ModeToggle />
                    </div>
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};
