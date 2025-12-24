export type Module = {
  id: string;
  name: string;
  path: string; // Relative to project root or absolute
  techStack: string[]; // Detected technologies
  defaultIde: "vscode" | "cursor" | "webstorm";
  lastOpenedAt?: number;
  devServerCommand?: string; // Custom dev server command for this module
};

