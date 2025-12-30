// src/components/layout/AppLayout.tsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  const [user, setUser] = useState<any>(null);

  // ✅ SINGLE SOURCE OF TRUTH FOR ROLE
  const [role, setRole] = useState<"admin" | "user">("user");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined") {
        setUser(JSON.parse(raw));
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
    }
  }, []);

  if (!user)
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <p>Loading user details…</p>
      </div>
    );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ✅ Sidebar uses ROLE, not user */}
      <AppSidebar role={role} />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ✅ Header RESOLVES role from employee directory */}
        <AppHeader user={user} onRoleResolved={setRole} />

        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="container mx-auto fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
