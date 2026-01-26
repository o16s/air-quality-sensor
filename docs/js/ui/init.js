/**
 * Init Module
 * Handles initialization, widget configuration, and page switching
 */

import { i18n } from '../i18n.js';
import { autoReconnect, isDeviceConnected, onConnect, onDisconnect, getDevice } from '../webusb.js';
import { getDatabaseStats, clearAllLogs } from '../storage.js';
import { eraseLogs } from '../protocol.js';
import { LOG_TYPE } from '../constants.js';
import * as state from './state.js';
import {
    handleConnect,
    handleDeviceConnected,
    handleDeviceDisconnected,
    handleDisconnect,
    showAppropriateDisconnectedContent,
    isRunningInElectron
} from './connection.js';
import { showError, showSuccess } from './utils.js';
import { updateLiveData } from './liveData.js';
import { updateDeviceLogCount } from './sync.js';
import {
    handleRefresh,
    handleDownloadLogs,
    loadLastSyncTime
} from './sync.js';
import { updateLogTable, updateBrowserLogCount } from './logTable.js';
import { loadSparklinesFromStorage } from './sparklines.js';
import { updateHeatmap, renderThresholdTable } from './heatmapUI.js';
import {
    updateDeviceFilter,
    updateSwitcherVisibility,
    updateSwitcherDisplay,
    updateDeviceDetailsBar,
    toggleDeviceDropdown,
    closeDeviceDropdown,
    selectDevice
} from './deviceSwitcher.js';
import {
    openSettingsModal,
    closeSettingsModal,
    closeEditDeviceModal,
    handleSaveDeviceMetadata
} from './modals.js';
import { handleExportCSV, handleExportJSON } from './export.js';
import { initReportPage, setupReportEventHandlers } from './reportUI.js';
import { updateEventsTimeline } from './eventsUI.js';

/**
 * Handle clear logs button - clears all logs from browser storage
 */
async function handleClearLogs() {
    if (!confirm(i18n.t('clear_confirm'))) {
        return;
    }

    try {
        await clearAllLogs();
        await updateBrowserLogCount();
        await updateDeviceFilter();
        await updateLogTable();
        showSuccess(i18n.t('clear_success'));
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
export function configureWidgetsForLogType(logType) {
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
        const newFilter = e.target.value || null;
        state.set('currentDeviceFilter', newFilter);
        // Also update selected device in switcher
        state.set('selectedDeviceSerial', newFilter);
        updateSwitcherDisplay();
        updateDeviceDetailsBar();
        updateLogTable(newFilter);
        updateHeatmap(newFilter, state.get('currentHeatmapMetric'));
    });

    // Events time filter dropdown
    document.getElementById('events-time-filter').addEventListener('change', (e) => {
        state.set('currentEventsTimeFilter', e.target.value);
        updateEventsTimeline(state.get('currentDeviceFilter'));
    });

    // Heatmap metric dropdown
    document.getElementById('heatmap-metric').addEventListener('change', (e) => {
        state.set('currentHeatmapMetric', e.target.value);
        updateHeatmap(state.get('currentDeviceFilter'), e.target.value);
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

    // Report page event handlers
    setupReportEventHandlers();

    // Language switcher
    const langSwitcher = document.getElementById('language-switcher');
    if (langSwitcher) {
        // Set current language in dropdown
        langSwitcher.value = i18n.getLanguage();
        langSwitcher.addEventListener('change', (e) => {
            i18n.setLanguage(e.target.value);
        });
    }
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
    setupEventHandlers();
    await attemptAutoReconnect();
    await updateBrowserLogCount();
    await updateDeviceFilter();
    await updateLogTable();
    await loadSparklinesFromStorage();
    loadLastSyncTime();
    renderThresholdTable();
    await updateHeatmap(null, state.get('currentHeatmapMetric'));

    // Initialize device switcher
    await updateSwitcherVisibility();

    // Initialize report page
    await initReportPage();

    // Show appropriate section based on connection state
    if (isDeviceConnected()) {
        document.getElementById('connect-section').classList.add('hidden');
    } else {
        document.getElementById('connect-section').classList.remove('hidden');
        await showAppropriateDisconnectedContent();
    }

    // If we have stored devices but none connected, select the first one
    const stats = await getDatabaseStats();
    if (stats.devices.length > 0 && !state.get('connectedDeviceSerial')) {
        state.set('selectedDeviceSerial', stats.devices[0]);
        await updateSwitcherDisplay();
        await updateDeviceDetailsBar();
    }
}
