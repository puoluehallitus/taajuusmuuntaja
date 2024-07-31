const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron')

const DEVELOPMENT_MODE = process.env.NODE_ENV === 'development';

if (DEVELOPMENT_MODE) {
  require('electron-reload')(__dirname);
}

let mainWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    width: 640,
    height: 480,
    autoHideMenuBar: true
  });

  // and load the index.html of the app.
  mainWindow.loadFile('dist/index.html');

  if (DEVELOPMENT_MODE) {
    // mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

let fullscreen = false;

function toggleFullscreen() {
  fullscreen = !fullscreen;
  mainWindow.setFullScreen(fullscreen);
}

function exitFullscreen() {
  fullscreen = false;
  mainWindow.setFullScreen(fullscreen);
}

app.whenReady().then(() => {
  ipcMain.handle('toggle-fullscreen', toggleFullscreen)
  ipcMain.handle('exit-fullscreen', exitFullscreen)
  createWindow();

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
