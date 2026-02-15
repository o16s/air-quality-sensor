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
} from '../device/webusb.js';
import {
    getFirmwareVersion,
    getLogType
} from '../device/protocol.js';
import { getDeviceMetadata, setDeviceMetadata } from '../storage/storage.js';
import { LOG_TYPE } from '../shared/constants.js';
import { getDeviceTypeById } from '../shared/deviceTypes.js';
import * as state from './state.js';
import { showError } from './utils.js';
import { getAllKnownDevices } from './deviceSwitcher.js';
import { updateLiveData } from './liveData.js';
import { updateDeviceLogCount, startAutoRefresh, stopAutoRefresh, syncDeviceTime } from './sync.js';

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
    state.set('connectedDeviceSerial', info.serialNumber);

    // Auto-select only when this is the sole known device (first-time experience).
    // Otherwise stay on whatever view the user is on (e.g. fleet table).
    const { allSerials } = await getAllKnownDevices();
    if (allSerials.size <= 1) {
        state.set('selectedDeviceSerial', info.serialNumber);
    }

    // Update hidden fields for existing code compatibility
    document.getElementById('device-serial').textContent = info.serialNumber;

    // View updates handled by updateOverviewVisibility() via selectedDeviceSerial subscription

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

        // Save model + firmware to metadata for future reference (preserves existing name/tags)
        const existingMetadata = await getDeviceMetadata(info.serialNumber);
        await setDeviceMetadata(info.serialNumber, {
            name: existingMetadata?.name || '',
            tags: existingMetadata?.tags || [],
            model: currentDeviceModel,
            deviceType: existingMetadata?.deviceType,
            firmware,
        });
    } catch (error) {
        state.set('currentDeviceModel', 'N/A');
        document.getElementById('device-firmware').textContent = 'N/A';
    }

    // Detect log format type and configure widgets
    let currentLogType = LOG_TYPE.GPS;
    try {
        currentLogType = await getLogType(device);
        const deviceType = getDeviceTypeById(currentLogType);
        const formatText = deviceType?.name || 'Unknown';
        console.log(`Log format: ${formatText}`);
        const logFormatEl = document.getElementById('log-format');
        if (logFormatEl) {
            logFormatEl.textContent = formatText;
        }
    } catch (error) {
        console.log('Failed to detect log format:', error.message);
        currentLogType = LOG_TYPE.GPS;
    }

    // Setting currentLogType triggers configureWidgetsForLogType via subscription
    state.set('currentLogType', currentLogType);

    // Persist device type to metadata so offline devices can be identified
    try {
        const existingMeta = await getDeviceMetadata(info.serialNumber);
        await setDeviceMetadata(info.serialNumber, {
            name: existingMeta?.name || '',
            tags: existingMeta?.tags || [],
            model: existingMeta?.model || state.get('currentDeviceModel') || '',
            deviceType: currentLogType,
            firmware: existingMeta?.firmware,
        });
    } catch (e) {
        console.log('Failed to persist device type:', e.message);
    }

    // Set device time to current system time
    try {
        await syncDeviceTime(device, false);
        console.log('Device time synchronized to system time');
    } catch (error) {
        console.log('Failed to set device time on connect:', error.message);
    }

    // Get device log count
    await updateDeviceLogCount();

    // Start auto-refresh (live data + sparklines every 10s)
    startAutoRefresh();

    // Initial data fetch
    await updateLiveData();
}

/**
 * Handle device disconnected event
 */
export async function handleDeviceDisconnected() {
    console.log('Device disconnected');

    // Stop auto-refresh first
    stopAutoRefresh();

    // Reset connect button state
    const connectBtn = document.getElementById('connect-btn');
    connectBtn.disabled = false;
    connectBtn.textContent = 'Connect Device';

    // Clear connected device state (but keep selected device).
    // Each setKey fires only its own subscribers:
    //   - connectedDeviceSerial=null → deviceSwitcher, modals
    //   - currentLogType=null → configureWidgetsForLogType(GPS)
    // View updates handled by updateOverviewVisibility() via fleetView subscriptions
    state.set('connectedDeviceSerial', null);
    state.set('currentLogType', null);
    state.set('currentDeviceModel', null);
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
