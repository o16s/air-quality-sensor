/**
 * Report Statistics Module
 * Computes statistics, event summaries, and GI 2.0 compliance for reports.
 * PDF rendering is in reportPdf.js.
 */

import { detectEvents, formatEventDuration } from '../events/events.js';
import { getLogsByDevice, getLogsByDateRange, getAllDeviceMetadata, getDatabaseStats } from '../storage/storage.js';
import { AIR_QUALITY_THRESHOLDS } from '../shared/constants.js';
import { getAllKnownMetrics, getDetectableMetrics } from '../shared/deviceTypes.js';
import { i18n } from '../shared/i18n.js';

/**
 * Compute statistics from logs
 * @param {Array} logs - Array of log records
 * @returns {Object|null} Statistics object or null if no data
 */
export function computeStatistics(logs) {
    if (!logs || logs.length === 0) {
        return null;
    }

    const stats = {
        totalMeasurements: logs.length,
        period: {
            start: Math.min(...logs.map(l => l.timestamp)),
            end: Math.max(...logs.map(l => l.timestamp))
        },
        byMetric: {}
    };

    // Compute for every known metric found in the data
    for (const metric of getAllKnownMetrics()) {
        const values = logs.map(l => l[metric.key]).filter(v => v != null && !isNaN(v));
        if (values.length > 0) {
            stats.byMetric[metric.key] = {
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values)
            };
        }
    }

    // Backwards-compatible top-level accessors (report UI reads stats.co2, stats.temperature, etc.)
    for (const [key, val] of Object.entries(stats.byMetric)) {
        stats[key] = val;
    }

    return stats;
}

/**
 * Compute event statistics (time in each severity zone)
 * @param {Array} logs - Array of log records
 * @returns {Object} Event statistics by severity and metric
 */
export function computeEventStats(logs) {
    const events = detectEvents(logs);

    // Build byMetric buckets from all detectable metrics (those with thresholds)
    const byMetric = {};
    for (const key of getDetectableMetrics()) {
        byMetric[key] = { count: 0, totalMinutes: 0, peaks: [], durations: [] };
    }

    const stats = {
        yellow: { count: 0, totalMinutes: 0 },
        orange: { count: 0, totalMinutes: 0 },
        red: { count: 0, totalMinutes: 0 },
        byMetric
    };

    for (const event of events) {
        const minutes = Math.round(event.duration / 60);

        // By severity
        if (event.severity && stats[event.severity]) {
            stats[event.severity].count++;
            stats[event.severity].totalMinutes += minutes;
        }

        // By metric - collect individual peak values and durations
        if (event.metric && stats.byMetric[event.metric]) {
            const m = stats.byMetric[event.metric];
            m.count++;
            m.totalMinutes += minutes;
            if (event.peak != null) m.peaks.push(event.peak);
            m.durations.push(minutes);
            if (event.combustionLikely) m.combustionCount = (m.combustionCount || 0) + 1;
        }
    }

    // Compute summary stats per metric
    for (const m of Object.values(stats.byMetric)) {
        if (m.peaks.length > 0) {
            m.peakMin = Math.min(...m.peaks);
            m.peakMax = Math.max(...m.peaks);
            m.peakMean = m.peaks.reduce((a, b) => a + b, 0) / m.peaks.length;
        }
        if (m.durations.length > 0) {
            m.longestEvent = Math.max(...m.durations);
        }
    }

    return stats;
}

/**
 * Compute statistics for each room based on device logs
 * @param {Array} rooms - Array of room objects with deviceSerial
 * @param {Array} allLogs - All logs from all devices
 * @param {number} startTimestamp - Start timestamp (Unix seconds)
 * @param {number} endTimestamp - End timestamp (Unix seconds)
 * @returns {Array} Room stats array
 */
export function computeRoomStats(rooms, allLogs, startTimestamp, endTimestamp) {
    return rooms.map(room => {
        // Filter logs for this room's device
        const roomLogs = allLogs.filter(log =>
            log.deviceSerial === room.deviceSerial &&
            log.timestamp >= startTimestamp &&
            log.timestamp <= endTimestamp
        );

        const stats = computeStatistics(roomLogs);
        const compliance = computeRoomCompliance(stats);
        const eventStats = computeEventStats(roomLogs);

        return {
            room,
            stats,
            compliance,
            eventStats,
            measurementCount: roomLogs.length,
            duration: stats ? Math.ceil((stats.period.end - stats.period.start) / 86400) : 0
        };
    });
}

/**
 * Determine compliance status for a room based on reference values from FORMS.md
 * @param {Object} stats - Statistics object from computeStatistics
 * @returns {Object} Compliance status with per-parameter breakdown
 */
function computeRoomCompliance(stats) {
    if (!stats) {
        return {
            status: 'unknown',
            reason: 'No data',
            co2: null,
            pm25: null,
            pm10: null
        };
    }

    // Check each parameter against reference values
    // Returns: 'ok' (within limits), 'warning' (elevated), 'elevated' (action required), or null (no data)
    const co2Status = stats.co2?.avg != null
        ? (stats.co2.avg <= 1000 ? 'ok' : (stats.co2.avg <= 1500 ? 'warning' : 'elevated'))
        : null;

    const pm25Status = stats.pm25?.avg != null
        ? (stats.pm25.avg <= 15 ? 'ok' : (stats.pm25.avg <= 35 ? 'warning' : 'elevated'))
        : null;

    const pm10Status = stats.pm10?.avg != null
        ? (stats.pm10.avg <= 45 ? 'ok' : (stats.pm10.avg <= 100 ? 'warning' : 'elevated'))
        : null;

    // Overall status is the worst of all parameters
    const statuses = [co2Status, pm25Status, pm10Status].filter(s => s !== null);
    let overallStatus = 'unknown';
    if (statuses.length > 0) {
        if (statuses.includes('elevated')) {
            overallStatus = 'elevated';
        } else if (statuses.includes('warning')) {
            overallStatus = 'warning';
        } else {
            overallStatus = 'ok';
        }
    }

    return {
        status: overallStatus,
        co2: co2Status,
        pm25: pm25Status,
        pm10: pm10Status
    };
}

/**
 * Compute GI 2.0 compliance status
 * @param {Object} stats - Statistics object from computeStatistics
 * @returns {Object} Compliance status {status: 'pass'|'warning'|'fail', reason: string}
 */
export function computeGI2Compliance(stats) {
    if (!stats || !stats.co2 || stats.co2.avg === null) {
        return { status: 'unknown', reason: 'Insufficient CO2 data' };
    }

    const co2Avg = stats.co2.avg;
    const co2Max = stats.co2.max;

    // GI 2.0 criteria (Swiss building standard)
    // Compliant: avg < 1000 ppm AND peak < 1500 ppm
    // Warning: avg < 1500 ppm AND peak < 2000 ppm
    // Not Compliant: otherwise

    if (co2Avg < 1000 && co2Max < 1500) {
        return { status: 'pass', reason: `CO2 avg ${Math.round(co2Avg)} ppm, peak ${Math.round(co2Max)} ppm` };
    } else if (co2Avg < 1500 && co2Max < 2000) {
        return { status: 'warning', reason: `CO2 avg ${Math.round(co2Avg)} ppm, peak ${Math.round(co2Max)} ppm` };
    } else {
        return { status: 'fail', reason: `CO2 avg ${Math.round(co2Avg)} ppm, peak ${Math.round(co2Max)} ppm` };
    }
}

/**
 * Get logs for selected devices and date range
 * @param {string[]} deviceSerials - Array of device serial numbers
 * @param {number} startTimestamp - Start timestamp (Unix seconds)
 * @param {number} endTimestamp - End timestamp (Unix seconds)
 * @returns {Promise<Array>} Combined logs from all devices
 */
export async function getLogsForReport(deviceSerials, startTimestamp, endTimestamp) {
    let allLogs = [];

    for (const serial of deviceSerials) {
        const logs = await getLogsByDateRange(startTimestamp, endTimestamp, serial);
        allLogs = allLogs.concat(logs);
    }

    // Sort by timestamp
    allLogs.sort((a, b) => a.timestamp - b.timestamp);
    return allLogs;
}
