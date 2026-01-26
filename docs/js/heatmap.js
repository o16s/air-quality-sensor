/**
 * Heatmap Data Generation Module
 * GitHub-style heatmap for air quality visualization
 */

import { AIR_QUALITY_THRESHOLDS, getColorForValue } from './constants.js';

/**
 * Generate heatmap data from logs
 * @param {Array} logs - Array of log records
 * @param {string} metric - Metric to visualize ('pm25', 'pm10', 'co2')
 * @param {Object} options - Configuration options
 * @returns {Object} Heatmap data structure
 */
export function generateHeatmapData(logs, metric, options = {}) {
    const {
        startHour = 7,      // 7am
        endHour = 19,       // 7pm (exclusive, so last row is 6pm)
        days = 14           // Last 14 days
    } = options;

    const config = AIR_QUALITY_THRESHOLDS[metric];
    if (!config) {
        return { grid: [], dayLabels: [], hourLabels: [], metric, error: 'Unknown metric' };
    }

    // Calculate time boundaries
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    // Filter logs to date range and valid values
    const filteredLogs = logs.filter(log =>
        log.timestamp >= startTimestamp &&
        log.timestamp <= endTimestamp &&
        log[metric] != null &&
        !isNaN(log[metric])
    );

    // Group logs by day and hour
    const buckets = {};  // key: "YYYY-MM-DD_HH" -> { sum, count }

    for (const log of filteredLogs) {
        const date = new Date(log.timestamp * 1000);
        const hour = date.getHours();

        // Only include office hours
        if (hour < startHour || hour >= endHour) continue;

        const dayKey = date.toISOString().split('T')[0];  // YYYY-MM-DD
        const key = `${dayKey}_${hour}`;

        if (!buckets[key]) {
            buckets[key] = { sum: 0, count: 0, day: dayKey, hour };
        }
        buckets[key].sum += log[metric];
        buckets[key].count++;
    }

    // Generate day labels (columns)
    const dayLabels = [];
    for (let d = 0; d < days; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + d);
        dayLabels.push({
            key: date.toISOString().split('T')[0],
            label: date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
            date
        });
    }

    // Generate hour labels (rows)
    const hourLabels = [];
    for (let h = startHour; h < endHour; h++) {
        const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
        const ampm = h >= 12 ? 'pm' : 'am';
        hourLabels.push({
            hour: h,
            label: `${hour12}${ampm}`
        });
    }

    // Build grid: rows = hours, columns = days
    const grid = [];
    for (let h = startHour; h < endHour; h++) {
        const row = [];
        for (const day of dayLabels) {
            const key = `${day.key}_${h}`;
            const bucket = buckets[key];

            if (bucket && bucket.count > 0) {
                const avg = bucket.sum / bucket.count;
                row.push({
                    value: avg,
                    count: bucket.count,
                    day: day.key,
                    hour: h,
                    color: getColorForValue(metric, avg)
                });
            } else {
                row.push({
                    value: null,
                    count: 0,
                    day: day.key,
                    hour: h,
                    color: '#f3f4f6'  // gray-100 for empty
                });
            }
        }
        grid.push(row);
    }

    return {
        grid,
        dayLabels,
        hourLabels,
        metric,
        unit: config.unit,
        label: config.label
    };
}

/**
 * Format a heatmap cell tooltip
 */
export function formatHeatmapTooltip(cell, unit, dayLabels, hourLabels) {
    const dayLabel = dayLabels.find(d => d.key === cell.day)?.label || cell.day;
    const hourLabel = hourLabels.find(h => h.hour === cell.hour)?.label || `${cell.hour}:00`;

    if (cell.value === null) {
        return `${dayLabel}, ${hourLabel}: No data`;
    }

    const value = cell.value.toFixed(1);
    return `${dayLabel}, ${hourLabel}: ${value} ${unit} (${cell.count} readings)`;
}
