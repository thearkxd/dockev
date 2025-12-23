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
  },
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
});
