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
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
};

