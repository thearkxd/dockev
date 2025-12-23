import type { Module } from "../types/Module";
import { homedir } from "os";
import path from "path";

interface TechSignal {
  name: string;
  indicators: string[]; // File/folder names that indicate this tech
}

const TECH_SIGNALS: TechSignal[] = [
  {
    name: "React Native / Expo",
    indicators: ["app.json", "app.config.js", "expo.json", "package.json"],
    // Check for expo in package.json dependencies
  },
  {
    name: "React",
    indicators: ["package.json", "src/App.tsx", "src/App.jsx", "vite.config.ts", "vite.config.js"],
  },
  {
    name: "Node.js",
    indicators: ["package.json", "server.js", "index.js", "app.js"],
  },
  {
    name: "Python",
    indicators: ["requirements.txt", "setup.py", "pyproject.toml", "main.py", "app.py"],
  },
  {
    name: "Next.js",
    indicators: ["next.config.js", "next.config.ts", "pages/", "app/"],
  },
  {
    name: "Vue",
    indicators: ["vue.config.js", "vite.config.ts"],
  },
  {
    name: "Angular",
    indicators: ["angular.json", "src/main.ts"],
  },
  {
    name: "Django",
    indicators: ["manage.py", "settings.py"],
  },
  {
    name: "Flask",
    indicators: ["app.py", "flask_app.py"],
  },
  {
    name: "Go",
    indicators: ["go.mod", "main.go"],
  },
  {
    name: "Rust",
    indicators: ["Cargo.toml", "src/main.rs"],
  },
];

export interface DetectedModule {
  name: string;
  path: string;
  techStack: string[];
  confidence: number; // 0-1, how confident we are this is a module
}

/**
 * Detects modules in a project by scanning subdirectories
 */
export async function detectModules(projectPath: string): Promise<DetectedModule[]> {
  return new Promise((resolve) => {
    // Normalize path
    let normalizedPath = projectPath;
    if (projectPath.startsWith("~")) {
      normalizedPath = path.join(homedir(), projectPath.slice(1));
    }
    normalizedPath = path.resolve(normalizedPath);

    // This will be implemented in Electron main process
    // For now, return empty array
    resolve([]);
  });
}

/**
 * Gets technology stack for a specific directory
 */
export function detectTechStack(dirPath: string): string[] {
  // This will be implemented in Electron main process
  // For now, return empty array
  return [];
}

