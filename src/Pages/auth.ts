// src/auth.ts
import { PublicClientApplication, Configuration, AccountInfo } from "@azure/msal-browser";

const msalConfig: Configuration = {
  auth: {
    clientId: "e6ab8da5-9981-4a10-8892-d6c24c2dca88",
    authority: "https://login.microsoftonline.com/39282642-8418-47f5-bdec-4c1dfbcf42e9",
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: "localStorage", storeAuthStateInCookie: false },
};

export const msal = new PublicClientApplication(msalConfig);

export function getActiveAccount(): AccountInfo | null {
  const accts = msal.getAllAccounts();
  return accts.length ? accts[0] : null;
}

export async function ensureSignedIn(): Promise<void> {
  await msal.initialize();

  // if already signed in, we’re good
  if (getActiveAccount()) return;

  // try SSO silently (works if session cookie present)
  try {
    await msal.ssoSilent({ scopes: ["openid", "profile", "email"] });
    if (getActiveAccount()) return;
  } catch {}

  // fall back to redirect flow
  await msal.loginRedirect({ scopes: ["openid", "profile", "email"] });
}

export async function signOut() {
  const account = getActiveAccount();
  await msal.logoutRedirect({ account: account ?? undefined });
}
