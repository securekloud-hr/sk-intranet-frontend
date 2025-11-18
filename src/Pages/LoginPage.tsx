// src/Pages/LoginPage.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { msalInstance, loginRequest } from "./auth";
import { InteractionRequiredAuthError, AccountInfo } from "@azure/msal-browser";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await msalInstance.initialize();
      await msalInstance.handleRedirectPromise();

      let account: AccountInfo | null =
        msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0] || null;

      // 1️⃣ No existing account → try silent SSO or redirect to Microsoft login
      if (!account) {
        try {
          const sso = await msalInstance.ssoSilent(loginRequest);
          account = sso.account!;
          msalInstance.setActiveAccount(account);
        } catch {
          await msalInstance.loginRedirect({ ...loginRequest, prompt: "select_account" });
          return;
        }
      }

      // 2️⃣ Ensure user exists in your MongoDB
      await apiFetch("/api/aad/ensure-user", { method: "POST", body: JSON.stringify({}) });

      // 3️⃣ Fetch user to get their role
      const me = await (await apiFetch("/api/aad/me")).json();

      // 4️⃣ Redirect based on user type
      if (me?.type === "admin") navigate("/admin", { replace: true });
      else navigate("/home", { replace: true });
    })().catch((err) => {
      if (err instanceof InteractionRequiredAuthError) {
        msalInstance.acquireTokenRedirect({ ...loginRequest, prompt: "consent" });
      } else {
        console.error("Login error:", err);
      }
    });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-[60vh]">
      <p className="text-gray-500 text-lg">Signing you in with Microsoft…</p>
    </div>
  );
}
