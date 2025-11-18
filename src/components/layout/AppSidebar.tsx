import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  FileText,
  Users,
  Calendar,
  HelpCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building,
  BarChart3,
  Network,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

type UserLike = {
  name?: string;
  email?: string;
  role?: "admin" | "user";
  fullName?: string;
  type?: string;
};

export function AppSidebar({ user }: { user?: UserLike }) {
  const [collapsed, setCollapsed] = useState(false);

  // ✅ Read user info cached from MSAL + backend role
  const cachedUser = useMemo<UserLike | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined") return JSON.parse(raw);
    } catch {}
    return null;
  }, []);

  // ✅ Determine role — prefer explicit `role` from MongoDB
  const role = user?.role || cachedUser?.role || "user";
  const isAdmin = role === "admin";

  // ✅ Sidebar navigation items
  const mainNavItems: NavItem[] = [
    { title: "HR", href: "/hr", icon: Users },
    { title: "Policies", href: "/policies", icon: FileText },

    { title: "Holidays", href: "/holidays", icon: Calendar },
    { title: "Employee Engagement", href: "/engagement", icon: Users },
    { title: "Learning & Development", href: "/learning", icon: GraduationCap },
    { title: "Internal Jobs", href: "/jobs", icon: Building },
    { title: "Talent Acquisition", href: "/talent", icon: Users },
    { title: "Performance", href: "/performance", icon: BarChart3 },
    { title: "Org Structure", href: "/org", icon: Network },
    { title: "Support", href: "/faqs", icon: HelpCircle },
  ];

  // ✅ Add "Admin Dashboard" only for admin users
  if (isAdmin) {
    mainNavItems.push({
      title: "Admin Dashboard",
      href: "/admin",
      icon: Shield,
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <Home size={20} className="text-white" />
            <span className="text-xl font-bold text-white">SecureKloud</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-white"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-sidebar-accent transition-all"
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
