/**
 * Storage Tests
 * Tests IndexedDB wrapper functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  initDatabase,
  storeLog,
  storeLogs,
  getAllLogs,
  getLogsByDevice,
  getLogsByDateRange,
  getLogCount,
  clearAllLogs,
  clearDeviceLogs,
  getLatestLog,
  getRecentLogs,
  hasLogs,
  getDatabaseStats
} from '../js/storage.js';

// Sample log data
const createMockLog = (overrides = {}) => ({
  temperature: 23.5,
  humidity: 45.6,
  pm25: 12.5,
  pm10: 18.3,
  lat: 47.1234567,
  lon: 8.5678901,
  fix: 1,
  battery: 85,
  timestamp: Math.floor(Date.now() / 1000),
  ...overrides
});

describe('Storage - Database Initialization', () => {
  it('should initialize database successfully', async () => {
    const db = await initDatabase();
    expect(db).toBeDefined();
    expect(db.name).toBe('ccc-sensor-logs');
  });

  it('should create object store with correct indexes', async () => {
    const db = await initDatabase();
    const transaction = db.transaction(['logs'], 'readonly');
    const store = transaction.objectStore('logs');

    expect(store.indexNames.contains('timestamp')).toBe(true);
    expect(store.indexNames.contains('deviceSerial')).toBe(true);
    expect(store.indexNames.contains('deviceTimestamp')).toBe(true);
  });
});

describe('Storage - Store Operations', () => {
  beforeEach(async () => {
    await clearAllLogs();
  });

  it('should store a single log', async () => {
    const log = createMockLog();
    const id = await storeLog(log, 'TEST-DEVICE-001');

    expect(id).toBeTypeOf('number');
    expect(id).toBeGreaterThan(0);
  });

  it('should store log with device serial', async () => {
    const log = createMockLog();
    await storeLog(log, 'TEST-DEVICE-001');

    const logs = await getAllLogs();
    expect(logs[0].deviceSerial).toBe('TEST-DEVICE-001');
  });

  it('should store log with downloadedAt timestamp', async () => {
    const log = createMockLog();
    await storeLog(log, 'TEST-DEVICE-001');

    const logs = await getAllLogs();
    expect(logs[0].downloadedAt).toBeTypeOf('number');
    expect(logs[0].downloadedAt).toBeGreaterThan(0);
  });

  it('should store multiple logs in batch', async () => {
    const logs = [
      createMockLog({ timestamp: 1000 }),
      createMockLog({ timestamp: 2000 }),
      createMockLog({ timestamp: 3000 })
    ];

    const result = await storeLogs(logs, 'TEST-DEVICE-001');

    expect(result.success).toBe(3);
    expect(result.total).toBe(3);
    expect(result.errors).toHaveLength(0);
  });
});

describe('Storage - Retrieve Operations', () => {
  beforeEach(async () => {
    await clearAllLogs();

    // Store test data
    const logs = [
      createMockLog({ timestamp: 1000, temperature: 20 }),
      createMockLog({ timestamp: 2000, temperature: 21 }),
      createMockLog({ timestamp: 3000, temperature: 22 })
    ];
    await storeLogs(logs, 'TEST-DEVICE-001');

    const logs2 = [
      createMockLog({ timestamp: 4000, temperature: 23 }),
      createMockLog({ timestamp: 5000, temperature: 24 })
    ];
    await storeLogs(logs2, 'TEST-DEVICE-002');
  });

  it('should get all logs', async () => {
    const logs = await getAllLogs();
    expect(logs).toHaveLength(5);
  });

  it('should get logs by device', async () => {
    const logs = await getLogsByDevice('TEST-DEVICE-001');
    expect(logs).toHaveLength(3);
    expect(logs.every(l => l.deviceSerial === 'TEST-DEVICE-001')).toBe(true);
  });

  it('should get logs by date range', async () => {
    const logs = await getLogsByDateRange(1500, 3500);
    expect(logs).toHaveLength(2);
    expect(logs[0].timestamp).toBeGreaterThanOrEqual(1500);
    expect(logs[0].timestamp).toBeLessThanOrEqual(3500);
  });

  it('should get logs by date range and device', async () => {
    const logs = await getLogsByDateRange(1000, 3000, 'TEST-DEVICE-001');
    expect(logs).toHaveLength(3);
    expect(logs.every(l => l.deviceSerial === 'TEST-DEVICE-001')).toBe(true);
  });

  it('should get total log count', async () => {
    const count = await getLogCount();
    expect(count).toBe(5);
  });

  it('should get log count by device', async () => {
    const count = await getLogCount('TEST-DEVICE-001');
    expect(count).toBe(3);
  });

  it('should get latest log', async () => {
    const latest = await getLatestLog();
    expect(latest).toBeDefined();
    expect(latest.timestamp).toBe(5000);
    expect(latest.temperature).toBe(24);
  });

  it('should get latest log by device', async () => {
    const latest = await getLatestLog('TEST-DEVICE-001');
    expect(latest).toBeDefined();
    expect(latest.timestamp).toBe(3000);
    expect(latest.deviceSerial).toBe('TEST-DEVICE-001');
  });

  it('should get recent logs (limited)', async () => {
    const recent = await getRecentLogs(2);
    expect(recent).toHaveLength(2);
    expect(recent[0].timestamp).toBeGreaterThan(recent[1].timestamp); // Descending order
  });

  it('should get recent logs by device', async () => {
    const recent = await getRecentLogs(2, 'TEST-DEVICE-001');
    expect(recent).toHaveLength(2);
    expect(recent.every(l => l.deviceSerial === 'TEST-DEVICE-001')).toBe(true);
  });

  it('should check if logs exist', async () => {
    const exists = await hasLogs();
    expect(exists).toBe(true);
  });

  it('should check if logs exist for device', async () => {
    const exists = await hasLogs('TEST-DEVICE-001');
    expect(exists).toBe(true);

    const notExists = await hasLogs('NONEXISTENT');
    expect(notExists).toBe(false);
  });
});

describe('Storage - Delete Operations', () => {
  beforeEach(async () => {
    await clearAllLogs();

    const logs = [
      createMockLog({ timestamp: 1000 }),
      createMockLog({ timestamp: 2000 })
    ];
    await storeLogs(logs, 'TEST-DEVICE-001');

    const logs2 = [
      createMockLog({ timestamp: 3000 })
    ];
    await storeLogs(logs2, 'TEST-DEVICE-002');
  });

  it('should clear all logs', async () => {
    await clearAllLogs();
    const count = await getLogCount();
    expect(count).toBe(0);
  });

  it('should clear logs for specific device', async () => {
    const deletedCount = await clearDeviceLogs('TEST-DEVICE-001');
    expect(deletedCount).toBe(2);

    const remaining = await getLogCount();
    expect(remaining).toBe(1);

    const device2Logs = await getLogsByDevice('TEST-DEVICE-002');
    expect(device2Logs).toHaveLength(1);
  });
});

describe('Storage - Statistics', () => {
  beforeEach(async () => {
    await clearAllLogs();

    const logs = [
      createMockLog({ timestamp: 1000 }),
      createMockLog({ timestamp: 2000 }),
      createMockLog({ timestamp: 3000 })
    ];
    await storeLogs(logs, 'TEST-DEVICE-001');

    const logs2 = [
      createMockLog({ timestamp: 4000 })
    ];
    await storeLogs(logs2, 'TEST-DEVICE-002');
  });

  it('should get database statistics', async () => {
    const stats = await getDatabaseStats();

    expect(stats.totalLogs).toBe(4);
    expect(stats.devices).toHaveLength(2);
    expect(stats.devices).toContain('TEST-DEVICE-001');
    expect(stats.devices).toContain('TEST-DEVICE-002');
    expect(stats.oldestTimestamp).toBe(1000);
    expect(stats.newestTimestamp).toBe(4000);
    expect(stats.estimatedSize).toBeGreaterThan(0);
  });
});

describe('Storage - Edge Cases', () => {
  beforeEach(async () => {
    await clearAllLogs();
  });

  it('should return empty array when no logs exist', async () => {
    const logs = await getAllLogs();
    expect(logs).toEqual([]);
  });

  it('should return null when getting latest log with no data', async () => {
    const latest = await getLatestLog();
    expect(latest).toBeNull();
  });

  it('should return 0 count when no logs exist', async () => {
    const count = await getLogCount();
    expect(count).toBe(0);
  });

  it('should handle empty batch store', async () => {
    const result = await storeLogs([], 'TEST-DEVICE');
    expect(result.success).toBe(0);
    expect(result.total).toBe(0);
  });

  it('should handle logs with missing optional fields', async () => {
    const log = {
      temperature: 23.5,
      humidity: 45.6,
      pm25: 12.5,
      pm10: 18.3,
      timestamp: 1000
      // Missing GPS fields, battery, etc.
    };

    const id = await storeLog(log, 'TEST-DEVICE');
    expect(id).toBeGreaterThan(0);

    const stored = await getAllLogs();
    expect(stored[0].temperature).toBe(23.5);
  });
});

describe('Storage - Data Persistence', () => {
  it('should persist data across database reopens', async () => {
    await clearAllLogs();

    const log = createMockLog({ temperature: 99.9 });
    await storeLog(log, 'PERSIST-TEST');

    // Re-initialize database
    await initDatabase();

    const logs = await getAllLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].temperature).toBe(99.9);
  });
});
