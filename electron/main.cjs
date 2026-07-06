const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const url = require('url');
const { autoUpdater } = require('electron-updater');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../public/logo.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Check if we are running in development mode
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../dist/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);

  // Automatically open DevTools in dev mode
  if (process.env.ELECTRON_START_URL) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  // Check for updates after window is created
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Auto-updater events
autoUpdater.on('checking-for-update', () => {
  // Comment this out later, just for debugging
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Found',
    message: 'An update is available! Downloading now...'
  });
});

autoUpdater.on('update-not-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'No Update',
    message: 'You are on the latest version.'
  });
});

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'A new version of Oxton Oportal has been downloaded. Would you like to install it and restart now?',
    buttons: ['Restart and Install', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('error', (err) => {
  dialog.showMessageBox({
    type: 'error',
    title: 'Updater Error',
    message: 'Error in auto-updater: ' + err.toString()
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
