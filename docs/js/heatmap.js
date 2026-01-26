/**
 * Heatmap Data Generation Module
 * GitHub-style heatmap for air quality visualization
 */

import { AIR_QUALITY_THRESHOLDS, getColorForValue } from './constants.js';

/**
 * Format date as YYYY-MM-DD using local time (not UTC)
 */
function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/**
 * Generate heatmap data from logs
 * @param {Array} logs - Array of log records
 * @param {string} metric - Metric to visualize ('pm25', 'pm10', 'co2')
 * @param {Object} options - Configuration options
 * @returns {Object} Heatmap data structure
 */
export function generateHeatmapData(logs, metric, options = {}) {
    const {
        startHour = 0,      // Midnight
        endHour = 24,       // Full 24 hours
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

        const dayKey = formatLocalDate(date);  // YYYY-MM-DD
        const key = `${dayKey}_${hour}`;

        if (!buckets[key]) {
            buckets[key] = { sum: 0, count: 0, day: dayKey, hour };
        }
        buckets[key].sum += log[metric];
        buckets[key].count++;
    }

    // Generate day labels (rows - dates as short form "23.1.")
    const dayLabels = [];
    for (let d = 0; d < days; d++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + d);
        dayLabels.push({
            key: formatLocalDate(date),
            label: `${date.getDate()}.${date.getMonth() + 1}.`,
            date
        });
    }

    // Generate hour labels (columns - 24h format)
    const hourLabels = [];
    for (let h = startHour; h < endHour; h++) {
        hourLabels.push({
            hour: h,
            label: `${h}`
        });
    }

    // Build grid: rows = days, columns = hours
    const grid = [];
    for (const day of dayLabels) {
        const row = [];
        for (let h = startHour; h < endHour; h++) {
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
