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
    getDevice,
    connectToDeviceBySerial,
    getPairedDevices
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
    eraseLogs
} from './protocol.js';

import { LOG_TYPE, DEVICE_CAPACITY, SPARKLINE_THRESHOLDS, CO2_THRESHOLDS, AIR_QUALITY_THRESHOLDS } from './constants.js';

import {
    getAllLogs,
    getLogCount as getStorageLogCount,
    storeLogs,
    clearAllLogs,
    getRecentLogs,
    getLogsByDateRange,
    getLogsByDevice,
    getDatabaseStats,
    getDeviceMetadata,
    setDeviceMetadata,
    getAllDeviceMetadata
} from './storage.js';

import { exportToCSV, exportToJSON } from './export.js';

import { detectEvents, formatEventDuration, formatEventTimeRange } from './events.js';

import { generateHeatmapData, formatHeatmapTooltip } from './heatmap.js';

import { TIME_SYNC } from './constants.js';

// UI state
let autoRefreshInterval = null;
let isDownloading = false;
let currentLogType = null;  // LOG_TYPE.GPS, LOG_TYPE.TSL2591, or LOG_TYPE.CO2
let currentDeviceFilter = null;  // Current device filter selection (null = all devices)
let currentEventsTimeFilter = '7d';  // Events time filter: '24h', '7d', '30d', 'all'
let currentHeatmapMetric = 'pm25';  // Heatmap metric: 'pm25', 'pm10', 'co2'
let currentDeviceSerial = null;  // Serial number of currently connected device
let currentDeviceModel = null;  // Model name of currently connected device (e.g., "OAQ-1-2")

// Device Switcher state
let selectedDeviceSerial = null;  // Currently selected device in UI (may not be connected)
let connectedDeviceSerial = null; // Currently connected device via USB (null if none)

/**
 * Widget Configuration per Log Type
 * Defines which sensor cards are visible and their labels for each device format
 */
const WIDGET_CONFIG = {
    [LOG_TYPE.GPS]: {
        pm25: { visible: true, label: 'PM2.5', valueId: 'pm25-value', sparklineId: 'pm25-sparkline' },
        pm10: { visible: true, label: 'PM10', valueId: 'pm10-value', sparklineId: 'pm10-sparkline' },
        co2:  { visible: false },
        lux:  { visible: false }
    },
    [LOG_TYPE.TSL2591]: {
        pm25: { visible: true, label: 'PM2.5', valueId: 'pm25-value', sparklineId: 'pm25-sparkline' },
        pm10: { visible: true, label: 'PM10', valueId: 'pm10-value', sparklineId: 'pm10-sparkline' },
        co2:  { visible: false },
        lux:  { visible: true, label: 'Light', valueId: 'lux-value', sparklineId: 'lux-sparkline' }
    },
    [LOG_TYPE.CO2]: {
        pm25: { visible: false },
        pm10: { visible: false },
        co2:  { visible: true, label: 'CO2', valueId: 'co2-value', sparklineId: 'co2-sparkline' },
        lux:  { visible: true, label: 'Light', valueId: 'lux-value', sparklineId: 'lux-sparkline' }
    }
};

/**
 * Configure widget visibility and labels based on device log type
 * Called when device connects and log type is detected
 * @param {number} logType - LOG_TYPE.GPS, LOG_TYPE.TSL2591, or LOG_TYPE.CO2
 */
function configureWidgetsForLogType(logType) {
    const config = WIDGET_CONFIG[logType] || WIDGET_CONFIG[LOG_TYPE.GPS];

    // Configure PM2.5 card
    const pm25Card = document.getElementById('pm25-value')?.closest('.sensor-card');
    if (pm25Card) {
        if (config.pm25.visible) {
            pm25Card.classList.remove('hidden');
            const label = pm25Card.querySelector('.text-gray-600');
            if (label) label.textContent = config.pm25.label;
            document.getElementById('pm25-value').textContent = '--';
        } else {
            pm25Card.classList.add('hidden');
        }
    }

    // Configure PM10 card
    const pm10Card = document.getElementById('pm10-value')?.closest('.sensor-card');
    if (pm10Card) {
        if (config.pm10.visible) {
            pm10Card.classList.remove('hidden');
            const label = pm10Card.querySelector('.text-gray-600');
            if (label) label.textContent = config.pm10.label;
            document.getElementById('pm10-value').textContent = '--';
        } else {
            pm10Card.classList.add('hidden');
        }
    }

    // Configure CO2 card
    const co2Card = document.getElementById('co2-card');
    if (co2Card) {
        if (config.co2.visible) {
            co2Card.classList.remove('hidden');
            document.getElementById('co2-value').textContent = '-- ppm';
        } else {
            co2Card.classList.add('hidden');
        }
    }

    // Configure Lux card
    const luxCard = document.getElementById('lux-card');
    if (luxCard) {
        if (config.lux.visible) {
            luxCard.classList.remove('hidden');
            document.getElementById('lux-value').textContent = '-- lux';
        } else {
            luxCard.classList.add('hidden');
        }
    }

    // Clear all sparkline canvases to avoid stale data
    ['pm25-sparkline', 'pm10-sparkline', 'co2-sparkline', 'lux-sparkline'].forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    console.log(`Widgets configured for log type: ${logType === LOG_TYPE.CO2 ? 'CO2' : logType === LOG_TYPE.TSL2591 ? 'TSL2591' : 'GPS'}`);
}

/**
 * Update device filter dropdown with unique devices from storage
 * Marks the currently connected device if any
 * Shows custom device names if available
 */
async function updateDeviceFilter() {
    try {
        const stats = await getDatabaseStats();
        const select = document.getElementById('device-filter');

        if (!select) return;

        // Get currently connected device serial (if any)
        let connectedSerial = null;
        if (isDeviceConnected()) {
            const info = getDeviceInfo();
            connectedSerial = info?.serialNumber;
        }

        // Get device metadata for friendly names
        const metadataList = await getAllDeviceMetadata();
        const metadataMap = {};
        metadataList.forEach(m => {
            metadataMap[m.serial] = m;
        });

        // Preserve current selection
        const currentValue = select.value;

        // Clear existing options and add "All Devices"
        select.innerHTML = '<option value="">All Devices</option>';

        // Add each unique device, marking connected one and showing custom name
        for (const serial of stats.devices) {
            const option = document.createElement('option');
            option.value = serial;

            const metadata = metadataMap[serial];
            let displayName = metadata?.name || serial;

            if (serial === connectedSerial) {
                option.textContent = `${displayName} (connected)`;
            } else {
                option.textContent = displayName;
            }

            // Add title attribute with serial for reference
            if (metadata?.name) {
                option.title = serial;
            }

            select.appendChild(option);
        }

        // Restore selection if still valid
        if (currentValue && stats.devices.includes(currentValue)) {
            select.value = currentValue;
        }
    } catch (error) {
        console.error('Failed to update device filter:', error);
    }
}

/**
 * Get log type label for display
 */
function getLogTypeLabel(logType) {
    switch (logType) {
        case LOG_TYPE.GPS: return 'GPS';
        case LOG_TYPE.TSL2591: return 'TSL';
        case LOG_TYPE.CO2: return 'CO2';
        default: return '—';
    }
}

// Environment detection (set once at module load)
const runningInElectron = navigator.userAgent.toLowerCase().includes('electron');

// Sparklines are populated from browser storage, not in-memory history
// This ensures sparklines show historical data, not just live readings

/**
 * Initialize sidebar navigation
 * Sets up click handlers for page switching
 */
function initSidebar() {
    const navItems = document.querySelectorAll('[data-page]');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.dataset.page;
            switchPage(pageId);
        });
    });
}

/**
 * Switch to a different page
 * @param {string} pageId - The page to switch to (overview, history, report, help)
 */
function switchPage(pageId) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.classList.remove('active');
    });
    const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Update pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const activePage = document.getElementById(`page-${pageId}`);
    if (activePage) activePage.classList.add('active');
}

// ============================================================
// Device Switcher Functions
// ============================================================

/**
 * Show/hide device header bar based on whether we have any device data
 */
async function updateSwitcherVisibility() {
    const stats = await getDatabaseStats();
    const hasDevices = stats.devices.length > 0 || connectedDeviceSerial;
    document.getElementById('device-header-bar').classList.toggle('hidden', !hasDevices);
}

/**
 * Populate dropdown with all known devices
 */
async function populateDeviceDropdown() {
    const stats = await getDatabaseStats();
    const metadataList = await getAllDeviceMetadata();
    const pairedDevices = await getPairedDevices();

    // Build metadata lookup map
    const metadataMap = {};
    metadataList.forEach(m => {
        metadataMap[m.serial] = m;
    });

    // Build set of available (plugged in) device serials
    const availableSerials = new Set(pairedDevices.map(d => d.serialNumber));

    // Combine known devices from storage and connected device
    const allDevices = new Set(stats.devices);
    if (connectedDeviceSerial) {
        allDevices.add(connectedDeviceSerial);
    }

    const deviceList = document.getElementById('device-list');
    deviceList.innerHTML = '';

    if (allDevices.size === 0) {
        deviceList.innerHTML = '<p class="px-3 py-2 text-sm text-gray-500">No devices found</p>';
        return;
    }

    // Build device list items
    for (const serial of allDevices) {
        const metadata = metadataMap[serial];
        const isConnected = serial === connectedDeviceSerial;
        const isAvailable = availableSerials.has(serial);
        const isSelected = serial === selectedDeviceSerial;
        const displayName = metadata?.name || currentDeviceModel || serial;
        const tags = metadata?.tags || [];

        // Get device type from logs or current connection
        let deviceType = null;
        if (isConnected && currentLogType !== null) {
            deviceType = currentLogType;
        } else {
            // Check stored logs for this device
            const deviceLogs = await getLogsByDevice(serial);
            if (deviceLogs.length > 0 && deviceLogs[0].logType !== undefined) {
                deviceType = deviceLogs[0].logType;
            }
        }

        const item = document.createElement('div');
        item.className = `flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`;
        item.dataset.serial = serial;

        // Get product image - use model from metadata or current connection
        const deviceModel = metadata?.model || (isConnected ? currentDeviceModel : null);
        let imgHtml = '';
        if (deviceModel) {
            imgHtml = `<img src="img/${deviceModel}.jpg" class="w-6 h-6 rounded object-cover flex-shrink-0" alt="" onerror="this.style.display='none'">`;
        } else {
            // Generic device icon
            imgHtml = `<svg class="w-6 h-6 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
            </svg>`;
        }

        // Build device type pill (first, colored)
        let typePillHtml = '';
        if (deviceType === LOG_TYPE.CO2) {
            typePillHtml = `<span class="inline-block px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded font-medium">CO2</span>`;
        } else if (deviceType === LOG_TYPE.TSL2591 || deviceType === LOG_TYPE.GPS) {
            typePillHtml = `<span class="inline-block px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded font-medium">PM</span>`;
        }

        // Build tags HTML as pills
        const tagPills = tags.map(tag =>
            `<span class="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">${tag}</span>`
        ).join('');

        const pillsHtml = (typePillHtml || tagPills)
            ? `<div class="flex flex-wrap gap-1 mt-1">${typePillHtml}${tagPills}</div>`
            : '';

        // Determine dot color: green=plugged in, gray=offline
        const isOnline = isConnected || isAvailable;
        const dotColor = isOnline ? 'bg-green-500' : 'bg-gray-300';
        const dotTitle = isOnline ? 'Online' : 'Offline';

        item.innerHTML = `
            <div class="flex items-start gap-2 flex-1 min-w-0">
                ${imgHtml}
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-gray-900 truncate">${displayName}</span>
                        <span class="w-2 h-2 rounded-full flex-shrink-0 ${dotColor}" title="${dotTitle}"></span>
                    </div>
                    ${pillsHtml}
                </div>
            </div>
            <button class="edit-device-btn p-1 text-gray-400 hover:text-gray-600 flex-shrink-0" data-serial="${serial}" title="Edit device">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                    <path d="M13.5 6.5l4 4" />
                </svg>
            </button>
        `;

        // Select device on click (not on edit button)
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.edit-device-btn')) {
                selectDevice(serial);
                closeDeviceDropdown();
            }
        });

        // Edit button handler
        const editBtn = item.querySelector('.edit-device-btn');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditDeviceModalForSerial(serial);
            closeDeviceDropdown();
        });

        deviceList.appendChild(item);
    }
}

/**
 * Handle device selection from dropdown
 * @param {string} serial - Device serial number to select
 */
async function selectDevice(serial) {
    selectedDeviceSerial = serial;

    // If selecting a different device than currently connected, try to switch connection
    if (serial && serial !== connectedDeviceSerial) {
        // Try to connect to the selected device (if it's paired and available)
        const connected = await connectToDeviceBySerial(serial);
        if (connected) {
            // Connection successful - handleDeviceConnected will be called via callback
            // which will update the UI appropriately
            return;
        }
        // If connection failed, continue showing offline view for this device
    }

    updateSwitcherDisplay();
    updateDeviceDetailsBar();
    // Update device filter to match selected device
    currentDeviceFilter = serial;
    updateLogTable(serial);
    updateHeatmap(serial, currentHeatmapMetric);
    updateEventsTimeline(serial);
    // Update the device filter dropdown to match
    const deviceFilterEl = document.getElementById('device-filter');
    if (deviceFilterEl) {
        deviceFilterEl.value = serial || '';
    }
}

/**
 * Update the switcher display with selected device info
 */
async function updateSwitcherDisplay() {
    const nameEl = document.getElementById('switcher-device-name');
    const iconEl = document.getElementById('switcher-device-icon');
    const dotEl = document.getElementById('switcher-status-dot');

    if (!selectedDeviceSerial) {
        nameEl.textContent = 'Select Device';
        iconEl.style.display = 'none';
        dotEl.classList.remove('bg-green-500', 'bg-yellow-400');
        dotEl.classList.add('bg-gray-400');
        return;
    }

    // Get device metadata for display name
    const metadata = await getDeviceMetadata(selectedDeviceSerial);
    const displayName = metadata?.name || currentDeviceModel || selectedDeviceSerial;
    nameEl.textContent = displayName;

    // Check if device is available (plugged in)
    const pairedDevices = await getPairedDevices();
    const isAvailable = pairedDevices.some(d => d.serialNumber === selectedDeviceSerial);
    const isConnected = selectedDeviceSerial === connectedDeviceSerial;
    const isOnline = isConnected || isAvailable;

    // Update status dot: green=online (plugged in), gray=offline
    dotEl.classList.remove('bg-green-500', 'bg-gray-400');
    dotEl.classList.add(isOnline ? 'bg-green-500' : 'bg-gray-400');

    // Update product icon - show when connected
    if (isConnected && currentDeviceModel) {
        iconEl.src = `img/${currentDeviceModel}.jpg`;
        iconEl.style.display = '';
    } else {
        // Hide icon for offline/available devices
        iconEl.style.display = 'none';
    }
}

/**
 * Toggle dropdown visibility
 */
function toggleDeviceDropdown() {
    const dropdown = document.getElementById('device-switcher-dropdown');
    const isHidden = dropdown.classList.contains('hidden');

    if (isHidden) {
        populateDeviceDropdown();
        dropdown.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
    }
}

/**
 * Close dropdown
 */
function closeDeviceDropdown() {
    document.getElementById('device-switcher-dropdown').classList.add('hidden');
}

/**
 * Update device header bar based on connection state
 * Shows/hides status info and action buttons depending on whether SELECTED device is connected
 */
async function updateDeviceDetailsBar() {
    const lastSyncEl = document.getElementById('details-last-sync');
    const syncBtn = document.getElementById('sync-data-btn-header');
    const settingsBtn = document.getElementById('settings-btn');
    const disconnectBtn = document.getElementById('disconnect-btn-header');
    const batteryStatus = document.getElementById('battery-status-inline');
    const storageStatus = document.getElementById('storage-status-inline');
    const liveDataSection = document.getElementById('live-data-section');

    const isViewingConnectedDevice = connectedDeviceSerial && selectedDeviceSerial === connectedDeviceSerial;

    if (isViewingConnectedDevice) {
        // Viewing the connected device - show full status, actions, and live data
        syncBtn.classList.remove('hidden');
        settingsBtn.classList.remove('hidden');
        disconnectBtn.classList.remove('hidden');
        batteryStatus.classList.remove('hidden');
        storageStatus.classList.remove('hidden');
        lastSyncEl.classList.add('hidden');
        liveDataSection.classList.remove('hidden');

    } else if (selectedDeviceSerial) {
        // Viewing an offline device - hide live status, actions, and live data
        syncBtn.classList.add('hidden');
        settingsBtn.classList.add('hidden');
        disconnectBtn.classList.add('hidden');
        batteryStatus.classList.add('hidden');
        storageStatus.classList.add('hidden');
        liveDataSection.classList.add('hidden');

        // Show last sync time for this device
        const lastSync = localStorage.getItem('lastSyncTime');
        if (lastSync) {
            const date = new Date(parseInt(lastSync));
            lastSyncEl.textContent = `Last synced: ${date.toLocaleDateString()}`;
            lastSyncEl.classList.remove('hidden');
        } else {
            lastSyncEl.textContent = 'Never synced';
            lastSyncEl.classList.remove('hidden');
        }
    }
}

/**
 * Open edit device modal for a specific serial
 * @param {string} serial - Device serial number
 */
async function openEditDeviceModalForSerial(serial) {
    const modal = document.getElementById('edit-device-modal');
    const nameInput = document.getElementById('edit-device-name-input');
    const tagsInput = document.getElementById('edit-device-tags-input');

    // Store the serial being edited
    modal.dataset.editingSerial = serial;

    try {
        const metadata = await getDeviceMetadata(serial);
        nameInput.value = metadata?.name || '';
        tagsInput.value = metadata?.tags?.join(', ') || '';
    } catch (error) {
        console.error('Failed to load metadata for editing:', error);
        nameInput.value = '';
        tagsInput.value = '';
    }

    modal.classList.remove('hidden');
    nameInput.focus();
}

/**
 * Initialize UI and event handlers
 */
export async function initUI() {
    // Apply Electron-specific UI adjustments once at startup
    if (runningInElectron) {
        document.getElementById('connect-btn').style.display = 'none';
        document.getElementById('electron-connect-hint').classList.remove('hidden');
    }

    initSidebar();
    setupEventHandlers();
    await attemptAutoReconnect();
    updateBrowserLogCount();
    await updateDeviceFilter();
    updateLogTable();
    loadSparklinesFromStorage();
    loadLastSyncTime();
    renderThresholdTable();
    updateHeatmap(null, currentHeatmapMetric);

    // Initialize device switcher
    await updateSwitcherVisibility();

    // Show appropriate section based on connection state
    if (isDeviceConnected()) {
        document.getElementById('connect-section').classList.add('hidden');
    } else {
        document.getElementById('connect-section').classList.remove('hidden');
        await showAppropriateDisconnectedContent();
    }

    // If we have stored devices but none connected, select the first one
    const stats = await getDatabaseStats();
    if (stats.devices.length > 0 && !connectedDeviceSerial) {
        selectedDeviceSerial = stats.devices[0];
        await updateSwitcherDisplay();
        await updateDeviceDetailsBar();
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
            const settingsModal = document.getElementById('settings-modal');
            const editDeviceModal = document.getElementById('edit-device-modal');
            const dropdown = document.getElementById('device-switcher-dropdown');
            if (!settingsModal.classList.contains('hidden')) {
                closeSettingsModal();
            }
            if (!editDeviceModal.classList.contains('hidden')) {
                closeEditDeviceModal();
            }
            if (!dropdown.classList.contains('hidden')) {
                closeDeviceDropdown();
            }
        }
    });

    // Edit device modal buttons
    document.getElementById('save-device-metadata-btn').addEventListener('click', handleSaveDeviceMetadata);
    document.getElementById('cancel-device-metadata-btn').addEventListener('click', closeEditDeviceModal);

    // Close edit device modal when clicking outside
    document.getElementById('edit-device-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-device-modal') {
            closeEditDeviceModal();
        }
    });

    // Export button
    document.getElementById('export-csv-btn').addEventListener('click', handleExportCSV);

    // Clear logs button
    document.getElementById('clear-logs-btn').addEventListener('click', handleClearLogs);

    // Device filter dropdown (on History page)
    document.getElementById('device-filter').addEventListener('change', (e) => {
        currentDeviceFilter = e.target.value || null;
        // Also update selected device in switcher
        selectedDeviceSerial = currentDeviceFilter;
        updateSwitcherDisplay();
        updateDeviceDetailsBar();
        updateLogTable(currentDeviceFilter);
        updateHeatmap(currentDeviceFilter, currentHeatmapMetric);
    });

    // Events time filter dropdown
    document.getElementById('events-time-filter').addEventListener('change', (e) => {
        currentEventsTimeFilter = e.target.value;
        updateEventsTimeline(currentDeviceFilter);
    });

    // Heatmap metric dropdown
    document.getElementById('heatmap-metric').addEventListener('change', (e) => {
        currentHeatmapMetric = e.target.value;
        updateHeatmap(currentDeviceFilter, currentHeatmapMetric);
    });

    // Device Switcher events
    document.getElementById('device-switcher-btn').addEventListener('click', toggleDeviceDropdown);

    // Connect new device button in dropdown
    document.getElementById('connect-new-device-btn').addEventListener('click', () => {
        closeDeviceDropdown();
        handleConnect();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const headerBar = document.getElementById('device-header-bar');
        const dropdown = document.getElementById('device-switcher-dropdown');
        if (headerBar && !headerBar.contains(e.target) && !dropdown.classList.contains('hidden')) {
            closeDeviceDropdown();
        }
    });

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

    // Get device info
    const info = getDeviceInfo();
    currentDeviceSerial = info.serialNumber;
    connectedDeviceSerial = info.serialNumber;
    selectedDeviceSerial = info.serialNumber;

    // Update hidden fields for existing code compatibility
    document.getElementById('device-serial').textContent = info.serialNumber;

    // Hide connect section, show main content
    const connectSection = document.getElementById('connect-section');
    connectSection.classList.add('hidden');

    // Show main content and hide instructions (both versions)
    document.getElementById('instructions').classList.add('hidden');
    document.getElementById('instructions-electron').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('live-data-section').classList.remove('hidden');

    // Show footer logo when connected
    document.getElementById('footer-logo').classList.remove('hidden');

    // Get firmware version and parse model
    try {
        const versionString = await getFirmwareVersion(device);

        // Parse version string: "OAQ-1-2 7088c449-dirty" → model + firmware
        const parts = versionString.trim().split(' ');
        currentDeviceModel = parts[0] || '-';
        const firmware = parts.slice(1).join(' ') || '-';

        // Update hidden fields
        document.getElementById('device-firmware').textContent = firmware;
        document.getElementById('device-model').textContent = currentDeviceModel;

        // Save model to device metadata for future reference (preserves existing name/tags)
        const existingMetadata = await getDeviceMetadata(info.serialNumber);
        await setDeviceMetadata(info.serialNumber, {
            name: existingMetadata?.name || '',
            tags: existingMetadata?.tags || [],
            model: currentDeviceModel
        });
    } catch (error) {
        currentDeviceModel = 'N/A';
        document.getElementById('device-firmware').textContent = 'N/A';
    }

    // Detect log format type and configure widgets
    try {
        currentLogType = await getLogType(device);
        let formatText = 'GPS';
        if (currentLogType === LOG_TYPE.CO2) {
            formatText = 'CO2';
        } else if (currentLogType === LOG_TYPE.TSL2591) {
            formatText = 'PM';
        }
        console.log(`Log format: ${formatText}`);
        const logFormatEl = document.getElementById('log-format');
        if (logFormatEl) {
            logFormatEl.textContent = formatText;
        }
    } catch (error) {
        console.log('Failed to detect log format:', error.message);
        currentLogType = LOG_TYPE.GPS;
    }

    // Configure sensor widgets based on detected log type
    configureWidgetsForLogType(currentLogType);

    // Set device time to current system time
    try {
        await syncDeviceTime(device, false);
        console.log('Device time synchronized to system time');
    } catch (error) {
        console.log('Failed to set device time on connect:', error.message);
    }

    // Get device log count
    updateDeviceLogCount();

    // Load sparklines from storage
    loadSparklinesFromStorage();

    // Update device filter dropdown
    await updateDeviceFilter();

    // Update device switcher
    await updateSwitcherVisibility();
    await updateSwitcherDisplay();
    await updateDeviceDetailsBar();

    // Start auto-refresh
    startAutoRefresh();

    // Initial data fetch
    await updateLiveData();
}

/**
 * Show appropriate content when disconnected (instructions or measurement history)
 */
async function showAppropriateDisconnectedContent() {
    // Use environment-specific instructions
    const instructions = document.getElementById(runningInElectron ? 'instructions-electron' : 'instructions');
    const otherInstructions = document.getElementById(runningInElectron ? 'instructions' : 'instructions-electron');

    // Always hide the wrong instructions
    otherInstructions.classList.add('hidden');

    try {
        const logCount = await getStorageLogCount();
        const hasLogs = logCount > 0;

        // Show instructions OR main content (measurement history)
        instructions.classList.toggle('hidden', hasLogs);
        document.getElementById('main-content').classList.toggle('hidden', !hasLogs);

        if (hasLogs) {
            // Hide live data section when disconnected
            document.getElementById('live-data-section').classList.add('hidden');
        }
    } catch (error) {
        // Error checking logs - default to showing instructions
        instructions.classList.remove('hidden');
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
 * Open edit device modal with current values (for connected device)
 */
async function openEditDeviceModal() {
    if (!currentDeviceSerial) return;
    await openEditDeviceModalForSerial(currentDeviceSerial);
}

/**
 * Close edit device modal
 */
function closeEditDeviceModal() {
    document.getElementById('edit-device-modal').classList.add('hidden');
}

/**
 * Handle save device metadata button click
 */
async function handleSaveDeviceMetadata() {
    const modal = document.getElementById('edit-device-modal');
    const serial = modal.dataset.editingSerial || currentDeviceSerial;

    if (!serial) return;

    const nameInput = document.getElementById('edit-device-name-input');
    const tagsInput = document.getElementById('edit-device-tags-input');

    const name = nameInput.value.trim();
    const tagsRaw = tagsInput.value;

    // Parse tags: split by comma, trim whitespace, filter empty
    const tags = tagsRaw
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

    try {
        await setDeviceMetadata(serial, { name, tags });

        // Update device filter dropdown to show new name
        await updateDeviceFilter();

        // Update switcher display if this is the selected device
        if (serial === selectedDeviceSerial) {
            await updateSwitcherDisplay();
        }

        closeEditDeviceModal();
        console.log('Device metadata saved successfully');
    } catch (error) {
        console.error('Failed to save device metadata:', error);
        showError('Failed to save device metadata: ' + error.message);
    }
}

/**
 * Handle device disconnected event
 */
async function handleDeviceDisconnected() {
    console.log('Device disconnected');

    // Clear connected device state (but keep selected device)
    connectedDeviceSerial = null;
    currentLogType = null;
    currentDeviceSerial = null;
    currentDeviceModel = null;

    // Show connect section
    document.getElementById('connect-section').classList.remove('hidden');

    // Reset connect button state
    const connectBtn = document.getElementById('connect-btn');
    connectBtn.disabled = false;
    connectBtn.textContent = 'Connect Device';

    // Reset widgets to GPS format (default)
    configureWidgetsForLogType(LOG_TYPE.GPS);

    // Show measurement history if available, otherwise show instructions
    await showAppropriateDisconnectedContent();

    // Hide status indicators
    document.getElementById('storage-status-inline').classList.add('hidden');
    document.getElementById('battery-status-inline').classList.add('hidden');

    // Hide footer logo
    document.getElementById('footer-logo').classList.add('hidden');

    // Update device filter to remove connected indicator
    await updateDeviceFilter();

    // Update device switcher - keep visible, show offline state
    await updateSwitcherVisibility();
    await updateSwitcherDisplay();
    await updateDeviceDetailsBar();

    // Stop auto-refresh
    stopAutoRefresh();
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

        // Update format-specific values (widget visibility handled by configureWidgetsForLogType)
        if (currentLogType === LOG_TYPE.CO2) {
            // CO2 format: update CO2 and Lux values
            updateCO2Value('co2-value', status.co2);
            updateLux(status.lux);
        } else {
            // GPS/TSL2591 format: update PM values
            updatePMValue('pm25-value', status.pm25);
            updatePMValue('pm10-value', status.pm10);
            // Update Lux for TSL2591 format
            if (currentLogType === LOG_TYPE.TSL2591) {
                updateLux(status.lux);
            }
        }

        // Update battery (now uses voltage instead of percentage)
        updateBattery(status.batteryVoltage, status.charging);

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
        document.getElementById('co2-value').textContent = 'N/A';
        document.getElementById('lux-value').textContent = 'N/A';
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
 * Update CO2 value with color coding based on indoor air quality thresholds
 */
function updateCO2Value(elementId, value) {
    const el = document.getElementById(elementId);
    el.textContent = `${Math.round(value)} ppm`;

    // Remove existing color classes
    el.classList.remove('text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600', 'text-purple-600');

    // Apply color based on CO2 levels
    if (value < CO2_THRESHOLDS.GOOD) {
        el.classList.add('text-green-600'); // Good (< 800 ppm)
    } else if (value < CO2_THRESHOLDS.MODERATE) {
        el.classList.add('text-yellow-600'); // Moderate (800-1000 ppm)
    } else if (value < CO2_THRESHOLDS.POOR) {
        el.classList.add('text-orange-600'); // Poor (1000-1500 ppm)
    } else {
        el.classList.add('text-red-600'); // Very poor (> 1500 ppm)
    }
}

/**
 * Get Tailwind color class for CO2 value (for table display)
 */
function getCO2ColorClass(value) {
    if (value < CO2_THRESHOLDS.GOOD) {
        return 'text-green-600 font-semibold'; // Good (< 800 ppm)
    } else if (value < CO2_THRESHOLDS.MODERATE) {
        return 'text-yellow-600 font-semibold'; // Moderate (800-1000 ppm)
    } else if (value < CO2_THRESHOLDS.POOR) {
        return 'text-orange-600 font-semibold'; // Poor (1000-1500 ppm)
    } else {
        return 'text-red-600 font-semibold'; // Very poor (> 1500 ppm)
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

    // Only show battery if viewing the connected device
    if (selectedDeviceSerial !== connectedDeviceSerial) {
        return;
    }

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

    // Show/hide low battery warning (< 2%)
    const batteryWarning = document.getElementById('battery-warning');
    if (batteryWarning) {
        if (level < 2) {
            batteryWarning.classList.remove('hidden');
        } else {
            batteryWarning.classList.add('hidden');
        }
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
    // Only show storage if viewing the connected device
    if (selectedDeviceSerial !== connectedDeviceSerial) {
        return;
    }

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
            let formatName = 'GPS';
            if (logType === LOG_TYPE.CO2) formatName = 'CO2';
            else if (logType === LOG_TYPE.TSL2591) formatName = 'TSL2591';

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
        await updateDeviceFilter();
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
 * Update log table with logs, optionally filtered by device
 * @param {string|null} deviceSerial - Filter by device serial, or null for all devices
 */
async function updateLogTable(deviceSerial = null) {
    try {
        // Fetch logs based on filter
        let logs;
        if (deviceSerial) {
            logs = await getLogsByDevice(deviceSerial);
            // Sort by timestamp DESC and limit
            logs.sort((a, b) => b.timestamp - a.timestamp);
            logs = logs.slice(0, 50);
        } else {
            logs = await getRecentLogs(50);
        }

        const tbody = document.getElementById('log-table-body');
        const thead = document.querySelector('#log-table-body').closest('table').querySelector('thead tr');

        if (logs.length === 0) {
            thead.innerHTML = `
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Synced On</th>
            `;
            tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">No logs downloaded yet</td></tr>';
            return;
        }

        // Determine if we have mixed log types
        const logTypes = new Set(logs.map(l => l.logType).filter(t => t !== undefined));
        const isMixed = logTypes.size > 1;
        const showCommon = deviceSerial === null || isMixed;

        if (showCommon) {
            // Common columns for "All Devices" or mixed types
            renderCommonTable(thead, tbody, logs);
        } else {
            // Type-specific columns for single device
            const logType = logs[0]?.logType;
            if (logType === LOG_TYPE.CO2) {
                renderCO2Table(thead, tbody, logs);
            } else if (logType === LOG_TYPE.TSL2591) {
                renderTSLTable(thead, tbody, logs);
            } else {
                renderGPSTable(thead, tbody, logs);
            }
        }

        // Update events timeline (needs all logs, not just 50)
        await updateEventsTimeline(deviceSerial);

    } catch (error) {
        console.error('Failed to update log table:', error);
    }
}

/**
 * Render table with common columns (for "All Devices" or mixed types)
 */
function renderCommonTable(thead, tbody, logs) {
    thead.innerHTML = `
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Synced On</th>
    `;
    tbody.innerHTML = logs.map(log => {
        const syncedOnDate = log.syncedOn ? new Date(log.syncedOn).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
        return `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-900">${formatTimestamp(log.timestamp)}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.temperature?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.humidity?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.batteryVoltage ? (log.batteryVoltage / 1000).toFixed(2) + 'V' : '-'}</td>
            <td class="px-4 py-3 text-xs text-gray-600">${getLogTypeLabel(log.logType)}</td>
            <td class="px-4 py-3 text-xs text-gray-600 font-mono">${log.deviceSerial || '-'}</td>
            <td class="px-4 py-3 text-xs text-gray-500">${syncedOnDate}</td>
        </tr>
    `;
    }).join('');
}

/**
 * Render table with CO2-specific columns
 */
function renderCO2Table(thead, tbody, logs) {
    thead.innerHTML = `
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CO2 (ppm)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pressure (hPa)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lux</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Synced On</th>
    `;
    tbody.innerHTML = logs.map(log => {
        const syncedOnDate = log.syncedOn ? new Date(log.syncedOn).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
        return `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-900">${formatTimestamp(log.timestamp)}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.temperature?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.humidity?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm ${getCO2ColorClass(log.co2)}">${log.co2 != null ? Math.round(log.co2) : '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.pressure?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.lux?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.batteryVoltage ? (log.batteryVoltage / 1000).toFixed(2) + 'V' : '-'}</td>
            <td class="px-4 py-3 text-xs text-gray-500">${syncedOnDate}</td>
        </tr>
    `;
    }).join('');
}

/**
 * Render table with TSL2591-specific columns
 */
function renderTSLTable(thead, tbody, logs) {
    thead.innerHTML = `
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM2.5</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM10</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lux</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Synced On</th>
    `;
    tbody.innerHTML = logs.map(log => {
        const syncedOnDate = log.syncedOn ? new Date(log.syncedOn).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
        return `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-900">${formatTimestamp(log.timestamp)}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.temperature?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.humidity?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.pm25?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.pm10?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.lux?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.batteryVoltage ? (log.batteryVoltage / 1000).toFixed(2) + 'V' : '-'}</td>
            <td class="px-4 py-3 text-xs text-gray-500">${syncedOnDate}</td>
        </tr>
    `;
    }).join('');
}

/**
 * Render table with GPS-specific columns
 */
function renderGPSTable(thead, tbody, logs) {
    thead.innerHTML = `
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Humidity (%)</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM2.5</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM10</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Battery</th>
        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Synced On</th>
    `;
    tbody.innerHTML = logs.map(log => {
        const syncedOnDate = log.syncedOn ? new Date(log.syncedOn).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
        return `
        <tr class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-900">${formatTimestamp(log.timestamp)}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.temperature?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.humidity?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.pm25?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.pm10?.toFixed(1) ?? '-'}</td>
            <td class="px-4 py-3 text-sm text-gray-900">${log.batteryVoltage ? (log.batteryVoltage / 1000).toFixed(2) + 'V' : '-'}</td>
            <td class="px-4 py-3 text-xs text-gray-500">${syncedOnDate}</td>
        </tr>
    `;
    }).join('');
}

/**
 * Handle export to CSV
 * Exports only the logs matching the current device filter
 */
async function handleExportCSV() {
    try {
        const logs = currentDeviceFilter
            ? await getLogsByDevice(currentDeviceFilter)
            : await getAllLogs();
        if (logs.length === 0) {
            showError('No logs to export');
            return;
        }

        // Sort by timestamp ascending for export
        logs.sort((a, b) => a.timestamp - b.timestamp);

        // Build device metadata map for export
        const metadataList = await getAllDeviceMetadata();
        const deviceMetadataMap = {};
        metadataList.forEach(m => {
            deviceMetadataMap[m.serial] = m;
        });

        exportToCSV(logs, deviceMetadataMap);
        const filterMsg = currentDeviceFilter ? ` for ${currentDeviceFilter}` : '';
        showSuccess(`Exported ${logs.length} logs${filterMsg} to CSV`);

    } catch (error) {
        console.error('Export failed:', error);
        showError('Export failed: ' + error.message);
    }
}

/**
 * Handle export to JSON
 * Exports only the logs matching the current device filter
 */
async function handleExportJSON() {
    try {
        const logs = currentDeviceFilter
            ? await getLogsByDevice(currentDeviceFilter)
            : await getAllLogs();
        if (logs.length === 0) {
            showError('No logs to export');
            return;
        }

        // Sort by timestamp ascending for export
        logs.sort((a, b) => a.timestamp - b.timestamp);

        // Build device metadata map for export
        const metadataList = await getAllDeviceMetadata();
        const deviceMetadataMap = {};
        metadataList.forEach(m => {
            deviceMetadataMap[m.serial] = m;
        });

        exportToJSON(logs, deviceMetadataMap);
        const filterMsg = currentDeviceFilter ? ` for ${currentDeviceFilter}` : '';
        showSuccess(`Exported ${logs.length} logs${filterMsg} to JSON`);

    } catch (error) {
        console.error('Export failed:', error);
        showError('Export failed: ' + error.message);
    }
}

/**
 * Update events timeline with detected anomalies and threshold violations
 */
async function updateEventsTimeline(deviceSerial = null) {
    const container = document.getElementById('events-timeline');
    if (!container) return;

    try {
        // Get all logs for event detection (not limited to 50)
        const logs = deviceSerial
            ? await getLogsByDevice(deviceSerial)
            : await getAllLogs();

        if (logs.length < 10) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Not enough data for event detection</p>';
            return;
        }

        const events = detectEvents(logs);

        if (events.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">No significant events detected</p>';
            return;
        }

        // Filter events by time based on dropdown selection
        const filteredEvents = filterEventsByTime(events, currentEventsTimeFilter);

        if (filteredEvents.length === 0) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">No events in selected time period</p>';
            return;
        }

        container.innerHTML = filteredEvents.map(renderEventCard).join('');

    } catch (error) {
        console.error('Failed to update events timeline:', error);
        container.innerHTML = '<p class="text-sm text-red-500 text-center py-4">Error detecting events</p>';
    }
}

/**
 * Filter events by time period
 */
function filterEventsByTime(events, timeFilter) {
    if (timeFilter === 'all') return events;

    const now = Math.floor(Date.now() / 1000);
    const cutoffs = {
        '24h': now - 24 * 60 * 60,
        '7d': now - 7 * 24 * 60 * 60,
        '30d': now - 30 * 24 * 60 * 60
    };

    const cutoff = cutoffs[timeFilter] || 0;
    return events.filter(e => e.startTime >= cutoff);
}

/**
 * Render a single event card
 */
function renderEventCard(event) {
    const severityColors = {
        yellow: 'border-yellow-400',
        orange: 'border-orange-500',
        red: 'border-red-500'
    };

    // Default to orange for anomaly-only events
    const borderColor = event.severity
        ? severityColors[event.severity]
        : 'border-orange-400';

    const peakColor = event.severity === 'red' ? 'text-red-600' : 'text-orange-600';

    const timeRange = formatEventTimeRange(event.startTime, event.endTime);
    const duration = formatEventDuration(event.duration);

    // Format peak value
    const peakValue = event.metric === 'co2'
        ? Math.round(event.peak)
        : event.peak.toFixed(1);

    // Format baseline value with unit
    const baselineValue = event.baseline !== undefined
        ? (event.metric === 'co2' ? Math.round(event.baseline) : event.baseline.toFixed(1))
        : null;

    // Detection method badge
    const methodBadge = event.detectionMethod === 'anomaly'
        ? `<span class="text-xs text-gray-400">Z: ${event.maxZScore?.toFixed(1) || '?'}σ</span>`
        : `<span class="text-xs text-gray-400">${event.severity} threshold</span>`;

    // Combustion indicator (PM2.5 + PM10 correlated)
    const combustionBadge = event.combustionLikely
        ? `<span class="inline-flex items-center ml-2 text-xs text-orange-600 cursor-help" title="PM2.5 and PM10 spiked together - indicates combustion source (smoking, cooking, exhaust)">
            <svg class="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
            combustion
          </span>`
        : '';

    return `
        <div class="border-l-4 ${borderColor} bg-gray-50 p-3 mb-2 rounded-r">
            <div class="flex justify-between items-start">
                <div>
                    <div class="text-sm font-medium text-gray-900">${timeRange}</div>
                    <div class="text-sm mt-1">
                        <span class="text-gray-600">Peak ${getMetricLabel(event.metric)}:</span>
                        <span class="${peakColor} font-semibold">${peakValue} ${event.unit}</span>
                        ${baselineValue !== null ? `<span class="text-gray-400 text-xs ml-1 cursor-help border-b border-dotted border-gray-400" title="Baseline = median of all readings for this metric">(baseline: ${baselineValue} ${event.unit})</span>` : ''}
                    </div>
                    <div class="mt-1 flex items-center">${methodBadge}${combustionBadge}</div>
                </div>
                <div class="text-sm text-gray-500 whitespace-nowrap">${duration}</div>
            </div>
        </div>
    `;
}

/**
 * Get display label for metric
 */
function getMetricLabel(metric) {
    const labels = { pm25: 'PM2.5', pm10: 'PM10', co2: 'CO₂' };
    return labels[metric] || metric;
}

/**
 * Render threshold table in Settings modal from AIR_QUALITY_THRESHOLDS
 */
function renderThresholdTable() {
    const container = document.getElementById('threshold-table');
    if (!container) return;

    const metrics = ['pm25', 'pm10', 'co2'];

    const html = `
        <table class="w-full text-xs">
            <thead>
                <tr class="text-left text-gray-500">
                    <th class="pb-2">Metric</th>
                    <th class="pb-2 text-yellow-600">Yellow</th>
                    <th class="pb-2 text-orange-600">Orange</th>
                    <th class="pb-2 text-red-600">Red</th>
                </tr>
            </thead>
            <tbody class="text-gray-700">
                ${metrics.map(metric => {
                    const config = AIR_QUALITY_THRESHOLDS[metric];
                    const levels = config.levels;
                    return `
                        <tr>
                            <td class="py-1">${config.label}</td>
                            <td class="py-1 text-yellow-600">&ge;${levels.good.max} ${config.unit}</td>
                            <td class="py-1 text-orange-600">&ge;${levels.yellow.max}</td>
                            <td class="py-1 text-red-600">&ge;${levels.orange.max}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}

/**
 * Update heatmap with data for selected device and metric
 */
async function updateHeatmap(deviceSerial = null, metric = 'pm25') {
    const container = document.getElementById('heatmap-container');
    if (!container) return;

    try {
        const logs = deviceSerial
            ? await getLogsByDevice(deviceSerial)
            : await getAllLogs();

        if (logs.length < 10) {
            container.innerHTML = '<p class="text-sm text-gray-500 text-center py-4">Not enough data for heatmap</p>';
            renderHeatmapLegend(metric);
            return;
        }

        const data = generateHeatmapData(logs, metric, { days: 14 });
        renderHeatmap(data);
        renderHeatmapLegend(metric);

    } catch (error) {
        console.error('Failed to update heatmap:', error);
        container.innerHTML = '<p class="text-sm text-red-500 text-center py-4">Error generating heatmap</p>';
    }
}

/**
 * Render heatmap grid
 * Grid: rows = days, columns = hours
 * Uses CSS grid to fill container width with square cells
 */
function renderHeatmap(data) {
    const container = document.getElementById('heatmap-container');
    if (!container || !data.grid.length) return;

    const { grid, dayLabels, hourLabels, unit } = data;
    const numCols = hourLabels.length; // 24

    // CSS grid: date label column (auto) + 24 equal columns for hours
    let html = `<div class="heatmap-grid text-xs" style="display: grid; grid-template-columns: auto repeat(${numCols}, 1fr); gap: 2px; align-items: center;">`;

    // Header row: empty cell + hour labels
    html += '<div></div>'; // Empty corner
    for (const hour of hourLabels) {
        html += `<div class="text-center text-gray-400 text-[10px]">${hour.label}</div>`;
    }

    // Data rows (one per day)
    for (let r = 0; r < grid.length; r++) {
        const row = grid[r];
        const dayLabel = dayLabels[r].label;

        // Date label
        html += `<div class="text-right text-gray-400 pr-2 whitespace-nowrap">${dayLabel}</div>`;

        // Hour cells
        for (const cell of row) {
            const tooltip = formatHeatmapTooltip(cell, unit, dayLabels, hourLabels);
            html += `<div class="rounded-sm cursor-help"
                         style="background-color: ${cell.color}; aspect-ratio: 1;"
                         title="${tooltip}"></div>`;
        }
    }

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Render heatmap legend
 */
function renderHeatmapLegend(metric) {
    const legendContainer = document.getElementById('heatmap-legend');
    if (!legendContainer) return;

    const config = AIR_QUALITY_THRESHOLDS[metric];
    if (!config) return;

    const levels = config.levels;

    legendContainer.innerHTML = `
        <span class="text-gray-400">Less</span>
        <div class="flex items-center gap-1">
            <div class="w-3 h-3 rounded-sm" style="background-color: #f3f4f6;" title="No data"></div>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.good.color};" title="Good (<${levels.good.max})"></div>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.yellow.color};" title="Moderate (${levels.good.max}-${levels.yellow.max})"></div>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.orange.color};" title="Poor (${levels.yellow.max}-${levels.orange.max})"></div>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.red.color};" title="Unhealthy (>${levels.orange.max})"></div>
        </div>
        <span class="text-gray-400">More</span>
        <span class="ml-4 text-gray-400">${config.unit}</span>
    `;
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
        await updateDeviceFilter();
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

        // Detect log format from stored data
        const hasCO2Data = logsChronological.some(log => log.co2 !== undefined && log.co2 !== null);
        const hasLuxData = logsChronological.some(log => log.lux !== undefined && log.lux !== null);
        const hasPMData = logsChronological.some(log => log.pm25 !== undefined && log.pm25 !== null);

        // Extract timestamps and sensor values
        const timestamps = logsChronological.map(log => log.timestamp);
        const tempValues = logsChronological.map(log => log.temperature).filter(v => v !== undefined && v !== null);
        const humidityValues = logsChronological.map(log => log.humidity).filter(v => v !== undefined && v !== null);

        // Update common sparklines (temp and humidity are on all formats)
        const tempConfig = { ...getTemperatureScale(tempValues), timestamps };
        const humidityConfig = { ...SPARKLINE_THRESHOLDS.humidity, timestamps };
        updateSparkline('temp-sparkline', tempValues, tempConfig);
        updateSparkline('humidity-sparkline', humidityValues, humidityConfig);

        // Update format-specific sparklines (visibility handled by configureWidgetsForLogType)
        if (hasCO2Data) {
            // CO2 format: update CO2 sparkline
            const co2Values = logsChronological.map(log => log.co2).filter(v => v !== undefined && v !== null);
            const co2Config = { ...SPARKLINE_THRESHOLDS.co2, timestamps };
            updateSparkline('co2-sparkline', co2Values, co2Config);
        }

        if (hasPMData) {
            // GPS/TSL2591 format: update PM sparklines
            const pm25Values = logsChronological.map(log => log.pm25).filter(v => v !== undefined && v !== null);
            const pm10Values = logsChronological.map(log => log.pm10).filter(v => v !== undefined && v !== null);
            const pm25Config = { ...SPARKLINE_THRESHOLDS.pm25, timestamps };
            const pm10Config = { ...SPARKLINE_THRESHOLDS.pm10, timestamps };
            updateSparkline('pm25-sparkline', pm25Values, pm25Config);
            updateSparkline('pm10-sparkline', pm10Values, pm10Config);
        }

        if (hasLuxData) {
            // TSL2591 and CO2 formats have lux data
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
