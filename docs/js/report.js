/**
 * PDF Report Generation Module
 * Generates professional air quality audit reports
 */

import { detectEvents, formatEventDuration } from './events.js';
import { getLogsByDevice, getLogsByDateRange, getAllDeviceMetadata, getDatabaseStats } from './storage.js';
import { AIR_QUALITY_THRESHOLDS } from './constants.js';
import { i18n } from './i18n.js';

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
        co2: { avg: null, min: null, max: null },
        pm25: { avg: null, min: null, max: null },
        pm10: { avg: null, min: null, max: null },
        temperature: { avg: null, min: null, max: null },
        humidity: { avg: null, min: null, max: null },
        lux: { avg: null, min: null, max: null }
    };

    // Compute for each metric
    for (const metric of ['co2', 'pm25', 'pm10', 'temperature', 'humidity', 'lux']) {
        const values = logs.map(l => l[metric]).filter(v => v != null && !isNaN(v));
        if (values.length > 0) {
            stats[metric] = {
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values)
            };
        }
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

    const stats = {
        yellow: { count: 0, totalMinutes: 0 },
        orange: { count: 0, totalMinutes: 0 },
        red: { count: 0, totalMinutes: 0 },
        byMetric: {
            pm25: { count: 0, totalMinutes: 0, peaks: [], durations: [] },
            pm10: { count: 0, totalMinutes: 0, peaks: [], durations: [] },
            co2: { count: 0, totalMinutes: 0, peaks: [], durations: [] }
        }
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
    for (const metric of ['pm25', 'pm10', 'co2']) {
        const m = stats.byMetric[metric];
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
 * Format duration in human-readable form
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
function formatDuration(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

/**
 * Format date for display
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date
 */
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('de-CH', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Render report preview HTML
 * @param {Object} config - Report configuration
 * @returns {string} HTML string for the report preview
 */
export function renderReportPreview(config) {
    const {
        organization = 'Octanis Instrumente GmbH',
        author = '',
        contact = '',
        logoUrl = null,
        title = 'Indoor Air Quality Audit',
        buildingLocation = null,
        buildingPhotoUrl = null,
        introText = '',
        legalText = '',
        stats,
        eventStats,
        gi2Status,
        gi2Override,
        findings = [],
        recommendations = [],
        dateStart,
        dateEnd,
        deviceNames = [],
        roomStats = []
    } = config;

    // Use override if set, otherwise computed status
    const complianceStatus = gi2Override !== 'auto' ? gi2Override : (gi2Status?.status || 'unknown');
    const complianceReason = gi2Override !== 'auto'
        ? i18n.t('report_gi2_manual_override')
        : (gi2Status?.reason || i18n.t('report_no_data_available'));

    // Format date range
    const periodText = dateStart && dateEnd
        ? `${formatDate(dateStart / 1000)} - ${formatDate(dateEnd / 1000)}`
        : i18n.t('report_no_period');

    // Calculate days
    const days = dateStart && dateEnd
        ? Math.ceil((dateEnd - dateStart) / (1000 * 60 * 60 * 24))
        : 0;

    // Section numbering
    let sectionNumber = 0;
    const nextSection = () => ++sectionNumber;
    // Track introduction section number for subsections
    let introSectionNum = 0;
    let resultsSectionNum = 0;

    return `
        <div class="bg-white p-8 min-h-[1120px]" style="width: 794px; font-family: 'Helvetica Neue', Arial, sans-serif;">
            <style>
                .report-section { page-break-inside: avoid; }
                table { page-break-inside: auto; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
            </style>

            <!-- Header -->
            <div class="report-section border-b-2 border-gray-300 pb-4 mb-6">
                <div class="flex justify-between items-start">
                    <div class="flex items-start gap-4">
                        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="h-12 w-auto object-contain">` : ''}
                        <div>
                            <h1 class="text-xl font-bold text-gray-900">${escapeHtml(title)}</h1>
                            <p class="text-xs text-gray-700 mt-1">${escapeHtml(organization)}</p>
                        </div>
                    </div>
                    <div class="text-right text-gray-500 text-xs">
                        <p>${i18n.t('report_generated_on')}</p>
                        <p class="font-medium">${new Date().toLocaleDateString('de-CH')}</p>
                        ${author ? `<p class="mt-2">${i18n.t('report_author')}: ${escapeHtml(author)}</p>` : ''}
                    </div>
                </div>
                ${buildingLocation ? `<p class="text-xs text-gray-700 mt-3">${escapeHtml(buildingLocation.name || '')}${buildingLocation.city ? ', ' + escapeHtml(buildingLocation.city) : ''}</p>` : ''}
                <p class="text-xs text-gray-700">${i18n.t('report_period')}: ${periodText}</p>
            </div>

            ${buildingPhotoUrl ? `
            <!-- Building Photo -->
            <div class="report-section mb-6">
                <img src="${buildingPhotoUrl}" alt="" class="w-full max-h-64 object-contain rounded">
            </div>
            ` : ''}

            ${introText ? `
            <!-- Introduction -->
            <div class="report-section mb-6">
                ${(() => { introSectionNum = nextSection(); return ''; })()}
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${introSectionNum}. ${i18n.t('report_intro_title')}</h2>
                <p class="text-xs text-gray-700">${escapeHtml(introText)}</p>
            </div>
            ` : ''}

            ${legalText ? `
            <div class="report-section mb-6">
                ${introText ? '' : (() => { introSectionNum = nextSection(); return ''; })()}
                <h3 class="text-xs font-semibold text-gray-700 mb-1">${introSectionNum ? introSectionNum + '.1 ' : ''}${i18n.t('report_intro_legal_title')}</h3>
                <p class="text-xs text-gray-700">${escapeHtml(legalText)}</p>
            </div>
            ` : ''}

            <!-- Executive Summary -->
            <div class="report-section mb-6">
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${nextSection()}. ${i18n.t('report_executive_summary')}</h2>
                <p class="text-xs text-gray-700">
                    ${i18n.t('report_executive_body_days', { days })}
                    ${stats ? i18n.t('report_executive_body_measurements', { total: stats.totalMeasurements.toLocaleString() }) : ''}.
                    ${complianceStatus === 'pass' ? i18n.t('report_executive_pass') : ''}
                    ${complianceStatus === 'warning' ? i18n.t('report_executive_warning') : ''}
                    ${complianceStatus === 'fail' ? i18n.t('report_executive_fail') : ''}
                </p>
            </div>

            ${buildingLocation ? `
            <!-- Building Information -->
            <div class="report-section mb-4">
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${nextSection()}. ${i18n.t('report_building_info')}</h2>
                <table class="w-full text-xs">
                    <tbody>
                        ${buildingLocation.name ? `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 text-gray-500 w-1/3">${i18n.t('location_name')}</td>
                            <td class="py-1 text-gray-800">${escapeHtml(buildingLocation.name)}</td>
                        </tr>` : ''}
                        ${buildingLocation.street || buildingLocation.city ? `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 text-gray-500">${i18n.t('location_address')}</td>
                            <td class="py-1 text-gray-800">${escapeHtml([buildingLocation.street, buildingLocation.postalCode, buildingLocation.city].filter(Boolean).join(', '))}</td>
                        </tr>` : ''}
                        ${buildingLocation.buildingCategory ? `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 text-gray-500">${i18n.t('location_building_category')}</td>
                            <td class="py-1 text-gray-800">${i18n.t('building_' + buildingLocation.buildingCategory)}</td>
                        </tr>` : ''}
                        ${buildingLocation.constructionYear ? `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 text-gray-500">${i18n.t('location_construction')}</td>
                            <td class="py-1 text-gray-800">${escapeHtml(buildingLocation.constructionYear)}${buildingLocation.lastRenovation ? ` (${i18n.t('location_renovated')} ${escapeHtml(buildingLocation.lastRenovation)})` : ''}</td>
                        </tr>` : ''}
                        ${buildingLocation.foundationStructure ? `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 text-gray-500">${i18n.t('location_foundation')}</td>
                            <td class="py-1 text-gray-800">${i18n.t('foundation_' + buildingLocation.foundationStructure)}${buildingLocation.basement ? ', ' + i18n.t('basement_' + buildingLocation.basement) : ''}${buildingLocation.hillsideLocation ? ', ' + i18n.t('location_hillside') : ''}</td>
                        </tr>` : ''}
                        ${buildingLocation.ventilationType ? `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 text-gray-500">${i18n.t('location_ventilation')}</td>
                            <td class="py-1 text-gray-800">${i18n.t('ventilation_' + buildingLocation.ventilationType)}${buildingLocation.ventilationDetails ? ' - ' + escapeHtml(buildingLocation.ventilationDetails) : ''}</td>
                        </tr>` : ''}
                    </tbody>
                </table>
            </div>

            ${buildingLocation.rooms && buildingLocation.rooms.length > 0 ? `
            <!-- Measurement Locations (Rooms) -->
            <div class="report-section mb-4">
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${nextSection()}. ${i18n.t('report_measurement_locations')}</h2>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_name')}</th>
                            <th class="text-left py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_floor')}</th>
                            <th class="text-left py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_type')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_area')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_ceiling_height')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_sensor_height')}</th>
                            <th class="text-right py-1 text-gray-600 font-medium">${i18n.t('report_sensor_id')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${buildingLocation.rooms.map(room => `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 pr-2">${escapeHtml(room.name) || '-'}</td>
                            <td class="py-1 pr-2">${escapeHtml(room.floor) || '-'}</td>
                            <td class="py-1 pr-2">${i18n.t('room_' + room.roomType)}</td>
                            <td class="py-1 pr-2 text-right">${room.area ? room.area + ' m²' : '-'}</td>
                            <td class="py-1 pr-2 text-right">${room.ceilingHeight ? room.ceilingHeight + ' m' : '-'}</td>
                            <td class="py-1 pr-2 text-right">${room.sensorHeight ? room.sensorHeight + ' m' : '-'}</td>
                            <td class="py-1 text-right">${escapeHtml(room.deviceSerial) || '-'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
            ` : ''}

            <!-- Measurement Results - Air Quality -->
            ${roomStats.length > 0 ? `
            <div class="report-section mb-4">
                ${(() => { resultsSectionNum = nextSection(); return ''; })()}
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${resultsSectionNum}. ${i18n.t('report_measurement_results')}</h2>
                <h3 class="text-xs font-semibold text-gray-700 mb-1">${resultsSectionNum}.1 ${i18n.t('report_air_quality_params')}</h3>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_name')}</th>
                            <th class="text-left py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_floor')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_n_measurements')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">CO2 Ø</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">CO2 Max</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">PM2.5 Ø</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">PM2.5 Max</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">PM10 Ø</th>
                            <th class="text-right py-1 text-gray-600 font-medium">PM10 Max</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${roomStats.map(rs => `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 pr-2">${escapeHtml(rs.room.name) || '-'}</td>
                            <td class="py-1 pr-2">${escapeHtml(rs.room.floor) || '-'}</td>
                            <td class="py-1 pr-2 text-right">${rs.measurementCount > 0 ? rs.measurementCount : '-'}</td>
                            <td class="py-1 pr-2 text-right ${rs.compliance.co2 === 'warning' ? 'text-yellow-600' : rs.compliance.co2 === 'elevated' ? 'text-red-600 font-medium' : ''}">${rs.stats?.co2?.avg != null ? Math.round(rs.stats.co2.avg) : '-'}</td>
                            <td class="py-1 pr-2 text-right">${rs.stats?.co2?.max != null ? Math.round(rs.stats.co2.max) : '-'}</td>
                            <td class="py-1 pr-2 text-right ${rs.compliance.pm25 === 'warning' ? 'text-yellow-600' : rs.compliance.pm25 === 'elevated' ? 'text-red-600 font-medium' : ''}">${rs.stats?.pm25?.avg != null ? rs.stats.pm25.avg.toFixed(1) : '-'}</td>
                            <td class="py-1 pr-2 text-right">${rs.stats?.pm25?.max != null ? rs.stats.pm25.max.toFixed(1) : '-'}</td>
                            <td class="py-1 pr-2 text-right ${rs.compliance.pm10 === 'warning' ? 'text-yellow-600' : rs.compliance.pm10 === 'elevated' ? 'text-red-600 font-medium' : ''}">${rs.stats?.pm10?.avg != null ? rs.stats.pm10.avg.toFixed(1) : '-'}</td>
                            <td class="py-1 text-right">${rs.stats?.pm10?.max != null ? rs.stats.pm10.max.toFixed(1) : '-'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p class="text-xs text-gray-400 mt-1">${i18n.t('report_units_note')}</p>

                <!-- Comfort Parameters -->
                <h3 class="text-xs font-semibold text-gray-700 mt-3 mb-1">${resultsSectionNum}.2 ${i18n.t('report_comfort_params')}</h3>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_name')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_temp_avg')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_temp_min')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_temp_max')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_humidity_avg')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_humidity_min')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_humidity_max')}</th>
                            <th class="text-right py-1 text-gray-600 font-medium">${i18n.t('report_lux_avg')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${roomStats.map(rs => `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 pr-2">${escapeHtml(rs.room.name) || '-'}</td>
                            <td class="py-1 pr-2 text-right">${rs.stats?.temperature?.avg != null ? rs.stats.temperature.avg.toFixed(1) : '-'}</td>
                            <td class="py-1 pr-2 text-right">${rs.stats?.temperature?.min != null ? rs.stats.temperature.min.toFixed(1) : '-'}</td>
                            <td class="py-1 pr-2 text-right">${rs.stats?.temperature?.max != null ? rs.stats.temperature.max.toFixed(1) : '-'}</td>
                            <td class="py-1 pr-2 text-right">${rs.stats?.humidity?.avg != null ? rs.stats.humidity.avg.toFixed(0) : '-'}</td>
                            <td class="py-1 pr-2 text-right">${rs.stats?.humidity?.min != null ? rs.stats.humidity.min.toFixed(0) : '-'}</td>
                            <td class="py-1 pr-2 text-right">${rs.stats?.humidity?.max != null ? rs.stats.humidity.max.toFixed(0) : '-'}</td>
                            <td class="py-1 text-right">${rs.stats?.lux?.avg != null ? Math.round(rs.stats.lux.avg) : '-'}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p class="text-xs text-gray-400 mt-1">${i18n.t('report_comfort_units_note')}</p>
            </div>
            ` : (stats ? '' : `<p class="text-gray-400 mb-4">${i18n.t('report_no_measurement_data')}</p>`)}

            <!-- Reference Values & Assessment Criteria -->
            ${roomStats.length > 0 ? `
            <div class="report-section mb-4">
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${nextSection()}. ${i18n.t('report_reference_values')}</h2>
                <p class="text-xs text-gray-700 mb-1">${i18n.t('report_assessment_criteria_note')}</p>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-1 pr-3 text-gray-600 font-medium">${i18n.t('report_parameter')}</th>
                            <th class="text-left py-1 pr-3 text-gray-600 font-medium">${i18n.t('report_acceptable')}</th>
                            <th class="text-left py-1 pr-3 font-medium text-yellow-600">${i18n.t('report_status_warning')}</th>
                            <th class="text-left py-1 pr-3 font-medium text-red-600">${i18n.t('report_action_required')}</th>
                            <th class="text-left py-1 text-gray-600 font-medium">${i18n.t('report_standard')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-100">
                            <td class="py-1 pr-3">CO2</td>
                            <td class="py-1 pr-3">≤ 1000 ppm</td>
                            <td class="py-1 pr-3 text-yellow-600">1001-1500 ppm</td>
                            <td class="py-1 pr-3 text-red-600">&gt; 1500 ppm</td>
                            <td class="py-1 text-gray-500">SIA 382/1</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                            <td class="py-1 pr-3">PM2.5</td>
                            <td class="py-1 pr-3">≤ 15 µg/m³</td>
                            <td class="py-1 pr-3 text-yellow-600">16-35 µg/m³</td>
                            <td class="py-1 pr-3 text-red-600">&gt; 35 µg/m³</td>
                            <td class="py-1 text-gray-500">WHO 2021</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                            <td class="py-1 pr-3">PM10</td>
                            <td class="py-1 pr-3">≤ 45 µg/m³</td>
                            <td class="py-1 pr-3 text-yellow-600">46-100 µg/m³</td>
                            <td class="py-1 pr-3 text-red-600">&gt; 100 µg/m³</td>
                            <td class="py-1 text-gray-500">WHO 2021</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                            <td class="py-1 pr-3">${i18n.t('sensor_temperature')}</td>
                            <td class="py-1 pr-3">18-24 °C</td>
                            <td class="py-1 pr-3 text-yellow-600">16-18 / 24-26 °C</td>
                            <td class="py-1 pr-3 text-red-600">&lt; 16 / &gt; 26 °C</td>
                            <td class="py-1 text-gray-500">SIA 180</td>
                        </tr>
                        <tr class="border-b border-gray-100">
                            <td class="py-1 pr-3">${i18n.t('sensor_humidity')}</td>
                            <td class="py-1 pr-3">30-70 %</td>
                            <td class="py-1 pr-3 text-yellow-600">20-30 / 70-80 %</td>
                            <td class="py-1 pr-3 text-red-600">&lt; 20 / &gt; 80 %</td>
                            <td class="py-1 text-gray-500">SIA 180</td>
                        </tr>
                    </tbody>
                </table>
                <p class="text-xs text-gray-400 mt-1">${i18n.t('report_assessment_applies_to_avg')}</p>
            </div>
            ` : ''}

            <!-- GI 2.0 Compliance -->
            <div class="report-section mb-4">
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${nextSection()}. ${i18n.t('report_gi2_compliance_title')}</h2>
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${
                        complianceStatus === 'pass' ? 'bg-green-100 text-green-800' :
                        complianceStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        complianceStatus === 'fail' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-600'
                    }">
                        ${complianceStatus === 'pass' ? i18n.t('report_gi2Pass') :
                          complianceStatus === 'warning' ? i18n.t('report_gi2Warning') :
                          complianceStatus === 'fail' ? i18n.t('report_gi2Fail') : i18n.t('report_gi2Unknown')}
                    </span>
                    <span class="text-xs text-gray-700">${escapeHtml(complianceReason)}</span>
                </div>
            </div>

            <!-- Event Statistics by Room and Parameter -->
            ${roomStats.some(rs => rs.eventStats && (rs.eventStats.byMetric.co2.count > 0 || rs.eventStats.byMetric.pm25.count > 0 || rs.eventStats.byMetric.pm10.count > 0)) ? `
            <div class="report-section mb-4">
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${nextSection()}. ${i18n.t('report_event_statistics')}</h2>
                <p class="text-xs text-gray-700 mb-1">${i18n.t('report_threshold_violations')}</p>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-1 pr-2 text-gray-600 font-medium">${i18n.t('room_name')}</th>
                            <th class="text-left py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_sensor_id')}</th>
                            <th class="text-left py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_parameter')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_events_count')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_peak_avg')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_peak_max')}</th>
                            <th class="text-right py-1 pr-2 text-gray-600 font-medium">${i18n.t('report_longest_event')}</th>
                            <th class="text-right py-1 text-gray-600 font-medium">${i18n.t('report_cumulative_duration')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${roomStats.flatMap(rs => {
                            const rows = [];
                            for (const [key, label, unit] of [['co2', 'CO2', 'ppm'], ['pm25', 'PM2.5', 'µg/m³'], ['pm10', 'PM10', 'µg/m³']]) {
                                const m = rs.eventStats?.byMetric[key];
                                if (m && m.count > 0) {
                                    const isCO2 = key === 'co2';
                                    rows.push({
                                        room: rs.room, metric: label, unit,
                                        count: m.count,
                                        combustionCount: m.combustionCount || 0,
                                        peakMean: m.peakMean,
                                        peakMax: m.peakMax,
                                        longestEvent: m.longestEvent,
                                        totalMinutes: m.totalMinutes,
                                        isCO2
                                    });
                                }
                            }
                            return rows;
                        }).map(row => `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 pr-2">${escapeHtml(row.room.name) || '-'}</td>
                            <td class="py-1 pr-2 text-gray-500">${escapeHtml(row.room.deviceSerial) || '-'}</td>
                            <td class="py-1 pr-2">${row.metric}${row.combustionCount > 0 ? ` <span class="inline-flex items-center text-orange-600" title="${i18n.t('events_combustionTooltip')}"><svg class="w-3 h-3 inline" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"/></svg>${row.combustionCount}</span>` : ''}</td>
                            <td class="py-1 pr-2 text-right">${row.count}</td>
                            <td class="py-1 pr-2 text-right">${row.peakMean != null ? (row.isCO2 ? Math.round(row.peakMean) : row.peakMean.toFixed(1)) + ' ' + row.unit : '-'}</td>
                            <td class="py-1 pr-2 text-right text-red-600">${row.peakMax != null ? (row.isCO2 ? Math.round(row.peakMax) : row.peakMax.toFixed(1)) + ' ' + row.unit : '-'}</td>
                            <td class="py-1 pr-2 text-right">${row.longestEvent != null ? formatDuration(row.longestEvent) : '-'}</td>
                            <td class="py-1 text-right">${formatDuration(row.totalMinutes)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p class="text-xs text-gray-400 mt-1">${i18n.t('report_event_footnote')}</p>
            </div>
            ` : ''}

            <!-- Findings -->
            ${findings.length > 0 ? `
            <div class="report-section mb-4">
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${nextSection()}. ${i18n.t('report_findings_title')}</h2>
                <table class="w-full text-xs">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="text-left py-1 text-gray-600 font-medium w-6">#</th>
                            <th class="text-left py-1 text-gray-600 font-medium">Finding</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${findings.map((finding, i) => `
                        <tr class="border-b border-gray-100">
                            <td class="py-1 text-gray-500">${i + 1}</td>
                            <td class="py-1">${escapeHtml(finding)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}

            <!-- Recommendations -->
            ${recommendations.length > 0 ? `
            <div class="report-section mb-4">
                <h2 class="text-sm font-bold uppercase tracking-wide text-gray-800 mb-2">${nextSection()}. ${i18n.t('report_recommendations_title')}</h2>
                <ol class="list-decimal list-inside space-y-1 text-xs text-gray-700">
                    ${recommendations.map(rec => `<li>${escapeHtml(rec)}</li>`).join('')}
                </ol>
            </div>
            ` : ''}
        </div>
    `;
}

/**
 * Escape HTML entities
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Generate PDF using html2pdf.js
 * @param {HTMLElement} element - Element to convert to PDF
 * @param {string} filename - Output filename
 * @returns {Promise<void>}
 */
export async function generatePDF(element, filename = 'air-quality-report.pdf', footerConfig = {}) {
    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
        throw new Error('html2pdf.js library not loaded');
    }

    const opt = {
        margin: [10, 10, 20, 10], // top, right, bottom (extra for footer), left — in mm
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css'] }
    };

    const worker = html2pdf().set(opt).from(element);

    await worker.toPdf().get('pdf').then(pdf => {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);

            // Draw footer separator line
            pdf.setDrawColor(200);
            pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);

            // Left: organization + contact
            pdf.setFontSize(7);
            pdf.setTextColor(120);
            const leftText = footerConfig.organization || '';
            const contactText = footerConfig.contact ? ` | ${footerConfig.contact}` : '';
            pdf.text(leftText + contactText, 10, pageHeight - 10);

            // Center: city (if available)
            if (footerConfig.city) {
                pdf.text(footerConfig.city, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }

            // Right: page number
            pdf.text(`${i} / ${totalPages}`, pageWidth - 10, pageHeight - 10, { align: 'right' });
        }
    }).save();
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
