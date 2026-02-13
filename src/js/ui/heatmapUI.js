/**
 * Heatmap UI Module
 * Handles heatmap visualization rendering
 */

import { i18n } from '../i18n.js';
import { getAllLogs, getLogsByDevice, getDeviceMetadata, getDeviceDisplayName } from '../storage.js';
import { AIR_QUALITY_THRESHOLDS } from '../constants.js';
import { getDetectableMetrics } from '../deviceTypes.js';
import { generateHeatmapData, formatHeatmapTooltip } from '../heatmap.js';
import { listenKeys } from 'nanostores';
import { $state, $dataVersion } from './state.js';

const ALL_METRICS = getDetectableMetrics();

/**
 * Update heatmap with data for selected device — renders one panel per metric
 * @param {string|null} deviceSerial - Filter by device serial, or null for all devices
 */
export async function updateHeatmap(deviceSerial = null) {
    const container = document.getElementById('heatmap-container');
    if (!container) return;

    try {
        const logs = deviceSerial
            ? await getLogsByDevice(deviceSerial)
            : await getAllLogs();

        if (logs.length < 10) {
            container.innerHTML = `<p class="text-sm text-gray-500 text-center py-4">${i18n.t('heatmap_notEnoughData')}</p>`;
            return;
        }

        // Look up device display name for labels
        let deviceName = i18n.t('history_allDevices');
        if (deviceSerial) {
            const metadata = await getDeviceMetadata(deviceSerial);
            deviceName = getDeviceDisplayName(metadata, deviceSerial);
        }

        // Generate data for all metrics, keep only those with data
        const panels = [];
        for (const metric of ALL_METRICS) {
            const data = generateHeatmapData(logs, metric);
            if (data.grid.length > 0) {
                panels.push({ data, metric });
            }
        }

        if (panels.length === 0) {
            container.innerHTML = `<p class="text-sm text-gray-500 text-center py-4">${i18n.t('heatmap_notEnoughData')}</p>`;
            return;
        }

        // Render side-by-side panels
        container.innerHTML = panels
            .map(({ data, metric }) => renderHeatmapPanel(data, metric, deviceName))
            .join('');

        // Update subtitle with day count from first panel
        const subtitleEl = document.getElementById('heatmap-subtitle');
        if (subtitleEl) {
            subtitleEl.textContent = i18n.t('heatmap_subtitle_dynamic', { days: panels[0].data.numDays });
        }

    } catch (error) {
        console.error('Failed to update heatmap:', error);
        container.innerHTML = `<p class="text-sm text-red-500 text-center py-4">${i18n.t('heatmap_error')}</p>`;
    }
}

/**
 * Render a single heatmap panel (grid + legend + label) as an HTML string
 * @param {Object} data - Heatmap data from generateHeatmapData
 * @param {string} metric - Metric key ('pm25', 'pm10', 'co2')
 * @param {string} deviceName - Display name for the device
 * @returns {string} HTML string for one panel
 */
function renderHeatmapPanel(data, metric, deviceName) {
    const { grid, dayLabels, hourLabels, unit, label } = data;
    const numCols = hourLabels.length;

    let html = '<div class="heatmap-panel flex-1 min-w-0">';

    // Label (above grid)
    html += `<div class="text-xs text-gray-500 text-center mb-2">${label} — ${deviceName}</div>`;

    // Grid
    html += `<div class="heatmap-grid text-xs" style="display: grid; grid-template-columns: auto repeat(${numCols}, 12px); gap: 1px; align-items: center; width: fit-content; margin: 0 auto;">`;

    // Header row: empty cell + hour labels
    html += '<div></div>';
    for (const hour of hourLabels) {
        html += `<div class="text-center text-gray-400 text-[10px]">${hour.label}</div>`;
    }

    // Data rows (one per day)
    for (let r = 0; r < grid.length; r++) {
        const row = grid[r];
        const dayLabel = dayLabels[r].label;

        // Date label
        html += `<div class="text-right text-gray-400 pr-2 whitespace-nowrap">${dayLabel}</div>`;

        // Hour cells
        for (const cell of row) {
            const tooltip = formatHeatmapTooltip(cell, unit, dayLabels, hourLabels);
            html += `<div class="rounded-sm cursor-help"
                         style="background-color: ${cell.color}; aspect-ratio: 1;"
                         title="${tooltip}"></div>`;
        }
    }

    html += '</div>';

    // Legend
    html += renderHeatmapLegendHTML(metric);

    html += '</div>';
    return html;
}

/**
 * Render heatmap legend as HTML string
 * @param {string} metric - Metric being displayed
 * @returns {string} HTML string for the legend
 */
function renderHeatmapLegendHTML(metric) {
    const config = AIR_QUALITY_THRESHOLDS[metric];
    if (!config) return '';

    const levels = config.levels;

    return `
        <div class="mt-3 flex items-center justify-center gap-1 text-xs text-gray-400">
            <span>0</span>
            <div class="w-3 h-3 rounded-sm" style="background-color: #f3f4f6;" title="${i18n.t('heatmap_noData')}"></div>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.good.color};" title="${i18n.t('heatmap_good')} (<${levels.good.max})"></div>
            <span>${levels.good.max}</span>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.yellow.color};" title="${i18n.t('heatmap_moderate')} (${levels.good.max}-${levels.yellow.max})"></div>
            <span>${levels.yellow.max}</span>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.orange.color};" title="${i18n.t('heatmap_poor')} (${levels.yellow.max}-${levels.orange.max})"></div>
            <span>${levels.orange.max}</span>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.red.color};" title="${i18n.t('heatmap_unhealthy')} (>${levels.orange.max})"></div>
            <span class="ml-1">${config.unit}</span>
        </div>
    `;
}


// ── Reactive subscriptions ────────────────────────────────────────────

listenKeys($state, ['historyDeviceSerial'], (value) => {
    updateHeatmap(value.historyDeviceSerial);
});

$dataVersion.listen(() => {
    updateHeatmap($state.get().historyDeviceSerial);
});
