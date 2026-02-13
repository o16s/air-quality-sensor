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
  getDatabaseStats,
  getDeviceMetadata,
  setDeviceMetadata,
  getAllDeviceMetadata,
  deleteDeviceMetadata,
  getDeviceDisplayName
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

describe('Storage - Duplicate Detection', () => {
  beforeEach(async () => {
    await clearAllLogs();
  });

  it('should skip exact duplicate logs (same timestamp and device)', async () => {
    const log1 = createMockLog({
      timestamp: 1699000000,
      temperature: 23.5,
      humidity: 45.6,
      pm25: 12.5,
      pm10: 18.3
    });

    // Store first log
    await storeLogs([log1], 'TEST-DEVICE-001');

    // Try to store exact duplicate
    const result = await storeLogs([log1], 'TEST-DEVICE-001');

    expect(result.success).toBe(0);
    expect(result.skipped).toBe(1);
    expect(result.total).toBe(1);

    // Verify only one log in database
    const allLogs = await getAllLogs();
    expect(allLogs).toHaveLength(1);
  });

  it('should NOT skip logs with different timestamps even if values match', async () => {
    const log1 = createMockLog({
      timestamp: 1699000000,
      temperature: 23.5,
      humidity: 45.6,
      pm25: 12.5,
      pm10: 18.3
    });

    const log2 = createMockLog({
      timestamp: 1699000001,  // 1 second later, same values
      temperature: 23.5,
      humidity: 45.6,
      pm25: 12.5,
      pm10: 18.3
    });

    await storeLogs([log1], 'TEST-DEVICE-001');
    const result = await storeLogs([log2], 'TEST-DEVICE-001');

    expect(result.success).toBe(1);
    expect(result.skipped).toBe(0);

    const allLogs = await getAllLogs();
    expect(allLogs).toHaveLength(2);
  });

  it('should store logs with different sensor values (not duplicates)', async () => {
    const log1 = createMockLog({
      timestamp: 1699000000,
      temperature: 23.5,
      pm25: 12.5
    });

    const log2 = createMockLog({
      timestamp: 1699000001,
      temperature: 23.5,
      pm25: 20.0  // Different PM2.5
    });

    await storeLogs([log1], 'TEST-DEVICE-001');
    const result = await storeLogs([log2], 'TEST-DEVICE-001');

    expect(result.success).toBe(1);
    expect(result.skipped).toBe(0);

    const allLogs = await getAllLogs();
    expect(allLogs).toHaveLength(2);
  });

  it('should handle batch with mix of new and duplicate logs', async () => {
    // Store initial logs
    const initialLogs = [
      createMockLog({ timestamp: 1699000000 }),
      createMockLog({ timestamp: 1699000100 })
    ];
    await storeLogs(initialLogs, 'TEST-DEVICE-001');

    // Try to store batch with 1 duplicate and 2 new
    const batchLogs = [
      createMockLog({ timestamp: 1699000000 }),  // Duplicate
      createMockLog({ timestamp: 1699000200 }),  // New
      createMockLog({ timestamp: 1699000300 })   // New
    ];

    const result = await storeLogs(batchLogs, 'TEST-DEVICE-001');

    expect(result.success).toBe(2);
    expect(result.skipped).toBe(1);
    expect(result.total).toBe(3);

    const allLogs = await getAllLogs();
    expect(allLogs).toHaveLength(4);  // 2 initial + 2 new
  });

  it('should allow same timestamp for different devices', async () => {
    const log1 = createMockLog({ timestamp: 1699000000 });
    const log2 = createMockLog({ timestamp: 1699000000 });

    await storeLogs([log1], 'DEVICE-001');
    const result = await storeLogs([log2], 'DEVICE-002');

    expect(result.success).toBe(1);
    expect(result.skipped).toBe(0);

    const allLogs = await getAllLogs();
    expect(allLogs).toHaveLength(2);
  });

  it('should skip all logs if all are duplicates', async () => {
    const logs = [
      createMockLog({ timestamp: 1699000000 }),
      createMockLog({ timestamp: 1699000100 }),
      createMockLog({ timestamp: 1699000200 })
    ];

    // Store first time
    await storeLogs(logs, 'TEST-DEVICE-001');

    // Try to store same logs again
    const result = await storeLogs(logs, 'TEST-DEVICE-001');

    expect(result.success).toBe(0);
    expect(result.skipped).toBe(3);
    expect(result.total).toBe(3);

    const allLogs = await getAllLogs();
    expect(allLogs).toHaveLength(3);  // Still only original 3
  });

  it('should handle empty logs array', async () => {
    const result = await storeLogs([], 'TEST-DEVICE-001');

    expect(result.success).toBe(0);
    expect(result.skipped).toBe(0);
    expect(result.total).toBe(0);
  });

  it('should NOT skip logs with 2 second timestamp difference', async () => {
    const log1 = createMockLog({
      timestamp: 1699000000,
      temperature: 23.5
    });

    const log2 = createMockLog({
      timestamp: 1699000002,
      temperature: 23.5
    });

    await storeLogs([log1], 'TEST-DEVICE-001');
    const result = await storeLogs([log2], 'TEST-DEVICE-001');

    expect(result.success).toBe(1);
    expect(result.skipped).toBe(0);

    const allLogs = await getAllLogs();
    expect(allLogs).toHaveLength(2);
  });
});

describe('Storage - Device Metadata', () => {
  it('should return null for non-existent device metadata', async () => {
    const metadata = await getDeviceMetadata('NONEXISTENT-SERIAL');
    expect(metadata).toBeNull();
  });

  it('should set and get device metadata', async () => {
    await setDeviceMetadata('TEST-SERIAL-001', {
      name: 'Kitchen Sensor',
      tags: ['kitchen', 'indoor']
    });

    const metadata = await getDeviceMetadata('TEST-SERIAL-001');

    expect(metadata).toBeDefined();
    expect(metadata.serial).toBe('TEST-SERIAL-001');
    expect(metadata.name).toBe('Kitchen Sensor');
    expect(metadata.tags).toEqual(['kitchen', 'indoor']);
    expect(metadata.updatedAt).toBeTypeOf('number');
  });

  it('should update existing device metadata', async () => {
    await setDeviceMetadata('TEST-SERIAL-002', {
      name: 'Old Name',
      tags: ['old']
    });

    await setDeviceMetadata('TEST-SERIAL-002', {
      name: 'New Name',
      tags: ['new', 'updated']
    });

    const metadata = await getDeviceMetadata('TEST-SERIAL-002');

    expect(metadata.name).toBe('New Name');
    expect(metadata.tags).toEqual(['new', 'updated']);
  });

  it('should preserve model when only name/tags are updated', async () => {
    // Simulate connection handler persisting model
    await setDeviceMetadata('TEST-SERIAL-MERGE', {
      name: '', tags: [], model: 'OAQ-1-2', deviceType: 2, firmware: '1.0'
    });

    // Simulate edit modal saving only name/tags
    await setDeviceMetadata('TEST-SERIAL-MERGE', { name: 'Kitchen', tags: ['indoor'] });

    const metadata = await getDeviceMetadata('TEST-SERIAL-MERGE');
    expect(metadata.name).toBe('Kitchen');
    expect(metadata.tags).toEqual(['indoor']);
    expect(metadata.model).toBe('OAQ-1-2');
    expect(metadata.deviceType).toBe(2);
    expect(metadata.firmware).toBe('1.0');
  });

  it('should handle empty name and tags', async () => {
    await setDeviceMetadata('TEST-SERIAL-003', {
      name: '',
      tags: []
    });

    const metadata = await getDeviceMetadata('TEST-SERIAL-003');

    expect(metadata.name).toBe('');
    expect(metadata.tags).toEqual([]);
  });

  it('should get all device metadata', async () => {
    await setDeviceMetadata('DEVICE-A', { name: 'Device A', tags: ['a'] });
    await setDeviceMetadata('DEVICE-B', { name: 'Device B', tags: ['b'] });
    await setDeviceMetadata('DEVICE-C', { name: 'Device C', tags: ['c'] });

    const allMetadata = await getAllDeviceMetadata();

    expect(allMetadata.length).toBeGreaterThanOrEqual(3);

    const deviceA = allMetadata.find(m => m.serial === 'DEVICE-A');
    expect(deviceA).toBeDefined();
    expect(deviceA.name).toBe('Device A');
  });

  it('should store metadata with updatedAt timestamp', async () => {
    const beforeTime = Math.floor(Date.now() / 1000) - 1;

    await setDeviceMetadata('TEST-SERIAL-004', {
      name: 'Test Device',
      tags: []
    });

    const afterTime = Math.floor(Date.now() / 1000) + 1;

    const metadata = await getDeviceMetadata('TEST-SERIAL-004');

    expect(metadata.updatedAt).toBeGreaterThanOrEqual(beforeTime);
    expect(metadata.updatedAt).toBeLessThanOrEqual(afterTime);
  });

  it('should handle null/undefined values gracefully', async () => {
    await setDeviceMetadata('TEST-SERIAL-005', {
      name: null,
      tags: undefined
    });

    const metadata = await getDeviceMetadata('TEST-SERIAL-005');

    expect(metadata.name).toBe('');
    expect(metadata.tags).toEqual([]);
  });

  it('should delete device metadata', async () => {
    await setDeviceMetadata('DELETE-TEST', { name: 'To Delete', tags: [] });

    // Verify it exists
    const before = await getDeviceMetadata('DELETE-TEST');
    expect(before).toBeDefined();
    expect(before.name).toBe('To Delete');

    // Delete it
    await deleteDeviceMetadata('DELETE-TEST');

    // Verify it's gone
    const after = await getDeviceMetadata('DELETE-TEST');
    expect(after).toBeNull();
  });

  it('should not error when deleting non-existent metadata', async () => {
    // Should resolve without error
    await deleteDeviceMetadata('NONEXISTENT-SERIAL');
    const result = await getDeviceMetadata('NONEXISTENT-SERIAL');
    expect(result).toBeNull();
  });
});

describe('Storage - clearDeviceLogs isolation', () => {
  beforeEach(async () => {
    await clearAllLogs();
  });

  it('should only remove logs for the target device', async () => {
    // Store logs for two devices
    await storeLogs([
      createMockLog({ timestamp: 1000 }),
      createMockLog({ timestamp: 2000 }),
    ], 'DEVICE-A');

    await storeLogs([
      createMockLog({ timestamp: 3000 }),
      createMockLog({ timestamp: 4000 }),
      createMockLog({ timestamp: 5000 }),
    ], 'DEVICE-B');

    // Clear only DEVICE-A
    const deletedCount = await clearDeviceLogs('DEVICE-A');
    expect(deletedCount).toBe(2);

    // DEVICE-A logs are gone
    const aLogs = await getLogsByDevice('DEVICE-A');
    expect(aLogs).toHaveLength(0);

    // DEVICE-B logs are untouched
    const bLogs = await getLogsByDevice('DEVICE-B');
    expect(bLogs).toHaveLength(3);

    // Total count is only DEVICE-B's logs
    const total = await getLogCount();
    expect(total).toBe(3);
  });
});

describe('getDeviceDisplayName', () => {
  it('should prefer user-set name', () => {
    expect(getDeviceDisplayName({ name: 'Kitchen' }, 'SN-001', 'OAQ-1')).toBe('Kitchen');
  });

  it('should fall back to liveModel + serial', () => {
    expect(getDeviceDisplayName({}, 'SN-001', 'OAQ-1')).toBe('OAQ-1 (SN-001)');
  });

  it('should fall back to metadata.model + serial', () => {
    expect(getDeviceDisplayName({ model: 'OAQ-2' }, 'SN-001')).toBe('OAQ-2 (SN-001)');
  });

  it('should prefer liveModel over metadata.model', () => {
    expect(getDeviceDisplayName({ model: 'OAQ-2' }, 'SN-001', 'OAQ-3')).toBe('OAQ-3 (SN-001)');
  });

  it('should fall back to serial only', () => {
    expect(getDeviceDisplayName(null, 'SN-001')).toBe('SN-001');
  });
});
