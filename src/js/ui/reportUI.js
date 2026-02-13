/**
 * Report UI Module
 * Handles report page functions
 */

import { i18n } from '../i18n.js';
import {
    getDatabaseStats,
    getAllDeviceMetadata,
    getDeviceDisplayName,
    saveReportLocation,
    getReportLocation,
    getAllReportLocations,
    deleteReportLocation,
    addRoomToLocation,
    updateRoomInLocation,
    deleteRoomFromLocation
} from '../storage.js';
import {
    computeStatistics,
    computeEventStats,
    computeGI2Compliance,
    computeRoomStats,
    renderReportPreview,
    generatePDF,
    getLogsForReport
} from '../report.js';
import { generateReportMarkdown, parseAnalysisResponse } from '../reportData.js';
import * as state from './state.js';
import { showError } from './utils.js';
import { escapeHtmlAttr } from './utils.js';

// Location/Room state
let currentLocationId = null;
let currentEditingRoomId = null;

// Building photo state
let currentBuildingPhotoDataUrl = null;
const MAX_BUILDING_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

/**
 * Initialize report page
 */
export async function initReportPage() {
    await setReportDateDefaults();
    initLocationRoomUI();
    await populateLocationSummary();
    initLogoUpload();
    loadSavedProviderData();
    initEditableStateDefaults();
    // Compute initial stats and preview
    await handleReportSelectionChange();
}

/**
 * Initialize default state values for editable report fields
 */
function initEditableStateDefaults() {
    if (!state.get('reportIntro')) state.set('reportIntro', i18n.t('report_intro_default'));
    if (!state.get('reportLegal')) state.set('reportLegal', i18n.t('report_intro_legal_default'));
    if (!state.get('reportFindings')) state.set('reportFindings', []);
    if (!state.get('reportRecommendations')) state.set('reportRecommendations', []);
}

/**
 * Setup report event handlers
 */
export function setupReportEventHandlers() {
    // Date range change
    document.getElementById('report-date-start').addEventListener('change', handleReportSelectionChange);
    document.getElementById('report-date-end').addEventListener('change', handleReportSelectionChange);

    // GI 2.0 override change
    document.getElementById('report-gi2-override').addEventListener('change', updateReportPreview);

    // Provider fields change (with save to localStorage)
    document.getElementById('report-org').addEventListener('input', () => {
        saveProviderData();
        updateReportPreview();
    });
    document.getElementById('report-author').addEventListener('input', () => {
        saveProviderData();
        updateReportPreview();
    });
    document.getElementById('report-contact').addEventListener('input', () => {
        saveProviderData();
        updateReportPreview();
    });

    // Title change
    document.getElementById('report-title').addEventListener('input', updateReportPreview);

    // Generate PDF button
    document.getElementById('generate-pdf-btn').addEventListener('click', handleGeneratePDF);

    // AI Analysis button
    document.getElementById('ai-analysis-btn').addEventListener('click', handleAIAnalysis);

    // Reset button
    document.getElementById('reset-report-btn').addEventListener('click', handleResetReport);

    // Event delegation on report preview for inline editing
    const preview = document.getElementById('report-preview');
    if (preview) {
        // Update state on input in contenteditable elements
        preview.addEventListener('input', (e) => {
            const el = e.target.closest('[data-editable]');
            if (!el) return;
            const field = el.dataset.editable;
            if (field === 'report-intro') {
                state.set('reportIntro', el.innerText);
            } else if (field === 'report-legal') {
                state.set('reportLegal', el.innerText);
            } else if (field === 'report-summary') {
                state.set('reportAISummary', el.innerText);
            } else if (field === 'report-findings' || field === 'report-recommendations') {
                const stateKey = field === 'report-findings' ? 'reportFindings' : 'reportRecommendations';
                const cells = preview.querySelectorAll(`[data-editable="${field}"]`);
                state.set(stateKey, Array.from(cells).map(c => c.innerText.trim()).filter(Boolean));
            }
        });

        // Add/remove buttons
        preview.addEventListener('click', (e) => {
            const addBtn = e.target.closest('[data-add]');
            if (addBtn) {
                const field = addBtn.dataset.add;
                const stateKey = field === 'report-findings' ? 'reportFindings' : 'reportRecommendations';
                const arr = state.get(stateKey) || [];
                arr.push('');
                state.set(stateKey, arr);
                updateReportPreview().then(() => {
                    // Focus the new empty cell
                    const cells = preview.querySelectorAll(`[data-editable="${field}"]`);
                    const lastCell = cells[cells.length - 1];
                    if (lastCell) lastCell.focus();
                });
                return;
            }
            const removeBtn = e.target.closest('[data-remove]');
            if (removeBtn) {
                const field = removeBtn.dataset.remove;
                const index = parseInt(removeBtn.dataset.index, 10);
                const stateKey = field === 'report-findings' ? 'reportFindings' : 'reportRecommendations';
                const arr = state.get(stateKey) || [];
                arr.splice(index, 1);
                state.set(stateKey, arr);
                updateReportPreview();
                return;
            }
        });

        // Force plain text on paste
        preview.addEventListener('paste', (e) => {
            if (e.target.closest('[contenteditable]')) {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
            }
        });

        // Prevent Enter in single-line fields (defensive)
        preview.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.closest('[contenteditable]')) {
                const el = e.target.closest('[data-editable]');
                // Allow Enter in multi-line text fields (intro, legal)
                if (el && (el.dataset.editable === 'report-intro' || el.dataset.editable === 'report-legal' || el.dataset.editable === 'report-summary')) {
                    return;
                }
                e.preventDefault();
            }
        });
    }

    // Help page: analysis server URL setting
    const analysisUrlInput = document.getElementById('setting-analysis-url');
    if (analysisUrlInput) {
        analysisUrlInput.value = localStorage.getItem('reportAnalysisUrl') || '';
        analysisUrlInput.addEventListener('input', () => {
            const val = analysisUrlInput.value.trim();
            if (val) {
                localStorage.setItem('reportAnalysisUrl', val);
            } else {
                localStorage.removeItem('reportAnalysisUrl');
            }
        });
    }
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

/**
 * Capture current contenteditable values into state before re-render
 */
function captureEditableContent() {
    const intro = document.querySelector('[data-editable="report-intro"]');
    if (intro) state.set('reportIntro', intro.innerText);
    const legal = document.querySelector('[data-editable="report-legal"]');
    if (legal) state.set('reportLegal', legal.innerText);
    const summary = document.querySelector('[data-editable="report-summary"]');
    if (summary) state.set('reportAISummary', summary.innerText);
    // Findings/recs: collect all cells
    for (const field of ['report-findings', 'report-recommendations']) {
        const cells = document.querySelectorAll(`[data-editable="${field}"]`);
        if (cells.length > 0) {
            const stateKey = field === 'report-findings' ? 'reportFindings' : 'reportRecommendations';
            state.set(stateKey, Array.from(cells).map(c => c.innerText.trim()).filter(Boolean));
        }
    }
}

/**
 * Update report preview
 */
export async function updateReportPreview() {
    // Capture edits from DOM before replacing innerHTML
    captureEditableContent();

    const previewContainer = document.getElementById('report-preview');

    const organization = document.getElementById('report-org').value;
    const author = document.getElementById('report-author').value;
    const contact = document.getElementById('report-contact').value;
    const title = document.getElementById('report-title').value;
    const gi2Override = document.getElementById('report-gi2-override').value;
    const logoUrl = getLogoDataUrl();

    // Read from state
    const introText = state.get('reportIntro') || '';
    const legalText = state.get('reportLegal') || '';
    const findings = state.get('reportFindings') || [];
    const recommendations = state.get('reportRecommendations') || [];

    const { startDate, endDate } = getReportDateRange();
    const deviceNames = await getSelectedDeviceNames();

    const reportStats = state.get('reportStats');
    const reportEventStats = state.get('reportEventStats');
    const reportGI2Status = state.get('reportGI2Status');
    const roomStats = state.get('reportRoomStats') || [];

    // Get building location data
    const buildingLocation = await getCurrentReportLocation();

    const html = renderReportPreview({
        organization,
        author,
        contact,
        logoUrl,
        title,
        buildingLocation,
        buildingPhotoUrl: buildingLocation?.buildingPhotoDataUrl || null,
        introText,
        legalText,
        stats: reportStats,
        eventStats: reportEventStats,
        gi2Status: reportGI2Status,
        gi2Override,
        findings,
        recommendations,
        executiveSummaryExtra: state.get('reportAISummary') || '',
        dateStart: startDate.getTime(),
        dateEnd: endDate.getTime(),
        deviceNames,
        roomStats
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
    btn.textContent = i18n.t('report_generating');

    try {
        const previewElement = document.getElementById('report-preview').firstElementChild;
        if (!previewElement) {
            throw new Error(i18n.t('report_noPreview'));
        }

        // Clean up contenteditable and no-print elements for PDF
        const editables = previewElement.querySelectorAll('[contenteditable]');
        editables.forEach(el => el.removeAttribute('contenteditable'));
        const noPrintEls = previewElement.querySelectorAll('.no-print');
        noPrintEls.forEach(el => el.style.display = 'none');

        const title = document.getElementById('report-title').value || 'Air-Quality-Report';
        const filename = `${title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

        const buildingLocation = await getCurrentReportLocation();
        await generatePDF(previewElement, filename, {
            organization: document.getElementById('report-org')?.value || '',
            contact: document.getElementById('report-contact')?.value || '',
            city: buildingLocation?.city || ''
        });

        // Restore contenteditable and no-print after PDF generation
        editables.forEach(el => el.setAttribute('contenteditable', 'true'));
        noPrintEls.forEach(el => el.style.display = '');

        btn.textContent = i18n.t('report_generated');
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
 * Handle AI Analysis button click - sends report data to analysis server
 */
export async function handleAIAnalysis() {
    const btn = document.getElementById('ai-analysis-btn');
    const originalHTML = btn.innerHTML;

    const analysisUrl = localStorage.getItem('reportAnalysisUrl');
    if (!analysisUrl) {
        btn.textContent = i18n.t('report_aiNoUrl');
        setTimeout(() => { btn.innerHTML = originalHTML; }, 3000);
        return;
    }

    btn.disabled = true;
    btn.textContent = i18n.t('report_aiAnalyzing');

    try {
        const selectedDevices = await getSelectedReportDevices();
        const { startTimestamp, endTimestamp, startDate, endDate } = getReportDateRange();

        const rawLogs = selectedDevices.length > 0
            ? await getLogsForReport(selectedDevices, startTimestamp, endTimestamp)
            : [];

        const organization = document.getElementById('report-org').value;
        const author = document.getElementById('report-author').value;
        const contact = document.getElementById('report-contact').value;
        const title = document.getElementById('report-title').value;
        const gi2Override = document.getElementById('report-gi2-override').value;

        const reportStats = state.get('reportStats');
        const reportEventStats = state.get('reportEventStats');
        const reportGI2Status = state.get('reportGI2Status');
        const roomStats = state.get('reportRoomStats') || [];
        const buildingLocation = await getCurrentReportLocation();

        const markdown = generateReportMarkdown({
            organization, author, contact, title, buildingLocation,
            stats: reportStats,
            eventStats: reportEventStats,
            gi2Status: reportGI2Status,
            gi2Override,
            findings: [],
            recommendations: [],
            dateStart: startDate.getTime(),
            dateEnd: endDate.getTime(),
            roomStats,
            rawLogs
        });

        const response = await fetch(analysisUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markdown })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const text = await response.text();
        const result = parseAnalysisResponse(text);

        // Store AI results into state
        if (result.summary) {
            state.set('reportAISummary', result.summary);
        }
        if (result.findings.length > 0) {
            state.set('reportFindings', result.findings);
        }
        if (result.recommendations.length > 0) {
            state.set('reportRecommendations', result.recommendations);
        }

        // Trigger preview update
        await updateReportPreview();

        btn.textContent = i18n.t('report_aiDone');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('AI analysis failed:', error);
        btn.textContent = i18n.t('report_aiError');
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 3000);
    }
}

/**
 * Handle reset button click
 */
export async function handleResetReport() {
    // Reset report-specific fields (not provider data which persists)
    document.getElementById('report-title').value = 'Indoor Air Quality Audit';
    document.getElementById('report-gi2-override').value = 'auto';

    // Reset editable state to defaults
    state.set('reportIntro', i18n.t('report_intro_default'));
    state.set('reportLegal', i18n.t('report_intro_legal_default'));
    state.set('reportFindings', []);
    state.set('reportRecommendations', []);
    state.set('reportAISummary', '');

    // Reset dates to defaults
    await setReportDateDefaults();

    // Refresh stats and preview
    await handleReportSelectionChange();
}

// ============================================
// Location & Room UI Functions
// ============================================

/**
 * Generate a UUID
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Initialize location and room UI
 */
export function initLocationRoomUI() {
    // Location modal buttons
    document.getElementById('add-location-btn')?.addEventListener('click', () => openLocationModal());
    document.getElementById('save-location-btn')?.addEventListener('click', handleSaveLocation);
    document.getElementById('cancel-location-btn')?.addEventListener('click', closeLocationModal);
    document.getElementById('delete-location-btn')?.addEventListener('click', handleDeleteLocation);

    // Room modal buttons
    document.getElementById('add-room-btn')?.addEventListener('click', () => openRoomModal());
    document.getElementById('save-room-btn')?.addEventListener('click', handleSaveRoom);
    document.getElementById('cancel-room-btn')?.addEventListener('click', closeRoomModal);

    // Smoking distance toggle
    document.getElementById('room-smoking-policy')?.addEventListener('change', (e) => {
        document.getElementById('room-smoking-distance-group')
            ?.classList.toggle('hidden', e.target.value !== 'nearby');
    });

    // Building photo upload
    initBuildingPhotoUpload();

    // Initialize location summary
    populateLocationSummary();
}

/**
 * Open location modal
 * @param {string|null} editId - Location ID to edit, or null for new
 */
export async function openLocationModal(editId = null) {
    const modal = document.getElementById('location-modal');
    const deleteBtn = document.getElementById('delete-location-btn');

    if (editId) {
        // Edit existing location
        const location = await getReportLocation(editId);
        if (location) {
            currentLocationId = editId;
            document.getElementById('loc-name').value = location.name || '';
            document.getElementById('loc-street').value = location.street || '';
            document.getElementById('loc-postal').value = location.postalCode || '';
            document.getElementById('loc-city').value = location.city || '';
            document.getElementById('loc-canton').value = location.canton || '';
            document.getElementById('loc-egid').value = location.egid || '';
            document.getElementById('loc-gps').value = location.gpsCoordinates || '';
            document.getElementById('loc-category').value = location.buildingCategory || 'single_family';
            document.getElementById('loc-year').value = location.constructionYear || '';
            document.getElementById('loc-renovation').value = location.lastRenovation || '';
            document.getElementById('loc-foundation').value = location.foundationStructure || 'concrete';
            document.getElementById('loc-basement').value = location.basement || 'full';
            document.getElementById('loc-hillside').checked = location.hillsideLocation || false;
            document.getElementById('loc-ventilation').value = location.ventilationType || 'natural';
            document.getElementById('loc-ventilation-details').value = location.ventilationDetails || '';
            // Load building photo
            currentBuildingPhotoDataUrl = location.buildingPhotoDataUrl || null;
            displayBuildingPhoto(currentBuildingPhotoDataUrl);
            deleteBtn.classList.remove('hidden');
        }
    } else {
        // New location
        currentLocationId = null;
        document.getElementById('loc-name').value = '';
        document.getElementById('loc-street').value = '';
        document.getElementById('loc-postal').value = '';
        document.getElementById('loc-city').value = '';
        document.getElementById('loc-canton').value = '';
        document.getElementById('loc-egid').value = '';
        document.getElementById('loc-gps').value = '';
        document.getElementById('loc-category').value = 'single_family';
        document.getElementById('loc-year').value = '';
        document.getElementById('loc-renovation').value = '';
        document.getElementById('loc-foundation').value = 'concrete';
        document.getElementById('loc-basement').value = 'full';
        document.getElementById('loc-hillside').checked = false;
        document.getElementById('loc-ventilation').value = 'natural';
        document.getElementById('loc-ventilation-details').value = '';
        // Clear building photo
        currentBuildingPhotoDataUrl = null;
        displayBuildingPhoto(null);
        deleteBtn.classList.add('hidden');
    }

    modal.classList.remove('hidden');
}

/**
 * Close location modal
 */
export function closeLocationModal() {
    document.getElementById('location-modal').classList.add('hidden');
    currentLocationId = null;
}

/**
 * Handle save location
 */
export async function handleSaveLocation() {
    const location = {
        id: currentLocationId || generateUUID(),
        name: document.getElementById('loc-name').value,
        street: document.getElementById('loc-street').value,
        postalCode: document.getElementById('loc-postal').value,
        city: document.getElementById('loc-city').value,
        canton: document.getElementById('loc-canton').value,
        egid: document.getElementById('loc-egid').value,
        gpsCoordinates: document.getElementById('loc-gps').value,
        buildingCategory: document.getElementById('loc-category').value,
        constructionYear: document.getElementById('loc-year').value,
        lastRenovation: document.getElementById('loc-renovation').value,
        foundationStructure: document.getElementById('loc-foundation').value,
        basement: document.getElementById('loc-basement').value,
        hillsideLocation: document.getElementById('loc-hillside').checked,
        ventilationType: document.getElementById('loc-ventilation').value,
        ventilationDetails: document.getElementById('loc-ventilation-details').value,
        buildingPhotoDataUrl: currentBuildingPhotoDataUrl,
        rooms: []
    };

    // Preserve existing rooms if editing
    if (currentLocationId) {
        const existing = await getReportLocation(currentLocationId);
        if (existing && existing.rooms) {
            location.rooms = existing.rooms;
        }
    }

    try {
        await saveReportLocation(location);
        closeLocationModal();
        await populateLocationSummary();
        await handleReportSelectionChange(); // Recompute stats
    } catch (error) {
        console.error('Failed to save location:', error);
        showError('Failed to save location: ' + error.message);
    }
}

/**
 * Handle delete location
 */
export async function handleDeleteLocation() {
    if (!currentLocationId) return;

    if (!confirm(i18n.t('location_delete_confirm'))) {
        return;
    }

    try {
        await deleteReportLocation(currentLocationId);
        closeLocationModal();
        await populateLocationSummary();
        await handleReportSelectionChange(); // Clear stats
    } catch (error) {
        console.error('Failed to delete location:', error);
        showError('Failed to delete location: ' + error.message);
    }
}

/**
 * Populate location summary in report panel
 */
export async function populateLocationSummary() {
    const container = document.getElementById('report-location-summary');
    const roomsSection = document.getElementById('rooms-section');
    const locations = await getAllReportLocations();

    if (locations.length === 0) {
        container.innerHTML = `
            <button id="add-location-btn" class="w-full border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 py-2 px-3 rounded text-sm flex items-center justify-center gap-2 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span data-i18n="location_add_building">${i18n.t('location_add_building')}</span>
            </button>
        `;
        document.getElementById('add-location-btn').addEventListener('click', () => openLocationModal());
        roomsSection?.classList.add('hidden');
        return;
    }

    // Use first location (single location per report)
    const location = locations[0];
    state.set('currentReportLocationId', location.id);

    const displayAddress = [location.street, location.postalCode, location.city].filter(Boolean).join(', ');

    container.innerHTML = `
        <div class="border border-gray-200 rounded p-3 bg-gray-50">
            <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-800 truncate">${escapeHtmlAttr(location.name) || i18n.t('location_unnamed')}</p>
                    ${displayAddress ? `<p class="text-sm text-gray-500 truncate">${escapeHtmlAttr(displayAddress)}</p>` : ''}
                    <p class="text-xs text-gray-400 mt-1">${i18n.t('building_' + location.buildingCategory)}</p>
                </div>
                <button id="edit-location-btn" class="p-1 text-gray-400 hover:text-blue-500" title="${i18n.t('action_edit')}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    document.getElementById('edit-location-btn').addEventListener('click', () => openLocationModal(location.id));

    // Show rooms section
    roomsSection?.classList.remove('hidden');
    await populateRoomsList(location);
}

/**
 * Populate rooms list
 * @param {Object} location - Location object with rooms
 */
export async function populateRoomsList(location) {
    const container = document.getElementById('report-rooms-list');

    if (!location.rooms || location.rooms.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-xs italic">${i18n.t('room_none_added')}</p>`;
        return;
    }

    const metadataList = await getAllDeviceMetadata();
    const metadataMap = {};
    metadataList.forEach(m => { metadataMap[m.serial] = m; });

    let html = '';
    for (const room of location.rooms) {
        const deviceName = room.deviceSerial
            ? (metadataMap[room.deviceSerial]?.name || room.deviceSerial)
            : '-';

        // Build dimensions string
        const dims = [];
        if (room.area) dims.push(`${room.area} m²`);
        if (room.ceilingHeight) dims.push(`${i18n.t('room_ceiling_abbr')} ${room.ceilingHeight}m`);
        if (room.sensorHeight) dims.push(`${i18n.t('room_sensor_abbr')} ${room.sensorHeight}m`);
        const dimsStr = dims.length > 0 ? dims.join(', ') : '';

        html += `
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-700 text-sm truncate">${escapeHtmlAttr(room.name) || i18n.t('room_unnamed')}</p>
                    <p class="text-xs text-gray-500">${room.floor ? room.floor + ' - ' : ''}${i18n.t('room_' + room.roomType)}${room.occupancy ? ' - ' + i18n.t('room_occupancy_' + room.occupancy) : (room.regularOccupancy ? ' - ' + i18n.t('room_occupied') : '')}${dimsStr ? ' - ' + dimsStr : ''}</p>
                    <p class="text-xs text-gray-400">${i18n.t('room_device')}: ${escapeHtmlAttr(deviceName)}</p>
                </div>
                <div class="flex items-center gap-1">
                    <button class="edit-room-btn p-1 text-gray-400 hover:text-blue-500" data-room-id="${room.id}" title="${i18n.t('action_edit')}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                    <button class="delete-room-btn p-1 text-gray-400 hover:text-red-500" data-room-id="${room.id}" title="${i18n.t('action_delete')}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;

    // Attach event listeners
    container.querySelectorAll('.edit-room-btn').forEach(btn => {
        btn.addEventListener('click', () => openRoomModal(btn.dataset.roomId));
    });
    container.querySelectorAll('.delete-room-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteRoom(btn.dataset.roomId));
    });
}

/**
 * Populate device select for room modal
 */
export async function populateDeviceSelectForRoom() {
    const select = document.getElementById('room-device');
    const stats = await getDatabaseStats();
    const metadataList = await getAllDeviceMetadata();

    const metadataMap = {};
    metadataList.forEach(m => { metadataMap[m.serial] = m; });

    let html = `<option value="">${i18n.t('room_no_device')}</option>`;
    for (const serial of stats.devices) {
        const name = metadataMap[serial]?.name || serial;
        html += `<option value="${serial}">${escapeHtmlAttr(name)}</option>`;
    }

    select.innerHTML = html;
}

/**
 * Open room modal
 * @param {string|null} editId - Room ID to edit, or null for new
 */
export async function openRoomModal(editId = null) {
    const modal = document.getElementById('room-modal');
    const title = document.getElementById('room-modal-title');

    await populateDeviceSelectForRoom();

    const locationId = state.get('currentReportLocationId');
    if (!locationId) {
        showError('Please add a building first');
        return;
    }

    if (editId) {
        // Edit existing room
        title.textContent = i18n.t('room_edit_title');
        currentEditingRoomId = editId;

        const location = await getReportLocation(locationId);
        const room = location?.rooms?.find(r => r.id === editId);

        if (room) {
            document.getElementById('room-name').value = room.name || '';
            document.getElementById('room-floor').value = room.floor || '';
            document.getElementById('room-type').value = room.roomType || 'living_room';
            document.getElementById('room-area').value = room.area || '';
            document.getElementById('room-ceiling').value = room.ceilingHeight || '';
            document.getElementById('room-sensor-height').value = room.sensorHeight || '';
            document.getElementById('room-device').value = room.deviceSerial || '';
            document.getElementById('room-ventilation').value = room.roomVentilation || 'windows_mechanical';
            const smokingPolicy = room.smokingPolicy || 'none';
            document.getElementById('room-smoking-policy').value = smokingPolicy;
            document.getElementById('room-smoking-distance-group')
                .classList.toggle('hidden', smokingPolicy !== 'nearby');
            document.getElementById('room-smoking-distance').value = room.smokingDistance || 'lt5';
            // Known issues checkboxes
            const knownIssues = room.knownIssues || [];
            document.querySelectorAll('.room-known-issue').forEach(cb => {
                cb.checked = knownIssues.includes(cb.value);
            });
            document.getElementById('room-occupancy').value = room.occupancy || (room.regularOccupancy ? '1to2' : 'unoccupied');
            document.getElementById('room-notes').value = room.notes || '';
        }
    } else {
        // New room
        title.textContent = i18n.t('room_add_title');
        currentEditingRoomId = null;

        document.getElementById('room-name').value = '';
        document.getElementById('room-floor').value = '';
        document.getElementById('room-type').value = 'living_room';
        document.getElementById('room-area').value = '';
        document.getElementById('room-ceiling').value = '';
        document.getElementById('room-sensor-height').value = '';
        document.getElementById('room-device').value = '';
        document.getElementById('room-ventilation').value = 'windows_mechanical';
        document.getElementById('room-smoking-policy').value = 'none';
        document.getElementById('room-smoking-distance-group').classList.add('hidden');
        document.getElementById('room-smoking-distance').value = 'lt5';
        document.querySelectorAll('.room-known-issue').forEach(cb => { cb.checked = false; });
        document.getElementById('room-occupancy').value = '1to2';
        document.getElementById('room-notes').value = '';
    }

    modal.classList.remove('hidden');
}

/**
 * Close room modal
 */
export function closeRoomModal() {
    document.getElementById('room-modal').classList.add('hidden');
    currentEditingRoomId = null;
}

/**
 * Handle save room
 */
export async function handleSaveRoom() {
    const locationId = state.get('currentReportLocationId');
    if (!locationId) return;

    const smokingPolicy = document.getElementById('room-smoking-policy').value;
    const occupancy = document.getElementById('room-occupancy').value;

    const room = {
        id: currentEditingRoomId || generateUUID(),
        name: document.getElementById('room-name').value,
        floor: document.getElementById('room-floor').value,
        roomType: document.getElementById('room-type').value,
        area: parseFloat(document.getElementById('room-area').value) || null,
        ceilingHeight: parseFloat(document.getElementById('room-ceiling').value) || null,
        sensorHeight: parseFloat(document.getElementById('room-sensor-height').value) || null,
        deviceSerial: document.getElementById('room-device').value,
        roomVentilation: document.getElementById('room-ventilation').value,
        smokingPolicy: smokingPolicy,
        smokingDistance: smokingPolicy === 'nearby' ? document.getElementById('room-smoking-distance').value : null,
        knownIssues: Array.from(document.querySelectorAll('.room-known-issue:checked')).map(cb => cb.value),
        occupancy: occupancy,
        regularOccupancy: occupancy !== 'unoccupied',
        notes: document.getElementById('room-notes').value
    };

    try {
        if (currentEditingRoomId) {
            await updateRoomInLocation(locationId, currentEditingRoomId, room);
        } else {
            await addRoomToLocation(locationId, room);
        }

        closeRoomModal();
        await populateLocationSummary();
        await handleReportSelectionChange(); // Recompute stats with new device
    } catch (error) {
        console.error('Failed to save room:', error);
        showError('Failed to save room: ' + error.message);
    }
}

/**
 * Handle delete room
 * @param {string} roomId - Room ID to delete
 */
export async function handleDeleteRoom(roomId) {
    const locationId = state.get('currentReportLocationId');
    if (!locationId) return;

    if (!confirm(i18n.t('room_delete_confirm'))) {
        return;
    }

    try {
        await deleteRoomFromLocation(locationId, roomId);
        await populateLocationSummary();
        await handleReportSelectionChange(); // Recompute stats without deleted device
    } catch (error) {
        console.error('Failed to delete room:', error);
        showError('Failed to delete room: ' + error.message);
    }
}

/**
 * Get current report location with rooms
 * @returns {Promise<Object|null>} Location object or null
 */
export async function getCurrentReportLocation() {
    const locationId = state.get('currentReportLocationId');
    if (!locationId) return null;
    return await getReportLocation(locationId);
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
        updateReportPreview();
    } catch (error) {
        console.error('Failed to upload logo:', error);
        showError('Failed to upload logo');
    }
}

/**
 * Convert file to data URL
 */
function fileToDataUrl(file) {
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

    updateReportPreview();
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
function saveProviderData() {
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
function loadSavedProviderData() {
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

// ============================================
// Building Photo Upload Functions
// ============================================

/**
 * Initialize building photo upload handlers
 */
function initBuildingPhotoUpload() {
    const uploadBtn = document.getElementById('building-photo-upload-btn');
    const uploadInput = document.getElementById('building-photo-upload');
    const removeBtn = document.getElementById('building-photo-remove-btn');

    uploadBtn?.addEventListener('click', () => uploadInput?.click());
    uploadInput?.addEventListener('change', handleBuildingPhotoUpload);
    removeBtn?.addEventListener('click', removeBuildingPhoto);
}

/**
 * Handle building photo file upload
 */
async function handleBuildingPhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showError(i18n.t('location_photo_invalid_type'));
        return;
    }

    if (file.size > MAX_BUILDING_PHOTO_SIZE) {
        showError(i18n.t('location_photo_too_large'));
        return;
    }

    try {
        const dataUrl = await fileToDataUrl(file);
        currentBuildingPhotoDataUrl = dataUrl;
        displayBuildingPhoto(dataUrl);
    } catch (error) {
        console.error('Failed to upload building photo:', error);
    }
}

/**
 * Display building photo in preview
 * @param {string|null} dataUrl - Data URL or null to clear
 */
function displayBuildingPhoto(dataUrl) {
    const preview = document.getElementById('building-photo-preview');
    const placeholder = document.getElementById('building-photo-placeholder');
    const removeBtn = document.getElementById('building-photo-remove-btn');

    if (dataUrl) {
        preview.src = dataUrl;
        preview?.classList.remove('hidden');
        placeholder?.classList.add('hidden');
        removeBtn?.classList.remove('hidden');
    } else {
        preview.src = '';
        preview?.classList.add('hidden');
        placeholder?.classList.remove('hidden');
        removeBtn?.classList.add('hidden');
    }
}

/**
 * Remove building photo
 */
function removeBuildingPhoto() {
    currentBuildingPhotoDataUrl = null;
    displayBuildingPhoto(null);

    const uploadInput = document.getElementById('building-photo-upload');
    if (uploadInput) uploadInput.value = '';
}

