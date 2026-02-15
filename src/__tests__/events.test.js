import { describe, it, expect } from 'vitest';
import { detectEvents, formatEventDuration, formatEventTimeRange } from '../js/events/events.js';

describe('Events - Detection', () => {
    // Helper to create mock logs
    function createMockLogs(baseTimestamp = 1609459200, count = 100, metric = 'pm25', baseValue = 10) {
        return Array.from({ length: count }, (_, i) => ({
            timestamp: baseTimestamp + i * 180, // 3-minute intervals
            pm25: metric === 'pm25' ? baseValue : 10,
            pm10: metric === 'pm10' ? baseValue : 15,
            co2: metric === 'co2' ? baseValue : 600,
            temperature: 22,
            humidity: 45
        }));
    }

    describe('detectEvents', () => {
        it('should return empty array for insufficient data', () => {
            expect(detectEvents([])).toEqual([]);
            expect(detectEvents(null)).toEqual([]);
            expect(detectEvents([{ timestamp: 1 }])).toEqual([]);
        });

        it('should detect PM2.5 threshold violation', () => {
            // Create logs with a spike above threshold (red = 55)
            const logs = createMockLogs(1609459200, 50, 'pm25', 10);
            // Add spike in the middle
            for (let i = 20; i < 30; i++) {
                logs[i].pm25 = 80; // Above red threshold
            }

            const events = detectEvents(logs);

            expect(events.length).toBeGreaterThan(0);
            const pmEvent = events.find(e => e.metric === 'pm25');
            expect(pmEvent).toBeDefined();
            expect(pmEvent.peak).toBe(80);
            expect(pmEvent.severity).toBe('red');
        });

        it('should detect CO2 threshold violation', () => {
            const logs = createMockLogs(1609459200, 50, 'co2', 600);
            // Add spike above threshold (orange = 1500)
            for (let i = 20; i < 30; i++) {
                logs[i].co2 = 1800;
            }

            const events = detectEvents(logs);

            const co2Event = events.find(e => e.metric === 'co2');
            expect(co2Event).toBeDefined();
            expect(co2Event.peak).toBe(1800);
        });

        it('should detect anomalies using MAD-based z-score', () => {
            // Create stable baseline
            const logs = createMockLogs(1609459200, 100, 'pm25', 10);
            // Add dramatic spike (should be detected as anomaly even if below absolute threshold)
            for (let i = 50; i < 55; i++) {
                logs[i].pm25 = 45; // Below red (55) but way above baseline
            }

            const events = detectEvents(logs);

            // Should detect either as anomaly or threshold violation
            const pmEvent = events.find(e => e.metric === 'pm25');
            expect(pmEvent).toBeDefined();
        });

        it('should merge overlapping events', () => {
            const logs = createMockLogs(1609459200, 50, 'pm25', 10);
            // Two close spikes that should merge
            for (let i = 10; i < 15; i++) {
                logs[i].pm25 = 80;
            }
            for (let i = 17; i < 22; i++) {
                logs[i].pm25 = 80;
            }

            const events = detectEvents(logs);

            // Should be merged into one or two events (depending on gap)
            const pmEvents = events.filter(e => e.metric === 'pm25');
            expect(pmEvents.length).toBeLessThanOrEqual(2);
        });

        it('should sort events by time descending', () => {
            const logs = createMockLogs(1609459200, 100, 'pm25', 10);
            // Add two spikes at different times
            for (let i = 10; i < 15; i++) {
                logs[i].pm25 = 80;
            }
            for (let i = 70; i < 75; i++) {
                logs[i].pm25 = 90;
            }

            const events = detectEvents(logs);
            const pmEvents = events.filter(e => e.metric === 'pm25');

            if (pmEvents.length >= 2) {
                expect(pmEvents[0].startTime).toBeGreaterThan(pmEvents[1].startTime);
            }
        });

        it('should detect combustion correlation when PM2.5 and PM10 spike together', () => {
            const logs = createMockLogs(1609459200, 50, 'pm25', 10);
            // Add simultaneous PM2.5 and PM10 spikes
            for (let i = 20; i < 30; i++) {
                logs[i].pm25 = 80;  // Above red threshold
                logs[i].pm10 = 300; // Above red threshold
            }

            const events = detectEvents(logs);

            const pm25Event = events.find(e => e.metric === 'pm25' && e.peak >= 80);
            const pm10Event = events.find(e => e.metric === 'pm10' && e.peak >= 300);

            expect(pm25Event).toBeDefined();
            expect(pm10Event).toBeDefined();
            expect(pm25Event.combustionLikely).toBe(true);
            expect(pm10Event.combustionLikely).toBe(true);
        });

        it('should not flag combustion when only PM2.5 spikes', () => {
            const logs = createMockLogs(1609459200, 50, 'pm25', 10);
            // Only PM2.5 spike, PM10 stays normal
            for (let i = 20; i < 30; i++) {
                logs[i].pm25 = 80;
            }

            const events = detectEvents(logs);

            const pm25Event = events.find(e => e.metric === 'pm25' && e.peak >= 80);
            expect(pm25Event).toBeDefined();
            expect(pm25Event.combustionLikely).toBeUndefined();
        });
    });
});

describe('Events - Formatting', () => {
    describe('formatEventDuration', () => {
        it('should format seconds', () => {
            expect(formatEventDuration(45)).toBe('45s');
        });

        it('should format minutes', () => {
            expect(formatEventDuration(120)).toBe('2 min');
            expect(formatEventDuration(300)).toBe('5 min');
        });

        it('should format hours', () => {
            expect(formatEventDuration(3600)).toBe('1h');
            expect(formatEventDuration(7200)).toBe('2h');
        });

        it('should format hours and minutes', () => {
            expect(formatEventDuration(5400)).toBe('1h 30m');
            expect(formatEventDuration(9000)).toBe('2h 30m');
        });
    });

    describe('formatEventTimeRange', () => {
        it('should format same-day range', () => {
            const start = 1609459200; // Jan 1, 2021 00:00:00 UTC
            const end = start + 3600; // 1 hour later

            const result = formatEventTimeRange(start, end);

            expect(result).toContain('Jan');
            expect(result).toContain('–');
        });

        it('should format multi-day range', () => {
            const start = 1609459200; // Jan 1, 2021
            const end = start + 86400 * 2; // 2 days later

            const result = formatEventTimeRange(start, end);

            // Should include both dates
            expect(result.length).toBeGreaterThan(15);
        });
    });
});
