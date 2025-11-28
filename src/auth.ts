// src/auth.ts
import {
  PublicClientApplication,
  type Configuration,
  type AccountInfo,
  BrowserAuthError,
} from "@azure/msal-browser";

/* ===========================
    MSAL CONFIG
=========================== */
const msalConfig: Configuration = {
  auth: {
    clientId: "e6ab8da5-9981-4a10-8892-d6c24c2dca88",
    authority: "https://login.microsoftonline.com/39282642-8418-47f5-bdec-4c1dfbcf42e9",
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

/* ===========================
    SCOPES
=========================== */
export const loginRequest = {
  scopes: [import.meta.env.VITE_API_SCOPE as string],
};

/* ===========================
    MAIN LOGIN FUNCTION
    ⬇ THIS IS WHERE FIX ADDED
=========================== */
export async function ensureSignedIn(): Promise<AccountInfo> {
  const accounts = msalInstance.getAllAccounts();
  if (accounts && accounts[0]) return accounts[0];

  try {
    // Try silent login first
    const sso = await msalInstance.ssoSilent(loginRequest);
    return sso.account!;
  } catch (err: any) {
    // 🔥 CATCH popup conflict & redirect out
    if (err instanceof BrowserAuthError && err.errorCode === "interaction_in_progress") {
      console.warn("⚠ interaction_in_progress → redirect to SecureKloud...");
      window.location.href = "https://www.securekloud.com/";
      throw err;
    }

    try {
      // 🔥 Popup login attempt
      const res = await msalInstance.loginPopup(loginRequest);
      return res.account!;
    } catch (popupErr: any) {
      console.error("❌ Final MSAL login failed → redirecting to SecureKloud");

      // If ANY login fails → redirect
      window.location.href = "https://www.securekloud.com/";
      throw popupErr;
    }
  }
}

/* ===========================
    ACQUIRE TOKEN SAFE MODE
=========================== */
export async function acquireTokenForApi(account?: AccountInfo) {
  const acc = account || (await ensureSignedIn());
  try {
    const result = await msalInstance.acquireTokenSilent({
      account: acc,
      scopes: loginRequest.scopes,
    });
    return result.accessToken;
  } catch {
    window.location.href = "https://www.securekloud.com/";
    throw new Error("Auth failed — redirected to SecureKloud");
  }
}
