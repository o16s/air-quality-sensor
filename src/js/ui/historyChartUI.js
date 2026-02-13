/**
 * History Chart UI Module
 * Fetches and aggregates data, wires events, calls ECharts renderer
 */

import { i18n } from '../i18n.js';
import { getLogsByDateRange } from '../storage.js';
import { getAllKnownMetrics, getMetricLabelsMap } from '../deviceTypes.js';
import { listenKeys } from 'nanostores';
import { $state, $dataVersion } from './state.js';
import * as state from './state.js';
import { initEChart, updateChart, resizeChart, getChartInstance, toggleZoomMode, resetZoom } from './historyChart.js';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en';
import localeDe from 'air-datepicker/locale/de';
import 'air-datepicker/air-datepicker.css';

// All possible metrics (generated from device type registry)
const ALL_METRICS = getAllKnownMetrics();

const BUCKET_SECONDS = 900; // 15 minutes
const MAX_POINTS = 1000;

const METRIC_LABEL_MAP = getMetricLabelsMap();

// Module state
let activeMetrics = new Set(ALL_METRICS.map(m => m.key));
let currentTimeRange = '7d';
let customDateRange = null; // [startDate, endDate] when currentTimeRange === 'custom'
let datePicker = null;
let cachedTraces = null;  // Map<metric, {timestamps[], values[]}>
let cacheKey = null;
let resizeRAF = null;

/**
 * Initialize the history chart: create ECharts instance, wire events, initial render
 */
export async function initHistoryChart() {
    initEChart('chart-container');
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
 * Wire up DOM events: time range buttons, legend sync, resize
 */
function wireEvents() {
    // Time range pill buttons (event delegation)
    const btnGroup = document.getElementById('chart-time-range-group');
    if (btnGroup) {
        btnGroup.addEventListener('click', async (e) => {
            const btn = e.target.closest('.time-range-btn');
            if (!btn) return;
            const range = btn.dataset.range;

            if (range === 'custom') {
                // Open the date picker — selection handled in onClose callback
                if (datePicker) datePicker.show();
                return;
            }

            if (range === currentTimeRange) return;

            btnGroup.querySelectorAll('.time-range-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentTimeRange = range;
            customDateRange = null;
            invalidateCache();
            await fetchAndRender();
        });
    }

    // Air Datepicker range picker (attached to hidden input, positioned near custom button)
    const dateInput = document.getElementById('chart-date-range-input');
    const customBtn = document.getElementById('chart-custom-range-btn');
    if (dateInput && customBtn) {
        const locale = i18n.getLanguage() === 'de' ? localeDe : localeEn;
        datePicker = new AirDatepicker(dateInput, {
            range: true,
            maxDate: new Date(),
            locale,
            autoClose: true,
            buttons: ['clear'],
            dateFormat: 'dd MMM yyyy',
            multipleDatesSeparator: ' - ',
            position({ $datepicker }) {
                const rect = customBtn.getBoundingClientRect();
                $datepicker.style.left = `${rect.right - $datepicker.offsetWidth}px`;
                $datepicker.style.top = `${rect.bottom + 4}px`;
            },
            onSelect: async ({ date }) => {
                if (Array.isArray(date) && date.length === 2) {
                    customDateRange = date;
                    currentTimeRange = 'custom';

                    if (btnGroup) {
                        btnGroup.querySelectorAll('.time-range-btn').forEach(b => b.classList.remove('active'));
                        const customBtn = document.getElementById('chart-custom-range-btn');
                        if (customBtn) customBtn.classList.add('active');
                    }

                    invalidateCache();
                    await fetchAndRender();
                }
            }
        });
    }

    // Zoom toggle button
    const zoomBtn = document.getElementById('chart-zoom-btn');
    if (zoomBtn) {
        zoomBtn.addEventListener('click', () => {
            const active = toggleZoomMode();
            zoomBtn.classList.toggle('bg-blue-50', active);
            zoomBtn.classList.toggle('text-blue-600', active);
            zoomBtn.classList.toggle('text-gray-400', !active);
        });
    }

    // Zoom reset button
    const resetBtn = document.getElementById('chart-zoom-reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetZoom();
            if (zoomBtn) {
                zoomBtn.classList.remove('bg-blue-50', 'text-blue-600');
                zoomBtn.classList.add('text-gray-400');
            }
        });
    }

    // Sync ECharts legend selection back to activeMetrics
    const chart = getChartInstance();
    if (chart) {
        chart.on('legendselectchanged', (params) => {
            const labelToKey = {};
            for (const m of ALL_METRICS) {
                labelToKey[METRIC_LABEL_MAP[m.key] || m.key] = m.key;
            }
            activeMetrics.clear();
            for (const [label, selected] of Object.entries(params.selected)) {
                if (selected && labelToKey[label]) {
                    activeMetrics.add(labelToKey[label]);
                }
            }
        });
    }

    // Responsive resize
    const container = document.getElementById('chart-container');
    if (container && typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => {
            if (resizeRAF) cancelAnimationFrame(resizeRAF);
            resizeRAF = requestAnimationFrame(() => resizeChart());
        });
        observer.observe(container);
    }
}

/**
 * Fetch data, aggregate into 15-min buckets, cache, and render.
 * Always requires a device filter — never mixes data from different devices.
 */
async function fetchAndRender() {
    const deviceFilter = state.get('historyDeviceSerial');

    // Never render without a device selected
    if (!deviceFilter) {
        cachedTraces = new Map();
        cacheKey = null;
        renderFromCache();
        return;
    }

    const customSuffix = currentTimeRange === 'custom' && customDateRange
        ? `|${customDateRange[0].getTime()}|${customDateRange[1].getTime()}`
        : '';
    const newCacheKey = `${deviceFilter}|${currentTimeRange}${customSuffix}`;

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

    renderFromCache();
}

/**
 * Render from cached data — build all available traces, let ECharts legend handle toggling
 */
function renderFromCache() {
    const container = document.getElementById('chart-container');
    const emptyState = document.getElementById('chart-empty-state');
    if (!container || !emptyState) return;

    const traces = [];
    if (cachedTraces) {
        for (const [metric, data] of cachedTraces) {
            if (data && data.timestamps.length >= 2) {
                traces.push({ metric, timestamps: data.timestamps, values: data.values });
            }
        }
    }

    if (traces.length === 0) {
        container.style.display = 'none';
        emptyState.classList.remove('hidden');
        if (cachedTraces && cachedTraces.size > 0) {
            emptyState.textContent = i18n.t('chart_noData');
        } else {
            emptyState.textContent = i18n.t('chart_noDataAvailable');
        }
        return;
    }

    container.style.display = '';
    emptyState.classList.add('hidden');

    // Build legend selected state from activeMetrics
    const selected = {};
    for (const t of traces) {
        selected[t.metric] = activeMetrics.has(t.metric);
    }

    updateChart(traces, { selected, timeRange: currentTimeRange });
}

/**
 * Fetch logs from storage based on device filter and time range
 */
async function fetchLogs(deviceFilter, timeRange) {
    const now = Math.floor(Date.now() / 1000);
    let startTimestamp;
    let endTimestamp = now;

    if (timeRange === 'custom' && customDateRange && customDateRange.length === 2) {
        startTimestamp = Math.floor(customDateRange[0].getTime() / 1000);
        // End of the selected end day (23:59:59)
        const endDate = new Date(customDateRange[1]);
        endDate.setHours(23, 59, 59, 999);
        endTimestamp = Math.floor(endDate.getTime() / 1000);
    } else if (timeRange === '24h') {
        startTimestamp = now - 24 * 3600;
    } else if (timeRange === '7d') {
        startTimestamp = now - 7 * 24 * 3600;
    } else if (timeRange === '30d') {
        startTimestamp = now - 30 * 24 * 3600;
    } else {
        startTimestamp = 0;
    }

    return getLogsByDateRange(startTimestamp, endTimestamp, deviceFilter);
}

/**
 * Aggregate logs into 15-minute buckets, averaging values per metric
 * @param {Array} logs - Raw log records
 * @returns {Map<string, {timestamps: number[], values: number[]}>}
 */
function aggregateTo15Min(logs) {
    if (!logs || logs.length === 0) return new Map();

    const buckets = new Map();

    for (const log of logs) {
        if (!log.timestamp) continue;
        const bucketKey = Math.floor(log.timestamp / BUCKET_SECONDS) * BUCKET_SECONDS;

        for (const m of ALL_METRICS) {
            const val = log[m.key];
            if (val === undefined || val === null) continue;

            if (!buckets.has(m.key)) buckets.set(m.key, new Map());
            const metricBuckets = buckets.get(m.key);

            if (!metricBuckets.has(bucketKey)) metricBuckets.set(bucketKey, []);
            metricBuckets.get(bucketKey).push(val);
        }
    }

    const result = new Map();

    for (const [metric, metricBuckets] of buckets) {
        const entries = Array.from(metricBuckets.entries()).sort((a, b) => a[0] - b[0]);
        let timestamps = entries.map(e => e[0]);
        let values = entries.map(e => {
            const arr = e[1];
            return arr.reduce((s, v) => s + v, 0) / arr.length;
        });

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
}

// ── Reactive subscriptions ────────────────────────────────────────────

listenKeys($state, ['historyDeviceSerial'], () => {
    // Reset toggled metrics when switching devices so stale selections don't persist
    activeMetrics = new Set(ALL_METRICS.map(m => m.key));
    refreshHistoryChart();
});

$dataVersion.listen(() => {
    refreshHistoryChart();
});
