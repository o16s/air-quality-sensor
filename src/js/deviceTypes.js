/**
 * Device Type Registry — Single Source of Truth
 * Declares what metrics each device type produces, with display/export/threshold metadata.
 * Buffer layouts remain in constants.js; this module references them by device type ID.
 */

import { LOG_TYPE, AIR_QUALITY_THRESHOLDS, SPARKLINE_THRESHOLDS } from './constants.js';

// ─── Metric Definitions ────────────────────────────────────────────────────────
// Each metric has a canonical key that matches the field name in log records.

const METRIC_DEFS = {
    temperature: {
        key: 'temperature',
        label: 'Temp',
        unit: '\u00B0C',
        color: '#ef4444',
        precision: 1,

        i18nKey: 'sensor_temperature',
        csvHeader: 'Temperature (\u00B0C)',
        csvPrecision: 3,
        cardId: null,            // temp/humidity are always-visible, no toggle
        valueId: 'temp-value',
        sparklineId: 'temp-sparkline',
    },
    humidity: {
        key: 'humidity',
        label: 'Humidity',
        unit: '%',
        color: '#3b82f6',
        precision: 1,

        i18nKey: 'sensor_humidity',
        csvHeader: 'Humidity (%)',
        csvPrecision: 3,
        cardId: null,
        valueId: 'humidity-value',
        sparklineId: 'humidity-sparkline',
    },
    pm25: {
        key: 'pm25',
        label: 'PM2.5',
        unit: '\u00B5g/m\u00B3',
        color: '#f59e0b',
        precision: 1,

        i18nKey: 'sensor_pm25',
        csvHeader: 'PM2.5 (\u00B5g/m\u00B3)',
        csvPrecision: 1,
        cardId: null,            // uses closest('.sensor-card') pattern
        valueId: 'pm25-value',
        sparklineId: 'pm25-sparkline',
    },
    pm10: {
        key: 'pm10',
        label: 'PM10',
        unit: '\u00B5g/m\u00B3',
        color: '#8b5cf6',
        precision: 1,

        i18nKey: 'sensor_pm10',
        csvHeader: 'PM10 (\u00B5g/m\u00B3)',
        csvPrecision: 1,
        cardId: null,
        valueId: 'pm10-value',
        sparklineId: 'pm10-sparkline',
    },
    co2: {
        key: 'co2',
        label: 'CO2',
        unit: 'ppm',
        color: '#10b981',
        precision: 0,

        i18nKey: 'sensor_co2',
        csvHeader: 'CO2 (ppm)',
        csvPrecision: 0,
        cardId: 'co2-card',
        valueId: 'co2-value',
        sparklineId: 'co2-sparkline',
    },
    lux: {
        key: 'lux',
        label: 'Light',
        unit: 'lux',
        color: '#f97316',
        precision: 1,

        i18nKey: 'sensor_light',
        csvHeader: 'Lux',
        csvPrecision: 1,
        cardId: 'lux-card',
        valueId: 'lux-value',
        sparklineId: 'lux-sparkline',
    },
    pressure: {
        key: 'pressure',
        label: 'Pressure',
        unit: 'hPa',
        color: '#6366f1',
        precision: 1,

        i18nKey: 'sensor_pressure',
        csvHeader: 'Pressure (hPa)',
        csvPrecision: 1,
        cardId: 'pressure-card',
        valueId: 'pressure-value',
        sparklineId: 'pressure-sparkline',
    },
    gasResistance: {
        key: 'gasResistance',
        label: 'Gas Res.',
        unit: '\u03A9',
        color: '#ec4899',
        precision: 0,

        i18nKey: 'sensor_gasResistance',
        csvHeader: 'Gas Resistance (Ohm)',
        csvPrecision: 0,
        cardId: 'gasResistance-card',
        valueId: 'gasResistance-value',
        sparklineId: 'gasResistance-sparkline',
    },
};

// ─── Extra (non-metric) Fields ──────────────────────────────────────────────────
// Fields that appear in logs/exports but are not plottable sensor metrics.

const EXTRA_FIELD_DEFS = {
    lat:       { key: 'lat',       csvHeader: 'Latitude',   csvPrecision: 7 },
    lon:       { key: 'lon',       csvHeader: 'Longitude',  csvPrecision: 7 },
    fix:       { key: 'fix',       csvHeader: 'GPS Fix',    csvPrecision: null },
    tslCH0:    { key: 'tslCH0',    csvHeader: 'TSL CH0',    csvPrecision: 0 },
    tslCH1:    { key: 'tslCH1',    csvHeader: 'TSL CH1',    csvPrecision: 0 },
    overflow:  { key: 'overflow',  csvHeader: 'Overflow',   csvPrecision: 0 },
};

// ─── Device Type Registry ───────────────────────────────────────────────────────

export const DEVICE_TYPES = {
    GPS: {
        id: LOG_TYPE.GPS,
        name: 'GPS',
        metrics: [
            METRIC_DEFS.temperature,
            METRIC_DEFS.humidity,
            METRIC_DEFS.pm25,
            METRIC_DEFS.pm10,
        ],
        extraFields: [
            EXTRA_FIELD_DEFS.lat,
            EXTRA_FIELD_DEFS.lon,
            EXTRA_FIELD_DEFS.fix,
        ],
    },
    TSL2591: {
        id: LOG_TYPE.TSL2591,
        name: 'TSL2591',
        metrics: [
            METRIC_DEFS.temperature,
            METRIC_DEFS.humidity,
            METRIC_DEFS.pm25,
            METRIC_DEFS.pm10,
            METRIC_DEFS.lux,
        ],
        extraFields: [
            EXTRA_FIELD_DEFS.tslCH0,
            EXTRA_FIELD_DEFS.tslCH1,
            EXTRA_FIELD_DEFS.overflow,
        ],
    },
    CO2: {
        id: LOG_TYPE.CO2,
        name: 'CO2',
        metrics: [
            METRIC_DEFS.temperature,
            METRIC_DEFS.humidity,
            METRIC_DEFS.co2,
            METRIC_DEFS.pressure,
            METRIC_DEFS.gasResistance,
            METRIC_DEFS.lux,
        ],
        extraFields: [],
    },
};

// ─── Lookup Helpers ─────────────────────────────────────────────────────────────

/** Lookup device type by LOG_TYPE integer id. Returns null if unknown. */
export function getDeviceTypeById(id) {
    for (const dt of Object.values(DEVICE_TYPES)) {
        if (dt.id === id) return dt;
    }
    return null;
}

/** Get metric key strings for a device type: ['temperature', 'humidity', ...] */
export function getMetricKeys(deviceType) {
    return deviceType.metrics.map(m => m.key);
}

/** Get a single metric definition from a device type by key. Returns undefined if not found. */
export function getMetricDef(deviceType, key) {
    return deviceType.metrics.find(m => m.key === key);
}

// ─── Aggregate Helpers (union across all types, deduped) ────────────────────────

let _allMetricsCache = null;

/** All known metrics across all device types, deduped, in declaration order. */
export function getAllKnownMetrics() {
    if (_allMetricsCache) return _allMetricsCache;
    const seen = new Set();
    const result = [];
    for (const dt of Object.values(DEVICE_TYPES)) {
        for (const m of dt.metrics) {
            if (!seen.has(m.key)) {
                seen.add(m.key);
                result.push(m);
            }
        }
    }
    _allMetricsCache = result;
    return result;
}

/** Map: { temperature: '#ef4444', ... } — same shape as the old METRIC_COLORS dict */
export function getMetricColorsMap() {
    const map = {};
    for (const m of getAllKnownMetrics()) {
        map[m.key] = m.color;
    }
    return map;
}

/** Map: { temperature: '°C', ... } — same shape as the old METRIC_UNITS dict */
export function getMetricUnitsMap() {
    const map = {};
    for (const m of getAllKnownMetrics()) {
        map[m.key] = m.unit;
    }
    return map;
}

/** Map: { temperature: 'Temp', ... } — same shape as the old METRIC_LABELS dict */
export function getMetricLabelsMap() {
    const map = {};
    for (const m of getAllKnownMetrics()) {
        map[m.key] = m.label;
    }
    return map;
}

/**
 * Metrics that have air quality thresholds (for events/heatmap).
 * Returns array of key strings: ['pm25', 'pm10', 'co2']
 */
export function getDetectableMetrics() {
    return Object.keys(AIR_QUALITY_THRESHOLDS);
}
