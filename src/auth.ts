// src/auth.ts
import {
  PublicClientApplication,
  type Configuration,
  type AccountInfo,
} from "@azure/msal-browser";

/**
 * This is your SPA (frontend) app registration.
 * Leave clientId as your SPA's Application (client) ID.
 */
const msalConfig: Configuration = {
  auth: {
    clientId: "e6ab8da5-9981-4a10-8892-d6c24c2dca88", // ✅ SPA clientId (frontend)
    authority: "https://login.microsoftonline.com/39282642-8418-47f5-bdec-4c1dfbcf42e9",
    redirectUri: window.location.origin, // http://localhost:8081 in dev
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

/**
 * IMPORTANT:
 * VITE_API_SCOPE must point to your BACKEND app’s exposed scope, e.g.
 * VITE_API_SCOPE=api://3b7fc1c3-39e2-41aa-96ee-72f90faf4174/user_impersonation
 * (3b7f... is the *backend* app registration's client ID, not the SPA one)
 */
export const loginRequest = {
  scopes: [import.meta.env.VITE_API_SCOPE as string],
};

// Ensure user is signed in (silent → popup)
export async function ensureSignedIn(): Promise<AccountInfo> {
  const accounts = msalInstance.getAllAccounts();
  if (accounts && accounts[0]) return accounts[0];

  try {
    const sso = await msalInstance.ssoSilent(loginRequest);
    return sso.account!;
  } catch {
    const res = await msalInstance.loginPopup(loginRequest);
    return res.account!;
  }
}

// Acquire token for your backend API (Graph OBO will happen on backend)
export async function acquireTokenForApi(account?: AccountInfo) {
  const acc = account || (await ensureSignedIn());
  const result = await msalInstance.acquireTokenSilent({
    account: acc,
    scopes: loginRequest.scopes,
  });
  return result.accessToken;
}
