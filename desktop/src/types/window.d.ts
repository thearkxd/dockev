export {};

declare global {
  interface Window {
    dockevWindow: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      openExternal: (url: string) => void;
      launch?: {
        ide: (projectPath: string, ide: string) => Promise<boolean>;
      };
      run?: {
        devServer: (
          projectPath: string,
          customCommand?: string,
          envVars?: Record<string, string>
        ) => Promise<boolean>;
      };
      git?: {
        getStatus: (
          projectPath: string
        ) => Promise<{
          branch: string;
          lastCommit: string;
          lastCommitTime: string;
          pendingChanges: number;
          files: Array<{ name: string; status: string }>;
        } | null>;
        getRemoteUrl: (projectPath: string) => Promise<string | null>;
        getDiff: (projectPath: string, filePath?: string) => Promise<string | null>;
      };
    };
    dockevDialog: {
      selectFolder: () => Promise<string | null>;
    };
    dockevShell: {
      openFolder: (folderPath: string) => Promise<boolean>;
    };
    dockevDetect: {
      modules: (
        projectPath: string
      ) => Promise<
        Array<{
          name: string;
          path: string;
          techStack: string[];
          confidence: number;
        }>
      >;
    };
    dockevProject: {
      getDetails: (
        projectPath: string
      ) => Promise<{
        name?: string;
        description?: string;
        version?: string;
        author?: string;
        license?: string;
        repository?: string;
        homepage?: string;
        readme?: string;
        packageJson?: Record<string, unknown>;
      } | null>;
      getStats: (
        projectPath: string
      ) => Promise<{
        size: number;
        fileCount: number;
        folderCount: number;
        created: number;
        modified: number;
        language?: string;
      } | null>;
      moveFolder: (
        sourcePath: string,
        destinationDir: string,
        excludeNodeModules: boolean,
        deleteSource: boolean
      ) => Promise<{
        success: boolean;
        newPath?: string;
        error?: string;
      }>;
      checkNodeModules: (
        projectPath: string,
        modulePaths?: string[]
      ) => Promise<{
        root: {
          hasNodeModules: boolean;
          hasPackageJson: boolean;
        };
        modules: Array<{
          name: string;
          path: string;
          hasNodeModules: boolean;
          hasPackageJson: boolean;
        }>;
      }>;
      installPackages: (
        projectPath: string,
        packageManager: "npm" | "yarn" | "pnpm",
        modulePath?: string
      ) => Promise<{
        success: boolean;
        error?: string;
      }>;
      onMoveProgress: (
        callback: (progress: {
          phase: "preparing" | "moving" | "cleaning" | "complete" | "error";
          currentFile?: string;
          filesProcessed?: number;
          totalFiles?: number;
          error?: string;
        }) => void
      ) => void;
      removeMoveProgressListener: () => void;
    };
  }
}
