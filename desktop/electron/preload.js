const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dockevWindow", {
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close: () => ipcRenderer.invoke("window:close"),
  launch: {
    ide: (projectPath, ide) =>
      ipcRenderer.invoke("launch:ide", projectPath, ide),
  },
});

contextBridge.exposeInMainWorld("dockevDialog", {
  selectFolder: () => ipcRenderer.invoke("dialog:selectFolder"),
});
