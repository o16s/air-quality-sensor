/**
 * Device Types Registry Tests
 */

import { describe, it, expect } from 'vitest';
import {
    DEVICE_TYPES,
    getDeviceTypeById,
    getMetricKeys,
    getMetricDef,
    getAllKnownMetrics,
    getMetricColorsMap,
    getMetricUnitsMap,
    getMetricLabelsMap,
    getDetectableMetrics
} from '../js/deviceTypes.js';
import { LOG_TYPE } from '../js/constants.js';

describe('Device Types Registry', () => {
    describe('DEVICE_TYPES structure', () => {
        it('should have GPS, TSL2591, and CO2 types', () => {
            expect(DEVICE_TYPES.GPS).toBeDefined();
            expect(DEVICE_TYPES.TSL2591).toBeDefined();
            expect(DEVICE_TYPES.CO2).toBeDefined();
        });

        it('should have correct IDs matching LOG_TYPE', () => {
            expect(DEVICE_TYPES.GPS.id).toBe(LOG_TYPE.GPS);
            expect(DEVICE_TYPES.TSL2591.id).toBe(LOG_TYPE.TSL2591);
            expect(DEVICE_TYPES.CO2.id).toBe(LOG_TYPE.CO2);
        });

        it('each device type should have metrics and extraFields arrays', () => {
            for (const dt of Object.values(DEVICE_TYPES)) {
                expect(Array.isArray(dt.metrics)).toBe(true);
                expect(Array.isArray(dt.extraFields)).toBe(true);
                expect(dt.metrics.length).toBeGreaterThan(0);
            }
        });

        it('every metric should have required fields', () => {
            const requiredFields = ['key', 'label', 'unit', 'color', 'precision', 'i18nKey'];
            for (const dt of Object.values(DEVICE_TYPES)) {
                for (const m of dt.metrics) {
                    for (const field of requiredFields) {
                        expect(m[field], `${dt.name}.${m.key} missing ${field}`).toBeDefined();
                    }
                }
            }
        });
    });

    describe('GPS device type', () => {
        it('should have temperature, humidity, pm25, pm10 metrics', () => {
            const keys = getMetricKeys(DEVICE_TYPES.GPS);
            expect(keys).toEqual(['temperature', 'humidity', 'pm25', 'pm10']);
        });

        it('should have lat, lon, fix, batteryVoltage, charging extra fields', () => {
            const extraKeys = DEVICE_TYPES.GPS.extraFields.map(f => f.key);
            expect(extraKeys).toEqual(['lat', 'lon', 'fix', 'batteryVoltage', 'charging']);
        });
    });

    describe('TSL2591 device type', () => {
        it('should have temperature, humidity, pm25, pm10, lux metrics', () => {
            const keys = getMetricKeys(DEVICE_TYPES.TSL2591);
            expect(keys).toEqual(['temperature', 'humidity', 'pm25', 'pm10', 'lux']);
        });

        it('should have tslCH0, tslCH1, overflow, batteryVoltage, charging extra fields', () => {
            const extraKeys = DEVICE_TYPES.TSL2591.extraFields.map(f => f.key);
            expect(extraKeys).toEqual(['tslCH0', 'tslCH1', 'overflow', 'batteryVoltage', 'charging']);
        });
    });

    describe('SPECTRAL device type', () => {
        it('should have 12 spectral channel metrics', () => {
            const keys = getMetricKeys(DEVICE_TYPES.SPECTRAL);
            expect(keys).toEqual([
                'f1_415nm', 'f2_445nm', 'f3_480nm', 'f4_515nm',
                'clear1', 'nir1',
                'f5_555nm', 'f6_590nm', 'f7_630nm', 'f8_680nm',
                'clear2', 'nir2',
            ]);
        });

        it('should NOT have temperature or humidity metrics', () => {
            const keys = getMetricKeys(DEVICE_TYPES.SPECTRAL);
            expect(keys).not.toContain('temperature');
            expect(keys).not.toContain('humidity');
        });

        it('should return undefined for getMetricDef with temperature', () => {
            expect(getMetricDef(DEVICE_TYPES.SPECTRAL, 'temperature')).toBeUndefined();
        });

        it('should return undefined for getMetricDef with humidity', () => {
            expect(getMetricDef(DEVICE_TYPES.SPECTRAL, 'humidity')).toBeUndefined();
        });

        it('should have no extra fields', () => {
            expect(DEVICE_TYPES.SPECTRAL.extraFields).toEqual([]);
        });
    });

    describe('CO2 device type', () => {
        it('should have temperature, humidity, co2, pressure, gasResistance, lux metrics', () => {
            const keys = getMetricKeys(DEVICE_TYPES.CO2);
            expect(keys).toEqual(['temperature', 'humidity', 'co2', 'pressure', 'gasResistance', 'lux']);
        });

        it('should NOT have pm25 or pm10', () => {
            const keys = getMetricKeys(DEVICE_TYPES.CO2);
            expect(keys).not.toContain('pm25');
            expect(keys).not.toContain('pm10');
        });
    });

    describe('getDeviceTypeById', () => {
        it('should look up GPS by id 0', () => {
            expect(getDeviceTypeById(0)).toBe(DEVICE_TYPES.GPS);
        });

        it('should look up TSL2591 by id 1', () => {
            expect(getDeviceTypeById(1)).toBe(DEVICE_TYPES.TSL2591);
        });

        it('should look up CO2 by id 2', () => {
            expect(getDeviceTypeById(2)).toBe(DEVICE_TYPES.CO2);
        });

        it('should return null for unknown id', () => {
            expect(getDeviceTypeById(99)).toBeNull();
        });
    });

    describe('getMetricDef', () => {
        it('should return the metric definition for a known key', () => {
            const def = getMetricDef(DEVICE_TYPES.CO2, 'co2');
            expect(def).toBeDefined();
            expect(def.key).toBe('co2');
            expect(def.unit).toBe('ppm');
        });

        it('should return undefined for a metric not on the device type', () => {
            const def = getMetricDef(DEVICE_TYPES.GPS, 'co2');
            expect(def).toBeUndefined();
        });
    });

    describe('getAllKnownMetrics', () => {
        it('should return all unique metrics across all device types', () => {
            const all = getAllKnownMetrics();
            const keys = all.map(m => m.key);
            expect(keys).toContain('temperature');
            expect(keys).toContain('humidity');
            expect(keys).toContain('pm25');
            expect(keys).toContain('pm10');
            expect(keys).toContain('co2');
            expect(keys).toContain('lux');
            expect(keys).toContain('pressure');
            expect(keys).toContain('gasResistance');
            expect(keys).toContain('trafficCount');
            expect(keys).toContain('engageCount');
            expect(keys).toContain('distance');
            expect(keys).toContain('variance');
            expect(keys).toContain('f1_415nm');
            expect(keys).toContain('f8_680nm');
            expect(keys).toContain('clear1');
            expect(keys).toContain('nir2');
            expect(all.length).toBe(24);
        });

        it('should not have duplicates', () => {
            const all = getAllKnownMetrics();
            const keys = all.map(m => m.key);
            expect(new Set(keys).size).toBe(keys.length);
        });

        it('should return the same reference on repeated calls (cached)', () => {
            const first = getAllKnownMetrics();
            const second = getAllKnownMetrics();
            expect(first).toBe(second);
        });
    });

    describe('getMetricColorsMap', () => {
        it('should return a map with all known metrics', () => {
            const colors = getMetricColorsMap();
            expect(colors.temperature).toBe('#ef4444');
            expect(colors.humidity).toBe('#3b82f6');
            expect(colors.pm25).toBe('#f59e0b');
            expect(colors.co2).toBe('#10b981');
        });
    });

    describe('getMetricUnitsMap', () => {
        it('should return correct units', () => {
            const units = getMetricUnitsMap();
            expect(units.temperature).toBe('\u00B0C');
            expect(units.humidity).toBe('%');
            expect(units.co2).toBe('ppm');
            expect(units.gasResistance).toBe('\u03A9');
        });
    });

    describe('getMetricLabelsMap', () => {
        it('should return correct labels', () => {
            const labels = getMetricLabelsMap();
            expect(labels.temperature).toBe('Temp');
            expect(labels.pm25).toBe('PM2.5');
            expect(labels.co2).toBe('CO2');
            expect(labels.gasResistance).toBe('Gas Res.');
        });
    });

    describe('getDetectableMetrics', () => {
        it('should return metrics with AIR_QUALITY_THRESHOLDS', () => {
            const detectable = getDetectableMetrics();
            expect(detectable).toContain('pm25');
            expect(detectable).toContain('pm10');
            expect(detectable).toContain('co2');
            expect(detectable).not.toContain('temperature');
            expect(detectable).not.toContain('humidity');
        });
    });
});
