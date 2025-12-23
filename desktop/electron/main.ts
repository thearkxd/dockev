import { app, BrowserWindow, ipcMain, Menu, dialog } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { spawn } from "child_process";

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
  "launch:ide",
  async (
    _event: Electron.IpcMainInvokeEvent,
    projectPath: string,
    ide: string
  ) => {
    return new Promise((resolve, reject) => {
      let command: string;
      const args: string[] = [projectPath];

      switch (ide) {
        case "vscode":
          command = "code";
          break;
        case "cursor":
          command = "cursor";
          break;
        case "webstorm":
          command = "webstorm";
          break;
        case "terminal":
          if (process.platform === "win32") {
            command = "cmd";
            args.unshift("/c", "start", "cmd", "/k", "cd", "/d");
          } else if (process.platform === "darwin") {
            command = "open";
            args[0] = "-a";
            args[1] = "Terminal";
            args[2] = projectPath;
          } else {
            command = "gnome-terminal";
            args.unshift("--working-directory");
          }
          break;
        default:
          reject(new Error(`Unsupported IDE: ${ide}`));
          return;
      }

      const child = spawn(command, args, {
        detached: true,
        stdio: "ignore",
      });

      child.on("error", (error) => {
        reject(error);
      });

      child.unref();
      resolve(true);
    });
  }
);

app.whenReady().then(() => {
  createWindow();
});
