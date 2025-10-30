import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Subscript, Syringe } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidebarItem {
  title: string;
  href: string;
  icon: ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    title: "Users",
    href: "/users",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    title: "Admin Users",
    href: "/admin/users",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
        />
      </svg>
    ),
  },
  {
    title: "System Status",
    href: "/admin/system",
    icon: <Syringe />,
  },
  {
    title: "Subcription",
    href: "/admin/subscriptions",
    icon: <Subscript />,
  },
];

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout, user, refreshUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Refresh user data only when component mounts and only if user data is missing
  useEffect(() => {
    if (!user) {
      refreshUser();
    }
  }, [user, refreshUser]);

  const handleLogout = () => {
    logout();
    // Redirect happens in the logout function
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-lg transition-all duration-300 ease-in-out flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-gradient-to-r from-primary/5 to-transparent">
            {sidebarOpen && (
              <h1 className="text-lg font-bold flex items-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                <span className="bg-gradient-to-br from-primary to-accent text-primary-foreground p-2 rounded-lg mr-2 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                Admin Panel
              </h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto rounded-lg hover:bg-sidebar-accent transition-all"
            >
              {sidebarOpen ? (
                <ArrowLeft className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav>
              <ul className="space-y-1 px-2">
                {sidebarItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-3 text-sm transition-all duration-200",
                        location.pathname === item.href
                          ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md"
                          : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center justify-center transition-all",
                          location.pathname === item.href
                            ? "text-primary-foreground"
                            : "text-muted-foreground",
                          sidebarOpen ? "mr-3" : "mr-0 mx-auto"
                        )}
                      >
                        {item.icon}
                      </span>
                      {sidebarOpen && (
                        <span className="font-semibold text-sm">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Sidebar footer */}
          {sidebarOpen && (
            <div className="p-4 border-t border-sidebar-border bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-primary to-accent rounded-full w-10 h-10 flex items-center justify-center shadow-md">
                  <span className="font-bold text-primary-foreground text-sm">
                    {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Admin</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/40 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {sidebarItems.find((item) => item.href === location.pathname)
                  ?.title || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg hover:bg-accent relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User menu dropdown */}
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:ring-2 hover:ring-primary/50"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="bg-gradient-to-br from-primary to-accent rounded-full w-9 h-9 flex items-center justify-center shadow-md">
                    <span className="font-bold text-primary-foreground">
                      {user?.firstName?.charAt(0) ||
                        user?.name?.charAt(0) ||
                        "A"}
                    </span>
                  </div>
                </Button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-lg shadow-lg py-1 z-50 border border-border backdrop-blur-sm">
                    <button
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors rounded-md mx-1"
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="mx-auto max-w-7xl space-y-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
