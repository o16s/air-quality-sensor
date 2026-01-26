/**
 * Sync Module
 * Handles auto-refresh, log downloads, and device time sync
 */

import { i18n } from '../i18n.js';
import { isDeviceConnected, getDevice, getDeviceInfo } from '../webusb.js';
import {
    getLogCount,
    downloadAllLogs,
    setDeviceTime,
    triggerAcquisition
} from '../protocol.js';
import { storeLogs } from '../storage.js';
import { LOG_TYPE, DEVICE_CAPACITY } from '../constants.js';
import * as state from './state.js';
import { showError, showSuccess } from './utils.js';
import { updateLiveData } from './liveData.js';
import { updateBrowserLogCount, updateLogTable } from './logTable.js';
import { updateDeviceFilter } from './deviceSwitcher.js';
import { loadSparklinesFromStorage } from './sparklines.js';

/**
 * Synchronize device time with system time
 * @param {USBDevice} device - The USB device
 * @param {boolean} updateAfter - Whether to update live data after sync
 * @returns {Promise<void>}
 */
export async function syncDeviceTime(device, updateAfter = false) {
    const now = Math.floor(Date.now() / 1000);
    await setDeviceTime(device, now);

    if (updateAfter) {
        await updateLiveData();
    }
}

/**
 * Start auto-refresh timer
 */
export function startAutoRefresh() {
    stopAutoRefresh();
    const interval = setInterval(updateLiveData, 10000); // Every 10 seconds
    state.set('autoRefreshInterval', interval);
}

/**
 * Stop auto-refresh timer
 */
export function stopAutoRefresh() {
    const autoRefreshInterval = state.get('autoRefreshInterval');
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        state.set('autoRefreshInterval', null);
    }
}

/**
 * Handle manual refresh button
 */
export async function handleRefresh() {
    if (!isDeviceConnected()) {
        return;
    }

    const btn = document.getElementById('refresh-btn');
    btn.disabled = true;

    try {
        // Trigger sensor acquisition
        const device = getDevice();
        btn.textContent = i18n.t('sync_acquiring');
        await triggerAcquisition(device);

        // 20-second countdown
        for (let i = 20; i > 0; i--) {
            btn.textContent = i18n.t('sync_acquiringCountdown', { seconds: i });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Fetch fresh data
        btn.textContent = i18n.t('sync_reading');
        await updateLiveData();

        // Update sparklines from browser storage
        await loadSparklinesFromStorage();

        // Success feedback
        btn.textContent = i18n.t('sync_refreshed');
        await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
        console.error('Failed to refresh:', error);
        showError(i18n.t('sync_refreshFailed', { message: error.message }));
    } finally {
        btn.disabled = false;
        btn.textContent = i18n.t('action_measureNow');
    }
}

/**
 * Handle refresh time button
 */
export async function handleRefreshTime() {
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
        showError(i18n.t('sync_timeFailed', { message: error.message }));
    } finally {
        btn.disabled = false;
    }
}

/**
 * Update device log count and capacity display
 */
export async function updateDeviceLogCount() {
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
export function updateDeviceCapacity(count) {
    const selectedDeviceSerial = state.get('selectedDeviceSerial');
    const connectedDeviceSerial = state.get('connectedDeviceSerial');

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
    countEl.textContent = i18n.t('storage_measurement', { count });

    // Calculate and display "Memory full in X days"
    const fullDateEl = document.getElementById('storage-full-date');
    if (count > 0 && count < maxCapacity) {
        const remainingLogs = maxCapacity - count;
        const secondsUntilFull = remainingLogs * measurementInterval;
        const daysUntilFull = secondsUntilFull / (60 * 60 * 24);

        let timeText;
        if (daysUntilFull < 1) {
            const hoursUntilFull = Math.round(secondsUntilFull / 3600);
            timeText = `${hoursUntilFull}h`;
        } else {
            timeText = `${Math.round(daysUntilFull)}d`;
        }
        fullDateEl.textContent = i18n.t('storage_memoryFullIn', { time: timeText });

        // Set tooltip with detailed info
        const intervalMinutes = Math.round(measurementInterval / 60);
        const tooltip = `${i18n.t('storage_tooltip', { interval: intervalMinutes })} • ${i18n.t('storage_maxMeasurements', { max: maxCapacity })} • ${i18n.t('storage_percentUsed', { percent: percent.toFixed(1) })}`;
        fullDateEl.setAttribute('title', tooltip);

        fullDateEl.classList.remove('hidden');
    } else if (count >= maxCapacity) {
        fullDateEl.textContent = i18n.t('storage_memoryFull');
        fullDateEl.setAttribute('title', i18n.t('storage_maxMeasurements', { max: maxCapacity }));
        fullDateEl.classList.remove('hidden');
    } else {
        fullDateEl.classList.add('hidden');
    }
}

/**
 * Handle download logs button (Sync Data)
 */
export async function handleDownloadLogs() {
    if (!isDeviceConnected() || state.get('isDownloading')) {
        return;
    }

    state.set('isDownloading', true);

    const btn = document.getElementById('sync-data-btn-header');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = i18n.t('sync_syncing');

    try {
        const device = getDevice();
        const info = getDeviceInfo();

        const result = await downloadAllLogs(device, (current, total) => {
            btn.textContent = i18n.t('sync_syncingProgress', { current, total });
        });

        const { logType, logs } = result;

        // Update current log type
        state.set('currentLogType', logType);

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
                showSuccess(i18n.t('sync_downloadedNew', { total: logs.length, format: formatName, new: storeResult.success, skipped: storeResult.skipped }));
            } else {
                showSuccess(i18n.t('sync_downloadedAll', { count: storeResult.success, format: formatName }));
            }
        } else {
            showSuccess(i18n.t('sync_noNewLogs'));
        }

        // Update counts, table, and sparklines
        await updateBrowserLogCount();
        await updateDeviceFilter();
        await updateLogTable();
        await loadSparklinesFromStorage();
        updateLastSyncTime();

    } catch (error) {
        console.error('Download failed:', error);
        showError(i18n.t('sync_failed', { message: error.message }));
    } finally {
        state.set('isDownloading', false);
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

/**
 * Update last sync time display and store in localStorage
 */
export function updateLastSyncTime() {
    const now = Date.now();
    localStorage.setItem('lastSyncTime', now.toString());

    const timeString = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('last-sync-time').textContent = i18n.t('time_lastSynced', { time: timeString });
}

/**
 * Load last sync time from localStorage on page load
 */
export function loadLastSyncTime() {
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
        const date = new Date(parseInt(lastSync));
        const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('last-sync-time').textContent = i18n.t('time_lastSynced', { time: timeString });
    }
}
