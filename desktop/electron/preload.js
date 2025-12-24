const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dockevWindow", {
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close: () => ipcRenderer.invoke("window:close"),
  launch: {
    ide: (projectPath, ide) =>
      ipcRenderer.invoke("launch:ide", projectPath, ide),
  },
  run: {
    devServer: (projectPath, customCommand, envVars) =>
      ipcRenderer.invoke("run:devServer", projectPath, customCommand, envVars),
  },
  git: {
    getStatus: (projectPath) =>
      ipcRenderer.invoke("git:getStatus", projectPath),
    getRemoteUrl: (projectPath) =>
      ipcRenderer.invoke("git:getRemoteUrl", projectPath),
    getDiff: (projectPath, filePath) =>
      ipcRenderer.invoke("git:getDiff", projectPath, filePath),
  },
  openExternal: (url) => ipcRenderer.invoke("window:openExternal", url),
});

contextBridge.exposeInMainWorld("dockevDialog", {
  selectFolder: () => ipcRenderer.invoke("dialog:selectFolder"),
});

contextBridge.exposeInMainWorld("dockevShell", {
  openFolder: (folderPath) =>
    ipcRenderer.invoke("shell:openFolder", folderPath),
});

contextBridge.exposeInMainWorld("dockevDetect", {
  modules: (projectPath) => ipcRenderer.invoke("detect:modules", projectPath),
});

contextBridge.exposeInMainWorld("dockevProject", {
  getDetails: (projectPath) =>
    ipcRenderer.invoke("project:getDetails", projectPath),
  getStats: (projectPath) =>
    ipcRenderer.invoke("project:getStats", projectPath),
  moveFolder: (
    sourcePath,
    destinationDir,
    excludeNodeModules,
    deleteSource
  ) => {
    return ipcRenderer.invoke(
      "project:moveFolder",
      sourcePath,
      destinationDir,
      excludeNodeModules,
      deleteSource
    );
  },
  checkNodeModules: (projectPath) => {
    return ipcRenderer.invoke("project:checkNodeModules", projectPath);
  },
  installPackages: (projectPath, packageManager, modulePath) => {
    return ipcRenderer.invoke(
      "project:installPackages",
      projectPath,
      packageManager,
      modulePath
    );
  },
  onMoveProgress: (callback) => {
    ipcRenderer.on("project:moveFolder:progress", (_event, progress) =>
      callback(progress)
    );
  },
  removeMoveProgressListener: () => {
    ipcRenderer.removeAllListeners("project:moveFolder:progress");
  },
});
