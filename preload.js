const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  exitFullscreen: () => ipcRenderer.invoke('exit-fullscreen')
});
