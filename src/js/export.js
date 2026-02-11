/**
 * Data Export Functions
 * Handles CSV and JSON export of sensor logs
 */

import { EXPORT_FILENAMES, MIME_TYPES, ERRORS } from './constants.js';
import { downloadFile, formatGPSFix } from './utils.js';

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

    // Detect format from first log
    const isCO2 = logs[0].hasOwnProperty('co2');
    const isTSL = logs[0].hasOwnProperty('lux') && !isCO2;

    // CSV headers based on format
    let headers;
    if (isCO2) {
        headers = [
            'DateTime',
            'Temperature (°C)',
            'Humidity (%)',
            'CO2 (ppm)',
            'Pressure (hPa)',
            'Gas Resistance (Ohm)',
            'Lux',
            'Battery (V)',
            'Charging',
            'Device Serial',
            'Device Name',
            'Device Tags',
            'Downloaded At'
        ];
    } else if (isTSL) {
        headers = [
            'DateTime',
            'Temperature (°C)',
            'Humidity (%)',
            'PM2.5 (μg/m³)',
            'PM10 (μg/m³)',
            'Lux',
            'TSL CH0',
            'TSL CH1',
            'Overflow',
            'Battery (V)',
            'Charging',
            'Device Serial',
            'Device Name',
            'Device Tags',
            'Downloaded At'
        ];
    } else {
        headers = [
            'DateTime',
            'Temperature (°C)',
            'Humidity (%)',
            'PM2.5 (μg/m³)',
            'PM10 (μg/m³)',
            'Latitude',
            'Longitude',
            'GPS Fix',
            'Battery (V)',
            'Charging',
            'Device Serial',
            'Device Name',
            'Device Tags',
            'Downloaded At'
        ];
    }

    // Build CSV content
    const rows = [headers.join(',')];

    logs.forEach(log => {
        const date = new Date(log.timestamp * 1000);
        const downloadDate = log.downloadedAt ? new Date(log.downloadedAt * 1000) : null;

        // Look up device metadata for this log's serial
        const metadata = log.deviceSerial ? deviceMetadataMap[log.deviceSerial] : null;
        const deviceName = metadata?.name || '';
        const deviceTags = metadata?.tags?.join(';') || '';

        let row;
        if (isCO2) {
            row = [
                formatDateTimeISO(date),
                log.temperature?.toFixed(3) || '',
                log.humidity?.toFixed(3) || '',
                log.co2 || '',
                log.pressure?.toFixed(1) || '',
                log.gasResistance || '',
                log.lux?.toFixed(1) || '',
                log.batteryVoltage ? (log.batteryVoltage / 1000).toFixed(3) : '',
                log.charging ? '1' : '0',
                log.deviceSerial || '',
                deviceName,
                deviceTags,
                downloadDate ? downloadDate.toISOString() : ''
            ];
        } else if (isTSL) {
            row = [
                formatDateTimeISO(date),
                log.temperature?.toFixed(3) || '',
                log.humidity?.toFixed(3) || '',
                log.pm25?.toFixed(1) || '',
                log.pm10?.toFixed(1) || '',
                log.lux?.toFixed(1) || '',
                log.tslCH0 || '',
                log.tslCH1 || '',
                log.overflow || '0',
                log.batteryVoltage ? (log.batteryVoltage / 1000).toFixed(3) : '',
                log.charging ? '1' : '0',
                log.deviceSerial || '',
                deviceName,
                deviceTags,
                downloadDate ? downloadDate.toISOString() : ''
            ];
        } else {
            row = [
                formatDateTimeISO(date),
                log.temperature?.toFixed(3) || '',
                log.humidity?.toFixed(3) || '',
                log.pm25?.toFixed(1) || '',
                log.pm10?.toFixed(1) || '',
                log.lat?.toFixed(7) || '',
                log.lon?.toFixed(7) || '',
                formatGPSFix(log.fix),
                log.batteryVoltage ? (log.batteryVoltage / 1000).toFixed(3) : '',
                log.charging ? '1' : '0',
                log.deviceSerial || '',
                deviceName,
                deviceTags,
                downloadDate ? downloadDate.toISOString() : ''
            ];
        }

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

    // Create download
    downloadFile(csvContent, EXPORT_FILENAMES.CSV, MIME_TYPES.CSV);
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

    // Detect format from first log
    const isCO2 = logs[0].hasOwnProperty('co2');
    const isTSL = logs[0].hasOwnProperty('lux') && !isCO2;

    // Determine format name
    let formatName = 'GPS';
    if (isCO2) formatName = 'CO2';
    else if (isTSL) formatName = 'TSL2591';

    // Create structured JSON with metadata
    const exportData = {
        metadata: {
            exportDate: new Date().toISOString(),
            totalRecords: logs.length,
            devices: [...new Set(logs.map(l => l.deviceSerial).filter(Boolean))],
            format: 'Octanis ICS Logs v1.0',
            sensorFormat: formatName
        },
        logs: logs.map(log => {
            // Look up device metadata for this log's serial
            const metadata = log.deviceSerial ? deviceMetadataMap[log.deviceSerial] : null;

            const baseLog = {
                timestamp: log.timestamp,
                dateTime: new Date(log.timestamp * 1000).toISOString(),
                sensors: {
                    temperature: {
                        value: log.temperature,
                        unit: '°C'
                    },
                    humidity: {
                        value: log.humidity,
                        unit: '%'
                    }
                },
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

            // Add format-specific fields
            if (isCO2) {
                baseLog.sensors.co2 = {
                    value: log.co2,
                    unit: 'ppm'
                };
                baseLog.sensors.pressure = {
                    value: log.pressure,
                    unit: 'hPa'
                };
                baseLog.sensors.gasResistance = {
                    value: log.gasResistance,
                    unit: 'Ohm'
                };
                baseLog.sensors.lux = {
                    value: log.lux,
                    unit: 'lux'
                };
            } else if (isTSL) {
                baseLog.sensors.pm25 = {
                    value: log.pm25,
                    unit: 'μg/m³'
                };
                baseLog.sensors.pm10 = {
                    value: log.pm10,
                    unit: 'μg/m³'
                };
                baseLog.sensors.lux = {
                    value: log.lux,
                    unit: 'lux'
                };
                baseLog.sensors.tslCH0 = log.tslCH0;
                baseLog.sensors.tslCH1 = log.tslCH1;
                baseLog.sensors.overflow = log.overflow;
            } else {
                baseLog.sensors.pm25 = {
                    value: log.pm25,
                    unit: 'μg/m³'
                };
                baseLog.sensors.pm10 = {
                    value: log.pm10,
                    unit: 'μg/m³'
                };
                baseLog.gps = {
                    latitude: log.lat,
                    longitude: log.lon,
                    fix: formatGPSFix(log.fix)
                };
            }

            return baseLog;
        })
    };

    const jsonContent = JSON.stringify(exportData, null, 2);

    // Create download
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
