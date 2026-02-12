/**
 * Device Switcher Module
 * Handles device selection dropdown and device filter
 */

import { i18n } from '../i18n.js';
import {
    getDatabaseStats,
    getDeviceMetadata,
    getAllDeviceMetadata,
    getLogsByDevice
} from '../storage.js';
import {
    isDeviceConnected,
    getDeviceInfo,
    connectToDeviceBySerial,
    getPairedDevices
} from '../webusb.js';
import { LOG_TYPE } from '../constants.js';
import { listenKeys } from 'nanostores';
import { $state, $dataVersion } from './state.js';
import * as state from './state.js';
import { openEditDeviceModalForSerial } from './modals.js';

/**
 * Get all known devices from all sources.
 * Single source of truth for "which devices exist."
 * @returns {Promise<{allSerials: Set<string>, metadataMap: Object, pairedSerials: Set<string>}>}
 */
export async function getAllKnownDevices() {
    const stats = await getDatabaseStats();
    const metadataList = await getAllDeviceMetadata();
    const pairedDevices = await getPairedDevices();

    const metadataMap = {};
    metadataList.forEach(m => { metadataMap[m.serial] = m; });

    const pairedSerials = new Set(pairedDevices.map(d => d.serialNumber));

    const allSerials = new Set(stats.devices);
    metadataList.forEach(m => allSerials.add(m.serial));
    pairedDevices.forEach(d => allSerials.add(d.serialNumber));

    return { allSerials, metadataMap, pairedSerials };
}

/**
 * Show/hide device header bar based on whether we have any device data
 */
export async function updateSwitcherVisibility() {
    const { allSerials } = await getAllKnownDevices();
    const connectedDeviceSerial = state.get('connectedDeviceSerial');
    const hasDevices = allSerials.size > 0 || connectedDeviceSerial;
    document.getElementById('device-header-bar').classList.toggle('hidden', !hasDevices);
}

/**
 * Populate dropdown with all known devices
 */
export async function populateDeviceDropdown() {
    const { allSerials: allDevices, metadataMap, pairedSerials: availableSerials } = await getAllKnownDevices();

    const connectedDeviceSerial = state.get('connectedDeviceSerial');

    const deviceList = document.getElementById('device-list');
    deviceList.innerHTML = '';

    if (allDevices.size === 0) {
        deviceList.innerHTML = `<p class="px-3 py-2 text-sm text-gray-500">${i18n.t('device_noDevicesFound')}</p>`;
        return;
    }

    const selectedDeviceSerial = state.get('selectedDeviceSerial');
    const currentLogType = state.get('currentLogType');
    const currentDeviceModel = state.get('currentDeviceModel');

    // Build device list items
    for (const serial of allDevices) {
        const metadata = metadataMap[serial];
        const isConnected = serial === connectedDeviceSerial;
        const isAvailable = availableSerials.has(serial);
        const isSelected = serial === selectedDeviceSerial;
        const model = (isConnected ? currentDeviceModel : null) || metadata?.model;
        const displayName = metadata?.name || (model ? `${model} (${serial})` : serial);
        const tags = metadata?.tags || [];

        // Get device type from metadata, connection, or logs (in priority order)
        let deviceType = null;
        if (isConnected && currentLogType !== null) {
            deviceType = currentLogType;
        } else if (metadata?.deviceType != null) {
            deviceType = metadata.deviceType;
        } else {
            // Fallback: check stored logs for this device
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
        const dotTitle = isOnline ? i18n.t('device_online') : i18n.t('device_offline');

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
            <button class="edit-device-btn p-1 text-gray-400 hover:text-gray-600 flex-shrink-0" data-serial="${serial}" title="${i18n.t('device_edit')}"">
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
export async function selectDevice(serial) {
    const connectedDeviceSerial = state.get('connectedDeviceSerial');

    // If selecting a different device than currently connected, try to switch connection
    if (serial && serial !== connectedDeviceSerial) {
        const connected = await connectToDeviceBySerial(serial);
        if (connected) {
            // Connection successful - handleDeviceConnected will be called via callback
            return;
        }
    }

    // Setting selectedDeviceSerial triggers widget subscriptions automatically
    state.set('selectedDeviceSerial', serial);
}

/**
 * Update the switcher display with selected device info
 */
export async function updateSwitcherDisplay() {
    const nameEl = document.getElementById('switcher-device-name');
    const iconEl = document.getElementById('switcher-device-icon');
    const dotEl = document.getElementById('switcher-status-dot');

    const selectedDeviceSerial = state.get('selectedDeviceSerial');
    const connectedDeviceSerial = state.get('connectedDeviceSerial');
    const currentDeviceModel = state.get('currentDeviceModel');

    if (!selectedDeviceSerial) {
        nameEl.textContent = i18n.t('device_selectDevice');
        iconEl.style.display = 'none';
        dotEl.classList.remove('bg-green-500', 'bg-yellow-400');
        dotEl.classList.add('bg-gray-400');
        return;
    }

    // Get device metadata for display name
    // Priority: user name → model (serial) → serial
    const metadata = await getDeviceMetadata(selectedDeviceSerial);
    const model = currentDeviceModel || metadata?.model;
    const displayName = metadata?.name || (model ? `${model} (${selectedDeviceSerial})` : selectedDeviceSerial);
    nameEl.textContent = displayName;

    // Check if device is available (plugged in)
    const pairedDevices = await getPairedDevices();
    const isAvailable = pairedDevices.some(d => d.serialNumber === selectedDeviceSerial);
    const isConnected = selectedDeviceSerial === connectedDeviceSerial;
    const isOnline = isConnected || isAvailable;

    // Update status dot: green=online (plugged in), gray=offline
    dotEl.classList.remove('bg-green-500', 'bg-gray-400');
    dotEl.classList.add(isOnline ? 'bg-green-500' : 'bg-gray-400');

    // Update product icon — show when model is known (live or persisted)
    const deviceModel = currentDeviceModel || metadata?.model;
    if (deviceModel) {
        iconEl.src = `img/${deviceModel}.jpg`;
        iconEl.style.display = '';
    } else {
        iconEl.style.display = 'none';
    }
}

/**
 * Toggle dropdown visibility
 */
export function toggleDeviceDropdown() {
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
export function closeDeviceDropdown() {
    document.getElementById('device-switcher-dropdown').classList.add('hidden');
}

/**
 * Update device header bar based on connection state
 * Shows/hides status info and action buttons depending on whether SELECTED device is connected
 */
export async function updateDeviceDetailsBar() {
    const lastSyncEl = document.getElementById('details-last-sync');
    const syncBtn = document.getElementById('sync-data-btn-header');
    const settingsBtn = document.getElementById('settings-btn');
    const disconnectBtn = document.getElementById('disconnect-btn-header');
    const batteryStatus = document.getElementById('battery-status-inline');
    const storageStatus = document.getElementById('storage-status-inline');
    const liveDataSection = document.getElementById('live-data-section');

    const connectedDeviceSerial = state.get('connectedDeviceSerial');
    const selectedDeviceSerial = state.get('selectedDeviceSerial');
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
            lastSyncEl.textContent = i18n.t('time_lastSynced', { time: date.toLocaleDateString() });
            lastSyncEl.classList.remove('hidden');
        } else {
            lastSyncEl.textContent = i18n.t('time_neverSynced');
            lastSyncEl.classList.remove('hidden');
        }
    }
}

/**
 * Update device filter dropdown with unique devices from storage
 * Marks the currently connected device if any
 * Shows custom device names if available
 */
export async function updateDeviceFilter() {
    try {
        const select = document.getElementById('device-filter');

        if (!select) return;

        const { allSerials: allDevices, metadataMap } = await getAllKnownDevices();

        // Get currently connected device serial (if any)
        let connectedSerial = null;
        if (isDeviceConnected()) {
            const info = getDeviceInfo();
            connectedSerial = info?.serialNumber;
        }

        // Preserve current selection
        const currentValue = select.value;
        const selectedDevice = state.get('selectedDeviceSerial');

        // Clear existing options
        select.innerHTML = '';

        if (allDevices.size === 0) {
            // No devices yet — show placeholder
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = i18n.t('device_noDevicesFound');
            placeholder.disabled = true;
            select.appendChild(placeholder);
            return;
        }

        // Add each unique device, marking connected one and showing custom name
        for (const serial of allDevices) {
            const option = document.createElement('option');
            option.value = serial;

            const metadata = metadataMap[serial];
            let displayName = metadata?.name || (metadata?.model ? `${metadata.model} (${serial})` : serial);

            if (serial === connectedSerial) {
                option.textContent = `${displayName} (${i18n.t('device_connected')})`;
            } else {
                option.textContent = displayName;
            }

            // Add title attribute with serial for reference
            if (metadata?.name || metadata?.model) {
                option.title = serial;
            }

            select.appendChild(option);
        }

        // Restore selection if still valid, otherwise pick selected device or first device
        const deviceArray = [...allDevices];
        if (currentValue && allDevices.has(currentValue)) {
            select.value = currentValue;
        } else if (selectedDevice && allDevices.has(selectedDevice)) {
            select.value = selectedDevice;
        } else {
            select.value = deviceArray[0];
        }
    } catch (error) {
        console.error('Failed to update device filter:', error);
    }
}

// ── Reactive subscriptions ────────────────────────────────────────────

listenKeys($state, ['selectedDeviceSerial', 'currentDeviceModel'], () => {
    updateSwitcherDisplay();
    updateDeviceDetailsBar();
    // Sync the device filter dropdown to match
    const serial = $state.get().selectedDeviceSerial;
    const deviceFilterEl = document.getElementById('device-filter');
    if (deviceFilterEl && serial) {
        deviceFilterEl.value = serial;
    }
});

listenKeys($state, ['connectedDeviceSerial'], () => {
    // device-header-bar visibility now handled by updateOverviewVisibility() in fleetView.js
    updateSwitcherDisplay();
    updateDeviceDetailsBar();
});

$dataVersion.listen(() => {
    updateDeviceFilter();
});
