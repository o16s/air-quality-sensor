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
// Updated Nov 4, 2025 - Breaking changes: command codes reorganized
// Updated Nov 6, 2025 - Added ACQUIRE command
// Updated Nov 6, 2025 - Added GET_LOG_TYPE command
export const COMMANDS = {
    GET_STATUS: 0x00,       // Get current sensor readings
    GET_LOG_COUNT: 0x01,    // Get number of log records
    GET_URL: 0x02,          // Get WebUSB landing page URL descriptor
    READ_LOG: 0x03,         // Read log record by index (was 0x02)
    ERASE_LOGS: 0x04,       // Erase all logs (requires wValue=0xDEAD) (was 0x03)
    GET_VERSION: 0x05,      // Get firmware version string (was 0x04)
    GET_TEST_RESULTS: 0x06, // Get Unity test framework results
    GET_PRINT_BUFFER: 0x07, // Get debug print buffer
    SET_TIME: 0x08,         // Set device RTC (Host-to-Device OUT transfer)
    ACQUIRE: 0x09,          // Trigger immediate sensor measurement (Host-to-Device OUT)
    GET_LOG_TYPE: 0x0A      // Get log format type (0=GPS, 1=TSL2591)
};

// Log Format Types
export const LOG_TYPE = {
    GPS: 0,         // GPS format: lat/lon/fix
    TSL2591: 1      // TSL2591 light sensor format: lux/ch0/ch1
};

// Device Capacity
export const DEVICE_CAPACITY = {
    MAX_LOG_CAPACITY: 2048,         // Maximum number of log records device can store
    ERASE_MAGIC_VALUE: 0xDEAD,      // Safety value required for ERASE_LOGS command
    MEASUREMENT_INTERVAL: 85        // Seconds between log records (85s = ~1.4 minutes)
};

// Buffer Sizes (in bytes)
// Updated Nov 4, 2025 - LOG_RECORD increased from 22 to 24 bytes (includes padding)
// Updated Nov 6, 2025 - STATUS increased from 16 to 20 bytes (added MEASURED_AT field)
// Updated Nov 6, 2025 - Added LOG_TYPE response size
export const BUFFER_SIZES = {
    STATUS: 24,             // Device status response (24 bytes for both GPS and TSL)
    LOG_COUNT: 2,           // Log count response
    LOG_TYPE_RESPONSE: 1,   // Log type response (0=GPS, 1=TSL2591)
    URL: 64,                // WebUSB URL descriptor (variable, max 64)
    LOG_RECORD: 24,         // Single log record (includes 2-byte padding)
    VERSION: 32,            // Firmware version string
    TEST_RESULTS: 64,       // Unity test framework results
    PRINT_BUFFER: 64        // Debug print buffer
};

// Battery Encoding Constants (Nov 7, 2025)
export const BATTERY_ENCODING = {
    VOLTAGE_MIN_MV: 3000,      // Minimum voltage (3.0V)
    VOLTAGE_MAX_MV: 5540,      // Maximum voltage (5.54V)
    VOLTAGE_STEP_MV: 20,       // Voltage precision (20mV steps)
    CHARGING_BIT: 7,           // Bit position for charging flag
    VOLTAGE_MASK: 0x7F,        // Mask for voltage bits (bits 6-0)
    CHARGING_MASK: 0x80        // Mask for charging bit (bit 7)
};

// Status Buffer Layout - GPS Format (24 bytes)
// Updated Nov 4, 2025 - Humidity changed from milli-percent (÷1000) to centi-percent (÷100)
// Updated Nov 6, 2025 - Added MEASURED_AT field, TIMESTAMP renamed to CURRENT_TIME, expanded to 24 bytes
// Updated Nov 7, 2025 - Battery changed to packed voltage+charging (bit7:charging, bits6-0:voltage)
export const STATUS_LAYOUT = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 1000 },     // °C × 1000
    HUMIDITY: { offset: 2, type: 'Uint16', scale: 100 },        // % × 100 (centi-percent)
    PM25: { offset: 4, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    PM10: { offset: 6, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    BATTERY: { offset: 8, type: 'Uint8', scale: 1 },            // [bit7:charging][bits6-0:voltage]
    RESERVED1: { offset: 9, type: 'Uint8', scale: 1 },          // Reserved
    GPS_FIX: { offset: 10, type: 'Uint8', scale: 1 },           // 0-2
    DEVICE_FLAGS: { offset: 11, type: 'Uint8', scale: 1 },      // Bit 0: GPS enabled
    RESERVED2: { offset: 12, type: 'Uint32', scale: 1 },        // Reserved (4 bytes)
    CURRENT_TIME: { offset: 16, type: 'Uint32', scale: 1 },     // Current device time (GPS/RTC/Uptime)
    MEASURED_AT: { offset: 20, type: 'Uint32', scale: 1 }       // When sensor data was captured
};

// Status Buffer Layout - TSL2591 Format (24 bytes)
// Added Nov 6, 2025 - For TSL2591 light sensor builds
// Updated Nov 7, 2025 - Battery changed to packed voltage+charging (bit7:charging, bits6-0:voltage)
export const STATUS_LAYOUT_TSL = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 1000 },     // °C × 1000
    HUMIDITY: { offset: 2, type: 'Uint16', scale: 100 },        // % × 100 (centi-percent)
    PM25: { offset: 4, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    PM10: { offset: 6, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    BATTERY: { offset: 8, type: 'Uint8', scale: 1 },            // [bit7:charging][bits6-0:voltage]
    RESERVED1: { offset: 9, type: 'Uint8', scale: 1 },          // Reserved
    LUX: { offset: 10, type: 'Float32', scale: 1 },             // lux as float32 (NO SCALING!)
    RESERVED2: { offset: 14, type: 'Uint16', scale: 1 },        // Reserved (2 bytes)
    CURRENT_TIME: { offset: 16, type: 'Uint32', scale: 1 },     // Current device time (GPS/RTC/Uptime)
    MEASURED_AT: { offset: 20, type: 'Uint32', scale: 1 }       // When sensor data was captured
};

// Log Record Buffer Layout - GPS Format (24 bytes)
// Updated Nov 4, 2025 - Added 2-byte padding, timestamp moved to offset 20
// Updated Nov 7, 2025 - Battery changed to packed voltage+charging (bit7:charging, bits6-0:voltage)
export const LOG_LAYOUT = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 1000 },     // °C × 1000
    HUMIDITY: { offset: 2, type: 'Uint16', scale: 100 },        // % × 100 (centi-percent)
    PM25: { offset: 4, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    PM10: { offset: 6, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    LATITUDE: { offset: 8, type: 'Int32', scale: 1e7 },         // degrees × 10⁷
    LONGITUDE: { offset: 12, type: 'Int32', scale: 1e7 },       // degrees × 10⁷
    GPS_FIX: { offset: 16, type: 'Uint8', scale: 1 },           // 0-2
    BATTERY: { offset: 17, type: 'Uint8', scale: 1 },           // [bit7:charging][bits6-0:voltage]
    PADDING: { offset: 18, type: 'Uint16', scale: 1 },          // Compiler alignment padding
    TIMESTAMP: { offset: 20, type: 'Uint32', scale: 1 }         // Unix epoch
};

// Log Record Buffer Layout - TSL2591 Light Sensor Format (24 bytes)
// Added Nov 6, 2025 - Alternative format for light sensor builds
// Updated Nov 7, 2025 - Battery changed to packed voltage+charging (bit7:charging, bits6-0:voltage)
export const LOG_LAYOUT_TSL = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 1000 },     // °C × 1000
    HUMIDITY: { offset: 2, type: 'Uint16', scale: 100 },        // % × 100 (centi-percent)
    PM25: { offset: 4, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    PM10: { offset: 6, type: 'Uint16', scale: 10 },             // μg/m³ × 10
    TSL_CH0: { offset: 8, type: 'Uint16', scale: 1 },           // Full spectrum raw count (0-65535)
    TSL_CH1: { offset: 10, type: 'Uint16', scale: 1 },          // IR spectrum raw count (0-65535)
    LUX: { offset: 12, type: 'Uint16', scale: 10 },             // lux × 10 (deci-lux)
    OVERFLOW: { offset: 14, type: 'Uint8', scale: 1 },          // 0=valid, 1=saturated
    BATTERY: { offset: 15, type: 'Uint8', scale: 1 },           // [bit7:charging][bits6-0:voltage]
    RESERVED1: { offset: 16, type: 'Uint16', scale: 1 },        // Reserved for future use
    RESERVED2: { offset: 18, type: 'Uint16', scale: 1 },        // Reserved for future use
    TIMESTAMP: { offset: 20, type: 'Uint32', scale: 1 }         // Unix epoch
};

// Mock Data Values (for testing without hardware)
export const MOCK_DATA = {
    // Status mock values
    TEMPERATURE_C: 23.5,
    HUMIDITY_PERCENT: 45.6,
    PM25_UG_M3: 12.5,
    PM10_UG_M3: 18.3,
    BATTERY_VOLTAGE_MV: 4100,   // 4.1V (typical LiPo full charge)
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
    BATTERY_MIN_MV: 3300,       // Minimum battery voltage (3.3V - LiPo cutoff = 0%)
    BATTERY_MAX_MV: 4150,       // Maximum battery voltage (4.15V - LiPo full = 100%, matches firmware)


    // GPS mock coordinates (Zurich, Switzerland area)
    GPS_LAT: 47.1234567,
    GPS_LON: 8.5678901,

    // TSL2591 light sensor mock values (added Nov 6, 2025)
    TSL_LUX: 123.4,             // Mock lux value
    TSL_CH0: 12345,             // Mock full spectrum raw count
    TSL_CH1: 6789,              // Mock IR spectrum raw count
    TSL_OVERFLOW: 0,            // 0 = valid reading
    TSL_LUX_MIN: 0.1,           // Minimum lux (dark)
    TSL_LUX_MAX: 800.0,         // Maximum lux (bright indoor/outdoor)
    TSL_CH0_MIN: 100,           // Minimum CH0 raw count
    TSL_CH0_MAX: 50000,         // Maximum CH0 raw count (below saturation)
    TSL_CH1_MIN: 50,            // Minimum CH1 raw count
    TSL_CH1_MAX: 30000,         // Maximum CH1 raw count (below saturation)

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

// Time Sync Configuration
export const TIME_SYNC = {
    DRIFT_THRESHOLD_SECONDS: 5  // Threshold for displaying "Synced" status
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

// CSV Column Headers (Added Nov 6, 2025)
export const CSV_HEADERS = {
    GPS: 'Timestamp,Temperature_C,Humidity_Pct,PM25_ugm3,PM10_ugm3,Latitude,Longitude,GPS_Fix,Battery_Pct',
    TSL: 'Timestamp,Temperature_C,Humidity_Pct,PM25_ugm3,PM10_ugm3,Lux,TSL_CH0,TSL_CH1,Overflow,Battery_Pct'
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

// Sparkline Threshold Definitions
// Based on WHO/EPA air quality standards and comfort guidelines
export const SPARKLINE_THRESHOLDS = {
    pm25: {
        range: { min: 0, max: 55 },  // μg/m³ (top range at unhealthy threshold)
        thresholds: [
            { label: '12', value: 12, color: '#10b981', name: 'Good/Moderate' },      // green (WHO/EPA)
            { label: '35', value: 35, color: '#f59e0b', name: 'Moderate/Unhealthy' }, // yellow
            { label: '55', value: 55, color: '#ef4444', name: 'Unhealthy' }           // red
        ]
    },
    pm10: {
        range: { min: 0, max: 250 },  // μg/m³
        thresholds: [
            { label: '50', value: 50, color: '#10b981', name: 'Good/Moderate' },
            { label: '150', value: 150, color: '#f59e0b', name: 'Moderate/Unhealthy' },
            { label: '250', value: 250, color: '#ef4444', name: 'Unhealthy' }
        ]
    },
    temperature: {
        range: { min: 16, max: 27 },  // 16°C (too cold) to 27°C (too hot for indoor work)
        thresholds: [
            { label: '16', value: 16, color: '#3b82f6', name: 'Too cold for office' },     // blue
            { label: '18', value: 18, color: '#10b981', name: 'Cool comfort boundary' },   // green
            { label: '24', value: 24, color: '#f59e0b', name: 'Warm comfort boundary' },   // orange
            { label: '27', value: 27, color: '#ef4444', name: 'Too hot for indoor work' }  // red
        ]
    },
    humidity: {
        range: { min: 0, max: 60 },  // % (max at mold risk threshold)
        thresholds: [
            { label: '30', value: 30, color: '#3b82f6', name: 'Dry threshold' },      // blue
            { label: '60', value: 60, color: '#f59e0b', name: 'Mold risk' }           // amber
        ]
    },
    lux: {
        range: { min: 0, max: 2000 },  // lux (indoor focus)
        thresholds: [
            { label: '100', value: 100, color: '#6b7280', name: 'Dim' },               // gray
            { label: '500', value: 500, color: '#3b82f6', name: 'Bright indoor' },     // blue
            { label: '1000', value: 1000, color: '#f59e0b', name: 'Very bright' }      // yellow
        ]
    }
};
