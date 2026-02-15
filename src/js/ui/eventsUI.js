/**
 * Events UI Module
 * Handles events timeline display
 */

import { i18n } from '../shared/i18n.js';
import { getAllLogs, getLogsByDevice } from '../storage/storage.js';
import { detectEvents, formatEventDuration, formatEventTimeRange } from '../events/events.js';
import { getMetricLabelsMap } from '../shared/deviceTypes.js';
import { listenKeys } from 'nanostores';
import { $state, $dataVersion } from './state.js';
import * as state from './state.js';

/**
 * Update events timeline with detected anomalies and threshold violations
 * @param {string|null} deviceSerial - Filter by device serial, or null for all devices
 */
export async function updateEventsTimeline(deviceSerial = null) {
    const container = document.getElementById('events-timeline');
    if (!container) return;

    try {
        // Get all logs for event detection (not limited to 50)
        const logs = deviceSerial
            ? await getLogsByDevice(deviceSerial)
            : await getAllLogs();

        if (logs.length < 10) {
            container.innerHTML = `<p class="text-sm text-gray-500 text-center py-4">${i18n.t('events_notEnoughData')}</p>`;
            return;
        }

        const events = detectEvents(logs);

        if (events.length === 0) {
            container.innerHTML = `<p class="text-sm text-gray-500 text-center py-4">${i18n.t('events_noEvents')}</p>`;
            return;
        }

        // Filter events by time based on dropdown selection
        const currentEventsTimeFilter = state.get('currentEventsTimeFilter');
        const filteredEvents = filterEventsByTime(events, currentEventsTimeFilter);

        if (filteredEvents.length === 0) {
            container.innerHTML = `<p class="text-sm text-gray-500 text-center py-4">${i18n.t('events_noEventsInPeriod')}</p>`;
            return;
        }

        container.innerHTML = filteredEvents.map(renderEventCard).join('');

    } catch (error) {
        console.error('Failed to update events timeline:', error);
        container.innerHTML = `<p class="text-sm text-red-500 text-center py-4">${i18n.t('events_errorDetecting')}</p>`;
    }
}

/**
 * Filter events by time period
 * @param {Array} events - Events to filter
 * @param {string} timeFilter - Time filter: '24h', '7d', '30d', 'all'
 * @returns {Array} Filtered events
 */
export function filterEventsByTime(events, timeFilter) {
    if (timeFilter === 'all') return events;

    const now = Math.floor(Date.now() / 1000);
    const cutoffs = {
        '24h': now - 24 * 60 * 60,
        '7d': now - 7 * 24 * 60 * 60,
        '30d': now - 30 * 24 * 60 * 60
    };

    const cutoff = cutoffs[timeFilter] || 0;
    return events.filter(e => e.startTime >= cutoff);
}

/**
 * Render a single event card
 * @param {Object} event - Event object from detectEvents
 * @returns {string} HTML string for the event card
 */
export function renderEventCard(event) {
    const severityColors = {
        yellow: 'border-yellow-400',
        orange: 'border-orange-500',
        red: 'border-red-500'
    };

    // Default to orange for anomaly-only events
    const borderColor = event.severity
        ? severityColors[event.severity]
        : 'border-orange-400';

    const peakColor = event.severity === 'red' ? 'text-red-600' : 'text-orange-600';

    const timeRange = formatEventTimeRange(event.startTime, event.endTime);
    const duration = formatEventDuration(event.duration);

    // Format peak value
    const peakValue = event.metric === 'co2'
        ? Math.round(event.peak)
        : event.peak.toFixed(1);

    // Format baseline value with unit
    const baselineValue = event.baseline !== undefined
        ? (event.metric === 'co2' ? Math.round(event.baseline) : event.baseline.toFixed(1))
        : null;

    // Detection method badge
    const methodBadge = event.detectionMethod === 'anomaly'
        ? `<span class="text-xs text-gray-400">Z: ${event.maxZScore?.toFixed(1) || '?'}σ</span>`
        : `<span class="text-xs text-gray-400">${i18n.t('events_threshold_' + event.severity)}</span>`;

    // Combustion indicator (PM2.5 + PM10 correlated)
    const combustionBadge = event.combustionLikely
        ? `<span class="inline-flex items-center ml-2 text-xs text-orange-600 cursor-help" title="${i18n.t('events_combustionTooltip')}">
            <svg class="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
            </svg>
            ${i18n.t('events_combustion')}
          </span>`
        : '';

    return `
        <div class="border-l-4 ${borderColor} bg-gray-50 p-3 mb-2 rounded-r">
            <div class="flex justify-between items-start">
                <div>
                    <div class="text-sm font-medium text-gray-900">${timeRange}</div>
                    <div class="text-sm mt-1">
                        <span class="text-gray-600">${i18n.t('events_peak', { metric: getMetricLabel(event.metric) })}:</span>
                        <span class="${peakColor} font-semibold">${peakValue} ${event.unit}</span>
                        ${baselineValue !== null ? `<span class="text-gray-400 text-xs ml-1 cursor-help border-b border-dotted border-gray-400" title="Baseline = median of all readings for this metric">(${i18n.t('events_baseline')}: ${baselineValue} ${event.unit})</span>` : ''}
                    </div>
                    <div class="mt-1 flex items-center">${methodBadge}${combustionBadge}</div>
                </div>
                <div class="text-sm text-gray-500 whitespace-nowrap">${duration}</div>
            </div>
        </div>
    `;
}

/**
 * Get display label for metric
 * @param {string} metric - Metric identifier
 * @returns {string} Human-readable label
 */
export function getMetricLabel(metric) {
    const labels = getMetricLabelsMap();
    // Use subscript variant for CO2 in event display
    if (metric === 'co2') return 'CO\u2082';
    return labels[metric] || metric;
}

// ── Reactive subscriptions ────────────────────────────────────────────

listenKeys($state, ['historyDeviceSerial', 'currentEventsTimeFilter'], (value) => {
    updateEventsTimeline(value.historyDeviceSerial);
});

$dataVersion.listen(() => {
    updateEventsTimeline($state.get().historyDeviceSerial);
});
