/**
 * Help Page Module
 * Renders dynamic content on the Help / Settings page
 */

import { i18n } from '../i18n.js';
import { AIR_QUALITY_THRESHOLDS } from '../constants.js';
import { DEVICE_TYPES } from '../deviceTypes.js';
import { track } from './utils.js';

/**
 * Initialize all help page content and event handlers
 */
export function initHelpPage() {
    updateExperimentalFeatures();
    renderAppVersion();
    renderDeviceTypesList();
    renderThresholdTable();
    initLanguageSwitcher();
    initExperimentalFeatures();
}

/**
 * Display app version from package.json (injected by Vite at build time)
 */
function renderAppVersion() {
    const el = document.getElementById('app-version');
    if (el && typeof __APP_VERSION__ !== 'undefined') {
        el.textContent = `v${__APP_VERSION__}`;
    }
}

/**
 * Render the supported device types list from the device type registry
 */
function renderDeviceTypesList() {
    const container = document.getElementById('device-types-list');
    if (!container) return;

    const html = Object.values(DEVICE_TYPES).map(dt => {
        const metricPills = dt.metrics.map(m =>
            `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">` +
            `<span class="w-2 h-2 rounded-full flex-shrink-0" style="background:${m.color}"></span>` +
            `${i18n.t(m.i18nKey) || m.label}` +
            `${m.unit ? ` <span class="text-gray-400">(${m.unit})</span>` : ''}` +
            `</span>`
        ).join('');

        const extraPills = dt.extraFields.map(f =>
            `<span class="inline-block px-2 py-0.5 rounded text-xs bg-gray-50 text-gray-500">${f.csvHeader}</span>`
        ).join('');

        const extraSection = extraPills
            ? `<div class="mt-2"><span class="text-xs text-gray-400">${i18n.t('help_deviceTypes_extraFields')}:</span> <div class="flex flex-wrap gap-1 mt-1">${extraPills}</div></div>`
            : '';

        return `
            <div class="mb-4 last:mb-0">
                <h3 class="text-sm font-semibold text-gray-800 mb-1">${dt.name}</h3>
                <div class="flex flex-wrap gap-1">${metricPills}</div>
                ${extraSection}
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

/**
 * Render threshold table from AIR_QUALITY_THRESHOLDS
 */
function renderThresholdTable() {
    const container = document.getElementById('threshold-table');
    if (!container) return;

    const metrics = Object.keys(AIR_QUALITY_THRESHOLDS);

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

/**
 * Initialize language switcher dropdown
 */
function initLanguageSwitcher() {
    const langSwitcher = document.getElementById('language-switcher');
    if (!langSwitcher) return;

    langSwitcher.value = i18n.getLanguage();
    langSwitcher.addEventListener('change', (e) => {
        track('setting_changed', { setting: 'language', value: e.target.value });
        i18n.setLanguage(e.target.value);
    });
}

/**
 * Initialize experimental features checkbox
 */
function initExperimentalFeatures() {
    const checkbox = document.getElementById('setting-experimental-features');
    if (!checkbox) return;

    checkbox.checked = localStorage.getItem('experimentalFeaturesEnabled') === 'true';
    checkbox.addEventListener('change', () => {
        track('setting_changed', { setting: 'experimental', value: checkbox.checked });
        localStorage.setItem('experimentalFeaturesEnabled', checkbox.checked);
        updateExperimentalFeatures();
    });
}

/**
 * Update visibility of experimental features based on localStorage setting
 */
export function updateExperimentalFeatures() {
    const enabled = localStorage.getItem('experimentalFeaturesEnabled') === 'true';
    document.querySelectorAll('[data-experimental="true"]').forEach(el => {
        el.classList.toggle('hidden', !enabled);
    });
}
