/**
 * Utils Tests
 * Tests utility functions
 */

import { describe, it, expect } from 'vitest';
import { isDuplicateLog } from '../js/utils.js';

// Sample log data
const createMockLog = (overrides = {}) => ({
  temperature: 23.5,
  humidity: 45.6,
  pm25: 12.5,
  pm10: 18.3,
  battery: 85,
  timestamp: 1699000000,
  deviceSerial: 'TEST-DEVICE-001',
  ...overrides
});

describe('Utils - isDuplicateLog', () => {
  describe('Exact Match Detection', () => {
    it('should detect exact duplicate (same timestamp and device)', () => {
      const log1 = createMockLog();
      const log2 = createMockLog();

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });

    it('should not detect duplicate for different devices', () => {
      const log1 = createMockLog({ deviceSerial: 'DEVICE-001' });
      const log2 = createMockLog({ deviceSerial: 'DEVICE-002' });

      expect(isDuplicateLog(log1, log2)).toBe(false);
    });

    it('should not detect duplicate for different timestamps (>2s)', () => {
      const log1 = createMockLog({ timestamp: 1699000000 });
      const log2 = createMockLog({ timestamp: 1699000010 }); // 10 seconds later

      expect(isDuplicateLog(log1, log2)).toBe(false);
    });
  });

  describe('Fuzzy Match Detection (Timestamp Tolerance)', () => {
    it('should detect duplicate with 1 second timestamp difference and matching values', () => {
      const log1 = createMockLog({ timestamp: 1699000000 });
      const log2 = createMockLog({ timestamp: 1699000001 }); // 1s later

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });

    it('should detect duplicate with 2 second timestamp difference and matching values', () => {
      const log1 = createMockLog({ timestamp: 1699000000 });
      const log2 = createMockLog({ timestamp: 1699000002 }); // 2s later

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });

    it('should NOT detect duplicate with 3 second timestamp difference', () => {
      const log1 = createMockLog({ timestamp: 1699000000 });
      const log2 = createMockLog({ timestamp: 1699000003 }); // 3s later

      expect(isDuplicateLog(log1, log2)).toBe(false);
    });

    it('should detect duplicate with negative timestamp difference (±2s)', () => {
      const log1 = createMockLog({ timestamp: 1699000002 });
      const log2 = createMockLog({ timestamp: 1699000000 }); // 2s earlier

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });
  });

  describe('Sensor Value Matching', () => {
    it('should NOT detect duplicate with different temperature (outside tolerance)', () => {
      const log1 = createMockLog({ timestamp: 1699000001, temperature: 23.5 });
      const log2 = createMockLog({ timestamp: 1699000002, temperature: 24.0 }); // 0.5°C diff

      expect(isDuplicateLog(log1, log2)).toBe(false);
    });

    it('should detect duplicate with small temperature difference (within tolerance)', () => {
      const log1 = createMockLog({ timestamp: 1699000001, temperature: 23.5 });
      const log2 = createMockLog({ timestamp: 1699000002, temperature: 23.55 }); // 0.05°C diff

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });

    it('should NOT detect duplicate with different humidity (outside tolerance)', () => {
      const log1 = createMockLog({ timestamp: 1699000001, humidity: 45.0 });
      const log2 = createMockLog({ timestamp: 1699000002, humidity: 46.0 }); // 1% diff

      expect(isDuplicateLog(log1, log2)).toBe(false);
    });

    it('should detect duplicate with small humidity difference (within tolerance)', () => {
      const log1 = createMockLog({ timestamp: 1699000001, humidity: 45.0 });
      const log2 = createMockLog({ timestamp: 1699000002, humidity: 45.3 }); // 0.3% diff

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });

    it('should NOT detect duplicate with different PM2.5 (outside tolerance)', () => {
      const log1 = createMockLog({ timestamp: 1699000001, pm25: 12.0 });
      const log2 = createMockLog({ timestamp: 1699000002, pm25: 13.0 }); // 1.0 diff

      expect(isDuplicateLog(log1, log2)).toBe(false);
    });

    it('should detect duplicate with small PM2.5 difference (within tolerance)', () => {
      const log1 = createMockLog({ timestamp: 1699000001, pm25: 12.0 });
      const log2 = createMockLog({ timestamp: 1699000002, pm25: 12.3 }); // 0.3 diff

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });

    it('should NOT detect duplicate with different PM10 (outside tolerance)', () => {
      const log1 = createMockLog({ timestamp: 1699000001, pm10: 18.0 });
      const log2 = createMockLog({ timestamp: 1699000002, pm10: 19.0 }); // 1.0 diff

      expect(isDuplicateLog(log1, log2)).toBe(false);
    });

    it('should require ALL sensor values to match for fuzzy duplicate', () => {
      const log1 = createMockLog({
        timestamp: 1699000001,
        temperature: 23.5,
        humidity: 45.0,
        pm25: 12.0,
        pm10: 18.0
      });

      // Only temperature matches, others differ
      const log2 = createMockLog({
        timestamp: 1699000002,
        temperature: 23.5,
        humidity: 50.0,  // Different
        pm25: 12.0,
        pm10: 18.0
      });

      expect(isDuplicateLog(log1, log2)).toBe(false);
    });

    it('should detect duplicate when ALL sensor values match (fuzzy)', () => {
      const log1 = createMockLog({
        timestamp: 1699000001,
        temperature: 23.5,
        humidity: 45.0,
        pm25: 12.0,
        pm10: 18.0
      });

      const log2 = createMockLog({
        timestamp: 1699000002,
        temperature: 23.52,  // Within tolerance
        humidity: 45.2,      // Within tolerance
        pm25: 12.1,          // Within tolerance
        pm10: 18.1           // Within tolerance
      });

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle logs with missing deviceSerial', () => {
      const log1 = createMockLog({ deviceSerial: undefined });
      const log2 = createMockLog({ deviceSerial: 'DEVICE-001' });

      expect(isDuplicateLog(log1, log2)).toBe(false);
    });

    it('should detect duplicate with both undefined deviceSerial and same timestamp', () => {
      const log1 = createMockLog({ deviceSerial: undefined, timestamp: 1699000000 });
      const log2 = createMockLog({ deviceSerial: undefined, timestamp: 1699000000 });

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });

    it('should handle logs with zero values', () => {
      const log1 = createMockLog({
        timestamp: 1699000001,
        temperature: 0,
        humidity: 0,
        pm25: 0,
        pm10: 0
      });
      const log2 = createMockLog({
        timestamp: 1699000002,
        temperature: 0,
        humidity: 0,
        pm25: 0,
        pm10: 0
      });

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });

    it('should handle logs with negative temperature', () => {
      const log1 = createMockLog({
        timestamp: 1699000001,
        temperature: -10.5
      });
      const log2 = createMockLog({
        timestamp: 1699000002,
        temperature: -10.4
      });

      expect(isDuplicateLog(log1, log2)).toBe(true);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should catch duplicate from re-download with exact same data', () => {
      // Scenario: User downloads logs, then downloads again immediately
      const originalLog = createMockLog({
        timestamp: 1699000000,
        deviceSerial: 'CCC-SENSOR-001',
        temperature: 22.5,
        humidity: 55.3,
        pm25: 8.2,
        pm10: 12.1
      });

      const redownloadedLog = createMockLog({
        timestamp: 1699000000,
        deviceSerial: 'CCC-SENSOR-001',
        temperature: 22.5,
        humidity: 55.3,
        pm25: 8.2,
        pm10: 12.1
      });

      expect(isDuplicateLog(originalLog, redownloadedLog)).toBe(true);
    });

    it('should catch duplicate with minor timestamp drift', () => {
      // Scenario: Device clock drifts slightly between downloads
      const originalLog = createMockLog({
        timestamp: 1699000000,
        deviceSerial: 'CCC-SENSOR-001',
        temperature: 22.5,
        humidity: 55.3,
        pm25: 8.2,
        pm10: 12.1
      });

      const driftedLog = createMockLog({
        timestamp: 1699000001,  // 1 second drift
        deviceSerial: 'CCC-SENSOR-001',
        temperature: 22.5,
        humidity: 55.3,
        pm25: 8.2,
        pm10: 12.1
      });

      expect(isDuplicateLog(originalLog, driftedLog)).toBe(true);
    });

    it('should NOT catch as duplicate when sensor readings actually changed', () => {
      // Scenario: Two readings 1 second apart with different values (real data)
      const reading1 = createMockLog({
        timestamp: 1699000000,
        deviceSerial: 'CCC-SENSOR-001',
        temperature: 22.5,
        humidity: 55.3,
        pm25: 8.2,
        pm10: 12.1
      });

      const reading2 = createMockLog({
        timestamp: 1699000001,
        deviceSerial: 'CCC-SENSOR-001',
        temperature: 22.5,
        humidity: 55.3,
        pm25: 15.8,  // PM2.5 increased significantly
        pm10: 12.1
      });

      expect(isDuplicateLog(reading1, reading2)).toBe(false);
    });
  });
});
