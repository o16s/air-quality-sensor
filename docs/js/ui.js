/**
 * UI Management and Updates
 * Handles all UI rendering and user interactions
 */

import {
    connectDevice,
    disconnectDevice,
    autoReconnect,
    onConnect,
    onDisconnect,
    getDeviceInfo,
    isDeviceConnected,
    handleUSBError,
    getDevice
} from './webusb.js';

import {
    getDeviceStatus,
    getLogCount,
    downloadAllLogs,
    getFirmwareVersion,
    formatGPSFix,
    createMapsURL,
    setMockMode
} from './protocol.js';

import {
    getAllLogs,
    getLogCount as getStorageLogCount,
    storeLogs,
    clearAllLogs,
    getRecentLogs
} from './storage.js';

import { exportToCSV, exportToJSON } from './export.js';

// UI state
let autoRefreshInterval = null;
let isDownloading = false;

/**
 * Initialize UI and event handlers
 */
export function initUI() {
    setupEventHandlers();
    attemptAutoReconnect();
    updateBrowserLogCount();
}

/**
 * Setup all UI event handlers
 */
function setupEventHandlers() {
    // Connect button
    document.getElementById('connect-btn').addEventListener('click', handleConnect);

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', handleRefresh);

    // Download logs button
    document.getElementById('download-logs-btn').addEventListener('click', handleDownloadLogs);

    // Export buttons
    document.getElementById('export-csv-btn').addEventListener('click', handleExportCSV);
    document.getElementById('export-json-btn').addEventListener('click', handleExportJSON);

    // Clear logs button
    document.getElementById('clear-logs-btn').addEventListener('click', handleClearLogs);

    // WebUSB connection callbacks
    onConnect(handleDeviceConnected);
    onDisconnect(handleDeviceDisconnected);
}

/**
 * Attempt to auto-reconnect to previously paired device
 */
async function attemptAutoReconnect() {
    try {
        const reconnected = await autoReconnect();
        if (reconnected) {
            console.log('Auto-reconnected to device');
        }
    } catch (error) {
        console.log('Auto-reconnect not available:', error.message);
    }
}

/**
 * Handle connect button click
 */
async function handleConnect() {
    const btn = document.getElementById('connect-btn');

    if (isDeviceConnected()) {
        // Disconnect
        try {
            await disconnectDevice();
        } catch (error) {
            showError('Disconnect failed: ' + error.message);
        }
    } else {
        // Connect
        btn.disabled = true;
        btn.textContent = 'Connecting...';

        try {
            await connectDevice();
        } catch (error) {
            showError(handleUSBError(error));
            btn.disabled = false;
            btn.textContent = 'Connect Device';
        }
    }
}

/**
 * Handle device connected event
 */
async function handleDeviceConnected(device) {
    console.log('Device connected:', device);

    // Update UI
    const btn = document.getElementById('connect-btn');
    btn.textContent = 'Disconnect';
    btn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    btn.classList.add('bg-red-600', 'hover:bg-red-700');
    btn.disabled = false;

    // Show device info
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('device-info').classList.remove('hidden');
    document.getElementById('main-content').classList.remove('hidden');

    // Get and display device info
    const info = getDeviceInfo();
    document.getElementById('device-name').textContent = info.productName;
    document.getElementById('device-serial').textContent = info.serialNumber;

    // Update connection status
    updateConnectionStatus(true);

    // Get firmware version
    try {
        const version = await getFirmwareVersion(device);
        document.getElementById('device-firmware').textContent = version;
    } catch (error) {
        document.getElementById('device-firmware').textContent = 'N/A';
    }

    // Get device log count
    updateDeviceLogCount();

    // Start auto-refresh
    startAutoRefresh();

    // Initial data fetch
    await updateLiveData();
}

/**
 * Handle device disconnected event
 */
function handleDeviceDisconnected() {
    console.log('Device disconnected');

    // Update UI
    const btn = document.getElementById('connect-btn');
    btn.textContent = 'Connect Device';
    btn.classList.remove('bg-red-600', 'hover:bg-red-700');
    btn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    btn.disabled = false;

    // Update connection status
    updateConnectionStatus(false);

    // Hide main content
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('instructions').classList.remove('hidden');

    // Stop auto-refresh
    stopAutoRefresh();
}

/**
 * Update connection status indicator
 */
function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connection-status');
    const dot = statusEl.querySelector('.w-2');
    const text = statusEl.querySelector('span:last-child');

    if (connected) {
        dot.classList.remove('bg-gray-400');
        dot.classList.add('bg-green-500');
        text.textContent = 'Connected';
    } else {
        dot.classList.remove('bg-green-500');
        dot.classList.add('bg-gray-400');
        text.textContent = 'Disconnected';
    }
}

/**
 * Update live sensor data
 */
async function updateLiveData() {
    if (!isDeviceConnected()) {
        return;
    }

    try {
        const device = getDevice();
        const status = await getDeviceStatus(device);

        // Update temperature (°C and °F)
        const tempF = (status.temperature * 9 / 5) + 32;
        document.getElementById('temp-value').textContent =
            `${status.temperature.toFixed(1)}°C (${tempF.toFixed(1)}°F)`;

        // Update humidity
        document.getElementById('humidity-value').textContent =
            `${status.humidity.toFixed(1)}%`;

        // Update PM values with AQI coloring
        updatePMValue('pm25-value', status.pm25);
        updatePMValue('pm10-value', status.pm10);

        // Update battery
        updateBattery(status.battery, status.charging);

        // Update GPS
        updateGPS(status.gpsFix, status.lat, status.lon);

        // Update timestamp
        document.getElementById('last-update').textContent = 'Just now';

    } catch (error) {
        console.error('Failed to update live data:', error);
        showError('Failed to read sensor data: ' + error.message);

        // Set all sensor values to N/A when data is unavailable
        document.getElementById('temp-value').textContent = 'N/A';
        document.getElementById('humidity-value').textContent = 'N/A';
        document.getElementById('pm25-value').textContent = 'N/A';
        document.getElementById('pm10-value').textContent = 'N/A';
        document.getElementById('battery-level').textContent = 'N/A';
        document.getElementById('battery-charging').textContent = 'N/A';
        document.getElementById('gps-fix').textContent = 'N/A';
        document.getElementById('gps-lat').textContent = 'N/A';
        document.getElementById('gps-lon').textContent = 'N/A';
        document.getElementById('last-update').textContent = 'Never';
    }
}

/**
 * Update PM value with AQI color coding
 */
function updatePMValue(elementId, value) {
    const el = document.getElementById(elementId);
    el.textContent = `${value.toFixed(1)} μg/m³`;

    // Remove existing color classes
    el.classList.remove('text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600', 'text-purple-600');

    // Apply AQI color based on PM2.5 levels
    if (value <= 12) {
        el.classList.add('text-green-600'); // Good
    } else if (value <= 35.4) {
        el.classList.add('text-yellow-600'); // Moderate
    } else if (value <= 55.4) {
        el.classList.add('text-orange-600'); // Unhealthy for sensitive
    } else if (value <= 150.4) {
        el.classList.add('text-red-600'); // Unhealthy
    } else {
        el.classList.add('text-purple-600'); // Very unhealthy
    }
}

/**
 * Update battery display
 */
function updateBattery(level, charging) {
    document.getElementById('battery-level').textContent = `${level}%`;
    document.getElementById('battery-charging').textContent = charging ? 'Yes ⚡' : 'No';

    const batteryBar = document.getElementById('battery-bar');
    batteryBar.style.width = `${level}%`;

    // Update battery bar color
    batteryBar.classList.remove('bg-green-500', 'bg-yellow-500', 'bg-red-500');
    if (level > 50) {
        batteryBar.classList.add('bg-green-500');
    } else if (level > 20) {
        batteryBar.classList.add('bg-yellow-500');
    } else {
        batteryBar.classList.add('bg-red-500');
    }
}

/**
 * Update GPS display
 */
function updateGPS(fix, lat, lon) {
    document.getElementById('gps-fix').textContent = formatGPSFix(fix);

    if (fix > 0 && lat !== undefined && lon !== undefined) {
        document.getElementById('gps-lat').textContent = lat.toFixed(7);
        document.getElementById('gps-lon').textContent = lon.toFixed(7);

        const mapLink = document.getElementById('gps-map-link');
        mapLink.href = createMapsURL(lat, lon);
        mapLink.classList.remove('hidden');
    } else {
        document.getElementById('gps-lat').textContent = '-';
        document.getElementById('gps-lon').textContent = '-';
        document.getElementById('gps-map-link').classList.add('hidden');
    }
}

/**
 * Start auto-refresh timer
 */
function startAutoRefresh() {
    stopAutoRefresh();
    autoRefreshInterval = setInterval(updateLiveData, 10000); // Every 10 seconds
}

/**
 * Stop auto-refresh timer
 */
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

/**
 * Handle manual refresh button
 */
async function handleRefresh() {
    const btn = document.getElementById('refresh-btn');
    btn.disabled = true;
    btn.textContent = 'Refreshing...';

    await updateLiveData();

    setTimeout(() => {
        btn.disabled = false;
        btn.textContent = 'Refresh';
    }, 500);
}

/**
 * Update device log count
 */
async function updateDeviceLogCount() {
    if (!isDeviceConnected()) {
        return;
    }

    try {
        const device = getDevice();
        const count = await getLogCount(device);
        document.getElementById('device-log-count').textContent = count.toLocaleString();
    } catch (error) {
        console.error('Failed to get log count:', error);
        document.getElementById('device-log-count').textContent = 'N/A';
    }
}

/**
 * Update browser storage log count
 */
async function updateBrowserLogCount() {
    try {
        const count = await getStorageLogCount();
        document.getElementById('browser-log-count').textContent = count.toLocaleString();
    } catch (error) {
        console.error('Failed to get storage log count:', error);
    }
}

/**
 * Handle download logs button
 */
async function handleDownloadLogs() {
    if (!isDeviceConnected() || isDownloading) {
        return;
    }

    isDownloading = true;

    const btn = document.getElementById('download-logs-btn');
    const progressBar = document.getElementById('download-progress-bar');
    const progressFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');

    btn.disabled = true;
    btn.textContent = 'Downloading...';
    progressBar.classList.remove('hidden');

    try {
        const device = getDevice();
        const info = getDeviceInfo();

        const logs = await downloadAllLogs(device, (current, total) => {
            const percent = (current / total) * 100;
            progressFill.style.width = `${percent}%`;
            progressText.textContent = `Downloading ${current} of ${total} records...`;
            document.getElementById('download-progress').textContent = `${current}/${total}`;
        });

        // Store logs in IndexedDB
        if (logs.length > 0) {
            await storeLogs(logs, info.serialNumber);
            showSuccess(`Downloaded and stored ${logs.length} logs`);
        } else {
            showSuccess('No new logs to download');
        }

        // Update counts
        await updateBrowserLogCount();
        await updateLogTable();

    } catch (error) {
        console.error('Download failed:', error);
        showError('Download failed: ' + error.message);
    } finally {
        isDownloading = false;
        btn.disabled = false;
        btn.textContent = 'Download All Logs';
        progressBar.classList.add('hidden');
        progressFill.style.width = '0%';
        document.getElementById('download-progress').textContent = '-';
    }
}

/**
 * Update log table with recent logs
 */
async function updateLogTable() {
    try {
        const logs = await getRecentLogs(20);
        const tbody = document.getElementById('log-table-body');

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No logs downloaded yet</td></tr>';
            return;
        }

        tbody.innerHTML = logs.map(log => `
            <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 text-sm text-gray-900">${formatTimestamp(log.timestamp)}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${log.temperature.toFixed(1)}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${log.humidity.toFixed(1)}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${log.pm25.toFixed(1)}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${log.pm10.toFixed(1)}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${log.battery}%</td>
            </tr>
        `).join('');

    } catch (error) {
        console.error('Failed to update log table:', error);
    }
}

/**
 * Handle export to CSV
 */
async function handleExportCSV() {
    try {
        const logs = await getAllLogs();
        if (logs.length === 0) {
            showError('No logs to export');
            return;
        }

        exportToCSV(logs);
        showSuccess(`Exported ${logs.length} logs to CSV`);

    } catch (error) {
        console.error('Export failed:', error);
        showError('Export failed: ' + error.message);
    }
}

/**
 * Handle export to JSON
 */
async function handleExportJSON() {
    try {
        const logs = await getAllLogs();
        if (logs.length === 0) {
            showError('No logs to export');
            return;
        }

        exportToJSON(logs);
        showSuccess(`Exported ${logs.length} logs to JSON`);

    } catch (error) {
        console.error('Export failed:', error);
        showError('Export failed: ' + error.message);
    }
}

/**
 * Handle clear logs button
 */
async function handleClearLogs() {
    if (!confirm('Are you sure you want to clear all logs from browser storage? This cannot be undone.')) {
        return;
    }

    try {
        await clearAllLogs();
        await updateBrowserLogCount();
        await updateLogTable();
        showSuccess('All logs cleared from browser storage');

    } catch (error) {
        console.error('Clear failed:', error);
        showError('Failed to clear logs: ' + error.message);
    }
}

/**
 * Format Unix timestamp to readable string
 */
function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}

/**
 * Show error message (simple alert for now)
 */
function showError(message) {
    alert('Error: ' + message);
}

/**
 * Show success message (simple alert for now)
 */
function showSuccess(message) {
    alert(message);
}
