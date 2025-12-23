export {};

declare global {
  interface Window {
    dockevWindow: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}
