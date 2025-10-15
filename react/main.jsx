const { app, BrowserWindow } = require(‘electron’);
const path = require(‘path’);

let mainWindow;

function createWindow() {
mainWindow = new BrowserWindow({
width: 500,
height: 800,
transparent: true,
frame: false,
alwaysOnTop: true,
skipTaskbar: false,
resizable: false,
webPreferences: {
nodeIntegration: true,
contextIsolation: false,
enableRemoteModule: true
},
x: 0,
y: 0
});

// Position window on right side of screen
const { screen } = require(‘electron’);
const primaryDisplay = screen.getPrimaryDisplay();
const { width, height } = primaryDisplay.workAreaSize;

mainWindow.setPosition(width - 500, height - 800);

// Load the app
if (process.env.NODE_ENV === ‘development’) {
mainWindow.loadURL(‘http://localhost:8080’);
mainWindow.webContents.openDevTools();
} else {
mainWindow.loadFile(path.join(__dirname, ‘dist’, ‘index.html’));
}

mainWindow.on(‘closed’, () => {
mainWindow = null;
});
}

app.whenReady().then(createWindow);

app.on(‘window-all-closed’, () => {
if (process.platform !== ‘darwin’) {
app.quit();
}
});

app.on(‘activate’, () => {
if (BrowserWindow.getAllWindows().length === 0) {
createWindow();
}
});