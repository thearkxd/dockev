import { app, BrowserWindow, ipcMain, Menu, dialog, shell } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";
import { homedir } from "os";
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  renameSync,
  mkdirSync,
  rmSync,
  readdir,
  copyFile,
  mkdir,
} from "fs";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

Menu.setApplicationMenu(null);

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    backgroundColor: "#09090b",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
  });

  // Development modunda her zaman localhost'u kullan
  // Electron dev modunda çalışıyorsa localhost kullan
  const isDev = !app.isPackaged;

  if (isDev) {
    const url = "http://localhost:5173";
    console.log("Loading URL:", url);
    mainWindow.loadURL(url).catch((error) => {
      console.error("Error loading URL:", error);
    });

    // Log when page finishes loading
    mainWindow.webContents.on("did-finish-load", () => {
      console.log("Page finished loading");
    });

    // Log any errors
    mainWindow.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription) => {
        console.error("Failed to load page:", errorCode, errorDescription);
      }
    );
  } else {
    mainWindow.loadFile(path.join(__dirname, "./dist/index.html"));
  }
}

ipcMain.handle(
  "window:openExternal",
  async (_event: Electron.IpcMainInvokeEvent, url: string) => {
    await shell.openExternal(url);
  }
);

ipcMain.handle("window:minimize", () => {
  mainWindow?.minimize();
});

ipcMain.handle("window:maximize", () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle("window:close", () => {
  mainWindow?.close();
});

ipcMain.handle("dialog:selectFolder", async () => {
  if (!mainWindow) return null;
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "Select Project Folder",
  });
  if (result.canceled) return null;
  return result.filePaths[0] || null;
});

ipcMain.handle(
  "shell:openFolder",
  async (_event: Electron.IpcMainInvokeEvent, folderPath: string) => {
    // Normalize path
    let normalizedPath = folderPath;
    if (folderPath.startsWith("~")) {
      normalizedPath = path.join(homedir(), folderPath.slice(1));
    }
    normalizedPath = path.resolve(normalizedPath);

    try {
      await shell.openPath(normalizedPath);
      return true;
    } catch (error) {
      console.error("Error opening folder:", error);
      throw error;
    }
  }
);

ipcMain.handle(
  "detect:modules",
  async (_event: Electron.IpcMainInvokeEvent, projectPath: string) => {
    // Normalize path
    let normalizedPath = projectPath;
    if (projectPath.startsWith("~")) {
      normalizedPath = path.join(homedir(), projectPath.slice(1));
    }
    normalizedPath = path.resolve(normalizedPath);

    if (!existsSync(normalizedPath)) {
      return [];
    }

    const detectedModules: Array<{
      name: string;
      path: string;
      techStack: string[];
      confidence: number;
    }> = [];

    try {
      const entries = readdirSync(normalizedPath, { withFileTypes: true });
      const subdirs = entries.filter((entry) => entry.isDirectory());

      // Tech detection signals
      const techSignals: Record<
        string,
        { name: string; indicators: string[] }
      > = {
        "React Native / Expo": {
          name: "React Native / Expo",
          indicators: ["app.json", "app.config.js", "expo.json"],
        },
        React: {
          name: "React",
          indicators: [
            "package.json",
            "src/App.tsx",
            "src/App.jsx",
            "vite.config.ts",
          ],
        },
        "Node.js": {
          name: "Node.js",
          indicators: ["package.json", "server.js", "index.js"],
        },
        Python: {
          name: "Python",
          indicators: [
            "requirements.txt",
            "setup.py",
            "pyproject.toml",
            "main.py",
          ],
        },
        "Next.js": {
          name: "Next.js",
          indicators: ["next.config.js", "next.config.ts", "pages", "app"],
        },
        Vue: {
          name: "Vue",
          indicators: ["vue.config.js"],
        },
        Angular: {
          name: "Angular",
          indicators: ["angular.json"],
        },
        Django: {
          name: "Django",
          indicators: ["manage.py"],
        },
        Flask: {
          name: "Flask",
          indicators: ["app.py", "flask_app.py"],
        },
        Go: {
          name: "Go",
          indicators: ["go.mod"],
        },
        Rust: {
          name: "Rust",
          indicators: ["Cargo.toml"],
        },
      };

      for (const dir of subdirs) {
        const dirPath = path.join(normalizedPath, dir.name);
        const detectedTechs: string[] = [];

        try {
          const dirEntries = readdirSync(dirPath, { withFileTypes: true });
          const fileNames = dirEntries.map((e) => e.name);

          // Check for tech indicators
          for (const [techName, tech] of Object.entries(techSignals)) {
            const hasIndicator = tech.indicators.some((indicator) => {
              return (
                fileNames.includes(indicator) ||
                dirEntries.some((e) => e.isDirectory() && e.name === indicator)
              );
            });

            if (hasIndicator) {
              detectedTechs.push(techName);
            }
          }

          // Check package.json for additional signals
          if (fileNames.includes("package.json")) {
            try {
              const packageJsonPath = path.join(dirPath, "package.json");
              const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
              const packageJson = JSON.parse(packageJsonContent);
              const deps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies,
              };

              if (deps.expo || deps["react-native"]) {
                if (!detectedTechs.includes("React Native / Expo")) {
                  detectedTechs.push("React Native / Expo");
                }
              }
              if (deps.next) {
                if (!detectedTechs.includes("Next.js")) {
                  detectedTechs.push("Next.js");
                }
              }
              if (deps.vue) {
                if (!detectedTechs.includes("Vue")) {
                  detectedTechs.push("Vue");
                }
              }
              if (deps["@angular/core"]) {
                if (!detectedTechs.includes("Angular")) {
                  detectedTechs.push("Angular");
                }
              }
            } catch {
              // Ignore package.json read errors
            }
          }

          // If we detected technologies, this might be a module
          if (detectedTechs.length > 0) {
            detectedModules.push({
              name: dir.name,
              path: path.relative(normalizedPath, dirPath),
              techStack: detectedTechs,
              confidence: Math.min(detectedTechs.length * 0.3, 1), // Higher confidence with more techs
            });
          }
        } catch {
          // Ignore errors reading subdirectory
        }
      }

      // Also check root directory for tech stack
      const rootEntries = readdirSync(normalizedPath, { withFileTypes: true });
      const rootFileNames = rootEntries.map((e) => e.name);
      const rootTechs: string[] = [];

      for (const [techName, tech] of Object.entries(techSignals)) {
        const hasIndicator = tech.indicators.some((indicator) => {
          return (
            rootFileNames.includes(indicator) ||
            rootEntries.some((e) => e.isDirectory() && e.name === indicator)
          );
        });

        if (hasIndicator) {
          rootTechs.push(techName);
        }
      }

      // If root has tech stack and no modules detected, or if root tech differs from modules
      if (rootTechs.length > 0 && detectedModules.length === 0) {
        // Root itself might be a single module project
        detectedModules.push({
          name: "root",
          path: ".",
          techStack: rootTechs,
          confidence: 0.8,
        });
      }
    } catch (error) {
      console.error("Error detecting modules:", error);
    }

    return detectedModules;
  }
);

ipcMain.handle(
  "project:getDetails",
  async (_event: Electron.IpcMainInvokeEvent, projectPath: string) => {
    // Normalize path
    let normalizedPath = projectPath;
    if (projectPath.startsWith("~")) {
      normalizedPath = path.join(homedir(), projectPath.slice(1));
    }
    normalizedPath = path.resolve(normalizedPath);

    if (!existsSync(normalizedPath)) {
      return null;
    }

    const details: {
      name?: string;
      description?: string;
      version?: string;
      author?: string;
      license?: string;
      repository?: string;
      homepage?: string;
      readme?: string;
      packageJson?: Record<string, unknown>;
    } = {};

    try {
      // Try to read package.json
      const packageJsonPath = path.join(normalizedPath, "package.json");
      if (existsSync(packageJsonPath)) {
        try {
          const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
          const packageJson = JSON.parse(packageJsonContent);
          details.packageJson = packageJson;
          details.name = packageJson.name || path.basename(normalizedPath);
          details.description = packageJson.description || "";
          details.version = packageJson.version || "";
          details.author =
            typeof packageJson.author === "string"
              ? packageJson.author
              : packageJson.author?.name || "";
          details.license = packageJson.license || "";
          details.repository =
            typeof packageJson.repository === "string"
              ? packageJson.repository
              : packageJson.repository?.url || "";
          details.homepage = packageJson.homepage || "";
        } catch {
          // Ignore package.json parse errors
        }
      }

      // Try to read README.md
      const readmePaths = [
        "README.md",
        "README.txt",
        "readme.md",
        "readme.txt",
        "Readme.md",
      ];
      for (const readmePath of readmePaths) {
        const fullReadmePath = path.join(normalizedPath, readmePath);
        if (existsSync(fullReadmePath)) {
          try {
            const readmeContent = readFileSync(fullReadmePath, "utf-8");
            // Get first 500 characters as preview
            details.readme = readmeContent.substring(0, 500);
            break;
          } catch {
            // Ignore readme read errors
          }
        }
      }

      // If no name found, use folder name
      if (!details.name) {
        details.name = path.basename(normalizedPath);
      }
    } catch (error) {
      console.error("Error reading project details:", error);
    }

    return details;
  }
);

ipcMain.handle(
  "project:getStats",
  async (_event: Electron.IpcMainInvokeEvent, projectPath: string) => {
    // Normalize path
    let normalizedPath = projectPath;
    if (projectPath.startsWith("~")) {
      normalizedPath = path.join(homedir(), projectPath.slice(1));
    }
    normalizedPath = path.resolve(normalizedPath);

    if (!existsSync(normalizedPath)) {
      return null;
    }

    const stats: {
      size: number; // bytes
      fileCount: number;
      folderCount: number;
      created: number; // timestamp
      modified: number; // timestamp
      language?: string;
    } = {
      size: 0,
      fileCount: 0,
      folderCount: 0,
      created: 0,
      modified: 0,
    };

    try {
      const calculateStats = (dirPath: string): void => {
        try {
          const entries = readdirSync(dirPath, { withFileTypes: true });

          for (const entry of entries) {
            // Skip node_modules, .git, and other common ignored folders
            if (
              entry.name === "node_modules" ||
              entry.name === ".git" ||
              entry.name === "dist" ||
              entry.name === "build" ||
              entry.name === ".next" ||
              entry.name === ".cache" ||
              entry.name === ".vscode" ||
              entry.name === ".idea"
            ) {
              continue;
            }

            const fullPath = path.join(dirPath, entry.name);

            try {
              // Use statSync for more reliable directory/file detection
              const entryStats = statSync(fullPath);

              if (entryStats.isDirectory()) {
                stats.folderCount++;
                calculateStats(fullPath); // Recursive call
              } else if (entryStats.isFile()) {
                stats.fileCount++;
                stats.size += entryStats.size;

                // Track created and modified times
                const createdTime =
                  entryStats.birthtimeMs || entryStats.ctimeMs;
                const modifiedTime = entryStats.mtimeMs;

                if (
                  createdTime &&
                  (!stats.created || createdTime < stats.created)
                ) {
                  stats.created = createdTime;
                }
                if (
                  modifiedTime &&
                  (!stats.modified || modifiedTime > stats.modified)
                ) {
                  stats.modified = modifiedTime;
                }
              }
            } catch (err) {
              // Ignore errors accessing specific files/folders (permissions, etc.)
              console.warn(`Error accessing ${fullPath}:`, err);
            }
          }
        } catch (err) {
          // Ignore errors reading directory
          console.warn(`Error reading directory ${dirPath}:`, err);
        }
      };

      calculateStats(normalizedPath);

      // Try to detect primary language from package.json or files
      const packageJsonPath = path.join(normalizedPath, "package.json");
      if (existsSync(packageJsonPath)) {
        try {
          const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
          const packageJson = JSON.parse(packageJsonContent);

          // Check for TypeScript
          if (
            packageJson.devDependencies?.typescript ||
            packageJson.dependencies?.typescript
          ) {
            stats.language = "TypeScript";
          }
          // Check for Python
          else if (existsSync(path.join(normalizedPath, "requirements.txt"))) {
            stats.language = "Python";
          }
          // Check for Go
          else if (existsSync(path.join(normalizedPath, "go.mod"))) {
            stats.language = "Go";
          }
          // Check for Rust
          else if (existsSync(path.join(normalizedPath, "Cargo.toml"))) {
            stats.language = "Rust";
          }
          // Default to JavaScript if package.json exists
          else {
            stats.language = "JavaScript";
          }
        } catch {
          // Ignore errors
        }
      }
    } catch (error) {
      console.error("Error calculating project stats:", error);
    }

    return stats;
  }
);

ipcMain.handle(
  "launch:ide",
  async (
    _event: Electron.IpcMainInvokeEvent,
    projectPath: string,
    ide: string
  ) => {
    return new Promise((resolve, reject) => {
      // Normalize path (replace ~ with home directory)
      let normalizedPath = projectPath;
      if (projectPath.startsWith("~")) {
        normalizedPath = path.join(homedir(), projectPath.slice(1));
      }
      normalizedPath = path.resolve(normalizedPath);

      // Verify path exists
      if (!existsSync(normalizedPath)) {
        reject(new Error(`Path does not exist: ${normalizedPath}`));
        return;
      }

      let command: string;
      let args: string[] = [];
      const isWindows = process.platform === "win32";

      switch (ide) {
        case "vscode":
          if (isWindows) {
            // On Windows, use code command directly (it handles .cmd internally)
            command = "code";
            args = [normalizedPath];
          } else {
            command = "code";
            args = [normalizedPath];
          }
          break;
        case "cursor":
          if (isWindows) {
            // On Windows, use cursor command directly
            command = "cursor";
            args = [normalizedPath];
          } else {
            command = "cursor";
            args = [normalizedPath];
          }
          break;
        case "webstorm":
          if (isWindows) {
            // WebStorm on Windows might be in Program Files
            const webstormPaths = [
              path.join(
                process.env["ProgramFiles"] || "",
                "JetBrains",
                "WebStorm",
                "bin",
                "webstorm64.exe"
              ),
              path.join(
                process.env["ProgramFiles(x86)"] || "",
                "JetBrains",
                "WebStorm",
                "bin",
                "webstorm64.exe"
              ),
              path.join(
                process.env["LOCALAPPDATA"] || "",
                "Programs",
                "WebStorm",
                "bin",
                "webstorm64.exe"
              ),
            ];
            const foundPath = webstormPaths.find((p) => existsSync(p));
            if (foundPath) {
              command = foundPath;
              args = [normalizedPath];
            } else {
              command = "webstorm";
              args = [normalizedPath];
            }
          } else {
            command = "webstorm";
            args = [normalizedPath];
          }
          break;
        case "terminal":
          if (isWindows) {
            // Use start command to open PowerShell in the project directory
            command = "powershell.exe";
            args = [
              "-NoExit",
              "-Command",
              `Set-Location -LiteralPath '${normalizedPath.replace(
                /'/g,
                "''"
              )}'`,
            ];
          } else if (process.platform === "darwin") {
            command = "open";
            args = ["-a", "Terminal", normalizedPath];
          } else {
            command = "gnome-terminal";
            args = ["--working-directory", normalizedPath];
          }
          break;
        default:
          // Try to use the ide string as a command directly (for custom IDEs)
          // Custom IDE IDs start with "custom_" prefix, so we extract the command
          if (ide.startsWith("custom_")) {
            // Get command from custom IDE (stored in settings)
            // For now, we'll try to use the ide ID as command
            // In a full implementation, you'd load settings and map ID to command
            command = ide.replace("custom_", "");
            args = [normalizedPath];
          } else {
            // Fallback: try using ide as command directly
            command = ide;
            args = [normalizedPath];
          }
          break;
      }

      // For Windows, use shell: true to ensure commands work properly
      const spawnOptions: {
        detached: boolean;
        stdio: "ignore" | "inherit";
        shell: boolean;
        cwd?: string;
        env?: NodeJS.ProcessEnv;
      } = {
        detached: true,
        stdio: "ignore",
        shell: isWindows,
      };

      // Set working directory for non-Windows
      if (!isWindows) {
        spawnOptions.cwd = normalizedPath;
      }

      // For terminal on Windows, we need to ensure proper execution
      if (isWindows && ide === "terminal") {
        spawnOptions.shell = true;
      }

      console.log(`Launching ${ide} with command: ${command}`, args);
      console.log(`Path: ${normalizedPath}`);

      const child = spawn(command, args, spawnOptions);

      child.on("error", (error: NodeJS.ErrnoException) => {
        console.error(`Error launching ${ide}:`, error);
        console.error(`Command: ${command}`, args);
        console.error(`Path: ${normalizedPath}`);
        console.error(`Error code: ${error.code}`);
        console.error(`Error message: ${error.message}`);

        reject(
          new Error(
            `Failed to launch ${ide}.\n\nCommand: ${command}\nPath: ${normalizedPath}\n\nMake sure it's installed and available in PATH.\n\nError: ${error.message}`
          )
        );
      });

      // Give the process time to start
      // On Windows, processes need more time, especially for IDEs
      setTimeout(
        () => {
          try {
            child.unref();
            resolve(true);
          } catch (err) {
            console.warn("Error unrefing child process:", err);
            resolve(true); // Still resolve as success
          }
        },
        isWindows ? 1000 : 200
      );
    });
  }
);

ipcMain.handle(
  "run:devServer",
  async (
    _event: Electron.IpcMainInvokeEvent,
    projectPath: string,
    customCommand?: string,
    envVars?: Record<string, string>,
    packageManager?: "npm" | "yarn" | "pnpm"
  ) => {
    return new Promise((resolve, reject) => {
      // Normalize path
      let normalizedPath = projectPath;
      if (projectPath.startsWith("~")) {
        normalizedPath = path.join(homedir(), projectPath.slice(1));
      }
      normalizedPath = path.resolve(normalizedPath);

      // Determine the command to run
      let cmd: string;
      let args: string[];

      if (customCommand && customCommand.trim()) {
        // Use custom command if provided
        const parts = customCommand.trim().split(/\s+/);
        cmd = parts[0];
        args = parts.slice(1);
      } else {
        // Use package manager from settings or default to npm
        const pm = packageManager || "npm";
        switch (pm) {
          case "yarn":
            cmd = "yarn";
            args = ["dev"];
            break;
          case "pnpm":
            cmd = "pnpm";
            args = ["run", "dev"];
            break;
          case "npm":
          default:
            cmd = "npm";
            args = ["run", "dev"];
            break;
        }
      }

      // Build the command string for terminal
      const commandString = `${cmd} ${args.join(" ")}`;

      // Platform-specific terminal commands
      const isWindows = process.platform === "win32";
      const isMac = process.platform === "darwin";
      const isLinux = process.platform === "linux";

      let terminalCmd: string;
      let terminalArgs: string[];

      if (isWindows) {
        // Windows: start cmd /k "npm run dev"
        terminalCmd = "cmd";
        terminalArgs = ["/c", "start", "cmd", "/k", commandString];
      } else if (isMac) {
        // macOS: Use osascript to open Terminal with command
        terminalCmd = "osascript";
        // Escape single quotes for AppleScript
        const escapedPath = normalizedPath.replace(/'/g, "\\'");
        const escapedCommand = commandString.replace(/'/g, "\\'");
        terminalArgs = [
          "-e",
          `tell application "Terminal" to do script "cd '${escapedPath}' && ${escapedCommand}"`,
        ];
      } else {
        // Linux: x-terminal-emulator -e "bash -c 'cd ... && npm run dev; exec bash'"
        terminalCmd = "x-terminal-emulator";
        const escapedPath = normalizedPath.replace(/'/g, "'\\''");
        terminalArgs = [
          "-e",
          `bash -c "cd '${escapedPath}' && ${commandString}; exec bash"`,
        ];
      }

      console.log("Running dev server in terminal:");
      console.log("Command:", terminalCmd);
      console.log("Args:", terminalArgs);
      console.log("Working directory:", normalizedPath);

      const child = spawn(terminalCmd, terminalArgs, {
          cwd: normalizedPath,
        shell: false,
          detached: true,
          stdio: "ignore",
          env: {
            ...process.env,
            ...envVars,
          },
        });

        child.on("error", (error: NodeJS.ErrnoException) => {
        console.error("Error running dev server in terminal:", error);
        // Fallback: try running command directly if terminal fails
        console.log("Falling back to direct command execution...");
        const fallbackChild = spawn(cmd, args, {
          cwd: normalizedPath,
          shell: process.platform === "win32",
          detached: true,
          stdio: "ignore",
          env: {
            ...process.env,
            ...envVars,
          },
        });

        fallbackChild.on("error", (fallbackError: NodeJS.ErrnoException) => {
          console.error("Fallback also failed:", fallbackError);
          reject(
            new Error(
              `Failed to run dev server: ${fallbackError.message}\n\nTried terminal command: ${terminalCmd} ${terminalArgs.join(" ")}\nTried direct command: ${cmd} ${args.join(" ")}`
            )
          );
        });

        fallbackChild.unref();
        setTimeout(() => {
        resolve(true);
        }, 200);
      });

      child.unref();
      setTimeout(() => {
        resolve(true);
      }, 200);
    });
  }
);

ipcMain.handle(
  "git:getRemoteUrl",
  async (_event: Electron.IpcMainInvokeEvent, projectPath: string) => {
    return new Promise((resolve) => {
      // Normalize path
      let normalizedPath = projectPath;
      if (projectPath.startsWith("~")) {
        normalizedPath = path.join(homedir(), projectPath.slice(1));
      }
      normalizedPath = path.resolve(normalizedPath);

      // Check if .git exists
      const gitDir = path.join(normalizedPath, ".git");
      if (!existsSync(gitDir)) {
        resolve(null); // Not a git repository
        return;
      }

      // Get remote URL (usually 'origin')
      const remoteProcess = spawn(
        "git",
        ["config", "--get", "remote.origin.url"],
        {
          cwd: normalizedPath,
          shell: process.platform === "win32",
        }
      );

      let remoteOutput = "";
      remoteProcess.stdout.on("data", (data: Buffer) => {
        remoteOutput += data.toString();
      });

      remoteProcess.on("close", (code) => {
        if (code === 0 && remoteOutput.trim()) {
          resolve(remoteOutput.trim());
        } else {
          resolve(null);
        }
      });

      remoteProcess.on("error", () => {
        resolve(null);
      });
    });
  }
);

ipcMain.handle(
  "git:getDiff",
  async (
    _event: Electron.IpcMainInvokeEvent,
    projectPath: string,
    filePath?: string
  ) => {
    return new Promise((resolve) => {
      // Normalize path
      let normalizedPath = projectPath;
      if (projectPath.startsWith("~")) {
        normalizedPath = path.join(homedir(), projectPath.slice(1));
      }
      normalizedPath = path.resolve(normalizedPath);

      // Check if .git exists
      const gitDir = path.join(normalizedPath, ".git");
      if (!existsSync(gitDir)) {
        resolve(null);
        return;
      }

      // Get diff for specific file or all files
      const diffProcess = spawn(
        "git",
        filePath ? ["diff", filePath] : ["diff"],
        {
          cwd: normalizedPath,
          shell: process.platform === "win32",
        }
      );

      let diffOutput = "";
      diffProcess.stdout.on("data", (data: Buffer) => {
        diffOutput += data.toString();
      });

      diffProcess.on("close", (code) => {
        if (code === 0) {
          resolve(diffOutput || null);
        } else {
          resolve(null);
        }
      });

      diffProcess.on("error", () => {
        resolve(null);
      });
    });
  }
);

ipcMain.handle(
  "git:getStatus",
  async (_event: Electron.IpcMainInvokeEvent, projectPath: string) => {
    return new Promise((resolve) => {
      // Normalize path
      let normalizedPath = projectPath;
      if (projectPath.startsWith("~")) {
        normalizedPath = path.join(homedir(), projectPath.slice(1));
      }
      normalizedPath = path.resolve(normalizedPath);

      // Check if .git exists
      const gitDir = path.join(normalizedPath, ".git");
      if (!existsSync(gitDir)) {
        resolve(null); // Not a git repository
        return;
      }

      const results: {
        branch: string;
        lastCommit: string;
        lastCommitTime: string;
        pendingChanges: number;
        files: Array<{ name: string; status: string }>;
      } = {
        branch: "",
        lastCommit: "",
        lastCommitTime: "",
        pendingChanges: 0,
        files: [],
      };

      let completed = 0;
      const totalCommands = 3;

      const checkComplete = () => {
        completed++;
        if (completed === totalCommands) {
          resolve(results);
        }
      };

      // Get current branch
      const branchProcess = spawn("git", ["branch", "--show-current"], {
        cwd: normalizedPath,
        shell: process.platform === "win32",
      });

      let branchOutput = "";
      branchProcess.stdout.on("data", (data: Buffer) => {
        branchOutput += data.toString();
      });

      branchProcess.on("close", (code) => {
        if (code === 0) {
          results.branch = branchOutput.trim() || "main";
        }
        checkComplete();
      });

      branchProcess.on("error", () => {
        checkComplete();
      });

      // Get last commit info
      const commitProcess = spawn("git", ["log", "-1", "--format=%H|%s|%ar"], {
        cwd: normalizedPath,
        shell: process.platform === "win32",
      });

      let commitOutput = "";
      commitProcess.stdout.on("data", (data: Buffer) => {
        commitOutput += data.toString();
      });

      commitProcess.on("close", (code) => {
        if (code === 0 && commitOutput.trim()) {
          const [, message, time] = commitOutput.trim().split("|");
          results.lastCommit = message || "No commit message";
          results.lastCommitTime = time || "";
        }
        checkComplete();
      });

      commitProcess.on("error", () => {
        checkComplete();
      });

      // Get status
      const statusProcess = spawn("git", ["status", "--porcelain"], {
        cwd: normalizedPath,
        shell: process.platform === "win32",
      });

      let statusOutput = "";
      statusProcess.stdout.on("data", (data: Buffer) => {
        statusOutput += data.toString();
      });

      statusProcess.on("close", (code) => {
        if (code === 0 && statusOutput.trim()) {
          const lines = statusOutput.trim().split("\n");
          const uniqueFiles = new Set<string>();
          results.files = lines.map((line) => {
            const status = line.substring(0, 2).trim();
            const fileName = line.substring(3).trim();
            uniqueFiles.add(fileName); // Track unique files
            let fileStatus = "modified";
            if (status.startsWith("A") || status.endsWith("A")) {
              fileStatus = "added";
            } else if (status.startsWith("D") || status.endsWith("D")) {
              fileStatus = "deleted";
            } else if (status.startsWith("R") || status.endsWith("R")) {
              fileStatus = "renamed";
            }
            return { name: fileName, status: fileStatus };
          });
          results.pendingChanges = uniqueFiles.size; // Use unique file count
        }
        checkComplete();
      });

      statusProcess.on("error", () => {
        checkComplete();
      });
    });
  }
);

ipcMain.handle(
  "project:checkNodeModules",
  async (
    _event: Electron.IpcMainInvokeEvent,
    projectPath: string,
    modulePaths?: string[]
  ) => {
    return new Promise((resolve) => {
      // Normalize path
      let normalizedPath = projectPath;
      if (projectPath.startsWith("~")) {
        normalizedPath = path.join(homedir(), projectPath.slice(1));
      }
      normalizedPath = path.resolve(normalizedPath);

      if (!existsSync(normalizedPath)) {
        resolve({
          root: {
            hasNodeModules: false,
            hasPackageJson: false,
          },
          modules: [],
        });
        return;
      }

      const result: {
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
      } = {
        root: {
          hasNodeModules: existsSync(path.join(normalizedPath, "node_modules")),
          hasPackageJson: existsSync(path.join(normalizedPath, "package.json")),
        },
        modules: [],
      };

      // If modulePaths provided, check only those modules
      // Otherwise, detect modules automatically
      if (modulePaths && modulePaths.length > 0) {
        for (const modulePath of modulePaths) {
          // Normalize module path to handle both forward and backslashes
          const normalizedModulePath = modulePath
            .split(/[/\\]/)
            .filter(Boolean)
            .join(path.sep);
          const fullModulePath = path.join(
            normalizedPath,
            normalizedModulePath
          );

          if (existsSync(fullModulePath)) {
            const moduleName = path.basename(fullModulePath);
            const nodeModulesPath = path.join(fullModulePath, "node_modules");
            const packageJsonPath = path.join(fullModulePath, "package.json");

            result.modules.push({
              name: moduleName,
              path: normalizedModulePath, // Use normalized path
              hasNodeModules: existsSync(nodeModulesPath),
              hasPackageJson: existsSync(packageJsonPath),
            });
          }
        }
      } else {
        // Auto-detect modules by checking subdirectories
        try {
          const entries = readdirSync(normalizedPath, { withFileTypes: true });
          const subdirs = entries.filter((entry) => entry.isDirectory());

          for (const dir of subdirs) {
            const dirPath = path.join(normalizedPath, dir.name);
            const packageJsonPath = path.join(dirPath, "package.json");

            // Only check directories that have package.json
            if (existsSync(packageJsonPath)) {
              const nodeModulesPath = path.join(dirPath, "node_modules");
              // Use dir.name directly instead of relative path to avoid separator issues
              const relativePath = dir.name;

              result.modules.push({
                name: dir.name,
                path: relativePath,
                hasNodeModules: existsSync(nodeModulesPath),
                hasPackageJson: true,
              });
            }
          }
        } catch (error) {
          console.error(
            "Error detecting modules for node_modules check:",
            error
          );
        }
      }

      resolve(result);
    });
  }
);

ipcMain.handle(
  "project:installPackages",
  async (
    _event: Electron.IpcMainInvokeEvent,
    projectPath: string,
    packageManager: "npm" | "yarn" | "pnpm",
    modulePath?: string
  ) => {
    return new Promise((resolve) => {
      // Normalize path
      let normalizedPath = projectPath;
      if (projectPath.startsWith("~")) {
        normalizedPath = path.join(homedir(), projectPath.slice(1));
      }
      normalizedPath = path.resolve(normalizedPath);

      // If modulePath provided, install in that module
      let installPath: string;

      // Debug: Check what we received
      console.log("=== Module Path Check ===");
      console.log("modulePath value:", modulePath);
      console.log("modulePath type:", typeof modulePath);
      console.log("modulePath truthy:", !!modulePath);
      if (modulePath) {
        console.log("modulePath.trim():", modulePath.trim());
        console.log("modulePath.trim() !== '':", modulePath.trim() !== "");
        console.log("modulePath !== '.':", modulePath !== ".");
      }
      console.log("========================");

      if (modulePath && modulePath.trim() !== "" && modulePath !== ".") {
        // Try multiple approaches to find the module
        // First, try using the path directly
        let cleanModulePath = modulePath
          .replace(/^\.\//, "")
          .replace(/^\.$/, "")
          .trim();

        console.log("Original modulePath:", modulePath);
        console.log("Cleaned modulePath:", cleanModulePath);

        // Normalize path separators to system default
        cleanModulePath = cleanModulePath
          .split(/[/\\]/)
          .filter(Boolean)
          .join(path.sep);

        console.log("Normalized modulePath:", cleanModulePath);

        // Use path.join instead of path.resolve to avoid absolute path issues
        let candidatePath = path.join(normalizedPath, cleanModulePath);
        console.log("Candidate path (before check):", candidatePath);

        // If path doesn't exist, try to find by directory name
        if (!existsSync(candidatePath)) {
          console.log(
            `Path ${candidatePath} does not exist, trying to find by name...`
          );
          try {
            const entries = readdirSync(normalizedPath, {
              withFileTypes: true,
            });
            const dirs = entries.filter((entry) => entry.isDirectory());
            console.log(
              "Available directories:",
              dirs.map((d) => d.name)
            );

            // Try to find directory with matching name (case-insensitive)
            const moduleName =
              cleanModulePath.split(path.sep).pop() || cleanModulePath;
            console.log("Looking for module name:", moduleName);

            const matchingDir = dirs.find(
              (dir) => dir.name.toLowerCase() === moduleName.toLowerCase()
            );
            if (matchingDir) {
              candidatePath = path.join(normalizedPath, matchingDir.name);
              console.log(`Found matching directory: ${candidatePath}`);
            } else {
              console.error(`No matching directory found for: ${moduleName}`);
            }
          } catch (err) {
            console.error("Error searching for module directory:", err);
          }
        } else {
          console.log(`Path exists: ${candidatePath}`);
        }

        installPath = candidatePath;
      } else {
        console.log("No modulePath provided, using root directory");
        installPath = normalizedPath;
      }

      console.log("=== Install Packages Debug ===");
      console.log("projectPath:", projectPath);
      console.log("normalizedPath:", normalizedPath);
      console.log("modulePath (received):", modulePath);
      console.log("modulePath type:", typeof modulePath);
      console.log("modulePath length:", modulePath?.length);
      console.log("installPath:", installPath);
      console.log("==============================");

      if (!existsSync(installPath)) {
        console.error("Install path does not exist:", installPath);
        // List available directories for debugging
        try {
          const entries = readdirSync(normalizedPath, {
            withFileTypes: true,
          });
          const dirs = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name);
          console.log("Available directories in project:", dirs);
        } catch (err) {
          console.error("Error reading project directory:", err);
        }

      resolve({
          success: false,
          error: `Path does not exist: ${installPath}`,
        });
        return;
      }

      // Check if package.json exists
      const packageJsonPath = path.join(installPath, "package.json");
      console.log("Checking package.json at:", packageJsonPath);
      console.log("package.json exists:", existsSync(packageJsonPath));

      if (!existsSync(packageJsonPath)) {
        // List directory contents for debugging
        try {
          const dirContents = readdirSync(installPath);
          console.log("Directory contents:", dirContents);
        } catch (err) {
          console.error("Error reading directory:", err);
        }

        resolve({
          success: false,
          error: `package.json not found at ${packageJsonPath}`,
        });
        return;
      }

      // Determine install command based on package manager
      let cmd: string;
      let args: string[];

      switch (packageManager) {
        case "npm":
          cmd = "npm";
          args = ["install"];
          break;
        case "yarn":
          cmd = "yarn";
          args = ["install"];
          break;
        case "pnpm":
          cmd = "pnpm";
          args = ["install"];
          break;
        default:
          resolve({
            success: false,
            error: `Unsupported package manager: ${packageManager}`,
          });
          return;
      }

      const child = spawn(cmd, args, {
        cwd: installPath,
        shell: process.platform === "win32",
        detached: true,
        stdio: "ignore",
      });

      child.on("error", (error: NodeJS.ErrnoException) => {
        console.error(
          `Error installing packages with ${packageManager}:`,
          error
        );
        resolve({
          success: false,
          error: `Failed to install packages: ${error.message}`,
        });
      });

      // Give the process time to start
      setTimeout(() => {
        try {
          child.unref();
          resolve({
            success: true,
          });
        } catch (err) {
          console.warn("Error unrefing child process:", err);
          resolve({
            success: true, // Still resolve as success
          });
        }
      }, 200);
    });
  }
);

// Move project folder handler
ipcMain.handle(
  "project:moveFolder",
  async (
    event: Electron.IpcMainInvokeEvent,
    sourcePath: string,
    destinationDir: string,
    excludeNodeModules: boolean,
    deleteSource: boolean
  ) => {
    return new Promise((resolve) => {
      const sendProgress = (
        phase: "preparing" | "moving" | "cleaning" | "complete" | "error",
        data?: {
          currentFile?: string;
          filesProcessed?: number;
          totalFiles?: number;
          error?: string;
        }
      ) => {
        // Send progress via IPC event
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("project:moveFolder:progress", {
            phase,
            ...data,
          });
        }
      };

      (async () => {
        try {
          // Normalize paths
          let normalizedSource = sourcePath;
          if (sourcePath.startsWith("~")) {
            normalizedSource = path.join(homedir(), sourcePath.slice(1));
          }
          normalizedSource = path.resolve(normalizedSource);

          let normalizedDest = destinationDir;
          if (destinationDir.startsWith("~")) {
            normalizedDest = path.join(homedir(), destinationDir.slice(1));
          }
          normalizedDest = path.resolve(normalizedDest);

          // Validate source exists
          if (!existsSync(normalizedSource)) {
            resolve({
              success: false,
              error: "Source path does not exist",
            });
            return;
          }

          // Validate destination directory exists or can be created
          if (!existsSync(normalizedDest)) {
            try {
              mkdirSync(normalizedDest, { recursive: true });
            } catch (error) {
              resolve({
                success: false,
                error: `Cannot create destination directory: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              });
              return;
            }
          }

          // Get project folder name
          const projectName = path.basename(normalizedSource);
          const newPath = path.join(normalizedDest, projectName);

          // Check if destination already exists
          if (existsSync(newPath)) {
            resolve({
              success: false,
              error: "Destination folder already exists",
            });
            return;
          }

          sendProgress("preparing");

          // Count files for progress (excluding node_modules if needed)
          const countFiles = async (
            dir: string,
            excludePatterns: string[] = []
          ): Promise<number> => {
            let count = 0;
            const entries = await promisify(readdir)(dir, {
              withFileTypes: true,
            });

            for (const entry of entries) {
              const fullPath = path.join(dir, entry.name);
              const relativePath = path.relative(normalizedSource, fullPath);

              // Skip excluded patterns
              if (
                excludePatterns.some((pattern) =>
                  relativePath.includes(pattern)
                )
              ) {
                continue;
              }

              if (entry.isDirectory()) {
                count += await countFiles(fullPath, excludePatterns);
              } else {
                count++;
              }
            }

            return count;
          };

          const excludePatterns = excludeNodeModules ? ["node_modules"] : [];
          const totalFiles = await countFiles(
            normalizedSource,
            excludePatterns
          );
          let filesProcessed = 0;

          sendProgress("moving", { filesProcessed: 0, totalFiles });

          // Check if source and destination are on the same disk
          // Simple heuristic: if paths start with same drive letter (Windows) or root (Unix)
          const sameDisk =
            process.platform === "win32"
              ? normalizedSource[0].toLowerCase() ===
                normalizedDest[0].toLowerCase()
              : path.parse(normalizedSource).root ===
                path.parse(normalizedDest).root;

          // Use fast rename only if same disk, not excluding node_modules, AND deleteSource is true
          // If deleteSource is false, we need to use copy+delete to preserve source
          if (sameDisk && !excludeNodeModules && deleteSource) {
            // Fast move using rename (this automatically removes source)
            try {
              renameSync(normalizedSource, newPath);
              sendProgress("complete");
              resolve({ success: true, newPath });
              return;
            } catch (error) {
              resolve({
                success: false,
                error: `Move failed: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              });
              return;
            }
          } else {
            // Copy + delete (for cross-disk or when excluding node_modules)
            const copyRecursive = async (
              src: string,
              dest: string
            ): Promise<void> => {
              const entries = await promisify(readdir)(src, {
                withFileTypes: true,
              });

              for (const entry of entries) {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);
                const relativePath = path.relative(normalizedSource, srcPath);

                // Skip excluded patterns
                if (
                  excludePatterns.some((pattern) =>
                    relativePath.includes(pattern)
                  )
                ) {
                  continue;
                }

                if (entry.isDirectory()) {
                  await promisify(mkdir)(destPath, { recursive: true });
                  await copyRecursive(srcPath, destPath);
                } else {
                  await promisify(copyFile)(srcPath, destPath);
                  filesProcessed++;
                  sendProgress("moving", {
                    currentFile: relativePath,
                    filesProcessed,
                    totalFiles,
                  });
                }
              }
            };

            try {
              // Create destination folder
              await promisify(mkdir)(newPath, { recursive: true });

              // Copy files
              await copyRecursive(normalizedSource, newPath);

              sendProgress("cleaning");

              // Delete source only if deleteSource is true
              if (deleteSource) {
                try {
                  console.log("Deleting source directory:", normalizedSource);
                rmSync(normalizedSource, { recursive: true, force: true });
                  console.log("Source directory deleted successfully");
                } catch (deleteError) {
                  console.error(
                    "Error deleting source directory:",
                    deleteError
                  );
                  // Don't fail the whole operation if deletion fails
                  // Just log the error
                }
              } else {
                console.log("deleteSource is false - keeping source directory");
              }

              sendProgress("complete");
              resolve({ success: true, newPath });
            } catch (error) {
              // Try to clean up destination if copy failed
              try {
                if (existsSync(newPath)) {
                  rmSync(newPath, { recursive: true, force: true });
                }
              } catch (cleanupError) {
                console.error("Failed to cleanup after error:", cleanupError);
              }

              resolve({
                success: false,
                error: `Move failed: ${
                  error instanceof Error ? error.message : String(error)
                }`,
              });
            }
          }
        } catch (error) {
          sendProgress("error", {
            error: error instanceof Error ? error.message : String(error),
          });
          resolve({
            success: false,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      })();
    });
  }
);

app.whenReady().then(() => {
  createWindow();
});
