/**
 * Centralized Constants
 * All magic numbers and configuration values in one place
 */

// USB Device Configuration
export const USB = {
    VENDOR_ID: 0x0483,              // STMicroelectronics
    PRODUCT_ID: 0x5740,             // CDC Virtual COM Port
    VENDOR_CODE: 0x22,              // WebUSB vendor request code
    INTERFACE_NUMBER: 0             // CDC interface number
};

// WebUSB Command Codes
export const COMMANDS = {
    GET_STATUS: 0x00,       // Get current sensor readings
    GET_LOG_COUNT: 0x01,    // Get number of log records
    READ_LOG: 0x02,         // Read log record by index
    ERASE_LOGS: 0x03,       // Erase all logs (requires wValue=0xDEAD)
    GET_VERSION: 0x04       // Get firmware version string
};

// Buffer Sizes (in bytes)
export const BUFFER_SIZES = {
    STATUS: 16,             // Device status response
    LOG_COUNT: 2,           // Log count response
    LOG_RECORD: 22,         // Single log record
    VERSION: 32             // Firmware version string
};

// Status Buffer Layout (16 bytes)
export const STATUS_LAYOUT = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 1000 },     // °C × 1000
    HUMIDITY: { offset: 2, type: 'Uint16', scale: 1000 },       // % × 1000
    PM25: { offset: 4, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    PM10: { offset: 6, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    BATTERY: { offset: 8, type: 'Uint8', scale: 1 },            // 0-100%
    CHARGING: { offset: 9, type: 'Uint8', scale: 1 },           // 0 or 1
    GPS_FIX: { offset: 10, type: 'Uint8', scale: 1 },           // 0-2
    RESERVED: { offset: 11, type: 'Uint8', scale: 1 },          // Reserved
    TIMESTAMP: { offset: 12, type: 'Uint32', scale: 1 }         // Seconds
};

// Log Record Buffer Layout (22 bytes)
export const LOG_LAYOUT = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 1000 },     // °C × 1000
    HUMIDITY: { offset: 2, type: 'Uint16', scale: 1000 },       // % × 1000
    PM25: { offset: 4, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    PM10: { offset: 6, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    LATITUDE: { offset: 8, type: 'Int32', scale: 1e7 },         // degrees × 10⁷
    LONGITUDE: { offset: 12, type: 'Int32', scale: 1e7 },       // degrees × 10⁷
    GPS_FIX: { offset: 16, type: 'Uint8', scale: 1 },           // 0-2
    BATTERY: { offset: 17, type: 'Uint8', scale: 1 },           // 0-100%
    TIMESTAMP: { offset: 18, type: 'Uint32', scale: 1 }         // Unix epoch
};

// Mock Data Values (for testing without hardware)
export const MOCK_DATA = {
    // Status mock values
    TEMPERATURE_C: 23.5,
    HUMIDITY_PERCENT: 45.6,
    PM25_UG_M3: 12.5,
    PM10_UG_M3: 18.3,
    BATTERY_PERCENT: 85,
    IS_CHARGING: true,
    GPS_FIX_QUALITY: 1,         // 1 = GPS fix

    // Log mock value ranges
    TEMP_MIN_C: 20.0,
    TEMP_MAX_C: 28.0,
    HUMIDITY_MIN_PERCENT: 30.0,
    HUMIDITY_MAX_PERCENT: 70.0,
    PM25_MIN_UG_M3: 5.0,
    PM25_MAX_UG_M3: 20.0,
    PM10_MIN_UG_M3: 10.0,
    PM10_MAX_UG_M3: 30.0,
    BATTERY_MIN_PERCENT: 60,
    BATTERY_MAX_PERCENT: 100,

    // GPS mock coordinates (Zurich, Switzerland area)
    GPS_LAT: 47.1234567,
    GPS_LON: 8.5678901,

    // Timing
    LOG_INTERVAL_SECONDS: 300,  // 5 minutes between logs
    LOG_COUNT: 50               // Number of mock logs to generate
};

// Async Operation Delays (milliseconds)
export const DELAYS = {
    STATUS_READ: 100,           // Mock delay for status read
    LOG_COUNT_READ: 50,         // Mock delay for log count
    LOG_RECORD_READ: 10,        // Mock delay for single log read
    AUTO_REFRESH_INTERVAL: 10000 // UI auto-refresh interval
};

// GPS Fix Quality Labels
export const GPS_FIX = {
    NO_FIX: 0,
    GPS: 1,
    DGPS: 2
};

// GPS Fix Quality to String
export const GPS_FIX_LABELS = {
    [GPS_FIX.NO_FIX]: 'No Fix',
    [GPS_FIX.GPS]: 'GPS',
    [GPS_FIX.DGPS]: 'DGPS'
};

// IndexedDB Configuration
export const DB = {
    NAME: 'octanis-sensor-logs',
    VERSION: 1,
    STORE_NAME: 'logs',
    INDEXES: {
        TIMESTAMP: 'timestamp',
        DEVICE_SERIAL: 'deviceSerial',
        DEVICE_TIMESTAMP: 'deviceTimestamp'
    }
};

// Export Filenames
export const EXPORT_FILENAMES = {
    CSV: 'octanis-sensor-logs.csv',
    JSON: 'octanis-sensor-logs.json',
    GEOJSON: 'octanis-sensor-logs.geojson',
    STATISTICS: 'octanis-sensor-statistics.txt'
};

// MIME Types
export const MIME_TYPES = {
    CSV: 'text/csv',
    JSON: 'application/json',
    GEOJSON: 'application/geo+json',
    TEXT: 'text/plain'
};

// Air Quality Index (AQI) Thresholds for PM2.5 (μg/m³)
export const AQI_THRESHOLDS = {
    GOOD: 12.0,
    MODERATE: 35.4,
    UNHEALTHY_SENSITIVE: 55.4,
    UNHEALTHY: 150.4,
    VERY_UNHEALTHY: 250.4
};

// Error Messages
export const ERRORS = {
    DEVICE_NOT_CONNECTED: 'Device not connected',
    WEBUSB_NOT_SUPPORTED: 'WebUSB is not supported in this browser',
    NO_DEVICE_SELECTED: 'No device selected',
    DEVICE_DISCONNECTED: 'Device disconnected during initialization',
    HTTPS_REQUIRED: 'WebUSB requires HTTPS. Please use localhost or a secure origin.',
    DEVICE_BUSY: 'Device is busy or already in use by another application',
    NO_LOGS_TO_EXPORT: 'No logs to export',
    NO_GPS_LOGS: 'No logs with GPS coordinates',
    NO_DATA_FOR_STATS: 'No data to generate statistics',
    CONTROL_TRANSFER_FAILED: 'Control transfer failed'
};
