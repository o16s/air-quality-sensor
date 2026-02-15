/**
 * Report Preview Module
 * HTML preview rendering and PDF generation
 */

import { i18n } from '../shared/i18n.js';
import {
    renderReportPreview,
    generatePDF,
} from '../reporting/report.js';
import * as state from './state.js';
import { showError } from './utils.js';
import { getReportDateRange, getSelectedDeviceNames, getLogoDataUrl } from './reportForm.js';
import { getCurrentReportLocation } from './reportLocationsUI.js';

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
