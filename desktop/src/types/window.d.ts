export {};

declare global {
  interface Window {
    dockevWindow: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      launch?: {
        ide: (projectPath: string, ide: string) => Promise<boolean>;
      };
    };
    dockevDialog: {
      selectFolder: () => Promise<string | null>;
    };
  }
}
