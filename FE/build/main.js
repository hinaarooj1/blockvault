

const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
async function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        width: width, // Set window width to 100% of screen width
        height: height, // Set window height to 100% of screen height
        webPreferences: {
            nodeIntegration: true,
        }
    });
    win.loadFile(path.join(__dirname, '../build/index.html'));

    // win.loadURL('http://localhost:3000');

    // Load React app's index.html

}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
