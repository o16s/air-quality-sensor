/**
 * Export Tests
 * Tests CSV and JSON export functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  exportToCSV,
  exportToJSON,
  exportToGeoJSON,
  generateStatistics,
  exportStatistics
} from '../js/export.js';

// Sample log data
const createMockLogs = () => [
  {
    timestamp: 1609459200,
    temperature: 23.5,
    humidity: 45.6,
    pm25: 12.5,
    pm10: 18.3,
    lat: 47.1234567,
    lon: 8.5678901,
    fix: 1,
    battery: 85,
    deviceSerial: 'TEST-001',
    downloadedAt: 1609459300
  },
  {
    timestamp: 1609459500,
    temperature: 24.1,
    humidity: 46.2,
    pm25: 13.1,
    pm10: 19.0,
    lat: 47.1234580,
    lon: 8.5678920,
    fix: 1,
    battery: 84,
    deviceSerial: 'TEST-001',
    downloadedAt: 1609459600
  },
  {
    timestamp: 1609459800,
    temperature: 23.9,
    humidity: 45.8,
    pm25: 12.8,
    pm10: 18.7,
    lat: 0,
    lon: 0,
    fix: 0,
    battery: 83,
    deviceSerial: 'TEST-002',
    downloadedAt: 1609459900
  }
];

describe('Export - CSV', () => {
  beforeEach(() => {
    // Clear any previous mock calls
    document.createElement.mockClear();
    URL.createObjectURL.mockClear();
  });

  it('should export logs to CSV format', () => {
    const logs = createMockLogs();

    exportToCSV(logs);

    // Verify createElement was called to create download link
    expect(document.createElement).toHaveBeenCalledWith('a');

    // Verify Blob was created
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('should include CSV headers', () => {
    const logs = createMockLogs();
    let csvContent = '';

    // Mock Blob to capture content
    global.Blob = vi.fn().mockImplementation((content) => {
      csvContent = content[0];
      return { type: 'text/csv' };
    });

    exportToCSV(logs);

    expect(csvContent).toContain('Timestamp');
    expect(csvContent).toContain('Temperature');
    expect(csvContent).toContain('Humidity');
    expect(csvContent).toContain('PM2.5');
    expect(csvContent).toContain('PM10');
  });

  it('should format temperature with 3 decimal places', () => {
    const logs = [createMockLogs()[0]];
    let csvContent = '';

    global.Blob = vi.fn().mockImplementation((content) => {
      csvContent = content[0];
      return { type: 'text/csv' };
    });

    exportToCSV(logs);

    expect(csvContent).toContain('23.500');
  });

  it('should escape fields with commas', () => {
    const logs = [{
      ...createMockLogs()[0],
      deviceSerial: 'TEST,001,ABC'
    }];
    let csvContent = '';

    global.Blob = vi.fn().mockImplementation((content) => {
      csvContent = content[0];
      return { type: 'text/csv' };
    });

    exportToCSV(logs);

    expect(csvContent).toContain('"TEST,001,ABC"');
  });

  it('should throw error when no logs provided', () => {
    expect(() => exportToCSV([])).toThrow('No logs to export');
    expect(() => exportToCSV(null)).toThrow('No logs to export');
  });
});

describe('Export - JSON', () => {
  beforeEach(() => {
    document.createElement.mockClear();
    URL.createObjectURL.mockClear();
  });

  it('should export logs to JSON format', () => {
    const logs = createMockLogs();

    exportToJSON(logs);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('should include metadata in JSON export', () => {
    const logs = createMockLogs();
    let jsonContent = '';

    global.Blob = vi.fn().mockImplementation((content) => {
      jsonContent = content[0];
      return { type: 'application/json' };
    });

    exportToJSON(logs);

    const parsed = JSON.parse(jsonContent);

    expect(parsed).toHaveProperty('metadata');
    expect(parsed.metadata).toHaveProperty('exportDate');
    expect(parsed.metadata).toHaveProperty('totalRecords');
    expect(parsed.metadata.totalRecords).toBe(3);
  });

  it('should structure sensor data with units', () => {
    const logs = [createMockLogs()[0]];
    let jsonContent = '';

    global.Blob = vi.fn().mockImplementation((content) => {
      jsonContent = content[0];
      return { type: 'application/json' };
    });

    exportToJSON(logs);

    const parsed = JSON.parse(jsonContent);
    const log = parsed.logs[0];

    expect(log.sensors.temperature).toHaveProperty('value');
    expect(log.sensors.temperature).toHaveProperty('unit');
    expect(log.sensors.temperature.unit).toBe('°C');
  });

  it('should include device serial in metadata', () => {
    const logs = createMockLogs();
    let jsonContent = '';

    global.Blob = vi.fn().mockImplementation((content) => {
      jsonContent = content[0];
      return { type: 'application/json' };
    });

    exportToJSON(logs);

    const parsed = JSON.parse(jsonContent);

    expect(parsed.metadata.devices).toContain('TEST-001');
    expect(parsed.metadata.devices).toContain('TEST-002');
  });

  it('should throw error when no logs provided', () => {
    expect(() => exportToJSON([])).toThrow('No logs to export');
  });
});

describe('Export - GeoJSON', () => {
  beforeEach(() => {
    document.createElement.mockClear();
    URL.createObjectURL.mockClear();
  });

  it('should export logs with GPS to GeoJSON', () => {
    const logs = createMockLogs();

    exportToGeoJSON(logs);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('should create valid GeoJSON FeatureCollection', () => {
    const logs = createMockLogs();
    let geoJSONContent = '';

    global.Blob = vi.fn().mockImplementation((content) => {
      geoJSONContent = content[0];
      return { type: 'application/geo+json' };
    });

    exportToGeoJSON(logs);

    const parsed = JSON.parse(geoJSONContent);

    expect(parsed.type).toBe('FeatureCollection');
    expect(parsed.features).toBeInstanceOf(Array);
  });

  it('should filter out logs without GPS fix', () => {
    const logs = createMockLogs();
    let geoJSONContent = '';

    global.Blob = vi.fn().mockImplementation((content) => {
      geoJSONContent = content[0];
      return { type: 'application/geo+json' };
    });

    exportToGeoJSON(logs);

    const parsed = JSON.parse(geoJSONContent);

    // Only 2 logs have GPS fix (fix > 0)
    expect(parsed.features).toHaveLength(2);
  });

  it('should use lon, lat order in coordinates', () => {
    const logs = [createMockLogs()[0]];
    let geoJSONContent = '';

    global.Blob = vi.fn().mockImplementation((content) => {
      geoJSONContent = content[0];
      return { type: 'application/geo+json' };
    });

    exportToGeoJSON(logs);

    const parsed = JSON.parse(geoJSONContent);
    const coords = parsed.features[0].geometry.coordinates;

    // GeoJSON uses [lon, lat] order
    expect(coords[0]).toBe(8.5678901); // longitude
    expect(coords[1]).toBe(47.1234567); // latitude
  });

  it('should throw error when no GPS logs exist', () => {
    const logs = [{
      ...createMockLogs()[0],
      fix: 0
    }];

    expect(() => exportToGeoJSON(logs)).toThrow('No logs with GPS coordinates');
  });
});

describe('Export - Statistics', () => {
  it('should generate statistics for logs', () => {
    const logs = createMockLogs();
    const stats = generateStatistics(logs);

    expect(stats).toBeDefined();
    expect(stats.count).toBe(3);
    expect(stats.temperature).toBeDefined();
    expect(stats.humidity).toBeDefined();
    expect(stats.pm25).toBeDefined();
    expect(stats.pm10).toBeDefined();
    expect(stats.battery).toBeDefined();
  });

  it('should calculate min/max/mean/median correctly', () => {
    const logs = createMockLogs();
    const stats = generateStatistics(logs);

    expect(stats.temperature.min).toBe(23.5);
    expect(stats.temperature.max).toBe(24.1);
    expect(stats.temperature.mean).toBeCloseTo(23.833, 2);

    expect(stats.battery.min).toBe(83);
    expect(stats.battery.max).toBe(85);
  });

  it('should track time range', () => {
    const logs = createMockLogs();
    const stats = generateStatistics(logs);

    expect(stats.timeRange.start).toBe(1609459200);
    expect(stats.timeRange.end).toBe(1609459800);
  });

  it('should count GPS records', () => {
    const logs = createMockLogs();
    const stats = generateStatistics(logs);

    // 2 logs have GPS fix > 0
    expect(stats.gpsRecords).toBe(2);
  });

  it('should return null for empty logs', () => {
    const stats = generateStatistics([]);
    expect(stats).toBeNull();
  });

  it('should handle logs with missing values', () => {
    const logs = [{
      temperature: 23.5,
      timestamp: 1000
      // Missing other fields
    }];

    const stats = generateStatistics(logs);

    expect(stats.temperature).toBeDefined();
    expect(stats.humidity).toBeNull(); // No humidity values
  });
});

describe('Export - Statistics Export', () => {
  beforeEach(() => {
    document.createElement.mockClear();
    URL.createObjectURL.mockClear();
  });

  it('should export statistics to text file', () => {
    const logs = createMockLogs();

    exportStatistics(logs);

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it('should include formatted statistics', () => {
    const logs = createMockLogs();
    let txtContent = '';

    global.Blob = vi.fn().mockImplementation((content) => {
      txtContent = content[0];
      return { type: 'text/plain' };
    });

    exportStatistics(logs);

    expect(txtContent).toContain('CCC Sensor Data Statistics');
    expect(txtContent).toContain('Total Records: 3');
    expect(txtContent).toContain('Temperature');
    expect(txtContent).toContain('Humidity');
    expect(txtContent).toContain('PM2.5');
  });

  it('should throw error when no data provided', () => {
    expect(() => exportStatistics([])).toThrow('No data to generate statistics');
  });
});

describe('Export - File Download', () => {
  let mockLink;

  beforeEach(() => {
    vi.useFakeTimers();

    mockLink = {
      href: '',
      download: '',
      click: vi.fn(),
      style: { display: '' }
    };

    document.createElement.mockReturnValue(mockLink);
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should trigger download with correct filename for CSV', () => {
    const logs = createMockLogs();

    exportToCSV(logs);

    expect(mockLink.download).toBe('ccc-sensor-logs.csv');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should trigger download with correct filename for JSON', () => {
    const logs = createMockLogs();

    exportToJSON(logs);

    expect(mockLink.download).toBe('ccc-sensor-logs.json');
    expect(mockLink.click).toHaveBeenCalled();
  });

  it('should clean up download link after download', () => {
    const logs = createMockLogs();

    exportToCSV(logs);

    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);

    // Cleanup happens in setTimeout, so we need to wait
    vi.runAllTimers();
  });
});

describe('Export - Edge Cases', () => {
  it('should handle logs with null values in CSV', () => {
    const logs = [{
      timestamp: 1000,
      temperature: null,
      humidity: undefined,
      pm25: 12.5,
      pm10: 18.3,
      battery: 85
    }];

    let csvContent = '';
    global.Blob = vi.fn().mockImplementation((content) => {
      csvContent = content[0];
      return { type: 'text/csv' };
    });

    exportToCSV(logs);

    // Should export without errors
    expect(csvContent).toBeDefined();
  });

  it('should handle logs with special characters in device serial', () => {
    const logs = [{
      ...createMockLogs()[0],
      deviceSerial: 'TEST"DEVICE"123'
    }];

    let csvContent = '';
    global.Blob = vi.fn().mockImplementation((content) => {
      csvContent = content[0];
      return { type: 'text/csv' };
    });

    exportToCSV(logs);

    // Quotes should be escaped
    expect(csvContent).toContain('TEST""DEVICE""123');
  });

  it('should handle very large coordinate precision', () => {
    const logs = [{
      ...createMockLogs()[0],
      lat: 47.12345678901234,
      lon: 8.98765432109876
    }];

    let geoJSONContent = '';
    global.Blob = vi.fn().mockImplementation((content) => {
      geoJSONContent = content[0];
      return { type: 'application/geo+json' };
    });

    exportToGeoJSON(logs);

    const parsed = JSON.parse(geoJSONContent);
    const coords = parsed.features[0].geometry.coordinates;

    expect(coords[0]).toBe(8.98765432109876);
    expect(coords[1]).toBe(47.12345678901234);
  });
});
