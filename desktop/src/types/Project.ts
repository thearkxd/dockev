export type Project = {
    id: string;
    name: string;
    path: string;
    category: string;
    tags: string[];
    defaultIde: "vscode" | "cursor" | "webstorm";
    lastOpenedAt?: number;
  };
  