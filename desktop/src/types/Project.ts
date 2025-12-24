import type { Module } from "./Module";

export type ProjectConfig = {
  devServerCommand?: string; // Custom dev server command (e.g., "npm run dev", "yarn start")
  environmentVariables?: Record<string, string>; // Key-value pairs for env vars
  techStackVersions?: Record<string, string>; // Technology name -> version mapping
};

export type Project = {
  id: string;
  name: string;
  path: string;
  category: string;
  tags: string[];
  defaultIde: "vscode" | "cursor" | "webstorm";
  lastOpenedAt?: number;
  modules?: Module[]; // Sub-projects/modules within this project
  config?: ProjectConfig; // Project-specific configuration
  color?: string; // Custom color for the project (hex color code)
};
  