/**
 * Export Module
 * Handles CSV and JSON export functions
 */

import { i18n } from '../i18n.js';
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
        const currentDeviceFilter = state.get('selectedDeviceSerial');
        const logs = currentDeviceFilter
            ? await getLogsByDevice(currentDeviceFilter)
            : await getAllLogs();
        if (logs.length === 0) {
            showError(i18n.t('export_noLogs'));
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
        showSuccess(i18n.t('export_success', { count: logs.length, filter: filterMsg, format: 'CSV' }));

    } catch (error) {
        console.error('Export failed:', error);
        showError(i18n.t('export_failed', { message: error.message }));
    }
}

/**
 * Handle export to JSON
 * Exports only the logs matching the current device filter
 */
export async function handleExportJSON() {
    try {
        const currentDeviceFilter = state.get('selectedDeviceSerial');
        const logs = currentDeviceFilter
            ? await getLogsByDevice(currentDeviceFilter)
            : await getAllLogs();
        if (logs.length === 0) {
            showError(i18n.t('export_noLogs'));
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
        showSuccess(i18n.t('export_success', { count: logs.length, filter: filterMsg, format: 'JSON' }));

    } catch (error) {
        console.error('Export failed:', error);
        showError(i18n.t('export_failed', { message: error.message }));
    }
}
