/**
 * Log Table Module
 * Handles measurement history table rendering
 */

import {
    getRecentLogs,
    getLogsByDevice,
    getLogCount as getStorageLogCount
} from '../storage.js';
import { LOG_TYPE } from '../constants.js';
import { formatTimestamp } from './utils.js';
import { getCO2ColorClass } from './liveData.js';
import { updateEventsTimeline } from './eventsUI.js';

/**
 * Get log type label for display
 * @param {number} logType - Log type constant
 * @returns {string} Human-readable label
 */
export function getLogTypeLabel(logType) {
    switch (logType) {
        case LOG_TYPE.GPS: return 'GPS';
        case LOG_TYPE.TSL2591: return 'TSL';
        case LOG_TYPE.CO2: return 'CO2';
        default: return '—';
    }
}

/**
 * Update browser storage log count display
 */
export async function updateBrowserLogCount() {
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
 * Update log table with logs, optionally filtered by device
 * @param {string|null} deviceSerial - Filter by device serial, or null for all devices
 */
export async function updateLogTable(deviceSerial = null) {
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
