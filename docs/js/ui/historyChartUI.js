/**
 * History Chart UI Module
 * Builds metric checkboxes, fetches and aggregates data, wires events, calls renderer
 */

import { i18n } from '../i18n.js';
import { getLogsByDateRange, getAllLogs, getLogsByDevice } from '../storage.js';
import { SPARKLINE_THRESHOLDS } from '../constants.js';
import * as state from './state.js';
import { renderChart, renderCrosshair, clearCrosshair, METRIC_COLORS, METRIC_UNITS } from './historyChart.js';

// All possible metrics and their i18n label keys
const ALL_METRICS = [
    { key: 'temperature', i18nKey: 'sensor_temperature', field: 'temperature' },
    { key: 'humidity',    i18nKey: 'sensor_humidity',    field: 'humidity' },
    { key: 'pm25',        i18nKey: 'sensor_pm25',        field: 'pm25' },
    { key: 'pm10',        i18nKey: 'sensor_pm10',        field: 'pm10' },
    { key: 'co2',         i18nKey: 'sensor_co2',         field: 'co2' },
    { key: 'lux',         i18nKey: 'sensor_light',       field: 'lux' },
    { key: 'pressure',    i18nKey: 'sensor_pressure',    field: 'pressure' },
    { key: 'gasResistance', i18nKey: 'sensor_gasResistance', field: 'gasResistance' }
];

const BUCKET_SECONDS = 900; // 15 minutes
const MAX_POINTS = 1000;

// Module state
let activeMetrics = new Set(['temperature', 'humidity']);
let currentTimeRange = '7d';
let cachedTraces = null;  // Map<metric, {timestamps[], values[]}>
let cacheKey = null;      // serialized (deviceSerial, timeRange)
let resizeRAF = null;
let lastChartState = null;

/**
 * Initialize the history chart: build checkboxes, wire events, initial render
 */
export async function initHistoryChart() {
    await buildCheckboxes();
    wireEvents();
    await refreshHistoryChart();
}

/**
 * Refresh chart: re-fetch data + re-render. Called from init.js and sync.js
 */
export async function refreshHistoryChart() {
    invalidateCache();
    await fetchAndRender();
}

/**
 * Detect available metrics by sampling stored logs, then build checkbox elements
 */
async function buildCheckboxes() {
    const container = document.getElementById('chart-metric-checkboxes');
    if (!container) return;

    // Get a sample of recent logs to detect which metrics have data
    const deviceFilter = state.get('currentDeviceFilter');
    let sampleLogs;
    try {
        if (deviceFilter) {
            sampleLogs = await getLogsByDevice(deviceFilter);
        } else {
            sampleLogs = await getAllLogs();
        }
    } catch {
        sampleLogs = [];
    }

    // Check which metrics have at least one non-null value
    const available = new Set();
    for (const log of sampleLogs) {
        for (const m of ALL_METRICS) {
            if (log[m.field] !== undefined && log[m.field] !== null) {
                available.add(m.key);
            }
        }
        // Short-circuit once all found
        if (available.size === ALL_METRICS.length) break;
    }

    // If no data at all, show all common metrics as options anyway
    if (available.size === 0) {
        available.add('temperature');
        available.add('humidity');
    }

    container.innerHTML = '';

    for (const m of ALL_METRICS) {
        if (!available.has(m.key)) continue;

        const label = document.createElement('label');
        label.className = 'flex items-center gap-1.5 cursor-pointer select-none';

        const colorBar = document.createElement('span');
        colorBar.className = 'inline-block w-3 h-3 rounded-sm';
        colorBar.style.backgroundColor = METRIC_COLORS[m.key];

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'chart-metric-cb rounded';
        cb.value = m.key;
        cb.checked = activeMetrics.has(m.key);

        const text = document.createElement('span');
        text.textContent = i18n.t(m.i18nKey) + ' (' + METRIC_UNITS[m.key] + ')';

        label.appendChild(cb);
        label.appendChild(colorBar);
        label.appendChild(text);
        container.appendChild(label);
    }
}

/**
 * Wire up DOM events: time range select, checkbox toggles, resize observer
 */
function wireEvents() {
    // Time range selector
    const rangeSelect = document.getElementById('chart-time-range');
    if (rangeSelect) {
        rangeSelect.addEventListener('change', async (e) => {
            currentTimeRange = e.target.value;
            invalidateCache();
            await fetchAndRender();
        });
    }

    // Checkbox toggles (use event delegation on container)
    const cbContainer = document.getElementById('chart-metric-checkboxes');
    if (cbContainer) {
        cbContainer.addEventListener('change', (e) => {
            if (!e.target.classList.contains('chart-metric-cb')) return;
            const metric = e.target.value;
            if (e.target.checked) {
                activeMetrics.add(metric);
            } else {
                activeMetrics.delete(metric);
            }
            renderFromCache();
        });
    }

    // Crosshair overlay events
    const overlay = document.getElementById('history-chart-overlay');
    if (overlay) {
        overlay.addEventListener('mousemove', (e) => {
            if (!lastChartState) return;
            const rect = overlay.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const tooltipData = renderCrosshair('history-chart-overlay', lastChartState, mouseX, mouseY);
            if (tooltipData) {
                showTooltip(tooltipData, mouseX, rect.width);
            } else {
                hideTooltip();
            }
        });

        overlay.addEventListener('mouseleave', () => {
            clearCrosshair('history-chart-overlay');
            hideTooltip();
        });
    }

    // Responsive resize
    const canvasContainer = document.getElementById('chart-canvas-container');
    if (canvasContainer && typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => {
            if (resizeRAF) cancelAnimationFrame(resizeRAF);
            resizeRAF = requestAnimationFrame(() => renderFromCache());
        });
        observer.observe(canvasContainer);
    }
}

/**
 * Fetch data, aggregate into 15-min buckets, cache, and render
 */
async function fetchAndRender() {
    const deviceFilter = state.get('currentDeviceFilter');
    const newCacheKey = `${deviceFilter || 'all'}|${currentTimeRange}`;

    if (cacheKey === newCacheKey && cachedTraces) {
        renderFromCache();
        return;
    }

    try {
        const logs = await fetchLogs(deviceFilter, currentTimeRange);
        cachedTraces = aggregateTo15Min(logs);
        cacheKey = newCacheKey;
    } catch (err) {
        console.error('History chart data fetch failed:', err);
        cachedTraces = new Map();
        cacheKey = newCacheKey;
    }

    // Rebuild checkboxes in case device changed and available metrics differ
    await buildCheckboxes();
    renderFromCache();
}

/**
 * Render from cached data using only active metrics
 */
function renderFromCache() {
    const canvas = document.getElementById('history-chart-canvas');
    const emptyState = document.getElementById('chart-empty-state');
    if (!canvas || !emptyState) return;

    // Build traces array for active metrics
    const traces = [];
    if (cachedTraces) {
        for (const metric of activeMetrics) {
            const data = cachedTraces.get(metric);
            if (data && data.timestamps.length >= 2) {
                traces.push({ metric, timestamps: data.timestamps, values: data.values });
            }
        }
    }

    if (traces.length === 0) {
        canvas.style.display = 'none';
        emptyState.classList.remove('hidden');
        // Update empty state text based on whether we have cached data at all
        if (cachedTraces && cachedTraces.size > 0) {
            emptyState.textContent = i18n.t('chart_noData');
        } else {
            emptyState.textContent = i18n.t('chart_noDataAvailable');
        }
        return;
    }

    canvas.style.display = '';
    emptyState.classList.add('hidden');

    // Build Y ranges from SPARKLINE_THRESHOLDS
    const yRanges = {};
    for (const t of traces) {
        const thresh = SPARKLINE_THRESHOLDS[t.metric];
        if (thresh && thresh.range) {
            yRanges[t.metric] = { min: thresh.range.min, max: thresh.range.max };
        }
    }

    lastChartState = renderChart('history-chart-canvas', traces, {
        timeRange: currentTimeRange,
        yRanges
    });
}

/**
 * Fetch logs from storage based on device filter and time range
 */
async function fetchLogs(deviceFilter, timeRange) {
    const now = Math.floor(Date.now() / 1000);
    let startTimestamp;

    if (timeRange === '24h') {
        startTimestamp = now - 24 * 3600;
    } else if (timeRange === '7d') {
        startTimestamp = now - 7 * 24 * 3600;
    } else if (timeRange === '30d') {
        startTimestamp = now - 30 * 24 * 3600;
    } else {
        // 'all' — use a very early start
        startTimestamp = 0;
    }

    return getLogsByDateRange(startTimestamp, now, deviceFilter || null);
}

/**
 * Aggregate logs into 15-minute buckets, averaging values per metric
 * @param {Array} logs - Raw log records
 * @returns {Map<string, {timestamps: number[], values: number[]}>}
 */
function aggregateTo15Min(logs) {
    if (!logs || logs.length === 0) return new Map();

    // Collect values per bucket per metric
    // bucket key = floor(timestamp / 900) * 900
    const buckets = new Map(); // Map<metric, Map<bucketKey, number[]>>

    for (const log of logs) {
        if (!log.timestamp) continue;
        const bucketKey = Math.floor(log.timestamp / BUCKET_SECONDS) * BUCKET_SECONDS;

        for (const m of ALL_METRICS) {
            const val = log[m.field];
            if (val === undefined || val === null) continue;

            if (!buckets.has(m.key)) buckets.set(m.key, new Map());
            const metricBuckets = buckets.get(m.key);

            if (!metricBuckets.has(bucketKey)) metricBuckets.set(bucketKey, []);
            metricBuckets.get(bucketKey).push(val);
        }
    }

    // Average each bucket and build sorted arrays
    const result = new Map();

    for (const [metric, metricBuckets] of buckets) {
        const entries = Array.from(metricBuckets.entries()).sort((a, b) => a[0] - b[0]);
        let timestamps = entries.map(e => e[0]);
        let values = entries.map(e => {
            const arr = e[1];
            return arr.reduce((s, v) => s + v, 0) / arr.length;
        });

        // Downsample if too many points
        if (timestamps.length > MAX_POINTS) {
            const stride = Math.ceil(timestamps.length / MAX_POINTS);
            const sampledT = [];
            const sampledV = [];
            for (let i = 0; i < timestamps.length; i += stride) {
                sampledT.push(timestamps[i]);
                sampledV.push(values[i]);
            }
            timestamps = sampledT;
            values = sampledV;
        }

        result.set(metric, { timestamps, values });
    }

    return result;
}

/**
 * Invalidate the cache so next render re-fetches
 */
function invalidateCache() {
    cachedTraces = null;
    cacheKey = null;
    lastChartState = null;
}

// --- Tooltip helpers ---

const METRIC_LABELS = {
    temperature: 'Temperature',
    humidity:    'Humidity',
    pm25:        'PM2.5',
    pm10:        'PM10',
    co2:         'CO2',
    lux:         'Light',
    pressure:    'Pressure',
    gasResistance: 'Gas Res.'
};

/**
 * Show and position the tooltip div
 */
function showTooltip(data, mouseX, containerWidth) {
    const tooltip = document.getElementById('chart-tooltip');
    if (!tooltip) return;

    // Build content
    const timeStr = formatTooltipTimestamp(data.timestamp, currentTimeRange);
    let html = `<div class="font-medium text-gray-700 mb-1 border-b border-gray-100 pb-1">${timeStr}</div>`;

    for (const v of data.values) {
        const dot = `<span class="inline-block w-2 h-2 rounded-full mr-1.5" style="background:${v.color}"></span>`;
        const label = METRIC_LABELS[v.metric] || v.metric;
        const formatted = v.value.toFixed(1);
        html += `<div class="flex items-center justify-between gap-3">`
             +  `<span class="flex items-center text-gray-600">${dot}${label}</span>`
             +  `<span class="font-medium text-gray-900">${formatted} ${v.unit}</span>`
             +  `</div>`;
    }

    tooltip.innerHTML = html;
    tooltip.classList.remove('hidden');

    // Position: right of crosshair by default, flip left near right edge
    const tooltipW = tooltip.offsetWidth;
    const gap = 12;
    let left;
    if (mouseX + gap + tooltipW + 20 > containerWidth) {
        left = data.x - tooltipW - gap;
    } else {
        left = data.x + gap;
    }
    // Vertically center in the plot area
    const plotCenterY = lastChartState ? lastChartState.plotTop + lastChartState.plotH / 2 : 100;
    const tooltipH = tooltip.offsetHeight;
    let top = plotCenterY - tooltipH / 2;
    // Keep within container bounds
    top = Math.max(4, Math.min(top, (lastChartState ? lastChartState.plotTop + lastChartState.plotH - tooltipH : 200)));

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

/**
 * Hide the tooltip div
 */
function hideTooltip() {
    const tooltip = document.getElementById('chart-tooltip');
    if (tooltip) tooltip.classList.add('hidden');
}

/**
 * Format a Unix timestamp for the tooltip header based on time range
 */
function formatTooltipTimestamp(timestamp, timeRange) {
    const d = new Date(timestamp * 1000);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (timeRange === '24h') {
        return `${hh}:${mm}`;
    } else if (timeRange === '7d') {
        return `${dayNames[d.getDay()]} ${d.getDate()}, ${hh}:${mm}`;
    } else if (timeRange === '30d') {
        return `${monthNames[d.getMonth()]} ${d.getDate()}, ${hh}:${mm}`;
    } else {
        return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
}
