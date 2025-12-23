import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./types/window.d.ts";

// Preload kontrolü
if (typeof window !== "undefined") {
  console.log("dockevWindow available:", !!window.dockevWindow);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
