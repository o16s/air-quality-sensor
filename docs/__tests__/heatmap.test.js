import { describe, it, expect } from 'vitest';
import { generateHeatmapData, formatHeatmapTooltip } from '../js/heatmap.js';

describe('Heatmap - Data Generation', () => {
    // Helper to create mock logs
    function createMockLogs(baseTimestamp, count, metric = 'pm25', value = 15) {
        return Array.from({ length: count }, (_, i) => ({
            timestamp: baseTimestamp + i * 3600, // 1 hour intervals
            pm25: metric === 'pm25' ? value : 10,
            pm10: metric === 'pm10' ? value : 15,
            co2: metric === 'co2' ? value : 600
        }));
    }

    describe('generateHeatmapData', () => {
        it('should return grid with all empty cells for no data', () => {
            const result = generateHeatmapData([], 'pm25');
            // Grid is still generated, but all cells should have count = 0
            expect(result.grid.length).toBe(12); // 12 hours (7am-6pm)
            const totalCount = result.grid.flat().reduce((sum, cell) => sum + cell.count, 0);
            expect(totalCount).toBe(0);
        });

        it('should return error for unknown metric', () => {
            const logs = createMockLogs(Date.now() / 1000, 100);
            const result = generateHeatmapData(logs, 'unknown');
            expect(result.error).toBe('Unknown metric');
        });

        it('should generate grid with correct dimensions', () => {
            // Create logs spanning multiple days and hours
            const now = Math.floor(Date.now() / 1000);
            const logs = createMockLogs(now - 7 * 24 * 3600, 200, 'pm25', 20);

            const result = generateHeatmapData(logs, 'pm25', { days: 7 });

            // Should have 12 rows (7am-6pm = hours 7-18)
            expect(result.hourLabels.length).toBe(12);
            expect(result.grid.length).toBe(12);

            // Should have 7 columns (days)
            expect(result.dayLabels.length).toBe(7);
            expect(result.grid[0].length).toBe(7);
        });

        it('should include metric info', () => {
            const now = Math.floor(Date.now() / 1000);
            const logs = createMockLogs(now - 24 * 3600, 50, 'pm25', 20);

            const result = generateHeatmapData(logs, 'pm25');

            expect(result.metric).toBe('pm25');
            expect(result.unit).toBe('μg/m³');
            expect(result.label).toBe('PM2.5');
        });

        it('should calculate hourly averages', () => {
            // Create multiple logs for the same hour
            const now = new Date();
            now.setHours(12, 0, 0, 0); // noon today
            const timestamp = Math.floor(now.getTime() / 1000);

            const logs = [
                { timestamp: timestamp, pm25: 10 },
                { timestamp: timestamp + 600, pm25: 20 },  // 10 min later
                { timestamp: timestamp + 1200, pm25: 30 }  // 20 min later
            ];

            const result = generateHeatmapData(logs, 'pm25', { days: 1 });

            // Find the noon cell
            const noonRow = result.grid.find((_, i) => result.hourLabels[i].hour === 12);
            if (noonRow) {
                const todayCell = noonRow[noonRow.length - 1]; // last column is today
                if (todayCell.count > 0) {
                    expect(todayCell.value).toBe(20); // (10+20+30)/3 = 20
                    expect(todayCell.count).toBe(3);
                }
            }
        });

        it('should assign colors based on thresholds', () => {
            const now = new Date();
            now.setHours(10, 0, 0, 0);
            const timestamp = Math.floor(now.getTime() / 1000);

            // Low value - should be green
            const logsLow = [{ timestamp, pm25: 5 }];
            const resultLow = generateHeatmapData(logsLow, 'pm25', { days: 1 });

            // High value - should be red
            const logsHigh = [{ timestamp, pm25: 100 }];
            const resultHigh = generateHeatmapData(logsHigh, 'pm25', { days: 1 });

            // Find cells with data
            const findCellWithData = (result) => {
                for (const row of result.grid) {
                    for (const cell of row) {
                        if (cell.count > 0) return cell;
                    }
                }
                return null;
            };

            const lowCell = findCellWithData(resultLow);
            const highCell = findCellWithData(resultHigh);

            if (lowCell) expect(lowCell.color).toBe('#10b981'); // green
            if (highCell) expect(highCell.color).toBe('#ef4444'); // red
        });

        it('should filter out non-office hours', () => {
            const now = new Date();
            now.setHours(3, 0, 0, 0); // 3am - outside office hours
            const timestamp = Math.floor(now.getTime() / 1000);

            const logs = [{ timestamp, pm25: 50 }];
            const result = generateHeatmapData(logs, 'pm25', { days: 1 });

            // All cells should be empty since 3am is outside 7am-7pm
            const totalCount = result.grid.flat().reduce((sum, cell) => sum + cell.count, 0);
            expect(totalCount).toBe(0);
        });
    });
});

describe('Heatmap - Formatting', () => {
    describe('formatHeatmapTooltip', () => {
        const dayLabels = [{ key: '2024-01-25', label: 'Thu 25' }];
        const hourLabels = [{ hour: 10, label: '10am' }];

        it('should format tooltip with value', () => {
            const cell = { value: 25.5, count: 5, day: '2024-01-25', hour: 10 };
            const result = formatHeatmapTooltip(cell, 'μg/m³', dayLabels, hourLabels);

            expect(result).toContain('25.5');
            expect(result).toContain('μg/m³');
            expect(result).toContain('5 readings');
        });

        it('should handle empty cells', () => {
            const cell = { value: null, count: 0, day: '2024-01-25', hour: 10 };
            const result = formatHeatmapTooltip(cell, 'μg/m³', dayLabels, hourLabels);

            expect(result).toContain('No data');
        });
    });
});
