/**
 * Report Data Export Module
 * Generates LLM-friendly markdown from report data
 */

import { i18n } from './i18n.js';

const MAX_RAW_ROWS = 2000; // unused after hourly aggregation, kept for reference

/**
 * Parse LLM markdown response into summary, findings and recommendations
 * Expects format:
 *   ## Summary
 *   One or two sentences.
 *   ## Findings
 *   1. First finding
 *   ## Recommendations
 *   1. First rec
 * @param {string} text - Markdown text from LLM
 * @returns {{ summary: string, findings: string[], recommendations: string[] }}
 */
export function parseAnalysisResponse(text) {
    const summaryMatch = text.match(/##\s*Summary\s*\n([\s\S]*?)(?=##\s*Findings|$)/i);
    const findingsMatch = text.match(/##\s*Findings\s*\n([\s\S]*?)(?=##\s*Recommendations|$)/i);
    const recsMatch = text.match(/##\s*Recommendations\s*\n([\s\S]*?)$/i);

    const parseList = (block) => {
        if (!block) return [];
        return block
            .split('\n')
            .map(line => line.replace(/^\s*\d+\.\s*/, '').trim())
            .filter(line => line.length > 0);
    };

    const summary = summaryMatch?.[1]?.trim() || '';

    return {
        summary,
        findings: parseList(findingsMatch?.[1]),
        recommendations: parseList(recsMatch?.[1])
    };
}

/**
 * Generate a structured markdown document from all report data
 * @param {Object} config - Report configuration (same shape as renderReportPreview + rawLogs)
 * @returns {string} Markdown string
 */
export function generateReportMarkdown(config) {
    const {
        organization = '',
        author = '',
        contact = '',
        title = 'Indoor Air Quality Audit',
        buildingLocation = null,
        stats,
        eventStats,
        gi2Status,
        gi2Override,
        findings = [],
        recommendations = [],
        dateStart,
        dateEnd,
        roomStats = [],
        rawLogs = []
    } = config;

    // Use override if set, otherwise computed status
    const complianceStatus = gi2Override !== 'auto' ? gi2Override : (gi2Status?.status || 'unknown');
    const complianceReason = gi2Override !== 'auto'
        ? 'Manual override'
        : (gi2Status?.reason || 'No data available');

    const periodStart = dateStart ? new Date(dateStart).toISOString().split('T')[0] : '?';
    const periodEnd = dateEnd ? new Date(dateEnd).toISOString().split('T')[0] : '?';
    const days = dateStart && dateEnd
        ? Math.ceil((dateEnd - dateStart) / (1000 * 60 * 60 * 24))
        : 0;

    const sections = [];

    // LLM prompt
    sections.push(i18n.t('report_llmPrompt'));
    sections.push('\n---\n');

    // Title
    const buildingName = buildingLocation?.name || title;
    sections.push(`# Indoor Air Quality Audit -- ${buildingName}\n`);

    // Report Context
    sections.push(renderContext({
        organization, author, contact, periodStart, periodEnd,
        buildingLocation
    }));

    // Measurement Locations
    if (buildingLocation?.rooms?.length > 0) {
        sections.push(renderMeasurementLocations(buildingLocation.rooms));
    }

    // Executive Summary
    sections.push(renderExecutiveSummary(days, stats, complianceStatus));

    // Air Quality Statistics per room
    if (roomStats.length > 0) {
        sections.push(renderAirQualityStats(roomStats));
        sections.push(renderComfortParams(roomStats));
    }

    // Reference Values
    sections.push(renderReferenceValues());

    // GI 2.0 Compliance
    sections.push(renderCompliance(complianceStatus, complianceReason));

    // Event Statistics
    if (roomStats.some(rs => rs.eventStats && (
        rs.eventStats.byMetric.co2.count > 0 ||
        rs.eventStats.byMetric.pm25.count > 0 ||
        rs.eventStats.byMetric.pm10.count > 0
    ))) {
        sections.push(renderEventStats(roomStats));
    }

    // Findings
    if (findings.length > 0) {
        sections.push(renderFindings(findings));
    }

    // Recommendations
    if (recommendations.length > 0) {
        sections.push(renderRecommendations(recommendations));
    }

    // Raw Measurement Data
    if (rawLogs.length > 0) {
        const rooms = buildingLocation?.rooms || [];
        sections.push(renderRawData(rawLogs, rooms));
    }

    return sections.join('\n');
}

function renderContext({ organization, author, contact, periodStart, periodEnd, buildingLocation }) {
    const lines = ['## Report Context\n'];
    if (organization) lines.push(`- **Organization:** ${organization}`);
    if (author) lines.push(`- **Author:** ${author}`);
    if (contact) lines.push(`- **Contact:** ${contact}`);
    lines.push(`- **Period:** ${periodStart} to ${periodEnd}`);

    if (buildingLocation) {
        const b = buildingLocation;
        if (b.name) lines.push(`- **Building:** ${b.name}`);
        const addr = [b.street, b.postalCode, b.city, b.canton].filter(Boolean).join(', ');
        if (addr) lines.push(`- **Address:** ${addr}`);
        if (b.buildingCategory) lines.push(`- **Category:** ${i18n.t('building_' + b.buildingCategory)}`);
        if (b.constructionYear) {
            let constr = b.constructionYear;
            if (b.lastRenovation) constr += ` (renovated ${b.lastRenovation})`;
            lines.push(`- **Construction:** ${constr}`);
        }
        if (b.ventilationType) lines.push(`- **Ventilation:** ${i18n.t('ventilation_' + b.ventilationType)}`);
        if (b.foundationStructure) lines.push(`- **Foundation:** ${i18n.t('foundation_' + b.foundationStructure)}`);
    }

    lines.push('');
    return lines.join('\n');
}

function renderMeasurementLocations(rooms) {
    const lines = ['## Measurement Locations\n'];

    for (const room of rooms) {
        const name = room.name || 'Unnamed Room';
        lines.push(`### ${name}\n`);

        const props = [];
        if (room.floor) props.push(`- **Floor:** ${room.floor}`);
        props.push(`- **Type:** ${i18n.t('room_' + room.roomType)}`);
        if (room.area) props.push(`- **Area:** ${room.area} m²`);
        if (room.ceilingHeight) props.push(`- **Ceiling height:** ${room.ceilingHeight} m`);
        if (room.sensorHeight) props.push(`- **Sensor height:** ${room.sensorHeight} m`);
        if (room.deviceSerial) props.push(`- **Sensor ID:** ${room.deviceSerial}`);
        if (room.roomVentilation) props.push(`- **Ventilation:** ${i18n.t('room_vent_' + room.roomVentilation)}`);
        if (room.smokingPolicy) {
            let smoking = i18n.t('room_smoking_' + room.smokingPolicy);
            if (room.smokingPolicy === 'nearby' && room.smokingDistance) {
                smoking += ` (${i18n.t('room_distance_' + room.smokingDistance)})`;
            }
            props.push(`- **Smoking:** ${smoking}`);
        }
        if (room.occupancy) props.push(`- **Occupancy:** ${i18n.t('room_occupancy_' + room.occupancy)}`);
        if (room.knownIssues?.length > 0) {
            const issues = room.knownIssues.map(issue => i18n.t('room_issue_' + issue)).join('; ');
            props.push(`- **Known issues:** ${issues}`);
        }
        if (room.notes) props.push(`- **Notes:** ${room.notes}`);

        lines.push(props.join('\n'));
        lines.push('');
    }

    return lines.join('\n');
}

function renderExecutiveSummary(days, stats, complianceStatus) {
    const lines = ['## Executive Summary\n'];
    const measurements = stats ? stats.totalMeasurements.toLocaleString() : '0';
    let statusText = '';
    if (complianceStatus === 'pass') statusText = 'GI 2.0: Compliant.';
    else if (complianceStatus === 'warning') statusText = 'GI 2.0: Warning -- some parameters require attention.';
    else if (complianceStatus === 'fail') statusText = 'GI 2.0: Not Compliant -- intervention required.';
    else statusText = 'GI 2.0: Unknown.';

    lines.push(`${days} days of monitoring, ${measurements} measurements. ${statusText}\n`);
    return lines.join('\n');
}

function renderAirQualityStats(roomStats) {
    const lines = ['## Air Quality Statistics (per room)\n'];
    lines.push('| Room | CO2 Avg | CO2 Max | PM2.5 Avg | PM2.5 Max | PM10 Avg | PM10 Max |');
    lines.push('|------|---------|---------|-----------|-----------|----------|----------|');
    for (const rs of roomStats) {
        const name = rs.room.name || '-';
        const co2Avg = rs.stats?.co2?.avg != null ? Math.round(rs.stats.co2.avg) : '-';
        const co2Max = rs.stats?.co2?.max != null ? Math.round(rs.stats.co2.max) : '-';
        const pm25Avg = rs.stats?.pm25?.avg != null ? rs.stats.pm25.avg.toFixed(1) : '-';
        const pm25Max = rs.stats?.pm25?.max != null ? rs.stats.pm25.max.toFixed(1) : '-';
        const pm10Avg = rs.stats?.pm10?.avg != null ? rs.stats.pm10.avg.toFixed(1) : '-';
        const pm10Max = rs.stats?.pm10?.max != null ? rs.stats.pm10.max.toFixed(1) : '-';
        lines.push(`| ${name} | ${co2Avg} | ${co2Max} | ${pm25Avg} | ${pm25Max} | ${pm10Avg} | ${pm10Max} |`);
    }
    lines.push('');
    lines.push('Units: CO2 in ppm, PM2.5/PM10 in ug/m3\n');
    return lines.join('\n');
}

function renderComfortParams(roomStats) {
    const lines = ['## Comfort Parameters (per room)\n'];
    lines.push('| Room | Temp Avg | Temp Min | Temp Max | Humidity Avg | Humidity Min | Humidity Max | Light Avg |');
    lines.push('|------|----------|----------|----------|--------------|--------------|--------------|-----------|');
    for (const rs of roomStats) {
        const name = rs.room.name || '-';
        const tAvg = rs.stats?.temperature?.avg != null ? rs.stats.temperature.avg.toFixed(1) : '-';
        const tMin = rs.stats?.temperature?.min != null ? rs.stats.temperature.min.toFixed(1) : '-';
        const tMax = rs.stats?.temperature?.max != null ? rs.stats.temperature.max.toFixed(1) : '-';
        const hAvg = rs.stats?.humidity?.avg != null ? Math.round(rs.stats.humidity.avg) : '-';
        const hMin = rs.stats?.humidity?.min != null ? Math.round(rs.stats.humidity.min) : '-';
        const hMax = rs.stats?.humidity?.max != null ? Math.round(rs.stats.humidity.max) : '-';
        const lAvg = rs.stats?.lux?.avg != null ? Math.round(rs.stats.lux.avg) : '-';
        lines.push(`| ${name} | ${tAvg} | ${tMin} | ${tMax} | ${hAvg} | ${hMin} | ${hMax} | ${lAvg} |`);
    }
    lines.push('');
    lines.push('Units: Temperature in C, Humidity in %, Light in lux\n');
    return lines.join('\n');
}

function renderReferenceValues() {
    const lines = ['## Reference Values\n'];
    lines.push('| Parameter | Acceptable | Warning | Action Required | Standard |');
    lines.push('|-----------|-----------|---------|-----------------|----------|');
    lines.push('| CO2 | <= 1000 ppm | 1001-1500 ppm | > 1500 ppm | SIA 382/1 |');
    lines.push('| PM2.5 | <= 15 ug/m3 | 16-35 ug/m3 | > 35 ug/m3 | WHO 2021 |');
    lines.push('| PM10 | <= 45 ug/m3 | 46-100 ug/m3 | > 100 ug/m3 | WHO 2021 |');
    lines.push('| Temperature | 18-24 C | 16-18 / 24-26 C | < 16 / > 26 C | SIA 180 |');
    lines.push('| Humidity | 30-70% | 20-30 / 70-80% | < 20 / > 80% | SIA 180 |');
    lines.push('');
    return lines.join('\n');
}

function renderCompliance(status, reason) {
    const lines = ['## GI 2.0 Compliance\n'];
    const label = status === 'pass' ? 'Compliant'
        : status === 'warning' ? 'Warning'
        : status === 'fail' ? 'Not Compliant'
        : 'Unknown';
    lines.push(`Status: **${label}** -- ${reason}\n`);
    return lines.join('\n');
}

function formatDuration(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

function renderEventStats(roomStats) {
    const lines = ['## Event Statistics\n'];
    lines.push('Threshold violations by room and parameter.\n');
    lines.push('| Room | Sensor | Parameter | Events | Peak Avg | Peak Max | Longest | Total Duration |');
    lines.push('|------|--------|-----------|--------|----------|----------|---------|----------------|');

    for (const rs of roomStats) {
        for (const [key, label, unit] of [['co2', 'CO2', 'ppm'], ['pm25', 'PM2.5', 'ug/m3'], ['pm10', 'PM10', 'ug/m3']]) {
            const m = rs.eventStats?.byMetric[key];
            if (m && m.count > 0) {
                const isCO2 = key === 'co2';
                const room = rs.room.name || '-';
                const sensor = rs.room.deviceSerial || '-';
                const peakAvg = m.peakMean != null ? (isCO2 ? Math.round(m.peakMean) : m.peakMean.toFixed(1)) + ' ' + unit : '-';
                const peakMax = m.peakMax != null ? (isCO2 ? Math.round(m.peakMax) : m.peakMax.toFixed(1)) + ' ' + unit : '-';
                const longest = m.longestEvent != null ? formatDuration(m.longestEvent) : '-';
                const total = formatDuration(m.totalMinutes);
                lines.push(`| ${room} | ${sensor} | ${label} | ${m.count} | ${peakAvg} | ${peakMax} | ${longest} | ${total} |`);
            }
        }
    }

    lines.push('');
    return lines.join('\n');
}

function renderFindings(findings) {
    const lines = ['## Current Findings\n'];
    findings.forEach((f, i) => {
        lines.push(`${i + 1}. ${f}`);
    });
    lines.push('');
    return lines.join('\n');
}

function renderRecommendations(recommendations) {
    const lines = ['## Current Recommendations\n'];
    recommendations.forEach((r, i) => {
        lines.push(`${i + 1}. ${r}`);
    });
    lines.push('');
    return lines.join('\n');
}

function renderRawData(rawLogs, rooms) {
    const lines = ['## Hourly Measurement Summary\n'];
    lines.push(`${rawLogs.length} total measurements, aggregated by hour and device.\n`);

    // Build device-serial -> room-name map
    const deviceToRoom = new Map();
    for (const room of rooms) {
        if (room.deviceSerial) {
            deviceToRoom.set(room.deviceSerial, room.name || 'Unnamed');
        }
    }

    // Group logs by hour + device
    const buckets = new Map();
    for (const log of rawLogs) {
        const dt = new Date(log.timestamp * 1000);
        const hourKey = dt.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"
        const device = log.deviceSerial || 'unknown';
        const key = `${hourKey}|${device}`;

        if (!buckets.has(key)) {
            buckets.set(key, { hour: hourKey, device, logs: [] });
        }
        buckets.get(key).logs.push(log);
    }

    // Sort by hour then device
    const sorted = [...buckets.values()].sort((a, b) =>
        a.hour < b.hour ? -1 : a.hour > b.hour ? 1 : a.device.localeCompare(b.device)
    );

    lines.push('| Hour (UTC) | Room | Device | n | CO2 Avg | CO2 Max | PM2.5 Avg | PM2.5 Max | PM10 Avg | PM10 Max | Temp Avg | Hum Avg | Lux Avg |');
    lines.push('|------------|------|--------|---|---------|---------|-----------|-----------|----------|----------|----------|---------|---------|');

    for (const bucket of sorted) {
        const n = bucket.logs.length;
        const agg = aggregateBucket(bucket.logs);
        const hour = bucket.hour.replace('T', ' ') + ':00';
        const roomName = deviceToRoom.get(bucket.device) || '-';
        lines.push(`| ${hour} | ${roomName} | ${bucket.device} | ${n} | ${agg.co2Avg} | ${agg.co2Max} | ${agg.pm25Avg} | ${agg.pm25Max} | ${agg.pm10Avg} | ${agg.pm10Max} | ${agg.tempAvg} | ${agg.humAvg} | ${agg.luxAvg} |`);
    }

    lines.push('');
    return lines.join('\n');
}

function aggregateBucket(logs) {
    const metrics = {
        co2: [], pm25: [], pm10: [],
        temperature: [], humidity: [], lux: []
    };

    for (const log of logs) {
        for (const key of Object.keys(metrics)) {
            if (log[key] != null && !isNaN(log[key])) {
                metrics[key].push(log[key]);
            }
        }
    }

    const avg = (arr, decimals) => {
        if (arr.length === 0) return '-';
        const v = arr.reduce((a, b) => a + b, 0) / arr.length;
        return decimals === 0 ? Math.round(v) : v.toFixed(decimals);
    };
    const max = (arr, decimals) => {
        if (arr.length === 0) return '-';
        const v = Math.max(...arr);
        return decimals === 0 ? Math.round(v) : v.toFixed(decimals);
    };

    return {
        co2Avg: avg(metrics.co2, 0),
        co2Max: max(metrics.co2, 0),
        pm25Avg: avg(metrics.pm25, 1),
        pm25Max: max(metrics.pm25, 1),
        pm10Avg: avg(metrics.pm10, 1),
        pm10Max: max(metrics.pm10, 1),
        tempAvg: avg(metrics.temperature, 1),
        humAvg: avg(metrics.humidity, 0),
        luxAvg: avg(metrics.lux, 0)
    };
}
