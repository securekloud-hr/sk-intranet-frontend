// src/lib/api.ts
// import { msalInstance, loginRequest } from "@/Pages/auth";

import { loginRequest, msalInstance } from "@/auth";


const API_BASE = import.meta.env.VITE_API_URL

// Acquire ID token from MSAL
export async function getIdToken(): Promise<string> {
  await msalInstance.initialize();
  await msalInstance.handleRedirectPromise();

  const account = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];
  if (!account) throw new Error("No MSAL account found");

  const tokenResp = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
  return tokenResp.idToken;
}

// Helper fetch wrapper
export async function apiFetch(path: string, init: RequestInit = {}) {
  const idToken = await getIdToken();
  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${idToken}`);
  headers.set("Content-Type", headers.get("Content-Type") || "application/json");
  return fetch(`${API_BASE}${path}`, { ...init, headers });
}
