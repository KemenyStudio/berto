const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'public', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    show: false, // Don't show until ready-to-show
  });

  // Handle external links
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Load the app
  const isDev = process.argv.includes('--dev');
  if (isDev) {
    win.loadURL('http://localhost:3001'); // Use port 3001 as shown in your logs
    win.webContents.openDevTools();
  } else {
    win.loadFile('out/index.html');
  }

  // Show window when ready
  win.once('ready-to-show', () => {
    win.show();
  });

  // Handle window closed
  win.on('closed', () => {
    win = null;
  });

  return win;
}

// App event handlers
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
}); 