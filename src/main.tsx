import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// 🧩 Add these imports
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/auth";  // your existing src/auth.ts file

// 🧠 Create root and wrap App inside MsalProvider
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);
