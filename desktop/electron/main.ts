import { app, BrowserWindow, ipcMain, Menu, dialog, shell } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";
import { homedir } from "os";
import { existsSync, readdirSync, readFileSync, statSync } from "fs";

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
    },
  });

  // Development modunda her zaman localhost'u kullan
  // Electron dev modunda çalışıyorsa localhost kullan
  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

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
    envVars?: Record<string, string>
  ) => {
    return new Promise((resolve, reject) => {
      // Normalize path
      let normalizedPath = projectPath;
      if (projectPath.startsWith("~")) {
        normalizedPath = path.join(homedir(), projectPath.slice(1));
      }
      normalizedPath = path.resolve(normalizedPath);

      // If custom command is provided, use it
      if (customCommand && customCommand.trim()) {
        const parts = customCommand.trim().split(/\s+/);
        const cmd = parts[0];
        const args = parts.slice(1);

        const child = spawn(cmd, args, {
          cwd: normalizedPath,
          shell: process.platform === "win32",
          detached: true,
          stdio: "ignore",
          env: {
            ...process.env,
            ...envVars,
          },
        });

        child.on("error", (error: NodeJS.ErrnoException) => {
          console.error("Error running custom dev server:", error);
          reject(
            new Error(
              `Failed to run custom command: ${customCommand}\n${error.message}`
            )
          );
        });

        child.unref();
        setTimeout(() => {
          resolve(true);
        }, 100);
        return;
      }

      // Try npm first, then yarn, then pnpm
      const commands = [
        { cmd: "npm", args: ["run", "dev"] },
        { cmd: "yarn", args: ["dev"] },
        { cmd: "pnpm", args: ["run", "dev"] },
      ];

      let currentIndex = 0;

      const tryNext = () => {
        if (currentIndex >= commands.length) {
          reject(new Error("No package manager found (npm/yarn/pnpm)"));
          return;
        }

        const { cmd, args } = commands[currentIndex];
        const child = spawn(cmd, args, {
          cwd: normalizedPath,
          detached: true,
          stdio: "ignore",
          shell: process.platform === "win32",
          env: {
            ...process.env,
            ...envVars,
          },
        });

        child.on("error", (error: NodeJS.ErrnoException) => {
          if (error.code === "ENOENT") {
            // Command not found, try next
            currentIndex++;
            tryNext();
          } else {
            reject(error);
          }
        });

        child.unref();
        resolve(true);
      };

      tryNext();
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
          results.pendingChanges = lines.length;
          results.files = lines.slice(0, 10).map((line) => {
            const status = line.substring(0, 2).trim();
            const fileName = line.substring(3).trim();
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
        }
        checkComplete();
      });

      statusProcess.on("error", () => {
        checkComplete();
      });
    });
  }
);

app.whenReady().then(() => {
  createWindow();
});
