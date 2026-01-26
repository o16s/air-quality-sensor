/**
 * Heatmap UI Module
 * Handles heatmap visualization rendering
 */

import { i18n } from '../i18n.js';
import { getAllLogs, getLogsByDevice } from '../storage.js';
import { AIR_QUALITY_THRESHOLDS } from '../constants.js';
import { generateHeatmapData, formatHeatmapTooltip } from '../heatmap.js';

/**
 * Update heatmap with data for selected device and metric
 * @param {string|null} deviceSerial - Filter by device serial, or null for all devices
 * @param {string} metric - Metric to display: 'pm25', 'pm10', 'co2'
 */
export async function updateHeatmap(deviceSerial = null, metric = 'pm25') {
    const container = document.getElementById('heatmap-container');
    if (!container) return;

    try {
        const logs = deviceSerial
            ? await getLogsByDevice(deviceSerial)
            : await getAllLogs();

        if (logs.length < 10) {
            container.innerHTML = `<p class="text-sm text-gray-500 text-center py-4">${i18n.t('heatmap_notEnoughData')}</p>`;
            renderHeatmapLegend(metric);
            return;
        }

        const data = generateHeatmapData(logs, metric, { days: 14 });
        renderHeatmap(data);
        renderHeatmapLegend(metric);

    } catch (error) {
        console.error('Failed to update heatmap:', error);
        container.innerHTML = `<p class="text-sm text-red-500 text-center py-4">${i18n.t('heatmap_error')}</p>`;
    }
}

/**
 * Render heatmap grid
 * Grid: rows = days, columns = hours
 * Uses CSS grid to fill container width with square cells
 * @param {Object} data - Heatmap data from generateHeatmapData
 */
export function renderHeatmap(data) {
    const container = document.getElementById('heatmap-container');
    if (!container || !data.grid.length) return;

    const { grid, dayLabels, hourLabels, unit } = data;
    const numCols = hourLabels.length; // 24

    // CSS grid: date label column (auto) + 24 equal columns for hours
    let html = `<div class="heatmap-grid text-xs" style="display: grid; grid-template-columns: auto repeat(${numCols}, 1fr); gap: 2px; align-items: center;">`;

    // Header row: empty cell + hour labels
    html += '<div></div>'; // Empty corner
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
    container.innerHTML = html;
}

/**
 * Render heatmap legend showing color scale
 * @param {string} metric - Metric being displayed
 */
export function renderHeatmapLegend(metric) {
    const legendContainer = document.getElementById('heatmap-legend');
    if (!legendContainer) return;

    const config = AIR_QUALITY_THRESHOLDS[metric];
    if (!config) return;

    const levels = config.levels;

    legendContainer.innerHTML = `
        <span class="text-gray-400">${i18n.t('heatmap_less')}</span>
        <div class="flex items-center gap-1">
            <div class="w-3 h-3 rounded-sm" style="background-color: #f3f4f6;" title="${i18n.t('heatmap_noData')}"></div>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.good.color};" title="${i18n.t('heatmap_good')} (<${levels.good.max})"></div>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.yellow.color};" title="${i18n.t('heatmap_moderate')} (${levels.good.max}-${levels.yellow.max})"></div>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.orange.color};" title="${i18n.t('heatmap_poor')} (${levels.yellow.max}-${levels.orange.max})"></div>
            <div class="w-3 h-3 rounded-sm" style="background-color: ${levels.red.color};" title="${i18n.t('heatmap_unhealthy')} (>${levels.orange.max})"></div>
        </div>
        <span class="text-gray-400">${i18n.t('heatmap_more')}</span>
        <span class="ml-4 text-gray-400">${config.unit}</span>
    `;
}

/**
 * Render threshold table in Settings modal from AIR_QUALITY_THRESHOLDS
 */
export function renderThresholdTable() {
    const container = document.getElementById('threshold-table');
    if (!container) return;

    const metrics = ['pm25', 'pm10', 'co2'];

    const html = `
        <table class="w-full text-xs">
            <thead>
                <tr class="text-left text-gray-500">
                    <th class="pb-2">Metric</th>
                    <th class="pb-2 text-yellow-600">Yellow</th>
                    <th class="pb-2 text-orange-600">Orange</th>
                    <th class="pb-2 text-red-600">Red</th>
                </tr>
            </thead>
            <tbody class="text-gray-700">
                ${metrics.map(metric => {
                    const config = AIR_QUALITY_THRESHOLDS[metric];
                    const levels = config.levels;
                    return `
                        <tr>
                            <td class="py-1">${config.label}</td>
                            <td class="py-1 text-yellow-600">&ge;${levels.good.max} ${config.unit}</td>
                            <td class="py-1 text-orange-600">&ge;${levels.yellow.max}</td>
                            <td class="py-1 text-red-600">&ge;${levels.orange.max}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = html;
}
