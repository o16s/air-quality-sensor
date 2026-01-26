/**
 * Report UI Module
 * Handles report page functions
 */

import {
    getDatabaseStats,
    getAllDeviceMetadata,
    getLogsByDevice
} from '../storage.js';
import {
    computeStatistics,
    computeEventStats,
    computeGI2Compliance,
    renderReportPreview,
    generatePDF,
    getLogsForReport
} from '../report.js';
import * as state from './state.js';
import { showError } from './utils.js';
import { escapeHtmlAttr } from './utils.js';

/**
 * Initialize report page
 */
export async function initReportPage() {
    await populateReportDeviceList();
    await setReportDateDefaults();
}

/**
 * Setup report event handlers
 */
export function setupReportEventHandlers() {
    // Device checkboxes change
    document.getElementById('report-device-list').addEventListener('change', handleReportSelectionChange);

    // Date range change
    document.getElementById('report-date-start').addEventListener('change', handleReportSelectionChange);
    document.getElementById('report-date-end').addEventListener('change', handleReportSelectionChange);

    // GI 2.0 override change
    document.getElementById('report-gi2-override').addEventListener('change', updateReportPreview);

    // Findings/Recommendations change
    document.getElementById('report-findings').addEventListener('input', updateReportPreview);
    document.getElementById('report-recommendations').addEventListener('input', updateReportPreview);

    // Org/Title/Location change
    document.getElementById('report-org').addEventListener('input', updateReportPreview);
    document.getElementById('report-title').addEventListener('input', updateReportPreview);
    document.getElementById('report-location').addEventListener('input', updateReportPreview);

    // Generate PDF button
    document.getElementById('generate-pdf-btn').addEventListener('click', handleGeneratePDF);

    // Reset button
    document.getElementById('reset-report-btn').addEventListener('click', handleResetReport);
}

/**
 * Populate device list with checkboxes
 */
export async function populateReportDeviceList() {
    const container = document.getElementById('report-device-list');
    const stats = await getDatabaseStats();
    const metadataList = await getAllDeviceMetadata();

    // Build metadata lookup map
    const metadataMap = {};
    metadataList.forEach(m => {
        metadataMap[m.serial] = m;
    });

    if (stats.devices.length === 0) {
        container.innerHTML = '<p class="text-sm text-gray-400">No devices with data found</p>';
        return;
    }

    let html = '';
    for (const serial of stats.devices) {
        const metadata = metadataMap[serial];
        const displayName = metadata?.name || serial;

        // Get measurement count for this device
        const deviceLogs = await getLogsByDevice(serial);
        const count = deviceLogs.length;

        html += `
            <label class="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input type="checkbox" value="${serial}" class="report-device-checkbox mt-0.5" checked>
                <div class="flex-1 min-w-0">
                    <span class="text-sm font-medium text-gray-700 truncate block">${escapeHtmlAttr(displayName)}</span>
                    <span class="text-xs text-gray-500">${count.toLocaleString()} measurements</span>
                </div>
            </label>
        `;
    }

    container.innerHTML = html;
}

/**
 * Set default date range based on available data
 */
export async function setReportDateDefaults() {
    const stats = await getDatabaseStats();

    const startInput = document.getElementById('report-date-start');
    const endInput = document.getElementById('report-date-end');

    if (stats.oldestTimestamp && stats.newestTimestamp) {
        const startDate = new Date(stats.oldestTimestamp * 1000);
        const endDate = new Date(stats.newestTimestamp * 1000);

        startInput.value = startDate.toISOString().split('T')[0];
        endInput.value = endDate.toISOString().split('T')[0];
    } else {
        // Default to today
        const today = new Date().toISOString().split('T')[0];
        endInput.value = today;

        // Default start to 7 days ago
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        startInput.value = weekAgo;
    }
}

/**
 * Handle report selection change (devices or dates)
 */
export async function handleReportSelectionChange() {
    await updateReportStats();
    await updateReportPreview();
}

/**
 * Update computed statistics based on selection
 */
export async function updateReportStats() {
    const selectedDevices = getSelectedReportDevices();
    const { startTimestamp, endTimestamp } = getReportDateRange();

    const statsContainer = document.getElementById('report-computed-stats');
    const eventStatsContainer = document.getElementById('report-event-stats');
    const gi2StatusContainer = document.getElementById('report-gi2-status');

    if (selectedDevices.length === 0) {
        statsContainer.innerHTML = '<p class="text-gray-400">Select at least one device</p>';
        eventStatsContainer.innerHTML = '<p class="text-gray-400">No data</p>';
        gi2StatusContainer.innerHTML = '<span class="text-gray-400">--</span>';
        state.set('reportStats', null);
        state.set('reportEventStats', null);
        state.set('reportGI2Status', null);
        return;
    }

    // Get logs for selected devices and date range
    const logs = await getLogsForReport(selectedDevices, startTimestamp, endTimestamp);

    if (logs.length === 0) {
        statsContainer.innerHTML = '<p class="text-gray-400">No data in selected range</p>';
        eventStatsContainer.innerHTML = '<p class="text-gray-400">No data</p>';
        gi2StatusContainer.innerHTML = '<span class="text-gray-400">--</span>';
        state.set('reportStats', null);
        state.set('reportEventStats', null);
        state.set('reportGI2Status', null);
        return;
    }

    // Compute statistics
    const reportStats = computeStatistics(logs);
    const reportEventStats = computeEventStats(logs);
    const reportGI2Status = computeGI2Compliance(reportStats);

    state.set('reportStats', reportStats);
    state.set('reportEventStats', reportEventStats);
    state.set('reportGI2Status', reportGI2Status);

    // Display computed statistics
    let statsHtml = `<p><strong>${reportStats.totalMeasurements.toLocaleString()}</strong> measurements</p>`;

    if (reportStats.co2.avg !== null) {
        statsHtml += `<p>CO2 Average: <strong>${Math.round(reportStats.co2.avg)} ppm</strong></p>`;
        statsHtml += `<p>CO2 Peak: <strong>${Math.round(reportStats.co2.max)} ppm</strong></p>`;
    }
    if (reportStats.pm25.avg !== null) {
        statsHtml += `<p>PM2.5 Average: <strong>${reportStats.pm25.avg.toFixed(1)} ug/m3</strong></p>`;
    }
    if (reportStats.temperature.avg !== null) {
        statsHtml += `<p>Temperature Avg: <strong>${reportStats.temperature.avg.toFixed(1)} C</strong></p>`;
    }

    statsContainer.innerHTML = statsHtml;

    // Display event statistics
    const totalEvents = reportEventStats.yellow.count + reportEventStats.orange.count + reportEventStats.red.count;
    if (totalEvents > 0) {
        let eventHtml = `<p><strong>${totalEvents}</strong> events detected</p>`;
        if (reportEventStats.yellow.count > 0) {
            eventHtml += `<p class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow-400"></span>Yellow: ${reportEventStats.yellow.count} (${reportEventStats.yellow.totalMinutes} min)</p>`;
        }
        if (reportEventStats.orange.count > 0) {
            eventHtml += `<p class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400"></span>Orange: ${reportEventStats.orange.count} (${reportEventStats.orange.totalMinutes} min)</p>`;
        }
        if (reportEventStats.red.count > 0) {
            eventHtml += `<p class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span>Red: ${reportEventStats.red.count} (${reportEventStats.red.totalMinutes} min)</p>`;
        }
        eventStatsContainer.innerHTML = eventHtml;
    } else {
        eventStatsContainer.innerHTML = '<p class="text-green-600">No threshold violations</p>';
    }

    // Display GI 2.0 status
    const statusClasses = {
        pass: 'text-green-600',
        warning: 'text-yellow-600',
        fail: 'text-red-600',
        unknown: 'text-gray-400'
    };
    const statusLabels = {
        pass: 'Compliant',
        warning: 'Warning',
        fail: 'Not Compliant',
        unknown: 'Unknown'
    };

    gi2StatusContainer.innerHTML = `
        <span class="${statusClasses[reportGI2Status.status]}">${statusLabels[reportGI2Status.status]}</span>
        <span class="text-xs text-gray-500 ml-2">${reportGI2Status.reason}</span>
    `;
}

/**
 * Get selected device serial numbers
 * @returns {Array<string>} Selected device serials
 */
export function getSelectedReportDevices() {
    const checkboxes = document.querySelectorAll('.report-device-checkbox:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

/**
 * Get report date range as timestamps
 * @returns {Object} Date range with timestamps and Date objects
 */
export function getReportDateRange() {
    const startInput = document.getElementById('report-date-start');
    const endInput = document.getElementById('report-date-end');

    const startDate = new Date(startInput.value);
    const endDate = new Date(endInput.value);

    // Set end date to end of day
    endDate.setHours(23, 59, 59, 999);

    return {
        startTimestamp: Math.floor(startDate.getTime() / 1000),
        endTimestamp: Math.floor(endDate.getTime() / 1000),
        startDate: startDate,
        endDate: endDate
    };
}

/**
 * Get device display names for selected devices
 * @returns {Promise<Array<string>>} Display names
 */
export async function getSelectedDeviceNames() {
    const selectedDevices = getSelectedReportDevices();
    const metadataList = await getAllDeviceMetadata();

    const metadataMap = {};
    metadataList.forEach(m => {
        metadataMap[m.serial] = m;
    });

    return selectedDevices.map(serial => {
        const metadata = metadataMap[serial];
        return metadata?.name || serial;
    });
}

/**
 * Update report preview
 */
export async function updateReportPreview() {
    const previewContainer = document.getElementById('report-preview');

    const organization = document.getElementById('report-org').value;
    const title = document.getElementById('report-title').value;
    const location = document.getElementById('report-location').value;
    const gi2Override = document.getElementById('report-gi2-override').value;

    // Parse findings and recommendations JSON
    let findings = [];
    let recommendations = [];
    try {
        findings = JSON.parse(document.getElementById('report-findings').value || '[]');
    } catch (e) {
        // Keep empty array if invalid JSON
    }
    try {
        recommendations = JSON.parse(document.getElementById('report-recommendations').value || '[]');
    } catch (e) {
        // Keep empty array if invalid JSON
    }

    const { startDate, endDate } = getReportDateRange();
    const deviceNames = await getSelectedDeviceNames();

    const reportStats = state.get('reportStats');
    const reportEventStats = state.get('reportEventStats');
    const reportGI2Status = state.get('reportGI2Status');

    const html = renderReportPreview({
        organization,
        title,
        location,
        stats: reportStats,
        eventStats: reportEventStats,
        gi2Status: reportGI2Status,
        gi2Override,
        findings,
        recommendations,
        dateStart: startDate.getTime(),
        dateEnd: endDate.getTime(),
        deviceNames
    });

    previewContainer.innerHTML = html;
}

/**
 * Handle generate PDF button click
 */
export async function handleGeneratePDF() {
    const btn = document.getElementById('generate-pdf-btn');
    const originalText = btn.textContent;

    btn.disabled = true;
    btn.textContent = 'Generating...';

    try {
        const previewElement = document.getElementById('report-preview').firstElementChild;
        if (!previewElement) {
            throw new Error('No preview content to export');
        }

        const title = document.getElementById('report-title').value || 'Air-Quality-Report';
        const filename = `${title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

        await generatePDF(previewElement, filename);

        btn.textContent = 'PDF Generated!';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('PDF generation failed:', error);
        showError('Failed to generate PDF: ' + error.message);
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

/**
 * Handle reset button click
 */
export async function handleResetReport() {
    // Reset form fields to defaults
    document.getElementById('report-org').value = 'Octanis Instrumente GmbH';
    document.getElementById('report-title').value = 'Indoor Air Quality Audit';
    document.getElementById('report-location').value = '';
    document.getElementById('report-gi2-override').value = 'auto';
    document.getElementById('report-findings').value = '["High CO2 events 14:00-17:00 daily", "Weekend air quality remains optimal"]';
    document.getElementById('report-recommendations').value = '["Install CO2-driven ventilation control", "Re-test after 4 weeks"]';

    // Re-select all devices
    document.querySelectorAll('.report-device-checkbox').forEach(cb => {
        cb.checked = true;
    });

    // Reset dates to defaults
    await setReportDateDefaults();

    // Refresh stats and preview
    await handleReportSelectionChange();
}
