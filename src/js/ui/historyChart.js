/**
 * History Chart Renderer — ECharts
 * Replaces custom Canvas 2D renderer with Apache ECharts for zoom/pan/tooltip
 */

import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
    TooltipComponent,
    LegendComponent,
    GridComponent,
    DataZoomComponent,
    ToolboxComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getMetricColorsMap, getMetricUnitsMap, getMetricLabelsMap } from '../shared/deviceTypes.js';

echarts.use([LineChart, TooltipComponent, LegendComponent, GridComponent, DataZoomComponent, ToolboxComponent, CanvasRenderer]);

let zoomActive = false;

/** Distinct color per metric (generated from device type registry) */
export const METRIC_COLORS = getMetricColorsMap();

/** Unit string per metric (generated from device type registry) */
export const METRIC_UNITS = getMetricUnitsMap();

/** Short display label per metric (generated from device type registry) */
const METRIC_LABELS = getMetricLabelsMap();

let chartInstance = null;

/**
 * Initialize ECharts instance on a container element
 * @param {string} containerId - DOM element ID
 * @returns {echarts.ECharts}
 */
export function initEChart(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return null;
    if (chartInstance) chartInstance.dispose();
    chartInstance = echarts.init(el);
    return chartInstance;
}

/**
 * Build grouped Y-axes: one axis per unique unit, metrics sharing the same unit
 * share the same axis.
 */
function buildYAxes(traces) {
    const unitToIndex = {};
    const yAxisConfigs = [];
    const seriesAxisMap = {};

    for (const t of traces) {
        const unit = METRIC_UNITS[t.metric] || '';
        if (!(unit in unitToIndex)) {
            const idx = yAxisConfigs.length;
            unitToIndex[unit] = idx;
            yAxisConfigs.push({
                type: 'value',
                name: unit,
                position: idx === 0 ? 'left' : 'right',
                offset: idx > 1 ? (idx - 1) * 60 : 0,
                axisLine: { show: true },
                splitLine: { show: idx === 0 },
                axisLabel: { fontSize: 11 }
            });
        }
        seriesAxisMap[t.metric] = unitToIndex[unit];
    }

    return { yAxisConfigs, seriesAxisMap };
}

/**
 * Update the chart with new trace data
 * @param {Array<{metric: string, timestamps: number[], values: number[]}>} traces
 * @param {Object} options
 * @param {Object} options.selected - Map of metric name -> boolean for legend selection
 * @param {string} options.timeRange - '24h' | '7d' | '30d' | 'all'
 */
export function updateChart(traces, options = {}) {
    if (!chartInstance) return;
    if (!traces || traces.length === 0) {
        chartInstance.clear();
        return;
    }

    const { yAxisConfigs, seriesAxisMap } = buildYAxes(traces);

    const series = traces.map(t => ({
        name: METRIC_LABELS[t.metric] || t.metric,
        type: 'line',
        smooth: true,
        symbol: 'none',
        yAxisIndex: seriesAxisMap[t.metric],
        itemStyle: { color: METRIC_COLORS[t.metric] || '#6b7280' },
        data: t.timestamps.map((ts, i) => [ts * 1000, t.values[i]])
    }));

    const legendSelected = {};
    if (options.selected) {
        for (const t of traces) {
            const label = METRIC_LABELS[t.metric] || t.metric;
            legendSelected[label] = options.selected[t.metric] !== false;
        }
    }

    chartInstance.setOption({
        tooltip: {
            trigger: 'axis',
            formatter(params) {
                if (!params || params.length === 0) return '';
                const d = new Date(params[0].value[0]);
                const hh = String(d.getHours()).padStart(2, '0');
                const mm = String(d.getMinutes()).padStart(2, '0');
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const header = `${dayNames[d.getDay()]} ${monthNames[d.getMonth()]} ${d.getDate()}, ${hh}:${mm}`;
                let html = `<div style="font-weight:500;margin-bottom:4px">${header}</div>`;
                for (const p of params) {
                    const val = p.value[1];
                    html += `<div>${p.marker} ${p.seriesName}: <b>${val.toFixed(1)}</b></div>`;
                }
                return html;
            }
        },
        toolbox: {
            show: true,
            top: -9999,
            feature: {
                dataZoom: { yAxisIndex: 'none' }
            }
        },
        legend: {
            type: 'scroll',
            bottom: 0,
            selected: legendSelected
        },
        grid: {
            left: 50,
            right: yAxisConfigs.length > 1 ? 50 + Math.max(0, yAxisConfigs.length - 2) * 60 : 20,
            top: 0,
            bottom: 80
        },
        xAxis: {
            type: 'time',
            axisLabel: {
                fontSize: 11,
                formatter: {
                    year: '{yyyy}',
                    month: '{MMM} {yyyy}',
                    day: '{MMM} {d}',
                    hour: '{MMM} {d}, {HH}:{mm}',
                    minute: '{HH}:{mm}',
                    second: '{HH}:{mm}:{ss}'
                }
            }
        },
        yAxis: yAxisConfigs.length > 0 ? yAxisConfigs : [{ type: 'value' }],
        dataZoom: [
            { type: 'inside', xAxisIndex: 0 },
            { type: 'slider', xAxisIndex: 0, bottom: 28, height: 20 }
        ],
        series
    }, true);
}

/**
 * Resize chart to fit its container
 */
export function resizeChart() {
    if (chartInstance) chartInstance.resize();
}

/**
 * Dispose chart instance
 */
export function disposeChart() {
    if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
    }
}

/**
 * Toggle brush-zoom mode on/off
 * @returns {boolean} Whether zoom mode is now active
 */
export function toggleZoomMode() {
    if (!chartInstance) return false;
    zoomActive = !zoomActive;
    chartInstance.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'dataZoomSelect',
        dataZoomSelectActive: zoomActive
    });
    return zoomActive;
}

/**
 * Reset zoom to show full data range
 */
export function resetZoom() {
    if (!chartInstance) return;
    zoomActive = false;
    chartInstance.dispatchAction({
        type: 'takeGlobalCursor',
        key: 'dataZoomSelect',
        dataZoomSelectActive: false
    });
    chartInstance.dispatchAction({ type: 'dataZoom', start: 0, end: 100 });
}

/**
 * Get the ECharts instance (for wiring events like legendselectchanged)
 */
export function getChartInstance() {
    return chartInstance;
}
