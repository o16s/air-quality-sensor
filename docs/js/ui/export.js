/**
 * Export Module
 * Handles CSV and JSON export functions
 */

import { getAllLogs, getLogsByDevice, getAllDeviceMetadata } from '../storage.js';
import { exportToCSV, exportToJSON } from '../export.js';
import * as state from './state.js';
import { showError, showSuccess } from './utils.js';

/**
 * Handle export to CSV
 * Exports only the logs matching the current device filter
 */
export async function handleExportCSV() {
    try {
        const currentDeviceFilter = state.get('currentDeviceFilter');
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
export async function handleExportJSON() {
    try {
        const currentDeviceFilter = state.get('currentDeviceFilter');
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
