/**
 * Fleet View Module
 * Manages the two-state Overview page: fleet table vs device view
 */

import { i18n } from '../i18n.js';
import { getLogCount, getDeviceDisplayName } from '../storage.js';
import { LOG_TYPE } from '../constants.js';
import { listenKeys } from 'nanostores';
import { $state, $dataVersion } from './state.js';
import * as state from './state.js';
import { openEditDeviceModalForSerial } from './modals.js';
import { getAllKnownDevices, selectDevice } from './deviceSwitcher.js';
import { latestOnly } from './utils.js';

/**
 * Format a Unix timestamp as a relative time string + absolute tooltip.
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {{ relative: string, absolute: string }}
 */
function formatRelativeTime(timestamp) {
    const date = new Date(timestamp * 1000);
    const absolute = date.toLocaleString();

    const now = Date.now() / 1000;
    const diffSec = Math.floor(now - timestamp);

    let relative;
    if (diffSec < 60) {
        relative = i18n.t('time_fresh');
    } else if (diffSec < 3600) {
        relative = i18n.t('time_minutesOld', { minutes: Math.floor(diffSec / 60) });
    } else if (diffSec < 86400) {
        relative = i18n.t('time_hoursOld', { hours: Math.floor(diffSec / 3600) });
    } else if (diffSec < 86400 * 30) {
        relative = i18n.t('time_daysAgo', { days: Math.floor(diffSec / 86400) });
    } else {
        relative = date.toLocaleDateString();
    }

    return { relative, absolute };
}

/**
 * Populate the fleet table with all known devices.
 * Wrapped with latestOnly to prevent duplicate rows when concurrent
 * subscriptions (state change + dataVersion bump) fire simultaneously.
 */
export const populateFleetTable = latestOnly(async (stale) => {
    const { allSerials: allDevices, metadataMap, pairedSerials: availableSerials } = await getAllKnownDevices();
    if (stale()) return;

    const connectedDeviceSerial = state.get('connectedDeviceSerial');
    const currentDeviceModel = state.get('currentDeviceModel');

    const tbody = document.getElementById('fleet-device-tbody');
    const emptyState = document.getElementById('fleet-empty');
    const table = document.getElementById('fleet-table');

    if (!tbody) return;

    if (allDevices.size === 0) {
        tbody.innerHTML = '';
        table.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    table.classList.remove('hidden');
    emptyState.classList.add('hidden');

    // ── Async data-collection phase ──────────────────────────────────
    const rows = [];
    for (const serial of allDevices) {
        const metadata = metadataMap[serial];
        const isConnected = serial === connectedDeviceSerial;
        const isAvailable = availableSerials.has(serial);
        const isOnline = isConnected || isAvailable;
        const displayName = getDeviceDisplayName(metadata, serial, isConnected ? currentDeviceModel : null);
        const tags = metadata?.tags || [];

        // Device type from persisted metadata.
        // Don't use currentLogType — it reflects the *selected* device, not this device.
        let deviceType = null;
        if (metadata?.deviceType != null) {
            deviceType = metadata.deviceType;
        }

        // Measurement count
        let logCountText = '--';
        try {
            const count = await getLogCount(serial);
            if (stale()) return;
            logCountText = count.toLocaleString();
        } catch (e) { /* ignore */ }

        // Last seen = when device was last connected over USB (metadata.updatedAt)
        let lastSeenText = i18n.t('fleet_never');
        let lastSeenTooltip = '';
        if (metadata?.updatedAt) {
            const { relative, absolute } = formatRelativeTime(metadata.updatedAt);
            lastSeenText = relative;
            lastSeenTooltip = absolute;
        }

        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors';
        tr.dataset.serial = serial;

        // Device column: image + name + serial
        const deviceModel = (isConnected ? currentDeviceModel : null) || metadata?.model;
        let imgHtml = '';
        if (deviceModel) {
            imgHtml = `<img src="img/${deviceModel}.jpg" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" alt="" onerror="this.style.display='none'">`;
        } else {
            imgHtml = `<div class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
                </svg>
            </div>`;
        }

        // Type pill
        let typePillHtml = '';
        if (deviceType === LOG_TYPE.SPECTRAL) {
            typePillHtml = `<span class="inline-block px-1.5 py-0.5 text-xs bg-violet-100 text-violet-700 rounded font-medium">Spectral</span>`;
        } else if (deviceType === LOG_TYPE.RADAR) {
            typePillHtml = `<span class="inline-block px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded font-medium">Radar</span>`;
        } else if (deviceType === LOG_TYPE.CO2) {
            typePillHtml = `<span class="inline-block px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded font-medium">CO2</span>`;
        } else if (deviceType === LOG_TYPE.TSL2591 || deviceType === LOG_TYPE.GPS) {
            typePillHtml = `<span class="inline-block px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded font-medium">PM</span>`;
        }

        // Status
        const dotColor = isOnline ? 'bg-green-500' : 'bg-gray-300';
        const statusText = isOnline ? i18n.t('fleet_online') : i18n.t('fleet_offline');
        const statusTextColor = isOnline ? 'text-green-700' : 'text-gray-500';

        // Tags
        const tagPills = tags.map(tag =>
            `<span class="inline-block px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">${tag}</span>`
        ).join('');

        tr.innerHTML = `
            <td class="py-3 pr-4">
                <div class="flex items-center gap-3">
                    ${imgHtml}
                    <div>
                        <div class="text-sm font-medium text-gray-900">${displayName}</div>
                        <div class="text-xs text-gray-400">${serial}</div>
                    </div>
                </div>
            </td>
            <td class="py-3 pr-4">${typePillHtml}</td>
            <td class="py-3 pr-4">
                <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full ${dotColor}"></span>
                    <span class="text-sm ${statusTextColor}">${statusText}</span>
                </div>
            </td>
            <td class="py-3 pr-4 text-sm text-gray-600">
                <button class="fleet-history-btn text-blue-600 hover:text-blue-800 hover:underline" data-serial="${serial}">${logCountText}</button>
            </td>
            <td class="py-3 pr-4 text-sm text-gray-500 font-mono">${metadata?.firmware || '--'}</td>
            <td class="py-3 pr-4 text-sm text-gray-500" ${lastSeenTooltip ? `title="${lastSeenTooltip}"` : ''}>${lastSeenText}</td>
            <td class="py-3 pr-4">
                <div class="flex flex-wrap gap-1">${tagPills}</div>
            </td>
            <td class="py-3 text-right">
                <button class="fleet-edit-btn p-1 text-gray-400 hover:text-gray-600" data-serial="${serial}" title="${i18n.t('device_edit')}">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                        <path d="M13.5 6.5l4 4" />
                    </svg>
                </button>
            </td>
        `;

        // Row click → select device (skip if clicking action buttons)
        tr.addEventListener('click', (e) => {
            if (!e.target.closest('.fleet-edit-btn') && !e.target.closest('.fleet-history-btn')) {
                selectDevice(serial);
            }
        });

        // History button → select device + switch to History page
        const historyBtn = tr.querySelector('.fleet-history-btn');
        historyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectDevice(serial);
            document.querySelector('.nav-item[data-page="history"]')?.click();
        });

        // Edit button
        const editBtn = tr.querySelector('.fleet-edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditDeviceModalForSerial(serial);
        });

        rows.push(tr);
    }

    // ── Sync DOM-write phase (atomic, no interleaving) ───────────────
    if (stale()) return;
    tbody.innerHTML = '';
    for (const tr of rows) {
        tbody.appendChild(tr);
    }
});

/**
 * Central visibility orchestrator for the Overview page.
 * Called reactively when selectedDeviceSerial changes and at init.
 */
export async function updateOverviewVisibility() {
    const { allSerials } = await getAllKnownDevices();
    const deviceCount = allSerials.size;
    const selectedDevice = state.get('selectedDeviceSerial');
    const isConnected = state.get('connectedDeviceSerial') != null;

    const connectSection = document.getElementById('connect-section');
    const instructions = document.getElementById('instructions');
    const instructionsElectron = document.getElementById('instructions-electron');
    const deviceHeaderBar = document.getElementById('device-header-bar');
    const mainContent = document.getElementById('main-content');
    const fleetView = document.getElementById('device-fleet-view');
    const breadcrumb = document.getElementById('fleet-breadcrumb');
    const footerLogo = document.getElementById('footer-logo');

    if (deviceCount === 0 && !isConnected) {
        // No devices, not connected → show connect section + instructions
        connectSection.classList.remove('hidden');
        instructions.classList.remove('hidden');
        instructionsElectron?.classList.add('hidden');
        deviceHeaderBar.classList.add('hidden');
        mainContent.classList.add('hidden');
        fleetView.classList.add('hidden');
        breadcrumb.classList.add('hidden');
        footerLogo.classList.add('hidden');

    } else if (selectedDevice !== null) {
        // Device view — showing a specific device
        connectSection.classList.add('hidden');
        instructions.classList.add('hidden');
        instructionsElectron?.classList.add('hidden');
        fleetView.classList.add('hidden');
        deviceHeaderBar.classList.remove('hidden');
        mainContent.classList.remove('hidden');
        footerLogo.classList.remove('hidden');

        // Show breadcrumb only when 2+ devices
        breadcrumb.classList.toggle('hidden', deviceCount < 2);

        // Live data visibility is handled by updateDeviceDetailsBar() in deviceSwitcher.js

    } else {
        // Fleet view — selectedDevice is null but devices exist
        connectSection.classList.add('hidden');
        instructions.classList.add('hidden');
        instructionsElectron?.classList.add('hidden');
        mainContent.classList.add('hidden');
        breadcrumb.classList.add('hidden');
        footerLogo.classList.add('hidden');
        deviceHeaderBar.classList.add('hidden');
        fleetView.classList.remove('hidden');
        populateFleetTable();
    }
}

/**
 * Navigate to fleet view by clearing selectedDeviceSerial.
 * The subscription handles the rest.
 */
export function navigateToFleetView() {
    state.set('selectedDeviceSerial', null);
}

// ── Reactive subscriptions ────────────────────────────────────────────

listenKeys($state, ['selectedDeviceSerial', 'connectedDeviceSerial'], () => {
    updateOverviewVisibility();
});

$dataVersion.listen(() => {
    // If on fleet view, refresh table (log counts may have changed)
    if (!state.get('selectedDeviceSerial')) {
        populateFleetTable();
    }
});
