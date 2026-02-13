/**
 * Init Module
 * Handles initialization, widget configuration, and page switching
 */

import { i18n } from '../i18n.js';

import { autoReconnect, isDeviceConnected, disconnectDevice, onConnect, onDisconnect, onDeviceListChange, getDevice } from '../webusb.js';
import { clearDeviceLogs, getDeviceMetadata } from '../storage.js';
import { eraseLogs } from '../protocol.js';
import { LOG_TYPE } from '../constants.js';
import { getDeviceTypeById, getAllKnownMetrics, DEVICE_TYPES } from '../deviceTypes.js';
import { listenKeys } from 'nanostores';
import { $state, bumpDataVersion } from './state.js';
import * as state from './state.js';
import {
    handleConnect,
    handleDeviceConnected,
    handleDeviceDisconnected,
    handleDisconnect,
    isRunningInElectron
} from './connection.js';
import { updateOverviewVisibility, navigateToFleetView } from './fleetView.js';
import { showError, showSuccess, track } from './utils.js';
import { updateDeviceLogCount } from './sync.js';
import {
    handleRefresh,
    handleDownloadLogs,
    loadLastSyncTime
} from './sync.js';
import { updateLogTable, updateBrowserLogCount } from './logTable.js';
import { initHelpPage } from './helpPage.js';
import {
    getAllKnownDevices,
    updateDeviceFilter,
    toggleDeviceDropdown,
    closeDeviceDropdown,
} from './deviceSwitcher.js';
import {
    openSettingsModal,
    closeSettingsModal,
    closeEditDeviceModal,
    handleSaveDeviceMetadata,
    handleForgetDevice,
    loadDeviceSettings,
    handleSaveSettings,
    handleRecordingToggle
} from './modals.js';
import { handleExportCSV, handleExportJSON } from './export.js';
import { initReportPage, setupReportEventHandlers } from './reportUI.js';
import { initHistoryChart, refreshHistoryChart } from './historyChartUI.js';
import { redrawSpectralChart, updateLiveData } from './liveData.js';

/**
 * Handle clear logs button - clears logs for the selected device
 */
async function handleClearLogs() {
    const serial = state.get('selectedDeviceSerial');
    if (!serial) return;

    if (!confirm(i18n.t('clear_confirmDevice'))) {
        return;
    }

    try {
        await clearDeviceLogs(serial);
        bumpDataVersion();
        showSuccess(i18n.t('clear_successDevice'));
    } catch (error) {
        console.error('Clear failed:', error);
        showError(i18n.t('clear_failed', { message: error.message }));
    }
}

/**
 * Handle erase device button - erases all logs from the connected device
 */
async function handleEraseDevice() {
    if (!isDeviceConnected()) {
        return;
    }

    // Double confirmation for device erase (destructive action)
    if (!confirm(i18n.t('erase_confirm1'))) {
        return;
    }

    if (!confirm(i18n.t('erase_confirm2'))) {
        return;
    }

    const btn = document.getElementById('erase-device-btn');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = i18n.t('settings_erasing');

    try {
        const device = getDevice();
        const success = await eraseLogs(device);

        if (success) {
            showSuccess(i18n.t('erase_success'));
            // Update capacity display to reflect empty device
            await updateDeviceLogCount();
            // Close modal on success
            closeSettingsModal();
        } else {
            showError(i18n.t('erase_failed'));
        }
    } catch (error) {
        console.error('Erase failed:', error);
        showError(i18n.t('clear_failed', { message: error.message }));
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/**
 * Configure widget visibility and labels based on device log type.
 * Uses the device type registry to determine which sensor cards to show.
 * Called when device connects and log type is detected.
 * @param {number} logType - LOG_TYPE.GPS, LOG_TYPE.TSL2591, or LOG_TYPE.CO2
 */
export function configureWidgetsForLogType(logType) {
    const deviceType = getDeviceTypeById(logType) || DEVICE_TYPES.GPS;
    const activeMetricKeys = new Set(deviceType.metrics.map(m => m.key));

    // For every known metric, show or hide its card
    for (const metric of getAllKnownMetrics()) {
        // temperature and humidity cards are always visible (no cardId toggle)
        if (!metric.cardId) continue;

        const visible = activeMetricKeys.has(metric.key);
        const card = document.getElementById(metric.cardId);
        if (!card) continue;

        if (visible) {
            card.classList.remove('hidden');
            // Reset value to placeholder
            const valueEl = document.getElementById(metric.valueId);
            if (valueEl) valueEl.textContent = '--';
        } else {
            card.classList.add('hidden');
        }
    }

    // Also handle pm25/pm10 cards which use closest('.sensor-card') instead of a cardId
    for (const key of ['pm25', 'pm10']) {
        const valueEl = document.getElementById(`${key}-value`);
        const card = valueEl?.closest('.sensor-card');
        if (!card) continue;

        if (activeMetricKeys.has(key)) {
            card.classList.remove('hidden');
            valueEl.textContent = '--';
        } else {
            card.classList.add('hidden');
        }
    }

    // Show/hide spectral card
    const spectralCard = document.getElementById('spectral-card');
    if (spectralCard) {
        spectralCard.classList.toggle('hidden', deviceType.id !== LOG_TYPE.SPECTRAL);
    }

    // Hide temp/humidity cards if the device type doesn't declare them
    const tempCard = document.getElementById('temp-value')?.closest('.sensor-card');
    const humidityCard = document.getElementById('humidity-value')?.closest('.sensor-card');
    if (tempCard) tempCard.classList.toggle('hidden', !activeMetricKeys.has('temperature'));
    if (humidityCard) humidityCard.classList.toggle('hidden', !activeMetricKeys.has('humidity'));

    // Clear all sparkline canvases to avoid stale data
    for (const metric of getAllKnownMetrics()) {
        if (metric.sparklineId) {
            const canvas = document.getElementById(metric.sparklineId);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    console.log(`Widgets configured for log type: ${deviceType.name}`);
}

// ── Reactive subscriptions ────────────────────────────────────────────

listenKeys($state, ['currentLogType'], (value) => {
    configureWidgetsForLogType(value.currentLogType ?? LOG_TYPE.GPS);
});

// When selected device changes, persist choice and load device type from metadata
listenKeys($state, ['selectedDeviceSerial'], async () => {
    const serial = state.get('selectedDeviceSerial');
    if (!serial) return;

    localStorage.setItem('lastSelectedDevice', serial);

    // Always load device type from metadata so widgets configure correctly.
    // This handles both offline devices AND switching back to a connected device
    // after viewing an offline one (which would have changed currentLogType).
    const metadata = await getDeviceMetadata(serial);
    if (metadata?.deviceType != null) {
        state.set('currentLogType', metadata.deviceType);
    }

    // Refresh live data and on-device log count when viewing the connected device.
    // handleDeviceConnected() may have run before selectedDeviceSerial was set
    // (multi-device setups), so battery/measurements/spectral chart need a refresh.
    if (serial === state.get('connectedDeviceSerial')) {
        updateLiveData();
        updateDeviceLogCount();
    }
});


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
export function switchPage(pageId) {
    // Track page view
    track('page_view', { page: pageId });

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

    // Overview page: fetch fresh live data and redraw spectral chart
    if (pageId === 'overview') {
        if (isDeviceConnected()) {
            updateLiveData();
        }
        redrawSpectralChart();
    }

    // History page: ensure a device is selected (the dropdown always has one)
    if (pageId === 'history') {
        if (!state.get('selectedDeviceSerial')) {
            const deviceFilter = document.getElementById('device-filter');
            if (deviceFilter?.value) {
                state.set('selectedDeviceSerial', deviceFilter.value);
            }
        }
        refreshHistoryChart();
    }
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

    // Settings button - load settings before opening modal
    document.getElementById('settings-btn').addEventListener('click', async () => {
        await loadDeviceSettings();
        openSettingsModal();
    });

    // Modal close button
    document.getElementById('close-modal-btn').addEventListener('click', closeSettingsModal);

    // Erase device button (in modal)
    document.getElementById('erase-device-btn').addEventListener('click', handleEraseDevice);

    // Save settings button (in modal)
    document.getElementById('save-settings-btn').addEventListener('click', handleSaveSettings);

    // Recording toggle (in modal) - sends immediately on change
    document.getElementById('settings-recording').addEventListener('change', handleRecordingToggle);

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

    // Forget device button (in edit device modal)
    document.getElementById('forget-device-btn').addEventListener('click', handleForgetDevice);

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
        const newFilter = e.target.value;
        if (!newFilter) return; // Ignore empty selection
        // Setting state triggers widget subscriptions automatically
        state.set('selectedDeviceSerial', newFilter);
    });

    // Events time filter dropdown — subscription in eventsUI handles the refresh
    document.getElementById('events-time-filter').addEventListener('change', (e) => {
        state.set('currentEventsTimeFilter', e.target.value);
    });

    // Device Switcher events
    document.getElementById('device-switcher-btn').addEventListener('click', toggleDeviceDropdown);

    // Connect new device button in dropdown — always opens picker,
    // disconnecting the current device first if needed
    document.getElementById('connect-new-device-btn').addEventListener('click', async () => {
        closeDeviceDropdown();
        if (isDeviceConnected()) {
            await disconnectDevice();
        }
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

    // Fleet view buttons
    document.getElementById('fleet-back-btn')?.addEventListener('click', () => {
        navigateToFleetView();
    });
    document.getElementById('fleet-connect-btn')?.addEventListener('click', () => {
        handleConnect();
    });

    // WebUSB connection callbacks
    onConnect(handleDeviceConnected);
    onDisconnect(handleDeviceDisconnected);

    // When any matching USB device is plugged/unplugged, refresh device lists
    onDeviceListChange(() => {
        bumpDataVersion();
        updateOverviewVisibility();
    });

    // Report page event handlers
    setupReportEventHandlers();

}

/**
 * Initialize UI and event handlers
 */
export async function initUI() {
    // Translate static page content
    i18n.translatePage();

    // Apply Electron-specific UI adjustments once at startup
    if (isRunningInElectron()) {
        document.getElementById('connect-btn').style.display = 'none';
        document.getElementById('electron-connect-hint').classList.remove('hidden');
    }

    initSidebar();
    initHelpPage();
    setupEventHandlers();
    await attemptAutoReconnect();
    await updateBrowserLogCount();
    await updateDeviceFilter();
    await updateLogTable();
    await initHistoryChart();
    loadLastSyncTime();

    // Initialize report page
    await initReportPage();

    // Auto-select device on startup (if not already connected)
    if (!state.get('connectedDeviceSerial')) {
        const { allSerials } = await getAllKnownDevices();

        if (allSerials.size === 1) {
            // Single device — go straight to device view
            // Setting state triggers updateOverviewVisibility() via subscription
            state.set('selectedDeviceSerial', [...allSerials][0]);
        }
        // 2+ devices: selectedDeviceSerial stays null → fleet table shown
        // 0 devices: selectedDeviceSerial stays null → connect section shown
    }

    // Explicit call needed because listenKeys only fires on state *changes*.
    // When no state changed above (0 or 2+ devices, no USB), the subscription
    // never fires, leaving the page in its default HTML state.
    await updateOverviewVisibility();
}
