// src/components/RequireAuth.tsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { msalInstance } from "@/auth";
import API from "@/config";
import { BrowserAuthError } from "@azure/msal-browser";

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
        await msalInstance.initialize();

        // 1️⃣ Try cached account
        let account = msalInstance.getAllAccounts()[0];

        // 2️⃣ If no cached account → loginPopup
        if (!account) {
          console.log("🔹 No cached account, logging in with popup...");

          try {
            await msalInstance.loginPopup({
              scopes: ["openid", "profile", "email"],
            });
          } catch (loginErr: any) {
            console.error("❌ loginPopup error:", loginErr);

            // 🔥 if interaction already in progress → redirect
            if (
              loginErr instanceof BrowserAuthError &&
              loginErr.errorCode === "interaction_in_progress"
            ) {
              console.warn(
                "⚠ interaction_in_progress during loginPopup → redirecting to SecureKloud"
              );
              window.location.href = "https://www.securekloud.com/";
              return;
            }

            // Any other login failure → also redirect
            window.location.href = "https://www.securekloud.com/";
            return;
          }

          account = msalInstance.getAllAccounts()[0];
        }

        if (!account) throw new Error("MSAL login failed — no account found");

        // 3️⃣ Extract Microsoft data
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

        // 4️⃣ Upsert user into Mongo
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

        // 5️⃣ Retrieve role (admin/user)
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

        // 6️⃣ Save locally for AppLayout + Sidebar
        const stored: StoredUser = { name: msalName, email: msalEmail, role };
        localStorage.setItem("user", JSON.stringify(stored));

        console.log("✅ User stored locally:", stored);
        setBooting(false);
      } catch (e: any) {
        console.error("❌ MSAL init/login error:", e);

        // 🔥 Catch interaction_in_progress from initialize / other MSAL calls
        if (
          e instanceof BrowserAuthError &&
          e.errorCode === "interaction_in_progress"
        ) {
          console.warn(
            "⚠ interaction_in_progress during init → redirecting to SecureKloud"
          );
          window.location.href = "https://www.securekloud.com/";
          return;
        }

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
