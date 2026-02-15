// Handle Squirrel events (Windows installer shortcuts)
if (require('electron-squirrel-startup')) require('electron').app.quit();

const { app, BrowserWindow, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

// Store granted USB devices for reconnection
const grantedDevices = new Map();

// Get web dist path - different in dev vs packaged app
function getWebDistPath() {
  if (app.isPackaged) {
    // Production: dist is in extraResources
    return path.join(process.resourcesPath, 'dist');
  } else {
    // Development: web/dist is sibling to desktop-app
    return path.join(__dirname, '..', '..', 'web', 'dist');
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the web app SPA
  const indexPath = path.join(getWebDistPath(), 'index.html');
  mainWindow.loadFile(indexPath);

  return mainWindow;
}

function setupUSBHandlers() {
  // Handle USB device selection (called by navigator.usb.requestDevice())
  session.defaultSession.on('select-usb-device', (event, details, callback) => {
    // Filter for STM32 devices (VID 0x0483)
    const stmDevices = details.deviceList.filter(d => d.vendorId === 0x0483);

    if (stmDevices.length === 0) {
      // No matching devices found
      callback();
      return;
    }

    // Auto-select first STM32 device (or could show a picker UI)
    const selectedDevice = stmDevices[0];

    // Store for later permission checks
    grantedDevices.set(selectedDevice.deviceId, selectedDevice);

    callback(selectedDevice.deviceId);
  });

  // Handle permission check for USB devices
  session.defaultSession.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'usb') {
      // Allow USB access
      return true;
    }
    return true;
  });

  // Handle USB device permission requests
  session.defaultSession.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'usb') {
      // Allow all USB devices (could filter by VID/PID here)
      return true;
    }
    return false;
  });

  // Handle device revocation (disconnect)
  session.defaultSession.on('usb-device-revoked', (event, details) => {
    grantedDevices.delete(details.device.deviceId);
  });
}

app.whenReady().then(() => {
  setupUSBHandlers();
  createWindow();

  // Check for updates (only in packaged app)
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }

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
