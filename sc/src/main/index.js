import { app, BrowserWindow } from 'electron' // eslint-disable-line
const electron = require("electron");
const ipc = require("electron").ipcMain;
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  var size = electron.screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    x: size.width * 0,
    y: 0,
    width: size.width * 1,
    height: size.height * 1.2,
    fullscreen: false,
    resizable: true,
    webPreferences: {
      javascript: true,
      plugins: true,
      title: 'feng',
      webSecurity: false,
      nodeIntegration: true, //  Nodejs  模块 影响到 jquery
      devTools: true
    }, 
    useContentSize: true,
    
     
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.on("open-file-dialog", function(event) {
  dialog.showOpenDialog(
    {
      properties: ["openFile", "openDirectory"]
    },
    function(files) {
      console.log(files);
      if (files) event.sender.send("selected-directory", files);
    }
  );
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
