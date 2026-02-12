/**
 * Data Export Functions
 * Handles CSV and JSON export of sensor logs
 */

import { EXPORT_FILENAMES, MIME_TYPES, ERRORS } from './constants.js';
import { downloadFile, formatGPSFix } from './utils.js';
import { getDeviceTypeById, DEVICE_TYPES } from './deviceTypes.js';

/**
 * Format date as ISO string for Excel compatibility (YYYY-MM-DD HH:MM:SS)
 */
function formatDateTimeISO(date) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/**
 * Export logs to CSV format
 * Automatically detects GPS vs TSL2591 vs CO2 format
 * @param {Array} logs - Log records to export
 * @param {Object} deviceMetadataMap - Map of serial -> {name, tags} (optional)
 */
export function exportToCSV(logs, deviceMetadataMap = {}) {
    if (!logs || logs.length === 0) {
        throw new Error(ERRORS.NO_LOGS_TO_EXPORT);
    }

    // Resolve device type from registry; fall back to field-sniffing for legacy data
    const deviceType = getDeviceTypeById(logs[0].logType) || sniffDeviceType(logs[0]);

    // Build CSV headers from device type: DateTime + metrics + extraFields + common trailer
    const headers = ['DateTime'];
    for (const m of deviceType.metrics) {
        headers.push(m.csvHeader);
    }
    for (const f of deviceType.extraFields) {
        headers.push(f.csvHeader);
    }
    headers.push('Battery (V)', 'Charging', 'Device Serial', 'Device Name', 'Device Tags', 'Downloaded At');

    // Build CSV content
    const rows = [headers.join(',')];

    logs.forEach(log => {
        const date = new Date(log.timestamp * 1000);
        const downloadDate = log.downloadedAt ? new Date(log.downloadedAt * 1000) : null;

        const metadata = log.deviceSerial ? deviceMetadataMap[log.deviceSerial] : null;
        const deviceName = metadata?.name || '';
        const deviceTags = metadata?.tags?.join(';') || '';

        const row = [formatDateTimeISO(date)];

        // Metric values
        for (const m of deviceType.metrics) {
            const val = log[m.key];
            if (val == null) {
                row.push('');
            } else if (m.csvPrecision != null && m.csvPrecision > 0) {
                row.push(val.toFixed(m.csvPrecision));
            } else if (m.csvPrecision === 0) {
                row.push(String(Math.round(val)));
            } else {
                row.push(String(val));
            }
        }

        // Extra fields
        for (const f of deviceType.extraFields) {
            const val = log[f.key];
            if (val == null) {
                row.push('');
            } else if (f.key === 'fix') {
                row.push(formatGPSFix(val));
            } else if (f.csvPrecision != null && f.csvPrecision > 0) {
                row.push(val.toFixed(f.csvPrecision));
            } else {
                row.push(String(val));
            }
        }

        // Common trailer
        row.push(
            log.batteryVoltage ? (log.batteryVoltage / 1000).toFixed(3) : '',
            log.charging ? '1' : '0',
            log.deviceSerial || '',
            deviceName,
            deviceTags,
            downloadDate ? downloadDate.toISOString() : ''
        );

        // Escape fields that contain commas or quotes
        const escapedRow = row.map(field => {
            const fieldStr = String(field);
            if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
                return `"${fieldStr.replace(/"/g, '""')}"`;
            }
            return fieldStr;
        });

        rows.push(escapedRow.join(','));
    });

    const csvContent = rows.join('\n');
    downloadFile(csvContent, EXPORT_FILENAMES.CSV, MIME_TYPES.CSV);
}

/**
 * Fallback device type detection for legacy logs without logType field.
 * Sniffs fields to determine the closest device type.
 */
function sniffDeviceType(log) {
    if (log.hasOwnProperty('co2')) return DEVICE_TYPES.CO2;
    if (log.hasOwnProperty('lux')) return DEVICE_TYPES.TSL2591;
    return DEVICE_TYPES.GPS;
}

/**
 * Export logs to JSON format
 * @param {Array} logs - Log records to export
 * @param {Object} deviceMetadataMap - Map of serial -> {name, tags} (optional)
 */
export function exportToJSON(logs, deviceMetadataMap = {}) {
    if (!logs || logs.length === 0) {
        throw new Error(ERRORS.NO_LOGS_TO_EXPORT);
    }

    // Resolve device type from registry; fall back to field-sniffing for legacy data
    const deviceType = getDeviceTypeById(logs[0].logType) || sniffDeviceType(logs[0]);

    // Create structured JSON with metadata
    const exportData = {
        metadata: {
            exportDate: new Date().toISOString(),
            totalRecords: logs.length,
            devices: [...new Set(logs.map(l => l.deviceSerial).filter(Boolean))],
            format: 'Octanis ICS Logs v1.0',
            sensorFormat: deviceType.name
        },
        logs: logs.map(log => {
            const metadata = log.deviceSerial ? deviceMetadataMap[log.deviceSerial] : null;

            const baseLog = {
                timestamp: log.timestamp,
                dateTime: new Date(log.timestamp * 1000).toISOString(),
                sensors: {},
                battery: {
                    voltage: log.batteryVoltage,
                    voltageUnit: 'mV',
                    charging: log.charging
                },
                device: {
                    serial: log.deviceSerial,
                    name: metadata?.name || null,
                    tags: metadata?.tags || []
                },
                downloadedAt: log.downloadedAt ? new Date(log.downloadedAt * 1000).toISOString() : null
            };

            // Add all metric values from device type
            for (const m of deviceType.metrics) {
                baseLog.sensors[m.key] = {
                    value: log[m.key],
                    unit: m.unit
                };
            }

            // Add extra fields — GPS gets special nested structure, others go under sensors
            for (const f of deviceType.extraFields) {
                if (f.key === 'lat' || f.key === 'lon' || f.key === 'fix') {
                    if (!baseLog.gps) {
                        baseLog.gps = {
                            latitude: log.lat,
                            longitude: log.lon,
                            fix: formatGPSFix(log.fix)
                        };
                    }
                } else {
                    baseLog.sensors[f.key] = log[f.key];
                }
            }

            return baseLog;
        })
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    downloadFile(jsonContent, EXPORT_FILENAMES.JSON, MIME_TYPES.JSON);
}

/**
 * Export logs to GeoJSON format (for mapping applications)
 */
export function exportToGeoJSON(logs) {
    if (!logs || logs.length === 0) {
        throw new Error(ERRORS.NO_LOGS_TO_EXPORT);
    }

    // Filter logs with valid GPS coordinates
    const logsWithGPS = logs.filter(log => log.fix > 0 && log.lat && log.lon);

    if (logsWithGPS.length === 0) {
        throw new Error(ERRORS.NO_GPS_LOGS);
    }

    // Create GeoJSON FeatureCollection
    const geoJSON = {
        type: 'FeatureCollection',
        features: logsWithGPS.map(log => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [log.lon, log.lat]
            },
            properties: {
                timestamp: log.timestamp,
                dateTime: new Date(log.timestamp * 1000).toISOString(),
                temperature: log.temperature,
                humidity: log.humidity,
                pm25: log.pm25,
                pm10: log.pm10,
                battery: log.battery,
                deviceSerial: log.deviceSerial
            }
        }))
    };

    const geoJSONContent = JSON.stringify(geoJSON, null, 2);

    // Create download
    downloadFile(geoJSONContent, EXPORT_FILENAMES.GEOJSON, MIME_TYPES.GEOJSON);
}

// Note: downloadFile and formatGPSFix are now imported from utils.js

/**
 * Generate summary statistics for logs
 */
export function generateStatistics(logs) {
    if (!logs || logs.length === 0) {
        return null;
    }

    const stats = {
        count: logs.length,
        temperature: calculateStats(logs, 'temperature'),
        humidity: calculateStats(logs, 'humidity'),
        pm25: calculateStats(logs, 'pm25'),
        pm10: calculateStats(logs, 'pm10'),
        battery: calculateStats(logs, 'battery'),
        timeRange: {
            start: Math.min(...logs.map(l => l.timestamp)),
            end: Math.max(...logs.map(l => l.timestamp))
        },
        gpsRecords: logs.filter(l => l.fix > 0).length
    };

    return stats;
}

/**
 * Calculate statistics for a specific field
 */
function calculateStats(logs, field) {
    const values = logs.map(l => l[field]).filter(v => v !== undefined && v !== null && !isNaN(v));

    if (values.length === 0) {
        return null;
    }

    const sorted = values.slice().sort((a, b) => a - b);

    return {
        min: Math.min(...values),
        max: Math.max(...values),
        mean: values.reduce((sum, v) => sum + v, 0) / values.length,
        median: sorted[Math.floor(sorted.length / 2)],
        count: values.length
    };
}

/**
 * Export statistics to text file
 */
export function exportStatistics(logs) {
    const stats = generateStatistics(logs);

    if (!stats) {
        throw new Error(ERRORS.NO_DATA_FOR_STATS);
    }

    const startDate = new Date(stats.timeRange.start * 1000);
    const endDate = new Date(stats.timeRange.end * 1000);

    const content = `
Octanis ICS Data Statistics
===========================

Time Range: ${startDate.toLocaleString()} to ${endDate.toLocaleString()}
Total Records: ${stats.count}
GPS Records: ${stats.gpsRecords}

Temperature (°C):
  Min:    ${stats.temperature.min.toFixed(2)}
  Max:    ${stats.temperature.max.toFixed(2)}
  Mean:   ${stats.temperature.mean.toFixed(2)}
  Median: ${stats.temperature.median.toFixed(2)}

Humidity (%):
  Min:    ${stats.humidity.min.toFixed(2)}
  Max:    ${stats.humidity.max.toFixed(2)}
  Mean:   ${stats.humidity.mean.toFixed(2)}
  Median: ${stats.humidity.median.toFixed(2)}

PM2.5 (μg/m³):
  Min:    ${stats.pm25.min.toFixed(2)}
  Max:    ${stats.pm25.max.toFixed(2)}
  Mean:   ${stats.pm25.mean.toFixed(2)}
  Median: ${stats.pm25.median.toFixed(2)}

PM10 (μg/m³):
  Min:    ${stats.pm10.min.toFixed(2)}
  Max:    ${stats.pm10.max.toFixed(2)}
  Mean:   ${stats.pm10.mean.toFixed(2)}
  Median: ${stats.pm10.median.toFixed(2)}

Battery (%):
  Min:    ${stats.battery.min.toFixed(0)}
  Max:    ${stats.battery.max.toFixed(0)}
  Mean:   ${stats.battery.mean.toFixed(0)}
  Median: ${stats.battery.median.toFixed(0)}

Generated: ${new Date().toLocaleString()}
`.trim();

    downloadFile(content, EXPORT_FILENAMES.STATISTICS, MIME_TYPES.TEXT);
}
