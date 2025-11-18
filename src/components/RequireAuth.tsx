// src/components/RequireAuth.tsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { msalInstance } from "@/auth";
 // ✅ adjust if your path is /Pages/auth.ts
import API from "@/config";

type StoredUser = {
  name: string;
  email: string;
  role?: "user" | "admin";
};

export default function RequireAuth() {
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log("🔹 Initializing MSAL...");
        await msalInstance.initialize(); // ✅ critical fix

        // 1️⃣ Try to get account from cache or trigger login
        let account = msalInstance.getAllAccounts()[0];
        if (!account) {
          console.log("🔹 No cached account, logging in with popup...");
          await msalInstance.loginPopup({
            scopes: ["openid", "profile", "email"],
          });
          account = msalInstance.getAllAccounts()[0];
        }

        if (!account) throw new Error("MSAL login failed — no account found");

        // 2️⃣ Extract Microsoft data
        const msalName =
          (account.idTokenClaims?.name as string) ||
          (account.name as string) ||
          "User";
        const msalEmail =
          (account.idTokenClaims?.preferred_username as string) ||
          (account.username as string) ||
          "";

        if (!msalEmail) throw new Error("No email returned from Microsoft");

        console.log("✅ Logged in as:", msalName, msalEmail);

        // 3️⃣ Upsert user into Mongo
        try {
          await fetch(`${API}/api/aad/ensure-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: msalName,
              email: msalEmail,
              jobTitle: "",
            }),
          });
        } catch (err) {
          console.warn("⚠️ ensure-user failed, continuing:", err);
        }

        // 4️⃣ Retrieve role (admin/user)
        let role: "user" | "admin" = "user";
        try {
          const res = await fetch(
            `${API}/api/aad/me?email=${encodeURIComponent(msalEmail)}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data?.role === "admin") role = "admin";
          }
        } catch {
          console.warn("⚠️ backend /me fetch failed — defaulting to user");
        }

        // 5️⃣ Save locally for AppLayout + Sidebar
        const stored: StoredUser = { name: msalName, email: msalEmail, role };
        localStorage.setItem("user", JSON.stringify(stored));

        console.log("✅ User stored locally:", stored);
        setBooting(false);
      } catch (e: any) {
        console.error("❌ MSAL init/login error:", e);
        setError(e?.message || "Sign-in failed");
        setBooting(false);
      }
    })();
  }, []);

  if (booting)
    return (
      <div className="flex h-screen items-center justify-center">
        <p>🔄 Signing you in with Microsoft...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex h-screen items-center justify-center text-center text-red-600">
        <div>
          <p>Error: {error}</p>
          <p>Please refresh and try again.</p>
        </div>
      </div>
    );

  return <Outlet />;
}
