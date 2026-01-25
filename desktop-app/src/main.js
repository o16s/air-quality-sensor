const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// Store granted USB devices for reconnection
const grantedDevices = new Map();

// Get docs path - different in dev vs packaged app
function getDocsPath() {
  if (app.isPackaged) {
    // Production: docs is in extraResources
    return path.join(process.resourcesPath, 'docs');
  } else {
    // Development: docs is sibling to desktop-app
    return path.join(__dirname, '..', '..', 'docs');
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

  // Load the docs SPA
  const indexPath = path.join(getDocsPath(), 'index.html');
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
