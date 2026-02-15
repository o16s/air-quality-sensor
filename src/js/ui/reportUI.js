/**
 * Report UI Orchestrator
 * Wires together reportForm, reportLocationsUI, and reportPreview sub-modules.
 */

import { i18n } from '../shared/i18n.js';
import {
    getLogsForReport,
} from '../reporting/report.js';
import { generateReportMarkdown, parseAnalysisResponse } from '../reporting/reportData.js';
import * as state from './state.js';

// Sub-modules
import {
    setReportDateDefaults,
    initEditableStateDefaults,
    updateReportStats,
    getSelectedReportDevices,
    getReportDateRange,
    initLogoUpload,
    loadSavedProviderData,
    saveProviderData,
} from './reportForm.js';
import {
    initLocationRoomUI,
    populateLocationSummary,
    setOnLocationDataChanged,
    getCurrentReportLocation,
} from './reportLocationsUI.js';
import { updateReportPreview, handleGeneratePDF } from './reportPreview.js';

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

    // Wire location data changes to re-compute stats + preview
    setOnLocationDataChanged(handleReportSelectionChange);

    // Compute initial stats and preview
    await handleReportSelectionChange();
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
 * Handle report selection change (devices or dates)
 */
async function handleReportSelectionChange() {
    await updateReportStats();
    await updateReportPreview();
}

/**
 * Handle AI Analysis button click - sends report data to analysis server
 */
async function handleAIAnalysis() {
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
async function handleResetReport() {
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
