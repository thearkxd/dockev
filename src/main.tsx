import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./types/window.d.ts";

// Preload kontrolü
if (typeof window !== "undefined") {
  console.log("dockevWindow available:", !!window.dockevWindow);
  console.log("Root element:", document.getElementById("root"));
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
  throw new Error("Root element not found");
}

import { HashRouter } from "react-router-dom";

// ...

console.log("Rendering App component...");
createRoot(rootElement).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
console.log("App component rendered!");
