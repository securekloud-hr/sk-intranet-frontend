import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Banknote,
  Computer,
  Users,
  Trophy,
  Target,
  Calendar,
  Binoculars,
  HelpCircle,
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
};

export function AppSidebar({
  role,
}: {
  role: "admin" | "manager" | "user";
}) {
  // ✅ FIX: collapsed state was missing
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = role === "admin";

  // ✅ Base navigation
  const mainNavItems: NavItem[] = [
     { title: "Admin", href: "/admin", icon: Users },
    { title: "HR", href: "/hr", icon: Users },
    { title: "IT", href: "/it", icon: Computer },
    { title: "Finance", href: "/finance", icon: Banknote },
    { title: "Holidays", href: "/holidays", icon: Calendar },
    { title: "Employee Engagement", href: "/engagement", icon: Trophy },
    { title: "Learning & Development", href: "/learning", icon: GraduationCap },
    { title: "Talent Acquisition", href: "/talent", icon: Target },
    { title: "Time Entry 🚧", href: "/timeentry", icon: Clock },
    { title: "Notice Board 🚧", href: "/noticeboard", icon: Building },
    { title: "Survey 🚧", href: "/survey", icon: Binoculars },
    { title: "Performance 🚧", href: "/performance", icon: BarChart3 },
    { title: "Org Structure", href: "/org", icon: Network },
    { title: "Support", href: "/faqs", icon: HelpCircle },
  ];

  // ✅ Admin Dashboard should appear AFTER Support
  if (isAdmin) {
    mainNavItems.push({
      title: "Admin Dashboard",
      href: "/admindashboard",
      icon: Shield,
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link to="/" className="flex items-center space-x-2">
            <Home size={20} className="text-white" />
            <span className="text-xl font-bold text-white">Home</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-1">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-white hover:bg-sidebar-accent"
          >
            <item.icon className="h-5 w-5" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
