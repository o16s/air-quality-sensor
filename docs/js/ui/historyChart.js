/**
 * History Chart Renderer
 * Pure Canvas 2D multi-line chart with per-metric Y-axes and adaptive X-axis
 */

/** Distinct color per metric (not threshold colors) */
export const METRIC_COLORS = {
    temperature: '#ef4444',
    humidity:    '#3b82f6',
    pm25:        '#f59e0b',
    pm10:        '#8b5cf6',
    co2:         '#10b981',
    lux:         '#f97316',
    pressure:    '#6366f1',
    gasResistance: '#ec4899'
};

/** Unit string per metric */
export const METRIC_UNITS = {
    temperature: '\u00B0C',
    humidity:    '%',
    pm25:        '\u00B5g/m\u00B3',
    pm10:        '\u00B5g/m\u00B3',
    co2:         'ppm',
    lux:         'lux',
    pressure:    'hPa',
    gasResistance: '\u03A9'
};

// Layout constants
const LEFT_AXIS  = 50;
const RIGHT_AXIS = 50;
const TOP_PAD    = 15;
const BOTTOM_PAD = 28;

/**
 * Render a multi-line time series chart on a canvas
 * @param {string} canvasId - Canvas element ID
 * @param {Array<{metric: string, timestamps: number[], values: number[]}>} traces - Data traces
 * @param {Object} options
 * @param {string} options.timeRange - '24h' | '7d' | '30d' | 'all'
 * @param {Object} options.yRanges - Per-metric Y range from SPARKLINE_THRESHOLDS e.g. {temperature: {min:16,max:27}}
 */
/**
 * Render a multi-line time series chart on a canvas.
 * Returns chart layout state for crosshair interaction, or null on early exit.
 * @returns {{ plotLeft, plotTop, plotW, plotH, globalMinT, globalMaxT, timeSpan, resolvedTraces }|null}
 */
export function renderChart(canvasId, traces, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !traces || traces.length === 0) return null;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssW = rect.width;
    const cssH = rect.height;

    // Bail out if canvas is in a hidden container (display: none) —
    // do NOT set canvas.width/height to 0, as that would override the
    // CSS classes (w-full h-full) and permanently collapse the canvas.
    if (cssW <= 0 || cssH <= 0) return null;

    canvas.width  = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, cssW, cssH);

    const plotLeft   = LEFT_AXIS;
    const plotRight  = cssW - RIGHT_AXIS;
    const plotTop    = TOP_PAD;
    const plotBottom = cssH - BOTTOM_PAD;
    const plotW = plotRight - plotLeft;
    const plotH = plotBottom - plotTop;

    if (plotW <= 0 || plotH <= 0) return null;

    // Compute global time range across all traces
    let globalMinT = Infinity, globalMaxT = -Infinity;
    for (const t of traces) {
        if (t.timestamps.length === 0) continue;
        const first = t.timestamps[0];
        const last  = t.timestamps[t.timestamps.length - 1];
        if (first < globalMinT) globalMinT = first;
        if (last  > globalMaxT) globalMaxT = last;
    }
    if (!isFinite(globalMinT) || globalMinT === globalMaxT) return null;

    const timeSpan = globalMaxT - globalMinT;

    // --- Draw grid ---
    drawGrid(ctx, plotLeft, plotTop, plotW, plotH);

    // --- Draw X-axis labels ---
    drawXAxis(ctx, plotLeft, plotBottom, plotW, cssH, globalMinT, globalMaxT, options.timeRange);

    // --- Draw Y-axes (first two active metrics) ---
    const yRanges = options.yRanges || {};
    const metricsForAxes = traces.slice(0, 2);

    if (metricsForAxes[0]) {
        const range = getYRange(metricsForAxes[0], yRanges);
        drawYAxis(ctx, plotLeft, plotTop, plotH, range, METRIC_COLORS[metricsForAxes[0].metric], 'left');
    }
    if (metricsForAxes[1]) {
        const range = getYRange(metricsForAxes[1], yRanges);
        drawYAxis(ctx, plotRight, plotTop, plotH, range, METRIC_COLORS[metricsForAxes[1].metric], 'right');
    }

    // --- Draw line traces ---
    ctx.save();
    ctx.beginPath();
    ctx.rect(plotLeft, plotTop, plotW, plotH);
    ctx.clip();

    const resolvedTraces = [];
    for (const trace of traces) {
        if (trace.timestamps.length < 2) continue;
        const yRange = getYRange(trace, yRanges);
        const color = METRIC_COLORS[trace.metric] || '#6b7280';

        drawLine(ctx, trace, plotLeft, plotTop, plotW, plotH, globalMinT, timeSpan, yRange, color);
        resolvedTraces.push({ metric: trace.metric, timestamps: trace.timestamps, values: trace.values, yRange });
    }

    ctx.restore();

    return { plotLeft, plotTop, plotW, plotH, globalMinT, globalMaxT, timeSpan, resolvedTraces };
}

/**
 * Draw crosshair line + dots on the overlay canvas at the nearest data point.
 * Returns tooltip data or null if mouseX is outside the plot area.
 * @param {string} overlayCanvasId
 * @param {Object} chartState - returned by renderChart()
 * @param {number} mouseX - CSS-pixel X relative to canvas
 * @param {number} mouseY - CSS-pixel Y relative to canvas
 * @returns {{ x: number, timestamp: number, values: Array<{metric, value, color, unit}> }|null}
 */
export function renderCrosshair(overlayCanvasId, chartState, mouseX, mouseY) {
    const overlay = document.getElementById(overlayCanvasId);
    if (!overlay || !chartState) return null;

    const { plotLeft, plotTop, plotW, plotH, globalMinT, timeSpan, resolvedTraces } = chartState;

    // Size overlay to match the base canvas DPR
    const dpr = window.devicePixelRatio || 1;
    const rect = overlay.getBoundingClientRect();
    const cssW = rect.width;
    const cssH = rect.height;
    overlay.width = cssW * dpr;
    overlay.height = cssH * dpr;
    const ctx = overlay.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);

    // Clamp mouseX to plot area
    const clampedX = Math.max(plotLeft, Math.min(mouseX, plotLeft + plotW));

    // Convert pixel X to timestamp
    const ratio = (clampedX - plotLeft) / plotW;
    const targetT = globalMinT + ratio * timeSpan;

    // Find the globally nearest timestamp across all traces
    let bestT = null;
    let bestDist = Infinity;
    for (const trace of resolvedTraces) {
        const idx = findNearestIndex(trace.timestamps, targetT);
        const dist = Math.abs(trace.timestamps[idx] - targetT);
        if (dist < bestDist) {
            bestDist = dist;
            bestT = trace.timestamps[idx];
        }
    }

    if (bestT === null) return null;

    // Snap crosshair X to the nearest timestamp's pixel position
    const crosshairX = plotLeft + ((bestT - globalMinT) / timeSpan) * plotW;

    // Draw vertical dashed line
    ctx.save();
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(crosshairX, plotTop);
    ctx.lineTo(crosshairX, plotTop + plotH);
    ctx.stroke();
    ctx.restore();

    // Draw dots on each trace + collect tooltip values
    const tooltipValues = [];
    for (const trace of resolvedTraces) {
        const idx = findNearestIndex(trace.timestamps, bestT);
        // Only show dot if this trace has a point at or very near the snapped timestamp
        if (Math.abs(trace.timestamps[idx] - bestT) > timeSpan * 0.01) continue;

        const value = trace.values[idx];
        const { yRange } = trace;
        const yRatio = (value - yRange.min) / (yRange.max - yRange.min);
        const dotY = plotTop + plotH - yRatio * plotH;
        const color = METRIC_COLORS[trace.metric] || '#6b7280';

        // White border circle
        ctx.beginPath();
        ctx.arc(crosshairX, dotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Colored filled circle
        ctx.beginPath();
        ctx.arc(crosshairX, dotY, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        tooltipValues.push({
            metric: trace.metric,
            value,
            color,
            unit: METRIC_UNITS[trace.metric] || ''
        });
    }

    return { x: crosshairX, timestamp: bestT, values: tooltipValues };
}

/**
 * Clear the crosshair overlay canvas
 * @param {string} overlayCanvasId
 */
export function clearCrosshair(overlayCanvasId) {
    const overlay = document.getElementById(overlayCanvasId);
    if (!overlay) return;
    const ctx = overlay.getContext('2d');
    ctx.clearRect(0, 0, overlay.width, overlay.height);
}

/**
 * Binary search for the nearest timestamp index
 */
function findNearestIndex(timestamps, targetT) {
    let lo = 0, hi = timestamps.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (timestamps[mid] < targetT) lo = mid + 1;
        else hi = mid;
    }
    if (lo > 0 && Math.abs(timestamps[lo - 1] - targetT) < Math.abs(timestamps[lo] - targetT)) {
        return lo - 1;
    }
    return lo;
}

/**
 * Get Y range for a trace, expanding if data exceeds thresholds
 */
function getYRange(trace, yRanges) {
    const base = yRanges[trace.metric] || { min: 0, max: 100 };
    let min = base.min;
    let max = base.max;

    if (trace.values.length > 0) {
        const dataMin = Math.min(...trace.values);
        const dataMax = Math.max(...trace.values);
        if (dataMin < min) min = Math.floor(dataMin);
        if (dataMax > max) max = Math.ceil(dataMax);
    }

    if (min === max) max = min + 1;
    return { min, max };
}

/**
 * Draw light grid lines
 */
function drawGrid(ctx, x, y, w, h) {
    ctx.save();
    ctx.strokeStyle = '#e5e7eb'; // gray-200
    ctx.lineWidth = 1;

    // Horizontal lines (5 divisions)
    for (let i = 0; i <= 4; i++) {
        const ly = Math.round(y + (h * i) / 4) + 0.5;
        ctx.beginPath();
        ctx.moveTo(x, ly);
        ctx.lineTo(x + w, ly);
        ctx.stroke();
    }

    ctx.restore();
}

/**
 * Draw adaptive X-axis labels
 */
function drawXAxis(ctx, plotLeft, plotBottom, plotW, cssH, minT, maxT, timeRange) {
    ctx.save();
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = '#6b7280'; // gray-500
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.strokeStyle = '#d1d5db'; // gray-300
    ctx.lineWidth = 1;

    const span = maxT - minT;
    const ticks = computeXTicks(minT, maxT, timeRange);

    for (const { t, label } of ticks) {
        const ratio = (t - minT) / span;
        const x = plotLeft + ratio * plotW;
        if (x < plotLeft || x > plotLeft + plotW) continue;

        // Tick mark
        ctx.beginPath();
        ctx.moveTo(x, plotBottom);
        ctx.lineTo(x, plotBottom + 4);
        ctx.stroke();

        // Label
        ctx.fillText(label, x, plotBottom + 6);
    }

    ctx.restore();
}

/**
 * Compute X-axis tick positions and labels
 */
function computeXTicks(minT, maxT, timeRange) {
    const ticks = [];

    if (timeRange === '24h') {
        // Every 2 hours
        const interval = 2 * 3600;
        const firstTick = Math.ceil(minT / interval) * interval;
        for (let t = firstTick; t <= maxT; t += interval) {
            const d = new Date(t * 1000);
            ticks.push({ t, label: `${d.getHours()}h` });
        }
    } else if (timeRange === '7d') {
        // Every day
        const interval = 24 * 3600;
        const firstTick = Math.ceil(minT / interval) * interval;
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let t = firstTick; t <= maxT; t += interval) {
            const d = new Date(t * 1000);
            ticks.push({ t, label: `${dayNames[d.getDay()]} ${d.getDate()}` });
        }
    } else if (timeRange === '30d') {
        // Every 5 days
        const interval = 5 * 24 * 3600;
        const firstTick = Math.ceil(minT / interval) * interval;
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let t = firstTick; t <= maxT; t += interval) {
            const d = new Date(t * 1000);
            ticks.push({ t, label: `${monthNames[d.getMonth()]} ${d.getDate()}` });
        }
    } else {
        // 'all' — every month
        const startDate = new Date(minT * 1000);
        const endDate = new Date(maxT * 1000);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let year = startDate.getFullYear();
        let month = startDate.getMonth();

        while (true) {
            const d = new Date(year, month, 1);
            const t = d.getTime() / 1000;
            if (t > maxT) break;
            if (t >= minT) {
                ticks.push({ t, label: monthNames[month] });
            }
            month++;
            if (month > 11) { month = 0; year++; }
        }
    }

    return ticks;
}

/**
 * Draw Y-axis labels in the metric's color
 */
function drawYAxis(ctx, x, top, height, range, color, side) {
    ctx.save();
    ctx.font = '10px system-ui, sans-serif';
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = side === 'left' ? 'right' : 'left';

    const divisions = 4;
    const offset = side === 'left' ? -8 : 8;

    for (let i = 0; i <= divisions; i++) {
        const ratio = i / divisions;
        const y = top + ratio * height;
        const value = range.max - ratio * (range.max - range.min);
        const label = formatAxisValue(value);

        ctx.fillText(label, x + offset, y);
    }

    ctx.restore();
}

/**
 * Format a Y-axis value compactly
 */
function formatAxisValue(value) {
    if (Math.abs(value) >= 1000) return Math.round(value).toString();
    if (Number.isInteger(value)) return value.toString();
    return value.toFixed(1);
}

/**
 * Draw a single smooth line trace
 */
function drawLine(ctx, trace, plotLeft, plotTop, plotW, plotH, globalMinT, timeSpan, range, color) {
    const { timestamps, values } = trace;
    const rangeSpan = range.max - range.min;

    // Map data to pixel coordinates
    const points = [];
    for (let i = 0; i < timestamps.length; i++) {
        const xRatio = (timestamps[i] - globalMinT) / timeSpan;
        const yRatio = (values[i] - range.min) / rangeSpan;
        points.push({
            x: plotLeft + xRatio * plotW,
            y: plotTop + plotH - yRatio * plotH
        });
    }

    // Draw smooth quadratic Bezier curve (same pattern as sparklines.js)
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        const xMid = (points[i - 1].x + points[i].x) / 2;
        const yMid = (points[i - 1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xMid, yMid);
    }

    // Complete last segment
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);

    ctx.strokeStyle = color + 'd9'; // 85% opacity
    ctx.lineWidth = 2;
    ctx.stroke();
}
