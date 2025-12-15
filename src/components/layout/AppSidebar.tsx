import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  FileText,
  Handshake,
  Banknote,
  Computer,
  Users,
  Trophy,
  Target,
  Calendar,
  Binoculars,
  HelpCircle,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building,
  BarChart3,
  Network,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  tooltip: string;
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
    { title: "Admin", href: "/admin", icon: Handshake, tooltip: "Admin Dashboard"},
    { title: "HR", href: "/hr", icon: Users, tooltip: "" },
    { title: "IT", href: "/it", icon: Computer, tooltip: "" },
    { title: "Finance", href: "/finance", icon: Banknote, tooltip: "" },
    
    { title: "Holidays", href: "/holidays", icon: Calendar, tooltip: "" },
    { title: "Employee Engagement", href: "/engagement", icon: Trophy, tooltip: "" },

    { title: "Learning & Development", href: "/learning", icon: GraduationCap, tooltip: "" },

    { title: "Talent Acquisition", href: "/talent", icon: Target, tooltip: "" },
    { title: "Time Entry", href: "/timeentry", icon: Clock, tooltip: "" },   
    { title: "Notice Board", href: "/noticeboard", icon: Building, tooltip: "" },
    { title: "Survey", href: "/survey", icon: Binoculars, tooltip: "" },    
    
    { title: "Performance", href: "/performance", icon: BarChart3, tooltip: "" },
    { title: "Org Structure", href: "/org", icon: Network, tooltip: "" },
    { title: "Support", href: "/faqs", icon: HelpCircle, tooltip: "" },
  ];

  // ✅ Add "Admin Dashboard" only for admin users
  if (isAdmin) {
    mainNavItems.push({
      title: "Admin Dashboard",
      href: "/admindashboard",
      icon: Shield, tooltip: "",
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
          {collapsed ? <Home size={18} /> : <ChevronLeft size={18} />}
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
