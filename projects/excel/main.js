// npm init -y
// npm install electron
// In package.json add "start" = "electron ." to "scripts".

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

function createWindow () {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          nodeIntegration : true
      }
    })
  
    win.loadFile('index.html').then(function(){
        win.maximize();
    });
  }

  app.whenReady().then(createWindow);