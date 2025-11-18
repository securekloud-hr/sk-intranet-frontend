// src/components/layout/AppLayout.tsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  const [user, setUser] = useState<any>(null);

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
      <AppSidebar user={user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader user={user} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="container mx-auto fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
