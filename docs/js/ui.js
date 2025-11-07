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
    setDeviceTime,
    triggerAcquisition,
    getLogType,
    formatGPSFix,
    createMapsURL,
    setMockMode,
    eraseLogs
} from './protocol.js';

import { LOG_TYPE, DEVICE_CAPACITY } from './constants.js';

import {
    getAllLogs,
    getLogCount as getStorageLogCount,
    storeLogs,
    clearAllLogs,
    getRecentLogs
} from './storage.js';

import { exportToCSV, exportToJSON } from './export.js';

import { TIME_SYNC } from './constants.js';

// UI state
let autoRefreshInterval = null;
let isDownloading = false;
let currentLogType = null;  // LOG_TYPE.GPS or LOG_TYPE.TSL2591

/**
 * Initialize UI and event handlers
 */
export function initUI() {
    setupEventHandlers();
    attemptAutoReconnect();
    updateBrowserLogCount();
    updateLogTable();  // Load existing logs from IndexedDB on page load
}

/**
 * Setup all UI event handlers
 */
function setupEventHandlers() {
    // Connect button
    document.getElementById('connect-btn').addEventListener('click', handleConnect);

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', handleRefresh);

    // Refresh time button
    document.getElementById('refresh-time-btn').addEventListener('click', handleRefreshTime);

    // Download logs button
    document.getElementById('download-logs-btn').addEventListener('click', handleDownloadLogs);

    // Export buttons
    document.getElementById('export-csv-btn').addEventListener('click', handleExportCSV);
    document.getElementById('export-json-btn').addEventListener('click', handleExportJSON);

    // Clear logs button
    document.getElementById('clear-logs-btn').addEventListener('click', handleClearLogs);

    // Erase device logs button
    document.getElementById('erase-device-logs-btn').addEventListener('click', handleEraseDeviceLogs);

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

    // Detect log format type
    try {
        currentLogType = await getLogType(device);
        const formatText = currentLogType === LOG_TYPE.TSL2591 ? 'TSL2591 (Light Sensor)' : 'GPS';
        console.log(`Log format: ${formatText}`);
        // Display log format if we have a UI element for it
        const logFormatEl = document.getElementById('log-format');
        if (logFormatEl) {
            logFormatEl.textContent = formatText;
        }
    } catch (error) {
        console.log('Failed to detect log format:', error.message);
        currentLogType = LOG_TYPE.GPS;  // Default to GPS format
    }

    // Set device time to current system time
    try {
        await syncDeviceTime(device, false);
        console.log('Device time synchronized to system time');
    } catch (error) {
        console.log('Failed to set device time on connect:', error.message);
        // Non-critical, continue anyway
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
        const status = await getDeviceStatus(device, currentLogType);

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

        // Update GPS or Lux based on log type
        if (currentLogType === LOG_TYPE.TSL2591) {
            updateLux(status.lux);
        } else {
            updateGPS(status.gpsFix, status.lat, status.lon);
        }

        // Update device time
        updateDeviceTime(status.timestamp);

        // Update measurement age
        const ageSeconds = status.currentTime - status.measuredAt;
        if (ageSeconds < 60) {
            document.getElementById('measured-age').textContent = `${ageSeconds}s ago`;
        } else if (ageSeconds < 3600) {
            document.getElementById('measured-age').textContent = `${Math.floor(ageSeconds / 60)}m ago`;
        } else {
            document.getElementById('measured-age').textContent = `${Math.floor(ageSeconds / 3600)}h ago`;
        }

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
        document.getElementById('device-time').textContent = '--:--:--';
        document.getElementById('system-time').textContent = '--:--:--';
        document.getElementById('time-drift').textContent = '-';
        document.getElementById('measured-age').textContent = '--';
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
    const gpsPanel = document.getElementById('gps-panel');
    const luxPanel = document.getElementById('lux-panel');

    if (gpsPanel) gpsPanel.classList.remove('hidden');
    if (luxPanel) luxPanel.classList.add('hidden');

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
 * Update Lux display (TSL2591 light sensor)
 */
function updateLux(lux) {
    const gpsPanel = document.getElementById('gps-panel');
    const luxPanel = document.getElementById('lux-panel');

    if (gpsPanel) gpsPanel.classList.add('hidden');
    if (luxPanel) luxPanel.classList.remove('hidden');

    if (lux !== undefined) {
        document.getElementById('lux-value').textContent = `${lux.toFixed(1)} lux`;
    } else {
        document.getElementById('lux-value').textContent = '--';
    }
}

/**
 * Update device time display
 * Displays device timestamp vs system time and calculates/shows time drift
 * @param {number} deviceTimestamp - Unix epoch timestamp from device
 */
function updateDeviceTime(deviceTimestamp) {
    // Device time from firmware
    const deviceTime = new Date(deviceTimestamp * 1000);
    document.getElementById('device-time').textContent = deviceTime.toLocaleTimeString();

    // System time
    const systemTime = new Date();
    document.getElementById('system-time').textContent = systemTime.toLocaleTimeString();

    // Calculate drift
    const driftSeconds = Math.abs(deviceTime - systemTime) / 1000;
    const driftEl = document.getElementById('time-drift');

    if (driftSeconds < TIME_SYNC.DRIFT_THRESHOLD_SECONDS) {
        driftEl.textContent = 'Synced';
        driftEl.classList.remove('text-red-600');
        driftEl.classList.add('text-green-600');
    } else {
        driftEl.textContent = `±${driftSeconds.toFixed(0)}s`;
        driftEl.classList.remove('text-green-600');
        driftEl.classList.add('text-red-600');
    }
}

/**
 * Synchronize device time with system time
 * @param {USBDevice} device - The USB device
 * @param {boolean} updateAfter - Whether to update live data after sync
 * @returns {Promise<void>}
 */
async function syncDeviceTime(device, updateAfter = false) {
    const now = Math.floor(Date.now() / 1000);
    await setDeviceTime(device, now);

    if (updateAfter) {
        await updateLiveData();
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
    if (!isDeviceConnected()) {
        return;
    }

    const btn = document.getElementById('refresh-btn');
    btn.disabled = true;

    try {
        // Trigger sensor acquisition
        const device = getDevice();
        btn.textContent = 'Acquiring...';
        await triggerAcquisition(device);

        // 20-second countdown
        for (let i = 20; i > 0; i--) {
            btn.textContent = `Acquiring... ${i}s`;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Fetch fresh data
        btn.textContent = 'Reading...';
        await updateLiveData();

        // Success feedback
        btn.textContent = 'Refreshed!';
        await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
        console.error('Failed to refresh:', error);
        showError('Failed to refresh: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Refresh';
    }
}

/**
 * Handle refresh time button
 */
async function handleRefreshTime() {
    if (!isDeviceConnected()) {
        return;
    }

    const btn = document.getElementById('refresh-time-btn');
    btn.disabled = true;

    try {
        const device = getDevice();
        await syncDeviceTime(device, true);  // true: update display immediately
        console.log('Device time re-synchronized');
    } catch (error) {
        console.error('Failed to refresh device time:', error);
        showError('Failed to sync time: ' + error.message);
    } finally {
        btn.disabled = false;
    }
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

        // Also update device capacity display
        updateDeviceCapacity(count);
    } catch (error) {
        console.error('Failed to get log count:', error);
        document.getElementById('device-log-count').textContent = 'N/A';
        updateDeviceCapacity(0);
    }
}

/**
 * Update device storage capacity display
 * @param {number} count - Current number of logs on device
 */
function updateDeviceCapacity(count) {
    const maxCapacity = DEVICE_CAPACITY.MAX_LOG_CAPACITY;
    const percent = (count / maxCapacity) * 100;

    // Update text
    document.getElementById('device-capacity-text').textContent = `${count} / ${maxCapacity} (${percent.toFixed(1)}%)`;

    // Update progress bar
    const bar = document.getElementById('device-capacity-bar');
    bar.style.width = `${percent}%`;

    // Change color based on capacity
    bar.classList.remove('bg-blue-600', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600');
    if (percent < 50) {
        bar.classList.add('bg-blue-600');
    } else if (percent < 75) {
        bar.classList.add('bg-yellow-500');
    } else if (percent < 90) {
        bar.classList.add('bg-orange-500');
    } else {
        bar.classList.add('bg-red-600');
    }

    // Enable/disable erase button
    const eraseBtn = document.getElementById('erase-device-logs-btn');
    eraseBtn.disabled = count === 0 || !isDeviceConnected();
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

        const result = await downloadAllLogs(device, (current, total) => {
            const percent = (current / total) * 100;
            progressFill.style.width = `${percent}%`;
            progressText.textContent = `Downloading ${current} of ${total} records...`;
            document.getElementById('download-progress').textContent = `${current}/${total}`;
        });

        const { logType, logs } = result;

        // Update current log type
        currentLogType = logType;

        // Store logs in IndexedDB with log type metadata
        if (logs.length > 0) {
            // Add logType to each log record before storing
            const logsWithType = logs.map(log => ({ ...log, logType }));
            const storeResult = await storeLogs(logsWithType, info.serialNumber);
            const formatName = logType === LOG_TYPE.TSL2591 ? 'TSL2591' : 'GPS';

            // Report results with duplicate information
            if (storeResult.skipped > 0) {
                showSuccess(`Downloaded ${logs.length} logs (${formatName} format): ${storeResult.success} new, ${storeResult.skipped} duplicates skipped`);
            } else {
                showSuccess(`Downloaded and stored ${storeResult.success} logs (${formatName} format)`);
            }
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
        const thead = document.querySelector('#log-table-body').closest('table').querySelector('thead tr');

        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="11" class="px-4 py-8 text-center text-gray-500">No logs downloaded yet</td></tr>';
            return;
        }

        // Detect log format from first log
        const isTSL = logs[0].hasOwnProperty('lux');

        // Update table headers based on format
        if (isTSL) {
            thead.innerHTML = `
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM2.5</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM10</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lux</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CH0</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CH1</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overflow</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
            `;
            tbody.innerHTML = logs.map(log => `
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">${formatTimestamp(log.timestamp)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.temperature.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.humidity.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.pm25.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.pm10.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.lux.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">${log.tslCH0}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">${log.tslCH1}</td>
                    <td class="px-4 py-3 text-sm ${log.overflow ? 'text-red-600 font-semibold' : 'text-green-600'}">${log.overflow ? '⚠️ SAT' : 'OK'}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.battery}%</td>
                    <td class="px-4 py-3 text-xs text-gray-600 font-mono">${log.deviceSerial || '-'}</td>
                </tr>
            `).join('');
        } else {
            // GPS format
            thead.innerHTML = `
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM2.5</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM10</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
            `;
            tbody.innerHTML = logs.map(log => `
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">${formatTimestamp(log.timestamp)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.temperature.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.humidity.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.pm25.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.pm10.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.battery}%</td>
                    <td class="px-4 py-3 text-xs text-gray-600 font-mono">${log.deviceSerial || '-'}</td>
                </tr>
            `).join('');
        }

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
 * Handle erase device logs button
 */
async function handleEraseDeviceLogs() {
    if (!isDeviceConnected()) {
        return;
    }

    // Double confirmation for device erase (destructive action)
    if (!confirm('⚠️ WARNING: This will permanently erase ALL logs from the device!\n\nAre you absolutely sure?')) {
        return;
    }

    if (!confirm('This action CANNOT be undone. Erase all device logs?')) {
        return;
    }

    const btn = document.getElementById('erase-device-logs-btn');
    btn.disabled = true;
    btn.textContent = 'Erasing...';

    try {
        const device = getDevice();
        const success = await eraseLogs(device);

        if (success) {
            showSuccess('Device logs erased successfully');
            // Update counts to reflect empty device
            await updateDeviceLogCount();
        } else {
            showError('Failed to erase device logs');
        }

    } catch (error) {
        console.error('Erase failed:', error);
        showError('Failed to erase logs: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Erase Device Logs';
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
