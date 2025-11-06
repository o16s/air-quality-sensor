/**
 * Data Export Functions
 * Handles CSV and JSON export of sensor logs
 */

import { EXPORT_FILENAMES, MIME_TYPES, ERRORS } from './constants.js';
import { downloadFile, formatGPSFix } from './utils.js';

/**
 * Export logs to CSV format
 * Automatically detects GPS vs TSL2591 format
 */
export function exportToCSV(logs) {
    if (!logs || logs.length === 0) {
        throw new Error(ERRORS.NO_LOGS_TO_EXPORT);
    }

    // Detect format from first log
    const isTSL = logs[0].hasOwnProperty('lux');

    // CSV headers based on format
    const headers = isTSL
        ? [
            'Timestamp',
            'Date',
            'Time',
            'Temperature (°C)',
            'Humidity (%)',
            'PM2.5 (μg/m³)',
            'PM10 (μg/m³)',
            'Lux',
            'TSL CH0',
            'TSL CH1',
            'Overflow',
            'Battery (%)',
            'Device Serial',
            'Downloaded At'
        ]
        : [
            'Timestamp',
            'Date',
            'Time',
            'Temperature (°C)',
            'Humidity (%)',
            'PM2.5 (μg/m³)',
            'PM10 (μg/m³)',
            'Latitude',
            'Longitude',
            'GPS Fix',
            'Battery (%)',
            'Device Serial',
            'Downloaded At'
        ];

    // Build CSV content
    const rows = [headers.join(',')];

    logs.forEach(log => {
        const date = new Date(log.timestamp * 1000);
        const downloadDate = log.downloadedAt ? new Date(log.downloadedAt * 1000) : null;

        const row = isTSL
            ? [
                log.timestamp,
                date.toLocaleDateString(),
                date.toLocaleTimeString(),
                log.temperature?.toFixed(3) || '',
                log.humidity?.toFixed(3) || '',
                log.pm25?.toFixed(1) || '',
                log.pm10?.toFixed(1) || '',
                log.lux?.toFixed(1) || '',
                log.tslCH0 || '',
                log.tslCH1 || '',
                log.overflow || '0',
                log.battery || '',
                log.deviceSerial || '',
                downloadDate ? downloadDate.toISOString() : ''
            ]
            : [
                log.timestamp,
                date.toLocaleDateString(),
                date.toLocaleTimeString(),
                log.temperature?.toFixed(3) || '',
                log.humidity?.toFixed(3) || '',
                log.pm25?.toFixed(1) || '',
                log.pm10?.toFixed(1) || '',
                log.lat?.toFixed(7) || '',
                log.lon?.toFixed(7) || '',
                formatGPSFix(log.fix),
                log.battery || '',
                log.deviceSerial || '',
                downloadDate ? downloadDate.toISOString() : ''
            ];

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
 */
export function exportToJSON(logs) {
    if (!logs || logs.length === 0) {
        throw new Error(ERRORS.NO_LOGS_TO_EXPORT);
    }

    // Create structured JSON with metadata
    const exportData = {
        metadata: {
            exportDate: new Date().toISOString(),
            totalRecords: logs.length,
            devices: [...new Set(logs.map(l => l.deviceSerial).filter(Boolean))],
            format: 'CCC Sensor Logs v1.0'
        },
        logs: logs.map(log => ({
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
                },
                pm25: {
                    value: log.pm25,
                    unit: 'μg/m³'
                },
                pm10: {
                    value: log.pm10,
                    unit: 'μg/m³'
                }
            },
            gps: {
                latitude: log.lat,
                longitude: log.lon,
                fix: formatGPSFix(log.fix)
            },
            battery: {
                level: log.battery,
                unit: '%'
            },
            device: {
                serial: log.deviceSerial
            },
            downloadedAt: log.downloadedAt ? new Date(log.downloadedAt * 1000).toISOString() : null
        }))
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
Octanis Sensor Data Statistics
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
