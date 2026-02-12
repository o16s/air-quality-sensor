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
  it('should detect duplicate with same timestamp and device', () => {
    const log1 = createMockLog();
    const log2 = createMockLog();
    expect(isDuplicateLog(log1, log2)).toBe(true);
  });

  it('should not detect duplicate for different devices', () => {
    const log1 = createMockLog({ deviceSerial: 'DEVICE-001' });
    const log2 = createMockLog({ deviceSerial: 'DEVICE-002' });
    expect(isDuplicateLog(log1, log2)).toBe(false);
  });

  it('should not detect duplicate for different timestamps', () => {
    const log1 = createMockLog({ timestamp: 1699000000 });
    const log2 = createMockLog({ timestamp: 1699000001 });
    expect(isDuplicateLog(log1, log2)).toBe(false);
  });

  it('should not detect duplicate even with identical sensor values but different timestamps', () => {
    const log1 = createMockLog({ timestamp: 1699000000 });
    const log2 = createMockLog({ timestamp: 1699000002 });
    expect(isDuplicateLog(log1, log2)).toBe(false);
  });

  it('should detect duplicate regardless of sensor value differences when timestamps match', () => {
    const log1 = createMockLog({ timestamp: 1699000000, temperature: 20.0 });
    const log2 = createMockLog({ timestamp: 1699000000, temperature: 25.0 });
    expect(isDuplicateLog(log1, log2)).toBe(true);
  });

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

  it('should catch re-download with exact same data', () => {
    const log1 = createMockLog({ timestamp: 1699000000, deviceSerial: 'CCC-SENSOR-001' });
    const log2 = createMockLog({ timestamp: 1699000000, deviceSerial: 'CCC-SENSOR-001' });
    expect(isDuplicateLog(log1, log2)).toBe(true);
  });

  it('should NOT treat consecutive readings as duplicates', () => {
    const log1 = createMockLog({ timestamp: 1699000000, deviceSerial: 'CCC-SENSOR-001' });
    const log2 = createMockLog({ timestamp: 1699000001, deviceSerial: 'CCC-SENSOR-001' });
    expect(isDuplicateLog(log1, log2)).toBe(false);
  });
});
