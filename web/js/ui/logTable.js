/**
 * Log Table Module
 * Handles measurement history table rendering using Grid.js
 */

import { Grid, html } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { i18n } from '../shared/i18n.js';
import {
    getRecentLogs,
    getLogsByDevice,
    getLogCount as getStorageLogCount,
    getDeviceMetadata
} from '../storage/storage.js';
import { LOG_TYPE } from '../shared/constants.js';
import { getDeviceTypeById } from '../shared/deviceTypes.js';
import { formatTimestamp } from './utils.js';
import { getCO2ColorClass } from './liveData.js';
import { listenKeys } from 'nanostores';
import { $state, $dataVersion } from './state.js';

/**
 * Get log type label for display
 * @param {number} logType - Log type constant
 * @returns {string} Human-readable label
 */
export function getLogTypeLabel(logType) {
    const deviceType = getDeviceTypeById(logType);
    return deviceType ? deviceType.name : '—';
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

// ── Grid.js instance ──────────────────────────────────────────────────

let grid = null;

function formatSyncedOn(syncedOn) {
    if (!syncedOn) return '-';
    return new Date(syncedOn).toLocaleString([], {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}


/**
 * Build common columns for "All Devices" or mixed device types
 */
function buildCommonColumns() {
    return [
        { name: 'Timestamp', sort: true },
        { name: 'Temp (\u00B0C)', sort: true },
        { name: 'Humidity (%)', sort: true },
        { name: 'Battery', sort: true },
        { name: 'Type', sort: true },
        { name: 'Serial', sort: true },
        { name: 'Synced On', sort: true },
    ];
}

/**
 * Build common data rows
 */
function buildCommonData(logs) {
    return logs.map(log => [
        formatTimestamp(log.timestamp),
        log.temperature?.toFixed(1) ?? '-',
        log.humidity?.toFixed(1) ?? '-',
        log.batteryVoltage ? (log.batteryVoltage / 1000).toFixed(2) + 'V' : '-',
        getLogTypeLabel(log.logType),
        log.deviceSerial || '-',
        formatSyncedOn(log.syncedOn),
    ]);
}

/**
 * Build typed columns from device type registry
 * @param {Object} deviceType - Device type from registry
 * @param {Object} [options]
 * @param {boolean} [options.includeTypeColumn] - Add a "Type" column (for mixed log types)
 */
function buildTypedColumns(deviceType, { includeTypeColumn } = {}) {
    const metricColumns = deviceType ? deviceType.metrics : [];

    const columns = [
        { name: 'Timestamp', sort: true },
    ];

    for (const m of metricColumns) {
        const unitSuffix = m.unit ? ` (${m.unit})` : '';
        if (m.key === 'co2') {
            columns.push({
                name: `${m.label}${unitSuffix}`,
                sort: true,
                formatter: (cell) => {
                    if (cell == null || cell === '-') return '-';
                    const colorClass = getCO2ColorClass(Number(cell));
                    return html(`<span class="${colorClass}">${cell}</span>`);
                },
            });
        } else {
            columns.push({
                name: `${m.label}${unitSuffix}`,
                sort: true,
            });
        }
    }

    // Add extra fields that have a tableHeader (e.g. battery)
    const tableExtras = (deviceType?.extraFields || []).filter(f => f.tableHeader);
    for (const f of tableExtras) {
        columns.push({ name: f.tableHeader, sort: true });
    }

    if (includeTypeColumn) {
        columns.push({ name: 'Type', sort: true });
    }

    columns.push({ name: 'Synced On', sort: true });

    return { columns, metricColumns, tableExtras };
}

/**
 * Build typed data rows from device type registry
 * @param {Object[]} logs
 * @param {Object[]} metricColumns
 * @param {Object[]} tableExtras
 * @param {Object} [options]
 * @param {boolean} [options.includeTypeColumn] - Add log type label per row
 */
function buildTypedData(logs, metricColumns, tableExtras, { includeTypeColumn } = {}) {
    return logs.map(log => {
        const row = [
            formatTimestamp(log.timestamp),
        ];

        for (const m of metricColumns) {
            const val = log[m.key];
            if (m.key === 'co2') {
                row.push(val != null ? Math.round(val) : '-');
            } else {
                row.push(val != null ? val.toFixed(m.precision) : '-');
            }
        }

        for (const f of tableExtras) {
            const val = log[f.key];
            row.push(f.format ? f.format(val) : (val ?? '-'));
        }

        if (includeTypeColumn) {
            row.push(getLogTypeLabel(log.logType));
        }

        row.push(formatSyncedOn(log.syncedOn));

        return row;
    });
}

/**
 * Update log table with logs, optionally filtered by device
 * @param {string|null} deviceSerial - Filter by device serial, or null for all devices
 */
export async function updateLogTable(deviceSerial = null) {
    try {
        let logs;
        if (deviceSerial) {
            logs = await getLogsByDevice(deviceSerial);
            logs.sort((a, b) => b.timestamp - a.timestamp);
        } else {
            logs = await getRecentLogs(50);
        }

        const container = document.getElementById('log-table-container');
        if (!container) return;

        let columns;
        let data;

        if (logs.length === 0) {
            columns = buildCommonColumns();
            data = [];
        } else {
            const logTypes = new Set(logs.map(l => l.logType).filter(t => t !== undefined));
            const isMixed = logTypes.size > 1;

            if (deviceSerial === null) {
                // "All Devices" view → common columns
                columns = buildCommonColumns();
                data = buildCommonData(logs);
            } else if (isMixed) {
                // Reflash scenario: use metadata deviceType for columns + Type column
                const metadata = await getDeviceMetadata(deviceSerial);
                const currentType = metadata?.deviceType ?? logs[0]?.logType;
                const deviceType = getDeviceTypeById(currentType);
                const result = buildTypedColumns(deviceType, { includeTypeColumn: true });
                columns = result.columns;
                data = buildTypedData(logs, result.metricColumns, result.tableExtras, { includeTypeColumn: true });
            } else {
                const logType = logs[0]?.logType;
                const deviceType = getDeviceTypeById(logType);
                const result = buildTypedColumns(deviceType);
                columns = result.columns;
                data = buildTypedData(logs, result.metricColumns, result.tableExtras);
            }
        }

        const config = {
            columns,
            data,
            pagination: { limit: 25 },
            sort: true,
            language: {
                pagination: {
                    previous: '\u2039',
                    next: '\u203A',
                    showing: i18n.t('history_showing') || 'Showing',
                    of: i18n.t('history_of') || 'of',
                    to: i18n.t('history_to') || 'to',
                    results: i18n.t('history_results') || 'results',
                },
                noRecordsFound: i18n.t('history_noLogs') || 'No logs downloaded yet',
            },
            className: {
                table: 'gridjs-table',
                container: 'gridjs-container',
            },
        };

        if (!grid) {
            grid = new Grid(config);
            grid.render(container);
        } else {
            grid.updateConfig(config).forceRender();
        }

    } catch (error) {
        console.error('Failed to update log table:', error);
    }
}

// ── Reactive subscriptions ────────────────────────────────────────────

listenKeys($state, ['historyDeviceSerial'], (value) => {
    updateLogTable(value.historyDeviceSerial);
});

$dataVersion.listen(() => {
    updateBrowserLogCount();
    updateLogTable($state.get().historyDeviceSerial);
});
