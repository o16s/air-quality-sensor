/**
 * Event Detection Module
 * Detects air quality anomalies using MAD-based z-scores and threshold violations
 */

import { AIR_QUALITY_THRESHOLDS } from './constants.js';

// Event detection configuration
const EVENT_CONFIG = {
    // MAD-based anomaly detection (relative spikes)
    anomaly: {
        pm25: { madThreshold: 3.5, minDurationSec: 300 },
        pm10: { madThreshold: 3.5, minDurationSec: 300 },
        co2:  { madThreshold: 3.0, minDurationSec: 600 }
    },
    // Minimum duration by severity (filters noise for minor violations)
    minDurationBySeverity: {
        yellow: 300,  // 5 minutes - filter out brief yellow blips
        orange: 60,   // 1 minute - more sensitive for moderate violations
        red: 0        // immediate - always show severe violations
    },
    // Minimum gap between events to keep them separate (seconds)
    mergeGapSec: 600
};

/**
 * Get threshold values for a metric from unified config
 */
function getMetricThresholds(metric) {
    const config = AIR_QUALITY_THRESHOLDS[metric];
    if (!config) return null;
    return {
        yellow: config.levels.good.max,    // >= good.max means yellow
        orange: config.levels.yellow.max,  // >= yellow.max means orange
        red: config.levels.orange.max      // >= orange.max means red
    };
}

/**
 * Main entry point - detect all events in logs
 * @param {Array} logs - Array of log records
 * @returns {Array} Array of detected events, sorted by time descending
 */
export function detectEvents(logs) {
    if (!logs || logs.length < 10) return [];

    // Sort logs by timestamp ascending for processing
    const sortedLogs = [...logs].sort((a, b) => a.timestamp - b.timestamp);

    const events = [];

    // 1. MAD-based anomaly detection (finds relative spikes)
    for (const metric of ['pm25', 'pm10', 'co2']) {
        const anomalies = detectAnomalies(sortedLogs, metric);
        events.push(...anomalies);
    }

    // 2. Threshold violations (absolute health limits)
    for (const metric of ['pm25', 'pm10', 'co2']) {
        const violations = detectThresholdViolations(sortedLogs, metric);
        events.push(...violations);
    }

    // Merge overlapping events and sort by time descending
    const merged = mergeOverlappingEvents(events);

    // 3. Detect combustion correlation (PM2.5 + PM10 together)
    detectCombustionCorrelation(merged);

    return merged.sort((a, b) => b.startTime - a.startTime);
}

/**
 * Detect combustion events by correlating PM2.5 and PM10 spikes
 * When both spike together, it indicates combustion (smoking, cooking, vehicle exhaust)
 * Mutates events in place to add combustionLikely flag
 */
function detectCombustionCorrelation(events) {
    const pm25Events = events.filter(e => e.metric === 'pm25');
    const pm10Events = events.filter(e => e.metric === 'pm10');

    for (const pm25 of pm25Events) {
        for (const pm10 of pm10Events) {
            // Check if events overlap in time
            if (eventsOverlap(pm25, pm10)) {
                pm25.combustionLikely = true;
                pm10.combustionLikely = true;
            }
        }
    }
}

/**
 * Check if two events overlap in time (with 5 minute tolerance)
 */
function eventsOverlap(a, b) {
    const tolerance = 300; // 5 minutes
    const aStart = a.startTime - tolerance;
    const aEnd = a.endTime + tolerance;
    const bStart = b.startTime - tolerance;
    const bEnd = b.endTime + tolerance;

    return aStart <= bEnd && bStart <= aEnd;
}

/**
 * Detect anomalies using Modified Z-Score (MAD-based)
 * More robust than standard z-score - resistant to outliers
 */
function detectAnomalies(logs, metric) {
    const config = EVENT_CONFIG.anomaly[metric];
    if (!config) return [];

    const values = logs.map(l => l[metric]).filter(v => v != null && !isNaN(v));
    if (values.length < 10) return [];

    const median = percentile(values, 50);
    const mad = medianAbsoluteDeviation(values);

    // If MAD is 0 (constant data), skip anomaly detection
    if (mad === 0) return [];

    // Find contiguous periods above threshold
    const events = [];
    let currentEvent = null;

    for (const log of logs) {
        const value = log[metric];
        if (value == null || isNaN(value)) continue;

        // Modified z-score: 0.6745 makes it comparable to standard z-score for normal data
        const modifiedZ = 0.6745 * (value - median) / mad;
        const isAnomaly = modifiedZ > config.madThreshold;

        if (isAnomaly) {
            if (!currentEvent) {
                currentEvent = {
                    startTime: log.timestamp,
                    endTime: log.timestamp,
                    metric,
                    peak: value,
                    peakTime: log.timestamp,
                    baseline: median,
                    maxZScore: modifiedZ,
                    detectionMethod: 'anomaly'
                };
            } else {
                currentEvent.endTime = log.timestamp;
                if (value > currentEvent.peak) {
                    currentEvent.peak = value;
                    currentEvent.peakTime = log.timestamp;
                }
                if (modifiedZ > currentEvent.maxZScore) {
                    currentEvent.maxZScore = modifiedZ;
                }
            }
        } else if (currentEvent) {
            // End of anomaly period
            const duration = currentEvent.endTime - currentEvent.startTime;
            if (duration >= config.minDurationSec) {
                events.push(finalizeEvent(currentEvent));
            }
            currentEvent = null;
        }
    }

    // Don't forget last event
    if (currentEvent) {
        const duration = currentEvent.endTime - currentEvent.startTime;
        if (duration >= config.minDurationSec) {
            events.push(finalizeEvent(currentEvent));
        }
    }

    return events;
}

/**
 * Detect threshold violations (absolute limits)
 */
function detectThresholdViolations(logs, metric) {
    const thresholds = getMetricThresholds(metric);
    if (!thresholds) return [];

    const events = [];
    let currentEvent = null;

    for (const log of logs) {
        const value = log[metric];
        if (value == null || isNaN(value)) continue;

        // Determine severity level
        let severity = null;
        if (value >= thresholds.red) severity = 'red';
        else if (value >= thresholds.orange) severity = 'orange';
        else if (value >= thresholds.yellow) severity = 'yellow';

        if (severity) {
            if (!currentEvent) {
                currentEvent = {
                    startTime: log.timestamp,
                    endTime: log.timestamp,
                    metric,
                    peak: value,
                    peakTime: log.timestamp,
                    threshold: thresholds[severity],
                    severity,
                    detectionMethod: 'threshold'
                };
            } else {
                currentEvent.endTime = log.timestamp;
                if (value > currentEvent.peak) {
                    currentEvent.peak = value;
                    currentEvent.peakTime = log.timestamp;
                    // Update severity if worse
                    if (value >= thresholds.red) currentEvent.severity = 'red';
                    else if (value >= thresholds.orange) currentEvent.severity = 'orange';
                }
            }
        } else if (currentEvent) {
            // Check minimum duration based on severity before adding
            if (meetsMinDuration(currentEvent)) {
                events.push(finalizeEvent(currentEvent));
            }
            currentEvent = null;
        }
    }

    if (currentEvent && meetsMinDuration(currentEvent)) {
        events.push(finalizeEvent(currentEvent));
    }

    return events;
}

/**
 * Check if event meets minimum duration requirement based on severity
 */
function meetsMinDuration(event) {
    const duration = event.endTime - event.startTime;
    const minDuration = EVENT_CONFIG.minDurationBySeverity[event.severity] || 0;
    return duration >= minDuration;
}

/**
 * Finalize event with computed fields
 */
function finalizeEvent(event) {
    const duration = event.endTime - event.startTime;
    const unit = getMetricUnit(event.metric);

    return {
        id: `${event.metric}_${event.startTime}`,
        ...event,
        duration,
        unit,
        title: generateEventTitle(event),
        description: generateEventDescription(event)
    };
}

/**
 * Merge events that overlap or are close in time
 */
function mergeOverlappingEvents(events) {
    if (events.length === 0) return [];

    // Sort by start time
    const sorted = [...events].sort((a, b) => a.startTime - b.startTime);
    const merged = [];

    for (const event of sorted) {
        const last = merged[merged.length - 1];

        // Check if this event overlaps with or is close to the last one
        if (last &&
            event.startTime <= last.endTime + EVENT_CONFIG.mergeGapSec &&
            event.metric === last.metric) {
            // Merge: extend end time and update peak if needed
            last.endTime = Math.max(last.endTime, event.endTime);
            last.duration = last.endTime - last.startTime;
            if (event.peak > last.peak) {
                last.peak = event.peak;
                last.peakTime = event.peakTime;
            }
            // Keep the more severe detection method
            if (event.detectionMethod === 'threshold' && last.detectionMethod === 'anomaly') {
                last.detectionMethod = 'both';
                last.severity = event.severity;
                last.threshold = event.threshold;
            }
            // Regenerate description
            last.title = generateEventTitle(last);
            last.description = generateEventDescription(last);
        } else {
            merged.push(event);
        }
    }

    return merged;
}

// --- Helper Functions ---

function percentile(values, p) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    if (lower === upper) return sorted[lower];
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function medianAbsoluteDeviation(values) {
    const median = percentile(values, 50);
    const deviations = values.map(v => Math.abs(v - median));
    return percentile(deviations, 50);
}

function getMetricUnit(metric) {
    const units = {
        pm25: 'μg/m³',
        pm10: 'μg/m³',
        co2: 'ppm'
    };
    return units[metric] || '';
}

function getMetricLabel(metric) {
    const labels = {
        pm25: 'PM2.5',
        pm10: 'PM10',
        co2: 'CO₂'
    };
    return labels[metric] || metric;
}

function generateEventTitle(event) {
    const label = getMetricLabel(event.metric);
    if (event.detectionMethod === 'anomaly') {
        return `${label} Spike Detected`;
    } else if (event.detectionMethod === 'threshold') {
        return `${label} Threshold Exceeded`;
    }
    return `${label} Event`;
}

function generateEventDescription(event) {
    const unit = event.unit;
    const peak = event.metric === 'co2' ? Math.round(event.peak) : event.peak.toFixed(1);

    if (event.baseline !== undefined) {
        const baseline = event.metric === 'co2' ? Math.round(event.baseline) : event.baseline.toFixed(1);
        return `Peak: ${peak} ${unit} (baseline: ${baseline} ${unit})`;
    }
    return `Peak: ${peak} ${unit}`;
}

/**
 * Format duration in human-readable form
 */
export function formatEventDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

/**
 * Format event time range
 */
export function formatEventTimeRange(startTime, endTime) {
    const start = new Date(startTime * 1000);
    const end = new Date(endTime * 1000);

    const dateOpts = { month: 'short', day: 'numeric' };
    const timeOpts = { hour: '2-digit', minute: '2-digit', hour12: false };

    const startDate = start.toLocaleDateString(undefined, dateOpts);
    const startTimeStr = start.toLocaleTimeString(undefined, timeOpts);
    const endTimeStr = end.toLocaleTimeString(undefined, timeOpts);

    // Same day?
    if (start.toDateString() === end.toDateString()) {
        return `${startDate}, ${startTimeStr}–${endTimeStr}`;
    }

    const endDate = end.toLocaleDateString(undefined, dateOpts);
    return `${startDate} ${startTimeStr} – ${endDate} ${endTimeStr}`;
}
