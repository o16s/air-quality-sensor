/**
 * Connection Module
 * Handles USB connection lifecycle
 */

import {
    connectDevice,
    disconnectDevice,
    isDeviceConnected,
    handleUSBError,
    getDevice,
    getDeviceInfo
} from '../webusb.js';
import {
    getFirmwareVersion,
    getLogType
} from '../protocol.js';
import { getDeviceMetadata, setDeviceMetadata, getLogCount as getStorageLogCount } from '../storage.js';
import { LOG_TYPE } from '../constants.js';
import * as state from './state.js';
import { showError } from './utils.js';
import { updateLiveData } from './liveData.js';
import { updateDeviceLogCount, startAutoRefresh, stopAutoRefresh, syncDeviceTime } from './sync.js';
import { loadSparklinesFromStorage } from './sparklines.js';
import {
    updateDeviceFilter,
    updateSwitcherVisibility,
    updateSwitcherDisplay,
    updateDeviceDetailsBar
} from './deviceSwitcher.js';
import { configureWidgetsForLogType } from './init.js';

// Environment detection (set once at module load)
const runningInElectron = navigator.userAgent.toLowerCase().includes('electron');

/**
 * Handle connect button click
 */
export async function handleConnect() {
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
 * @param {USBDevice} device - The connected USB device
 */
export async function handleDeviceConnected(device) {
    console.log('Device connected:', device);

    // Get device info
    const info = getDeviceInfo();
    state.set('currentDeviceSerial', info.serialNumber);
    state.set('connectedDeviceSerial', info.serialNumber);
    state.set('selectedDeviceSerial', info.serialNumber);

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
    let currentDeviceModel = null;
    try {
        const versionString = await getFirmwareVersion(device);

        // Parse version string: "OAQ-1-2 7088c449-dirty" → model + firmware
        const parts = versionString.trim().split(' ');
        currentDeviceModel = parts[0] || '-';
        const firmware = parts.slice(1).join(' ') || '-';

        state.set('currentDeviceModel', currentDeviceModel);

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
        state.set('currentDeviceModel', 'N/A');
        document.getElementById('device-firmware').textContent = 'N/A';
    }

    // Detect log format type and configure widgets
    let currentLogType = LOG_TYPE.GPS;
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

    state.set('currentLogType', currentLogType);

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
    await updateDeviceLogCount();

    // Load sparklines from storage
    await loadSparklinesFromStorage();

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
export async function showAppropriateDisconnectedContent() {
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
 * Handle device disconnected event
 */
export async function handleDeviceDisconnected() {
    console.log('Device disconnected');

    // Clear connected device state (but keep selected device)
    state.set('connectedDeviceSerial', null);
    state.set('currentLogType', null);
    state.set('currentDeviceSerial', null);
    state.set('currentDeviceModel', null);

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
 * Handle disconnect button
 */
export async function handleDisconnect() {
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
 * Check if running in Electron
 * @returns {boolean} True if running in Electron
 */
export function isRunningInElectron() {
    return runningInElectron;
}
