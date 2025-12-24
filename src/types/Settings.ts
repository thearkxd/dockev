import type { Category } from "./Category";

export type Theme = "dark" | "light" | "system";

export type IDE = {
  id: string;
  name: string;
  command: string;
  isDefault?: boolean;
};

export type Settings = {
  defaultIde: string;
  autoTechStackDetection: boolean;
  theme: Theme;
  customIdes: IDE[];
  defaultPackageManager?: "npm" | "yarn" | "pnpm";
  categories: Category[];
};

