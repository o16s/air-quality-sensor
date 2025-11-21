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

import { LOG_TYPE, DEVICE_CAPACITY, SPARKLINE_THRESHOLDS } from './constants.js';

import {
    getAllLogs,
    getLogCount as getStorageLogCount,
    storeLogs,
    clearAllLogs,
    getRecentLogs,
    getLogsByDateRange
} from './storage.js';

import { exportToCSV, exportToJSON } from './export.js';

import { TIME_SYNC } from './constants.js';

// UI state
let autoRefreshInterval = null;
let isDownloading = false;
let currentLogType = null;  // LOG_TYPE.GPS or LOG_TYPE.TSL2591

// Sparklines are populated from browser storage, not in-memory history
// This ensures sparklines show historical data, not just live readings

/**
 * Initialize UI and event handlers
 */
export async function initUI() {
    setupEventHandlers();
    await attemptAutoReconnect();
    updateBrowserLogCount();
    updateLogTable();  // Load existing logs from IndexedDB on page load
    loadSparklinesFromStorage();  // Load sparklines from existing data
    loadLastSyncTime();  // Load last sync time from localStorage

    // Show appropriate section based on connection state
    if (isDeviceConnected()) {
        // Device connected - show device info
        document.getElementById('connect-section').classList.add('hidden');
        document.getElementById('device-info').classList.remove('hidden');
    } else {
        // No device - show connect section
        document.getElementById('connect-section').classList.remove('hidden');

        // Show measurement history if available, otherwise show instructions
        await showAppropriateDisconnectedContent();
    }
}

/**
 * Setup all UI event handlers
 */
function setupEventHandlers() {
    // Connect button
    document.getElementById('connect-btn').addEventListener('click', handleConnect);

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', handleRefresh);

    // Sync Data button (in header)
    document.getElementById('sync-data-btn-header').addEventListener('click', handleDownloadLogs);

    // Disconnect button (in header)
    document.getElementById('disconnect-btn-header').addEventListener('click', handleDisconnect);

    // Settings button
    document.getElementById('settings-btn').addEventListener('click', openSettingsModal);

    // Modal close button
    document.getElementById('close-modal-btn').addEventListener('click', closeSettingsModal);

    // Erase device button (in modal)
    document.getElementById('erase-device-btn').addEventListener('click', handleEraseDevice);

    // Close modal when clicking outside
    document.getElementById('settings-modal').addEventListener('click', (e) => {
        if (e.target.id === 'settings-modal') {
            closeSettingsModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('settings-modal');
            if (!modal.classList.contains('hidden')) {
                closeSettingsModal();
            }
        }
    });

    // Export button
    document.getElementById('export-csv-btn').addEventListener('click', handleExportCSV);

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
    console.log('Hiding connect section, showing device info');

    // Hide connect section, show device info
    const connectSection = document.getElementById('connect-section');
    const deviceInfo = document.getElementById('device-info');

    console.log('connect-section element:', connectSection);
    console.log('device-info element:', deviceInfo);

    connectSection.classList.add('hidden');
    deviceInfo.classList.remove('hidden');

    console.log('connect-section hidden?', connectSection.classList.contains('hidden'));
    console.log('device-info hidden?', deviceInfo.classList.contains('hidden'));

    // Show main content and hide instructions
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('live-data-section').classList.remove('hidden');

    // Show footer logo when connected
    document.getElementById('footer-logo').classList.remove('hidden');

    // Get and display device info
    const info = getDeviceInfo();
    document.getElementById('device-name').textContent = info.productName;
    document.getElementById('device-serial').textContent = info.serialNumber;

    // Update connection status
    updateConnectionStatus(true);

    // Get firmware version and parse model
    try {
        const versionString = await getFirmwareVersion(device);

        // Parse version string: "OAQ-1-2 7088c449-dirty" → model + firmware
        const parts = versionString.trim().split(' ');
        const model = parts[0] || '-';
        const firmware = parts.slice(1).join(' ') || '-';

        // Display model and firmware separately
        document.getElementById('device-model').textContent = model;
        document.getElementById('device-firmware').textContent = firmware;

        // Display product image if available
        if (model !== '-') {
            const productImage = document.getElementById('product-image');
            const productImageContainer = document.getElementById('product-image-container');

            productImage.src = `img/${model}.jpg`;
            productImage.alt = model;

            // Show image container (hide on error)
            productImage.onload = () => {
                productImageContainer.classList.remove('hidden');
            };
            productImage.onerror = () => {
                productImageContainer.classList.add('hidden');
                console.log(`Product image not found: img/${model}.jpg`);
            };
        }
    } catch (error) {
        document.getElementById('device-model').textContent = 'N/A';
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

    // Load sparklines from storage (now that main content is visible)
    loadSparklinesFromStorage();

    // Start auto-refresh
    startAutoRefresh();

    // Initial data fetch
    await updateLiveData();
}

/**
 * Show appropriate content when disconnected (instructions or measurement history)
 */
async function showAppropriateDisconnectedContent() {
    try {
        const logCount = await getStorageLogCount();

        if (logCount > 0) {
            // Have data - show measurement history (but not live data)
            document.getElementById('instructions').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
            document.getElementById('live-data-section').classList.add('hidden');
        } else {
            // No data - show getting started instructions
            document.getElementById('instructions').classList.remove('hidden');
            document.getElementById('main-content').classList.add('hidden');
        }
    } catch (error) {
        // Error checking logs - default to showing instructions
        document.getElementById('instructions').classList.remove('hidden');
        document.getElementById('main-content').classList.add('hidden');
    }
}

/**
 * Open settings modal
 */
function openSettingsModal() {
    document.getElementById('settings-modal').classList.remove('hidden');
}

/**
 * Close settings modal
 */
function closeSettingsModal() {
    document.getElementById('settings-modal').classList.add('hidden');
}

/**
 * Handle device disconnected event
 */
async function handleDeviceDisconnected() {
    console.log('Device disconnected');

    // Show connect section, hide device info
    document.getElementById('connect-section').classList.remove('hidden');
    document.getElementById('device-info').classList.add('hidden');

    // Reset connect button state
    const connectBtn = document.getElementById('connect-btn');
    connectBtn.disabled = false;
    connectBtn.textContent = 'Connect Device';

    // Update connection status
    updateConnectionStatus(false);

    // Show measurement history if available, otherwise show instructions
    await showAppropriateDisconnectedContent();

    // Hide status indicators
    document.getElementById('storage-status-inline').classList.add('hidden');

    // Hide product image and footer logo
    document.getElementById('product-image-container').classList.add('hidden');
    document.getElementById('footer-logo').classList.add('hidden');

    // Stop auto-refresh
    stopAutoRefresh();
}

/**
 * Update connection status indicator
 */
function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connection-status');
    const dot = statusEl.querySelector('.w-2');
    const text = statusEl.querySelector('.font-medium');

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

        // Update temperature (°C only)
        document.getElementById('temp-value').textContent =
            `${status.temperature.toFixed(1)}°C`;

        // Update humidity
        document.getElementById('humidity-value').textContent =
            `${status.humidity.toFixed(1)}%`;

        // Update PM values with AQI coloring
        updatePMValue('pm25-value', status.pm25);
        updatePMValue('pm10-value', status.pm10);

        // Update battery (now uses voltage instead of percentage)
        updateBattery(status.batteryVoltage, status.charging);

        // Update Lux for TSL2591 format
        // Sparklines are NOT updated here - they update only on Refresh or Sync
        if (currentLogType === LOG_TYPE.TSL2591) {
            updateLux(status.lux);
        }

        // Update PM measurement age
        const ageSeconds = status.currentTime - status.measuredAt;
        if (ageSeconds < 5) {
            document.getElementById('measured-age').textContent = 'fresh';
        } else if (ageSeconds < 60) {
            document.getElementById('measured-age').textContent = `${ageSeconds}s old`;
        } else if (ageSeconds < 3600) {
            document.getElementById('measured-age').textContent = `${Math.floor(ageSeconds / 60)}m old`;
        } else {
            document.getElementById('measured-age').textContent = `${Math.floor(ageSeconds / 3600)}h old`;
        }

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
        document.getElementById('measured-age').textContent = '--';
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
 * Format battery voltage for display with charging icon
 * @param {number} voltageMv - Battery voltage in millivolts
 * @param {boolean} charging - Whether battery is charging
 * @returns {string} Formatted HTML string with voltage and charging icon
 */
function formatBatteryVoltage(voltageMv, charging) {
    const voltage = (voltageMv / 1000).toFixed(2);
    const chargingIcon = charging ? '<svg class="w-3 h-3 inline ml-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>' : '';
    return `${voltage}V${chargingIcon}`;
}

/**
 * Update battery display (inline status bar)
 * Now uses battery voltage (mV) instead of percentage
 */
function updateBattery(voltageMv, charging) {
    const batteryStatus = document.getElementById('battery-status-inline');
    const batteryPercent = document.getElementById('battery-percent-inline');
    const batteryCharging = document.getElementById('battery-charging-inline');
    const batteryFill = document.getElementById('battery-fill');

    // Convert voltage to percentage (LiPo battery curve approximation)
    // 3.3V = 0%, 4.15V = 100% (matches firmware calculation)
    let level;
    if (voltageMv <= 3300) {
        level = 0;
    } else if (voltageMv >= 4150) {
        level = 100;
    } else {
        // Linear approximation between 3.3V and 4.15V
        level = Math.round(((voltageMv - 3300) / (4150 - 3300)) * 100);
    }

    // Show battery status with voltage in tooltip
    batteryStatus.classList.remove('hidden');
    batteryPercent.textContent = `${level}%`;
    batteryPercent.setAttribute('title', `${(voltageMv / 1000).toFixed(2)}V`);

    // Update charging indicator
    if (charging) {
        batteryCharging.classList.remove('hidden');
    } else {
        batteryCharging.classList.add('hidden');
    }

    // Update battery fill width (SVG rect width attribute)
    const fillWidth = (16 * level) / 100;  // 16 is the max width of the battery body
    batteryFill.setAttribute('width', fillWidth);

    // Update battery color based on level
    const batteryContainer = batteryStatus.querySelector('svg');
    batteryContainer.classList.remove('text-green-600', 'text-yellow-600', 'text-red-600');
    if (level > 50) {
        batteryContainer.classList.add('text-green-600');
    } else if (level > 20) {
        batteryContainer.classList.add('text-yellow-600');
    } else {
        batteryContainer.classList.add('text-red-600');
    }
}

/**
 * Update GPS display
 */
function updateGPS(fix, lat, lon) {
    const gpsPanel = document.getElementById('gps-panel');
    const luxWidget = document.getElementById('lux-widget');

    if (gpsPanel) gpsPanel.classList.remove('hidden');
    if (luxWidget) luxWidget.classList.add('hidden');

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
    const luxCard = document.getElementById('lux-card');

    if (gpsPanel) gpsPanel.classList.add('hidden');
    if (luxCard) luxCard.classList.remove('hidden');

    if (lux !== undefined) {
        document.getElementById('lux-value').textContent = `${lux.toFixed(1)} lux`;
    } else {
        document.getElementById('lux-value').textContent = '-- lux';
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

        // Update sparklines from browser storage
        await loadSparklinesFromStorage();

        // Success feedback
        btn.textContent = 'Refreshed!';
        await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
        console.error('Failed to refresh:', error);
        showError('Failed to refresh: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Measure Now';
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

        // Update device capacity display in status bar
        updateDeviceCapacity(count);
    } catch (error) {
        console.error('Failed to get log count:', error);
        updateDeviceCapacity(0);
    }
}

/**
 * Update device storage capacity display in status bar
 * @param {number} count - Current number of logs on device
 */
function updateDeviceCapacity(count) {
    const maxCapacity = DEVICE_CAPACITY.MAX_LOG_CAPACITY;
    const percent = (count / maxCapacity) * 100;
    const measurementInterval = DEVICE_CAPACITY.MEASUREMENT_INTERVAL;

    // Show storage status in status bar
    const storageStatus = document.getElementById('storage-status-inline');
    storageStatus.classList.remove('hidden');

    // Update count display
    const countEl = document.getElementById('storage-count-inline');
    const measurementText = count === 1 ? 'measurement' : 'measurements';
    countEl.textContent = `${count} ${measurementText}`;

    // Calculate and display "Memory full in X days"
    const fullDateEl = document.getElementById('storage-full-date');
    if (count > 0 && count < maxCapacity) {
        const remainingLogs = maxCapacity - count;
        const secondsUntilFull = remainingLogs * measurementInterval;
        const daysUntilFull = secondsUntilFull / (60 * 60 * 24);

        let fullText;
        if (daysUntilFull < 1) {
            const hoursUntilFull = Math.round(secondsUntilFull / 3600);
            fullText = `Memory full in ${hoursUntilFull}h`;
        } else {
            fullText = `Memory full in ${Math.round(daysUntilFull)}d`;
        }
        fullDateEl.textContent = fullText;

        // Set tooltip with detailed info
        const intervalMinutes = Math.round(measurementInterval / 60);
        const tooltip = `Recording every ${intervalMinutes} min • Max ${maxCapacity} measurements • ${percent.toFixed(1)}% used`;
        fullDateEl.setAttribute('title', tooltip);

        fullDateEl.classList.remove('hidden');
    } else if (count >= maxCapacity) {
        fullDateEl.textContent = 'Memory full';
        fullDateEl.setAttribute('title', `Max ${maxCapacity} measurements reached`);
        fullDateEl.classList.remove('hidden');
    } else {
        fullDateEl.classList.add('hidden');
    }
}

/**
 * Update browser storage log count
 */
async function updateBrowserLogCount() {
    try {
        const count = await getStorageLogCount();
        const countEl = document.getElementById('browser-log-count');
        const countSpan = countEl.querySelector('.font-medium');
        if (countSpan) {
            countSpan.textContent = count.toLocaleString();
        }
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

    const btn = document.getElementById('sync-data-btn-header');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Syncing...';

    try {
        const device = getDevice();
        const info = getDeviceInfo();

        const result = await downloadAllLogs(device, (current, total) => {
            btn.textContent = `Syncing ${current}/${total}`;
        });

        const { logType, logs } = result;

        // Update current log type
        currentLogType = logType;

        // Store logs in IndexedDB with sync metadata
        if (logs.length > 0) {
            // Add metadata to each log record
            const syncedOn = Date.now();
            const logsWithMetadata = logs.map(log => ({
                ...log,
                logType,
                syncedOn
            }));

            const storeResult = await storeLogs(logsWithMetadata, info.serialNumber);
            const formatName = logType === LOG_TYPE.TSL2591 ? 'TSL2591' : 'GPS';

            // Sync device time AFTER downloading
            try {
                await syncDeviceTime(device, false);
            } catch (error) {
                console.log('Failed to sync device time after download:', error.message);
            }

            // Report results with duplicate information
            if (storeResult.skipped > 0) {
                showSuccess(`Downloaded ${logs.length} logs (${formatName} format): ${storeResult.success} new, ${storeResult.skipped} duplicates skipped`);
            } else {
                showSuccess(`Downloaded and stored ${storeResult.success} logs (${formatName} format)`);
            }
        } else {
            showSuccess('No new logs to download');
        }

        // Update counts, table, and sparklines
        await updateBrowserLogCount();
        await updateLogTable();
        await loadSparklinesFromStorage();
        updateLastSyncTime();

    } catch (error) {
        console.error('Download failed:', error);
        showError('Download failed: ' + error.message);
    } finally {
        isDownloading = false;
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/**
 * Update last sync time display and store in localStorage
 */
function updateLastSyncTime() {
    const now = Date.now();
    localStorage.setItem('lastSyncTime', now.toString());

    const timeString = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('last-sync-time').textContent = `Last synced: ${timeString}`;
}

/**
 * Load last sync time from localStorage on page load
 */
function loadLastSyncTime() {
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
        const date = new Date(parseInt(lastSync));
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('last-sync-time').textContent = `Last synced: ${timeString}`;
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
            tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-gray-500">No logs downloaded yet</td></tr>';
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
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charging</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Synced On</th>
            `;
            tbody.innerHTML = logs.map(log => {
                const syncedOnDate = log.syncedOn ? new Date(log.syncedOn).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
                return `
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
                    <td class="px-4 py-3 text-sm text-gray-900">${(log.batteryVoltage / 1000).toFixed(2)}V</td>
                    <td class="px-4 py-3 text-sm ${log.charging ? 'text-green-600' : 'text-gray-400'}">${log.charging ? '⚡' : '—'}</td>
                    <td class="px-4 py-3 text-xs text-gray-600 font-mono">${log.deviceSerial || '-'}</td>
                    <td class="px-4 py-3 text-xs text-gray-500">${syncedOnDate}</td>
                </tr>
            `;
            }).join('');
        } else {
            // GPS format
            thead.innerHTML = `
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM2.5</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM10</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charging</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Synced On</th>
            `;
            tbody.innerHTML = logs.map(log => {
                const syncedOnDate = log.syncedOn ? new Date(log.syncedOn).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
                return `
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">${formatTimestamp(log.timestamp)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.temperature.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.humidity.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.pm25.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${log.pm10.toFixed(1)}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${(log.batteryVoltage / 1000).toFixed(2)}V</td>
                    <td class="px-4 py-3 text-sm ${log.charging ? 'text-green-600' : 'text-gray-400'}">${log.charging ? '⚡' : '—'}</td>
                    <td class="px-4 py-3 text-xs text-gray-600 font-mono">${log.deviceSerial || '-'}</td>
                    <td class="px-4 py-3 text-xs text-gray-500">${syncedOnDate}</td>
                </tr>
            `;
            }).join('');
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
 * Handle disconnect button
 */
async function handleDisconnect() {
    if (!isDeviceConnected()) {
        return;
    }

    try {
        await disconnectDevice();
    } catch (error) {
        console.error('Disconnect failed:', error);
        showError('Failed to disconnect: ' + error.message);
    }
}

/**
 * Handle erase device button
 */
async function handleEraseDevice() {
    if (!isDeviceConnected()) {
        return;
    }

    // Double confirmation for device erase (destructive action)
    if (!confirm('WARNING: This will permanently erase ALL logs from the device!\n\nAre you absolutely sure?')) {
        return;
    }

    if (!confirm('This action CANNOT be undone. Erase all device logs?')) {
        return;
    }

    const btn = document.getElementById('erase-device-btn');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Erasing...';

    try {
        const device = getDevice();
        const success = await eraseLogs(device);

        if (success) {
            showSuccess('Device logs erased successfully');
            // Update capacity display to reflect empty device
            await updateDeviceLogCount();
            // Close modal on success
            closeSettingsModal();
        } else {
            showError('Failed to erase device logs');
        }

    } catch (error) {
        console.error('Erase failed:', error);
        showError('Failed to erase logs: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
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
 * Show error message (console only, no annoying alerts)
 */
function showError(message) {
    console.error('❌', message);
    // Could add a toast notification here in the future
}

/**
 * Show success message (console only, no annoying alerts)
 */
function showSuccess(message) {
    console.log('✅', message);
    // Sync/export success is already obvious from UI updates
    // No need for annoying alert popups
}

/**
 * Calculate temperature scale (uses fixed range 16-27°C for office comfort)
 * @param {Array<number>} tempValues - Temperature values in °C
 * @returns {Object} Scale configuration with range and thresholds
 */
function getTemperatureScale(tempValues) {
    if (!tempValues || tempValues.length === 0) {
        return SPARKLINE_THRESHOLDS.temperature;
    }

    const dataMin = Math.min(...tempValues);
    const dataMax = Math.max(...tempValues);

    // Use fixed temperature range from constants (16-27°C)
    let rangeMin = SPARKLINE_THRESHOLDS.temperature.range.min; // Fixed at 16°C
    let rangeMax = SPARKLINE_THRESHOLDS.temperature.range.max; // Fixed at 27°C

    // Expand if data exceeds range
    if (dataMin < rangeMin) rangeMin = Math.floor(dataMin);
    if (dataMax > rangeMax) rangeMax = Math.ceil(dataMax);

    return {
        range: { min: rangeMin, max: rangeMax },
        thresholds: SPARKLINE_THRESHOLDS.temperature.thresholds
    };
}

/**
 * Load sparklines from browser storage (last 12 hours, or recent data if less available)
 * Called after Refresh or Sync Data to update historical trends
 */
async function loadSparklinesFromStorage() {
    try {
        // Get logs from last 12 hours
        const now = Math.floor(Date.now() / 1000);
        const twelveHoursAgo = now - (12 * 60 * 60); // 43,200 seconds

        let recentLogs = await getLogsByDateRange(twelveHoursAgo, now);

        // If we don't have enough data in 12 hours, fall back to most recent logs
        if (!recentLogs || recentLogs.length < 2) {
            recentLogs = await getRecentLogs(10); // Get up to 10 most recent logs
        }

        if (!recentLogs || recentLogs.length < 2) {
            // Still not enough data for meaningful sparkline
            return;
        }

        // Sort chronologically (oldest first)
        const logsChronological = recentLogs.sort((a, b) => a.timestamp - b.timestamp);

        // Detect log format from stored data (check if logs have 'lux' field)
        const hasLuxData = logsChronological.some(log => log.lux !== undefined && log.lux !== null);

        // Extract timestamps and sensor values
        const timestamps = logsChronological.map(log => log.timestamp);
        const pm25Values = logsChronological.map(log => log.pm25).filter(v => v !== undefined && v !== null);
        const pm10Values = logsChronological.map(log => log.pm10).filter(v => v !== undefined && v !== null);
        const tempValues = logsChronological.map(log => log.temperature).filter(v => v !== undefined && v !== null);
        const humidityValues = logsChronological.map(log => log.humidity).filter(v => v !== undefined && v !== null);

        // Update sparklines with fixed scales, thresholds, and timestamps
        const pm25Config = { ...SPARKLINE_THRESHOLDS.pm25, timestamps };
        const pm10Config = { ...SPARKLINE_THRESHOLDS.pm10, timestamps };
        const tempConfig = { ...getTemperatureScale(tempValues), timestamps };
        const humidityConfig = { ...SPARKLINE_THRESHOLDS.humidity, timestamps };

        updateSparkline('pm25-sparkline', pm25Values, pm25Config);
        updateSparkline('pm10-sparkline', pm10Values, pm10Config);
        updateSparkline('temp-sparkline', tempValues, tempConfig);
        updateSparkline('humidity-sparkline', humidityValues, humidityConfig);

        // Update lux sparkline if TSL2591 format (detect from data)
        if (hasLuxData) {
            const luxCard = document.getElementById('lux-card');
            if (luxCard) {
                luxCard.classList.remove('hidden');
            }
            const luxValues = logsChronological.map(log => log.lux).filter(v => v !== undefined && v !== null);
            const luxConfig = { ...SPARKLINE_THRESHOLDS.lux, timestamps };
            updateSparkline('lux-sparkline', luxValues, luxConfig);
        }
    } catch (error) {
        console.error('Failed to load sparklines from storage:', error);
    }
}

/**
 * Update sparkline with fixed scale, threshold gridlines, and time axis
 * @param {string} canvasId - Canvas element ID
 * @param {Array<number>} dataPoints - Data values (chronological)
 * @param {Object} config - Scale and threshold configuration
 * @param {Object} config.range - Fixed y-axis range {min, max}
 * @param {Array} config.thresholds - Threshold definitions [{label, value, color, name}, ...]
 * @param {Array<number>} config.timestamps - Unix timestamps for each data point
 */
function updateSparkline(canvasId, dataPoints, config = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !dataPoints || dataPoints.length < 2) {
        return; // Need minimum 2 points for sparkline
    }

    const { range = {}, thresholds = [] } = config;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Set canvas size to match actual display size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Reserve space for threshold labels on right (plot fills left edge)
    const rightMargin = 30; // Space for threshold labels
    const plotWidth = width - rightMargin;

    // Determine scale (use fixed range or auto-scale)
    const dataMin = Math.min(...dataPoints);
    const dataMax = Math.max(...dataPoints);
    let min = range.min !== null && range.min !== undefined ? range.min : dataMin;
    let max = range.max !== null && range.max !== undefined ? range.max : dataMax;

    // Expand range if data exceeds fixed bounds (overflow handling)
    if (range.min !== null && dataMin < range.min) min = Math.floor(dataMin);
    if (range.max !== null && dataMax > range.max) max = Math.ceil(dataMax);

    const rangeSpan = max - min || 1; // Avoid division by zero

    // Reserve padding at top and bottom for visual breathing room
    const topPadding = 10; // 10px padding at top
    const bottomPadding = 15; // 15px padding at bottom (for time axis)
    const plotHeight = height - topPadding - bottomPadding;

    // Draw threshold gridlines (full width, behind data)
    if (thresholds.length > 0) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = '9px system-ui';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        thresholds.forEach(threshold => {
            if (threshold.value >= min && threshold.value <= max) {
                // Calculate y position with padding and snap to pixel boundary for crisp rendering
                let y = topPadding + (plotHeight - ((threshold.value - min) / rangeSpan) * plotHeight);
                y = Math.round(y) + 0.5; // Align to pixel grid (0.5 offset for 1px lines)

                // Draw gridline (full width from left edge)
                ctx.strokeStyle = threshold.color + '18'; // 9% opacity (subtle)
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(plotWidth, y);
                ctx.stroke();

                // Draw tick mark on right edge
                ctx.strokeStyle = threshold.color + '60'; // 38% opacity
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(plotWidth, y);
                ctx.lineTo(plotWidth + 6, y);
                ctx.stroke();

                // Draw threshold label
                ctx.fillStyle = '#9ca3af'; // gray-400 (subtle)
                ctx.fillText(threshold.label, width - 2, y);
            }
        });

        ctx.restore();
    }

    // Calculate data points for plotting (edge-to-edge horizontally, with vertical padding)
    const step = plotWidth / (dataPoints.length - 1);
    const points = dataPoints.map((value, i) => ({
        x: i * step,
        y: topPadding + (plotHeight - ((value - min) / rangeSpan) * plotHeight)
    }));

    // Draw smooth curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // Use quadratic curves for smoothness
    for (let i = 1; i < points.length; i++) {
        const xMid = (points[i - 1].x + points[i].x) / 2;
        const yMid = (points[i - 1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xMid, yMid);
    }

    // Complete the last segment
    const lastPoint = points[points.length - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)'; // blue-600 at 70% opacity (increased visibility)
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw time axis (hour markers at bottom)
    if (config.timestamps && config.timestamps.length > 0) {
        ctx.save();
        ctx.font = '9px system-ui';
        ctx.fillStyle = '#9ca3af'; // gray-400
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const firstTime = config.timestamps[0];
        const lastTime = config.timestamps[config.timestamps.length - 1];
        const timeSpan = lastTime - firstTime;

        // Draw hour markers (every hour)
        const hourInterval = 60 * 60; // 1 hour in seconds
        const firstHour = Math.ceil(firstTime / hourInterval) * hourInterval;

        for (let t = firstHour; t <= lastTime; t += hourInterval) {
            // Calculate x position
            const ratio = (t - firstTime) / timeSpan;
            const x = ratio * plotWidth;

            // Draw tick mark
            ctx.strokeStyle = '#d1d5db'; // gray-300
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, height - 3);
            ctx.lineTo(x, height);
            ctx.stroke();

            // Draw hour label (e.g., "9h", "12h")
            const date = new Date(t * 1000);
            const hour = date.getHours();
            ctx.fillText(`${hour}h`, x, height - 4);
        }

        ctx.restore();
    }
}
