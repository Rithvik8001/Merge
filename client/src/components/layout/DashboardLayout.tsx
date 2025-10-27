import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
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
  Compass,
  Users,
  Clock,
  Settings,
  LogOut,
  ChevronDown,
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
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Dark Sidebar */}
        <Sidebar className="w-64 border-r border-border bg-slate-950 text-white">
          <SidebarHeader className="px-6 py-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="font-bold text-lg">Merge</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-6">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;

                return (
                  <button
                    key={item.url}
                    onClick={() => navigate(item.url)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-primary text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-800 px-3 py-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3 py-2 h-auto text-white hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {user?.userName?.[0]?.toUpperCase() ||
                        user?.email?.[0]?.toUpperCase() ||
                        "U"}
                    </div>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm font-medium text-white truncate">
                        {user?.userName || "Developer"}
                      </span>
                      <span className="text-xs text-slate-400 truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 flex-shrink-0 opacity-60" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <span className="flex-1">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="flex-1">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="flex-1">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Top Bar */}
          <div className="px-8 py-4 border-b border-border flex items-center justify-between bg-background/50">
            <span className="text-sm text-muted-foreground">
              Welcome back, <span className="font-semibold text-foreground">{user?.userName || "Developer"}</span>
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};
