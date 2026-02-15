/**
 * Tests for Report Generation Module
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
    computeStatistics,
    computeEventStats,
    computeGI2Compliance,
    computeRoomStats,
} from '../js/reporting/report.js';
import { renderReportPreview } from '../js/reporting/reportPdf.js';

describe('Report Module', () => {
    describe('computeStatistics', () => {
        it('should return null for empty logs', () => {
            expect(computeStatistics([])).toBeNull();
            expect(computeStatistics(null)).toBeNull();
        });

        it('should compute statistics from logs', () => {
            const logs = [
                { timestamp: 1000, co2: 800, pm25: 10, pm10: 20, temperature: 22, humidity: 45 },
                { timestamp: 2000, co2: 1200, pm25: 15, pm10: 30, temperature: 24, humidity: 50 },
                { timestamp: 3000, co2: 1000, pm25: 12, pm10: 25, temperature: 23, humidity: 48 }
            ];

            const stats = computeStatistics(logs);

            expect(stats.totalMeasurements).toBe(3);
            expect(stats.period.start).toBe(1000);
            expect(stats.period.end).toBe(3000);
            expect(stats.co2.avg).toBe(1000);
            expect(stats.co2.min).toBe(800);
            expect(stats.co2.max).toBe(1200);
            expect(stats.pm25.avg).toBeCloseTo(12.33, 1);
            expect(stats.temperature.avg).toBe(23);
        });

        it('should handle missing metrics', () => {
            const logs = [
                { timestamp: 1000, temperature: 22 },
                { timestamp: 2000, temperature: 24 }
            ];

            const stats = computeStatistics(logs);

            expect(stats.temperature.avg).toBe(23);
            expect(stats.co2).toBeUndefined();
            expect(stats.pm25).toBeUndefined();
        });
    });

    describe('computeEventStats', () => {
        it('should return empty stats for few logs', () => {
            const logs = [
                { timestamp: 1000, co2: 800 }
            ];

            const stats = computeEventStats(logs);

            expect(stats.yellow.count).toBe(0);
            expect(stats.orange.count).toBe(0);
            expect(stats.red.count).toBe(0);
        });
    });

    describe('computeGI2Compliance', () => {
        it('should return unknown for insufficient data', () => {
            const result = computeGI2Compliance(null);
            expect(result.status).toBe('unknown');
        });

        it('should return pass for compliant data', () => {
            const stats = {
                co2: { avg: 800, max: 1200 }
            };

            const result = computeGI2Compliance(stats);

            expect(result.status).toBe('pass');
        });

        it('should return warning for moderate data', () => {
            const stats = {
                co2: { avg: 1200, max: 1800 }
            };

            const result = computeGI2Compliance(stats);

            expect(result.status).toBe('warning');
        });

        it('should return fail for non-compliant data', () => {
            const stats = {
                co2: { avg: 1800, max: 2500 }
            };

            const result = computeGI2Compliance(stats);

            expect(result.status).toBe('fail');
        });
    });

    describe('computeRoomStats', () => {
        it('should compute stats per room based on device serial', () => {
            const rooms = [
                { name: 'Living Room', floor: 'EG', deviceSerial: 'DEV001' },
                { name: 'Bedroom', floor: '1.OG', deviceSerial: 'DEV002' }
            ];
            const allLogs = [
                { timestamp: 1000, deviceSerial: 'DEV001', co2: 800, pm25: 10, pm10: 20, temperature: 22, humidity: 45 },
                { timestamp: 2000, deviceSerial: 'DEV001', co2: 900, pm25: 12, pm10: 22, temperature: 23, humidity: 47 },
                { timestamp: 1000, deviceSerial: 'DEV002', co2: 1200, pm25: 20, pm10: 40, temperature: 21, humidity: 50 },
                { timestamp: 2000, deviceSerial: 'DEV002', co2: 1400, pm25: 25, pm10: 50, temperature: 20, humidity: 55 }
            ];

            const roomStats = computeRoomStats(rooms, allLogs, 0, 5000);

            expect(roomStats).toHaveLength(2);
            expect(roomStats[0].room.name).toBe('Living Room');
            expect(roomStats[0].stats.co2.avg).toBe(850);
            expect(roomStats[0].measurementCount).toBe(2);
            expect(roomStats[0].compliance.status).toBe('ok');
            expect(roomStats[0].compliance.co2).toBe('ok');
            expect(roomStats[0].compliance.pm25).toBe('ok');
            expect(roomStats[0].compliance.pm10).toBe('ok');

            expect(roomStats[1].room.name).toBe('Bedroom');
            expect(roomStats[1].stats.co2.avg).toBe(1300);
            expect(roomStats[1].measurementCount).toBe(2);
            expect(roomStats[1].compliance.status).toBe('warning');
            expect(roomStats[1].compliance.co2).toBe('warning');  // 1300 ppm > 1000
            expect(roomStats[1].compliance.pm25).toBe('warning'); // 22.5 avg > 15
            expect(roomStats[1].compliance.pm10).toBe('ok');      // 45 avg <= 45
        });

        it('should return empty stats for rooms with no data', () => {
            const rooms = [
                { name: 'Empty Room', floor: 'EG', deviceSerial: 'DEV999' }
            ];
            const allLogs = [
                { timestamp: 1000, deviceSerial: 'DEV001', co2: 800 }
            ];

            const roomStats = computeRoomStats(rooms, allLogs, 0, 5000);

            expect(roomStats).toHaveLength(1);
            expect(roomStats[0].stats).toBeNull();
            expect(roomStats[0].measurementCount).toBe(0);
            expect(roomStats[0].compliance.status).toBe('unknown');
            expect(roomStats[0].compliance.co2).toBeNull();
            expect(roomStats[0].compliance.pm25).toBeNull();
            expect(roomStats[0].compliance.pm10).toBeNull();
        });

        it('should filter logs by date range', () => {
            const rooms = [
                { name: 'Test Room', floor: 'EG', deviceSerial: 'DEV001' }
            ];
            const allLogs = [
                { timestamp: 500, deviceSerial: 'DEV001', co2: 800 },  // Outside range
                { timestamp: 1500, deviceSerial: 'DEV001', co2: 900 }, // Inside range
                { timestamp: 2500, deviceSerial: 'DEV001', co2: 1000 }, // Inside range
                { timestamp: 3500, deviceSerial: 'DEV001', co2: 1100 }  // Outside range
            ];

            const roomStats = computeRoomStats(rooms, allLogs, 1000, 3000);

            expect(roomStats[0].measurementCount).toBe(2);
            expect(roomStats[0].stats.co2.avg).toBe(950);
        });

        it('should mark elevated status for high values', () => {
            const rooms = [
                { name: 'High CO2 Room', floor: 'EG', deviceSerial: 'DEV001' }
            ];
            const allLogs = [
                { timestamp: 1000, deviceSerial: 'DEV001', co2: 1600, pm25: 40, pm10: 110 }
            ];

            const roomStats = computeRoomStats(rooms, allLogs, 0, 5000);

            expect(roomStats[0].compliance.status).toBe('elevated');
            expect(roomStats[0].compliance.co2).toBe('elevated');   // > 1500
            expect(roomStats[0].compliance.pm25).toBe('elevated');  // > 35
            expect(roomStats[0].compliance.pm10).toBe('elevated');  // > 100
        });
    });

    describe('renderReportPreview', () => {
        it('should render HTML with basic config', () => {
            const html = renderReportPreview({
                organization: 'Test Org',
                title: 'Test Report',
                buildingLocation: {
                    name: 'Test Building',
                    city: 'Test City'
                }
            });

            expect(html).toContain('Test Org');
            expect(html).toContain('Test Report');
            expect(html).toContain('Test Building');
            expect(html).toContain('Test City');
        });

        it('should render statistics when provided', () => {
            const roomStats = [{
                room: { name: 'Living Room', floor: 'EG', deviceSerial: 'ABC123' },
                stats: {
                    totalMeasurements: 100,
                    co2: { avg: 900, min: 500, max: 1400 },
                    pm25: { avg: 10, min: 5, max: 20 },
                    pm10: { avg: 30, min: 10, max: 40 },
                    temperature: { avg: 22, min: 20, max: 24 },
                    humidity: { avg: 45, min: 40, max: 50 },
                    lux: { avg: 300, min: 100, max: 500 },
                    period: { start: 1000, end: 600000 }
                },
                compliance: { status: 'ok', co2: 'ok', pm25: 'ok', pm10: 'ok' },
                measurementCount: 100,
                duration: 7
            }];
            const html = renderReportPreview({
                stats: {
                    totalMeasurements: 100,
                    co2: { avg: 900, min: 500, max: 1400 },
                    pm25: { avg: 10, min: 5, max: 20 },
                    pm10: { avg: 30, min: 10, max: 40 },
                    temperature: { avg: 22, min: 20, max: 24 },
                    humidity: { avg: 45, min: 40, max: 50 },
                    lux: { avg: 300, min: 100, max: 500 }
                },
                roomStats,
                dateStart: Date.now() - 7 * 24 * 60 * 60 * 1000,
                dateEnd: Date.now()
            });

            expect(html).toContain('900');
            expect(html).toContain('1400');
            expect(html).toContain('100 total measurements');
            expect(html).toContain('Living Room');
            // Verify PM2.5 max and PM10 columns exist
            expect(html).toContain('PM2.5 Max');
            expect(html).toContain('PM10 Max');
            // Verify comfort parameters table exists
            expect(html).toContain('Temp Ø');
            expect(html).toContain('Humidity Ø');
            expect(html).toContain('Light Ø');
        });

        it('should color-code values exceeding thresholds', () => {
            const roomStats = [{
                room: { name: 'Bad Room', floor: 'EG', deviceSerial: 'ABC123' },
                stats: {
                    co2: { avg: 1200, min: 900, max: 1600 },
                    pm25: { avg: 40, min: 20, max: 60 },
                    pm10: { avg: 30, min: 10, max: 40 },
                    period: { start: 1000, end: 600000 }
                },
                compliance: { status: 'elevated', co2: 'warning', pm25: 'elevated', pm10: 'ok' },
                measurementCount: 100,
                duration: 7
            }];
            const html = renderReportPreview({ roomStats });
            // Should have yellow coloring for CO2 warning and red for PM2.5 elevated
            expect(html).toContain('text-yellow-600');
            expect(html).toContain('text-red-600');
        });

        it('should render findings and recommendations', () => {
            const html = renderReportPreview({
                findings: ['Finding 1', 'Finding 2'],
                recommendations: ['Rec 1', 'Rec 2']
            });

            expect(html).toContain('Finding 1');
            expect(html).toContain('Finding 2');
            expect(html).toContain('Rec 1');
            expect(html).toContain('Rec 2');
        });

        it('should escape HTML in user input', () => {
            const html = renderReportPreview({
                organization: '<script>alert("xss")</script>',
                title: 'Test & Report'
            });

            expect(html).not.toContain('<script>');
            expect(html).toContain('&lt;script&gt;');
            expect(html).toContain('Test &amp; Report');
        });

        it('should handle GI2 compliance status', () => {
            const html = renderReportPreview({
                gi2Status: { status: 'pass', reason: 'CO2 levels acceptable' },
                gi2Override: 'auto'
            });

            expect(html).toContain('Compliant');
        });

        it('should handle GI2 override', () => {
            const html = renderReportPreview({
                gi2Status: { status: 'pass', reason: 'CO2 levels acceptable' },
                gi2Override: 'fail'
            });

            expect(html).toContain('Not Compliant');
            expect(html).toContain('Manual override');
        });
    });
});
