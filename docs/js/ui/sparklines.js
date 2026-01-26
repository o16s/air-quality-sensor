/**
 * Sparklines Module
 * Handles sparkline chart rendering
 */

import { getLogsByDateRange, getRecentLogs } from '../storage.js';
import { SPARKLINE_THRESHOLDS } from '../constants.js';

/**
 * Calculate temperature scale (uses fixed range 16-27°C for office comfort)
 * @param {Array<number>} tempValues - Temperature values in °C
 * @returns {Object} Scale configuration with range and thresholds
 */
export function getTemperatureScale(tempValues) {
    if (!tempValues || tempValues.length === 0) {
        return SPARKLINE_THRESHOLDS.temperature;
    }

    const dataMin = Math.min(...tempValues);
    const dataMax = Math.max(...tempValues);

    // Use fixed temperature range from constants (16-27°C)
    let rangeMin = SPARKLINE_THRESHOLDS.temperature.range.min; // Fixed at 16°C
    let rangeMax = SPARKLINE_THRESHOLDS.temperature.range.max; // Fixed at 27°C

    // Expand if data exceeds range
    if (dataMin < rangeMin) rangeMin = Math.floor(dataMin);
    if (dataMax > rangeMax) rangeMax = Math.ceil(dataMax);

    return {
        range: { min: rangeMin, max: rangeMax },
        thresholds: SPARKLINE_THRESHOLDS.temperature.thresholds
    };
}

/**
 * Load sparklines from browser storage (last 12 hours, or recent data if less available)
 * Called after Refresh or Sync Data to update historical trends
 */
export async function loadSparklinesFromStorage() {
    try {
        // Get logs from last 12 hours
        const now = Math.floor(Date.now() / 1000);
        const twelveHoursAgo = now - (12 * 60 * 60); // 43,200 seconds

        let recentLogs = await getLogsByDateRange(twelveHoursAgo, now);

        // If we don't have enough data in 12 hours, fall back to most recent logs
        if (!recentLogs || recentLogs.length < 2) {
            recentLogs = await getRecentLogs(10); // Get up to 10 most recent logs
        }

        if (!recentLogs || recentLogs.length < 2) {
            // Still not enough data for meaningful sparkline
            return;
        }

        // Sort chronologically (oldest first)
        const logsChronological = recentLogs.sort((a, b) => a.timestamp - b.timestamp);

        // Detect log format from stored data
        const hasCO2Data = logsChronological.some(log => log.co2 !== undefined && log.co2 !== null);
        const hasLuxData = logsChronological.some(log => log.lux !== undefined && log.lux !== null);
        const hasPMData = logsChronological.some(log => log.pm25 !== undefined && log.pm25 !== null);

        // Extract timestamps and sensor values
        const timestamps = logsChronological.map(log => log.timestamp);
        const tempValues = logsChronological.map(log => log.temperature).filter(v => v !== undefined && v !== null);
        const humidityValues = logsChronological.map(log => log.humidity).filter(v => v !== undefined && v !== null);

        // Update common sparklines (temp and humidity are on all formats)
        const tempConfig = { ...getTemperatureScale(tempValues), timestamps };
        const humidityConfig = { ...SPARKLINE_THRESHOLDS.humidity, timestamps };
        updateSparkline('temp-sparkline', tempValues, tempConfig);
        updateSparkline('humidity-sparkline', humidityValues, humidityConfig);

        // Update format-specific sparklines (visibility handled by configureWidgetsForLogType)
        if (hasCO2Data) {
            // CO2 format: update CO2 sparkline
            const co2Values = logsChronological.map(log => log.co2).filter(v => v !== undefined && v !== null);
            const co2Config = { ...SPARKLINE_THRESHOLDS.co2, timestamps };
            updateSparkline('co2-sparkline', co2Values, co2Config);
        }

        if (hasPMData) {
            // GPS/TSL2591 format: update PM sparklines
            const pm25Values = logsChronological.map(log => log.pm25).filter(v => v !== undefined && v !== null);
            const pm10Values = logsChronological.map(log => log.pm10).filter(v => v !== undefined && v !== null);
            const pm25Config = { ...SPARKLINE_THRESHOLDS.pm25, timestamps };
            const pm10Config = { ...SPARKLINE_THRESHOLDS.pm10, timestamps };
            updateSparkline('pm25-sparkline', pm25Values, pm25Config);
            updateSparkline('pm10-sparkline', pm10Values, pm10Config);
        }

        if (hasLuxData) {
            // TSL2591 and CO2 formats have lux data
            const luxValues = logsChronological.map(log => log.lux).filter(v => v !== undefined && v !== null);
            const luxConfig = { ...SPARKLINE_THRESHOLDS.lux, timestamps };
            updateSparkline('lux-sparkline', luxValues, luxConfig);
        }
    } catch (error) {
        console.error('Failed to load sparklines from storage:', error);
    }
}

/**
 * Update sparkline with fixed scale, threshold gridlines, and time axis
 * @param {string} canvasId - Canvas element ID
 * @param {Array<number>} dataPoints - Data values (chronological)
 * @param {Object} config - Scale and threshold configuration
 * @param {Object} config.range - Fixed y-axis range {min, max}
 * @param {Array} config.thresholds - Threshold definitions [{label, value, color, name}, ...]
 * @param {Array<number>} config.timestamps - Unix timestamps for each data point
 */
export function updateSparkline(canvasId, dataPoints, config = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !dataPoints || dataPoints.length < 2) {
        return; // Need minimum 2 points for sparkline
    }

    const { range = {}, thresholds = [] } = config;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Set canvas size to match actual display size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Reserve space for threshold labels on right (plot fills left edge)
    const rightMargin = 30; // Space for threshold labels
    const plotWidth = width - rightMargin;

    // Determine scale (use fixed range or auto-scale)
    const dataMin = Math.min(...dataPoints);
    const dataMax = Math.max(...dataPoints);
    let min = range.min !== null && range.min !== undefined ? range.min : dataMin;
    let max = range.max !== null && range.max !== undefined ? range.max : dataMax;

    // Expand range if data exceeds fixed bounds (overflow handling)
    if (range.min !== null && dataMin < range.min) min = Math.floor(dataMin);
    if (range.max !== null && dataMax > range.max) max = Math.ceil(dataMax);

    const rangeSpan = max - min || 1; // Avoid division by zero

    // Reserve padding at top and bottom for visual breathing room
    const topPadding = 10; // 10px padding at top
    const bottomPadding = 15; // 15px padding at bottom (for time axis)
    const plotHeight = height - topPadding - bottomPadding;

    // Draw threshold gridlines (full width, behind data)
    if (thresholds.length > 0) {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = '9px system-ui';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        thresholds.forEach(threshold => {
            if (threshold.value >= min && threshold.value <= max) {
                // Calculate y position with padding and snap to pixel boundary for crisp rendering
                let y = topPadding + (plotHeight - ((threshold.value - min) / rangeSpan) * plotHeight);
                y = Math.round(y) + 0.5; // Align to pixel grid (0.5 offset for 1px lines)

                // Draw gridline (full width from left edge)
                ctx.strokeStyle = threshold.color + '18'; // 9% opacity (subtle)
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(plotWidth, y);
                ctx.stroke();

                // Draw tick mark on right edge
                ctx.strokeStyle = threshold.color + '60'; // 38% opacity
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(plotWidth, y);
                ctx.lineTo(plotWidth + 6, y);
                ctx.stroke();

                // Draw threshold label
                ctx.fillStyle = '#9ca3af'; // gray-400 (subtle)
                ctx.fillText(threshold.label, width - 2, y);
            }
        });

        ctx.restore();
    }

    // Calculate data points for plotting (edge-to-edge horizontally, with vertical padding)
    const step = plotWidth / (dataPoints.length - 1);
    const points = dataPoints.map((value, i) => ({
        x: i * step,
        y: topPadding + (plotHeight - ((value - min) / rangeSpan) * plotHeight)
    }));

    // Draw smooth curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // Use quadratic curves for smoothness
    for (let i = 1; i < points.length; i++) {
        const xMid = (points[i - 1].x + points[i].x) / 2;
        const yMid = (points[i - 1].y + points[i].y) / 2;
        ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xMid, yMid);
    }

    // Complete the last segment
    const lastPoint = points[points.length - 1];
    ctx.lineTo(lastPoint.x, lastPoint.y);

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)'; // blue-600 at 70% opacity (increased visibility)
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw time axis (hour markers at bottom)
    if (config.timestamps && config.timestamps.length > 0) {
        ctx.save();
        ctx.font = '9px system-ui';
        ctx.fillStyle = '#9ca3af'; // gray-400
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const firstTime = config.timestamps[0];
        const lastTime = config.timestamps[config.timestamps.length - 1];
        const timeSpan = lastTime - firstTime;

        // Draw hour markers (every hour)
        const hourInterval = 60 * 60; // 1 hour in seconds
        const firstHour = Math.ceil(firstTime / hourInterval) * hourInterval;

        for (let t = firstHour; t <= lastTime; t += hourInterval) {
            // Calculate x position
            const ratio = (t - firstTime) / timeSpan;
            const x = ratio * plotWidth;

            // Draw tick mark
            ctx.strokeStyle = '#d1d5db'; // gray-300
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, height - 3);
            ctx.lineTo(x, height);
            ctx.stroke();

            // Draw hour label (e.g., "9h", "12h")
            const date = new Date(t * 1000);
            const hour = date.getHours();
            ctx.fillText(`${hour}h`, x, height - 4);
        }

        ctx.restore();
    }
}
