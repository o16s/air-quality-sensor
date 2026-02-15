/**
 * Report Form Module
 * Date range, device selection, statistics display, AI analysis, logo/provider data
 */

import { i18n } from '../shared/i18n.js';
import {
    getDatabaseStats,
    getAllDeviceMetadata,
    getDeviceDisplayName,
} from '../storage/storage.js';
import {
    computeStatistics,
    computeEventStats,
    computeGI2Compliance,
    computeRoomStats,
    getLogsForReport
} from '../reporting/report.js';
import * as state from './state.js';
import { showError } from './utils.js';
import { getCurrentReportLocation } from './reportLocationsUI.js';

/**
 * Initialize default state values for editable report fields
 */
export function initEditableStateDefaults() {
    if (!state.get('reportIntro')) state.set('reportIntro', i18n.t('report_intro_default'));
    if (!state.get('reportLegal')) state.set('reportLegal', i18n.t('report_intro_legal_default'));
    if (!state.get('reportFindings')) state.set('reportFindings', []);
    if (!state.get('reportRecommendations')) state.set('reportRecommendations', []);
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
 * Update computed statistics based on selection
 */
export async function updateReportStats() {
    const selectedDevices = await getSelectedReportDevices();
    const { startTimestamp, endTimestamp } = getReportDateRange();

    const statsContainer = document.getElementById('report-computed-stats');
    const eventStatsContainer = document.getElementById('report-event-stats');
    const gi2StatusContainer = document.getElementById('report-gi2-status');

    if (selectedDevices.length === 0) {
        statsContainer.innerHTML = `<p class="text-gray-400">${i18n.t('report_selectAtLeastOne')}</p>`;
        eventStatsContainer.innerHTML = `<p class="text-gray-400">${i18n.t('report_noData')}</p>`;
        gi2StatusContainer.innerHTML = '<span class="text-gray-400">--</span>';
        state.set('reportStats', null);
        state.set('reportEventStats', null);
        state.set('reportGI2Status', null);
        state.set('reportRoomStats', []);
        return;
    }

    // Get logs for selected devices and date range
    const logs = await getLogsForReport(selectedDevices, startTimestamp, endTimestamp);

    if (logs.length === 0) {
        statsContainer.innerHTML = `<p class="text-gray-400">${i18n.t('report_noDataInRange')}</p>`;
        eventStatsContainer.innerHTML = `<p class="text-gray-400">${i18n.t('report_noData')}</p>`;
        gi2StatusContainer.innerHTML = '<span class="text-gray-400">--</span>';
        state.set('reportStats', null);
        state.set('reportEventStats', null);
        state.set('reportGI2Status', null);
        state.set('reportRoomStats', []);
        return;
    }

    // Compute statistics
    const reportStats = computeStatistics(logs);
    const reportEventStats = computeEventStats(logs);
    const reportGI2Status = computeGI2Compliance(reportStats);

    state.set('reportStats', reportStats);
    state.set('reportEventStats', reportEventStats);
    state.set('reportGI2Status', reportGI2Status);

    // Compute per-room statistics
    const buildingLocation = await getCurrentReportLocation();
    if (buildingLocation?.rooms) {
        const roomStats = computeRoomStats(
            buildingLocation.rooms,
            logs,
            startTimestamp,
            endTimestamp
        );
        state.set('reportRoomStats', roomStats);
    } else {
        state.set('reportRoomStats', []);
    }

    // Display computed statistics
    let statsHtml = `<p><strong>${reportStats.totalMeasurements.toLocaleString()}</strong> ${i18n.t('report_measurements', { count: reportStats.totalMeasurements }).split(' ').slice(1).join(' ')}</p>`;

    if (reportStats.co2?.avg != null) {
        statsHtml += `<p>${i18n.t('report_co2Average')}: <strong>${Math.round(reportStats.co2.avg)} ppm</strong></p>`;
        statsHtml += `<p>${i18n.t('report_co2Peak')}: <strong>${Math.round(reportStats.co2.max)} ppm</strong></p>`;
    }
    if (reportStats.pm25?.avg != null) {
        statsHtml += `<p>${i18n.t('report_pm25Average')}: <strong>${reportStats.pm25.avg.toFixed(1)} ug/m3</strong></p>`;
    }
    if (reportStats.temperature?.avg != null) {
        statsHtml += `<p>${i18n.t('report_tempAverage')}: <strong>${reportStats.temperature.avg.toFixed(1)} C</strong></p>`;
    }

    statsContainer.innerHTML = statsHtml;

    // Display event statistics
    const totalEvents = reportEventStats.yellow.count + reportEventStats.orange.count + reportEventStats.red.count;
    if (totalEvents > 0) {
        let eventHtml = `<p>${i18n.t('report_eventsDetected', { count: totalEvents })}</p>`;
        if (reportEventStats.yellow.count > 0) {
            eventHtml += `<p class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-yellow-400"></span>${i18n.t('report_yellow')}: ${reportEventStats.yellow.count} (${reportEventStats.yellow.totalMinutes} min)</p>`;
        }
        if (reportEventStats.orange.count > 0) {
            eventHtml += `<p class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400"></span>${i18n.t('report_orange')}: ${reportEventStats.orange.count} (${reportEventStats.orange.totalMinutes} min)</p>`;
        }
        if (reportEventStats.red.count > 0) {
            eventHtml += `<p class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span>${i18n.t('report_red')}: ${reportEventStats.red.count} (${reportEventStats.red.totalMinutes} min)</p>`;
        }
        eventStatsContainer.innerHTML = eventHtml;
    } else {
        eventStatsContainer.innerHTML = `<p class="text-green-600">${i18n.t('report_noThresholdViolations')}</p>`;
    }

    // Display GI 2.0 status
    const statusClasses = {
        pass: 'text-green-600',
        warning: 'text-yellow-600',
        fail: 'text-red-600',
        unknown: 'text-gray-400'
    };
    const statusLabels = {
        pass: i18n.t('report_gi2Pass'),
        warning: i18n.t('report_gi2Warning'),
        fail: i18n.t('report_gi2Fail'),
        unknown: i18n.t('report_gi2Unknown')
    };

    gi2StatusContainer.innerHTML = `
        <span class="${statusClasses[reportGI2Status.status]}">${statusLabels[reportGI2Status.status]}</span>
        <span class="text-xs text-gray-500 ml-2">${reportGI2Status.reason}</span>
    `;
}

/**
 * Get selected device serial numbers from rooms
 * @returns {Promise<Array<string>>} Selected device serials
 */
export async function getSelectedReportDevices() {
    const location = await getCurrentReportLocation();
    if (!location || !location.rooms) return [];

    // Get unique device serials from rooms
    const serials = location.rooms
        .map(room => room.deviceSerial)
        .filter(serial => serial && serial.length > 0);

    return [...new Set(serials)];
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
    const selectedDevices = await getSelectedReportDevices();
    const metadataList = await getAllDeviceMetadata();

    const metadataMap = {};
    metadataList.forEach(m => {
        metadataMap[m.serial] = m;
    });

    return selectedDevices.map(serial => {
        const metadata = metadataMap[serial];
        return getDeviceDisplayName(metadata, serial);
    });
}

// ============================================
// Logo Upload & Provider Data Functions
// ============================================

const PROVIDER_STORAGE_KEY = 'reportProviderData';
const LOGO_STORAGE_KEY = 'reportCompanyLogo';
const MAX_LOGO_SIZE = 500 * 1024; // 500KB

/**
 * Initialize logo upload handlers
 */
export function initLogoUpload() {
    const uploadBtn = document.getElementById('logo-upload-btn');
    const uploadInput = document.getElementById('logo-upload');
    const removeBtn = document.getElementById('logo-remove-btn');

    uploadBtn?.addEventListener('click', () => uploadInput?.click());

    uploadInput?.addEventListener('change', handleLogoUpload);

    removeBtn?.addEventListener('click', handleLogoRemove);

    // Load saved logo
    loadSavedLogo();
}

/**
 * Handle logo file upload
 */
async function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError(i18n.t('report_logo_invalid_type'));
        return;
    }

    // Validate file size
    if (file.size > MAX_LOGO_SIZE) {
        showError(i18n.t('report_logo_too_large'));
        return;
    }

    try {
        const dataUrl = await fileToDataUrl(file);
        saveLogo(dataUrl);
        displayLogo(dataUrl);
        // Preview update will be triggered by the orchestrator if needed
    } catch (error) {
        console.error('Failed to upload logo:', error);
        showError('Failed to upload logo');
    }
}

/**
 * Convert file to data URL
 */
export function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

/**
 * Save logo to localStorage
 */
function saveLogo(dataUrl) {
    try {
        localStorage.setItem(LOGO_STORAGE_KEY, dataUrl);
    } catch (error) {
        console.error('Failed to save logo to localStorage:', error);
    }
}

/**
 * Load saved logo from localStorage
 */
function loadSavedLogo() {
    try {
        const dataUrl = localStorage.getItem(LOGO_STORAGE_KEY);
        if (dataUrl) {
            displayLogo(dataUrl);
        }
    } catch (error) {
        console.error('Failed to load logo from localStorage:', error);
    }
}

/**
 * Display logo in preview
 */
function displayLogo(dataUrl) {
    const preview = document.getElementById('logo-preview');
    const placeholder = document.getElementById('logo-placeholder');
    const removeBtn = document.getElementById('logo-remove-btn');

    if (preview && dataUrl) {
        preview.src = dataUrl;
        preview.classList.remove('hidden');
        placeholder?.classList.add('hidden');
        removeBtn?.classList.remove('hidden');
    }
}

/**
 * Handle logo removal
 */
function handleLogoRemove() {
    localStorage.removeItem(LOGO_STORAGE_KEY);

    const preview = document.getElementById('logo-preview');
    const placeholder = document.getElementById('logo-placeholder');
    const removeBtn = document.getElementById('logo-remove-btn');
    const uploadInput = document.getElementById('logo-upload');

    preview?.classList.add('hidden');
    preview.src = '';
    placeholder?.classList.remove('hidden');
    removeBtn?.classList.add('hidden');

    // Clear file input
    if (uploadInput) uploadInput.value = '';
}

/**
 * Get current logo data URL
 */
export function getLogoDataUrl() {
    try {
        return localStorage.getItem(LOGO_STORAGE_KEY) || null;
    } catch {
        return null;
    }
}

/**
 * Save provider data to localStorage
 */
export function saveProviderData() {
    const data = {
        organization: document.getElementById('report-org')?.value || '',
        author: document.getElementById('report-author')?.value || '',
        contact: document.getElementById('report-contact')?.value || ''
    };

    try {
        localStorage.setItem(PROVIDER_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save provider data:', error);
    }
}

/**
 * Load saved provider data from localStorage
 */
export function loadSavedProviderData() {
    try {
        const stored = localStorage.getItem(PROVIDER_STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            if (data.organization) {
                document.getElementById('report-org').value = data.organization;
            }
            if (data.author) {
                document.getElementById('report-author').value = data.author;
            }
            if (data.contact) {
                document.getElementById('report-contact').value = data.contact;
            }
        }
    } catch (error) {
        console.error('Failed to load provider data:', error);
    }
}
