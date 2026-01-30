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
    GET_LOG_TYPE: 0x0A,     // Get log format type (0=GPS, 1=TSL2591)
    GET_SETTINGS: 0x0B,     // Get device settings (interval, LED mode)
    SET_SETTINGS: 0x0C      // Set device settings (Host-to-Device OUT)
};

// Measurement Interval Options
// index is sent to firmware, minutes is display value
export const MEASUREMENT_INTERVALS = [
    { index: 0, minutes: 1 },
    { index: 1, minutes: 2 },
    { index: 2, minutes: 3, isDefault: true },
    { index: 3, minutes: 5 },
    { index: 4, minutes: 10 },
    { index: 5, minutes: 15 },
    { index: 6, minutes: 20 },
    { index: 7, minutes: 30 },
    { index: 8, minutes: 60 },
    { index: 9, minutes: 120 },
    { index: 10, minutes: 180 }
];

// Log Format Types
export const LOG_TYPE = {
    GPS: 0,         // GPS format: lat/lon/fix
    TSL2591: 1,     // TSL2591 light sensor format: lux/ch0/ch1
    CO2: 2          // CO2 sensor format: co2/pressure/gasResistance
};

// Device Capacity
export const DEVICE_CAPACITY = {
    MAX_LOG_CAPACITY: 4680,         // Maximum number of log records device can store
    ERASE_MAGIC_VALUE: 0xDEAD,      // Safety value required for ERASE_LOGS command
    MEASUREMENT_INTERVAL: 180       // Seconds between log records (180s = 3 minutes, 20 logs/hour)
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
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 100 },      // °C × 100 (centi-degrees)
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
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 100 },      // °C × 100 (centi-degrees)
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
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 100 },      // °C × 100 (centi-degrees)
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
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 100 },      // °C × 100 (centi-degrees)
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

// Log Record Buffer Layout - CO2 Sensor Format (24 bytes)
// Added Jan 2026 - CO2 sensor with environmental monitoring
export const LOG_LAYOUT_CO2 = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 100 },      // °C × 100 (centi-degrees)
    HUMIDITY: { offset: 2, type: 'Uint16', scale: 100 },        // % × 100 (centi-percent)
    CO2: { offset: 4, type: 'Uint16', scale: 1 },               // ppm (no scaling)
    RESERVED: { offset: 6, type: 'Uint16', scale: 1 },          // Reserved
    TSL_CH0: { offset: 8, type: 'Uint16', scale: 1 },           // Full spectrum raw count
    TSL_CH1: { offset: 10, type: 'Uint16', scale: 1 },          // IR spectrum raw count
    LUX: { offset: 12, type: 'Uint16', scale: 10 },             // lux × 10 (deci-lux)
    OVERFLOW: { offset: 14, type: 'Uint8', scale: 1 },          // 0=valid, 1=saturated
    BATTERY: { offset: 15, type: 'Uint8', scale: 1 },           // [bit7:charging][bits6-0:voltage]
    PRESSURE: { offset: 16, type: 'Uint16', scale: 10 },        // hPa × 10 (deci-hPa)
    GAS_RESISTANCE: { offset: 18, type: 'Uint16', scale: 0.1 }, // stored/10, multiply by 10 for ohms
    TIMESTAMP: { offset: 20, type: 'Uint32', scale: 1 }         // Unix epoch
};

// Status Buffer Layout - CO2 Format (24 bytes)
// Added Jan 2026 - For CO2 sensor builds
export const STATUS_LAYOUT_CO2 = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 100 },      // °C × 100 (centi-degrees)
    HUMIDITY: { offset: 2, type: 'Uint16', scale: 100 },        // % × 100 (centi-percent)
    CO2: { offset: 4, type: 'Uint16', scale: 1 },               // ppm (no scaling)
    RESERVED1: { offset: 6, type: 'Uint16', scale: 1 },         // Reserved
    BATTERY: { offset: 8, type: 'Uint8', scale: 1 },            // [bit7:charging][bits6-0:voltage]
    RESERVED2: { offset: 9, type: 'Uint8', scale: 1 },          // Reserved
    LUX: { offset: 10, type: 'Float32', scale: 1 },             // lux as float32 (NO SCALING!)
    RESERVED3: { offset: 14, type: 'Uint16', scale: 1 },        // Reserved (2 bytes)
    CURRENT_TIME: { offset: 16, type: 'Uint32', scale: 1 },     // Current device time
    MEASURED_AT: { offset: 20, type: 'Uint32', scale: 1 }       // When sensor data was captured
};

// UI Configuration
export const UI_CONFIG = {
    AUTO_REFRESH_INTERVAL: 10000 // UI auto-refresh interval (milliseconds)
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
    NAME: 'octanis-ics-logs',
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
    CSV: 'octanis-ics-logs.csv',
    JSON: 'octanis-ics-logs.json',
    GEOJSON: 'octanis-ics-logs.geojson',
    STATISTICS: 'octanis-ics-statistics.txt'
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
    TSL: 'Timestamp,Temperature_C,Humidity_Pct,PM25_ugm3,PM10_ugm3,Lux,TSL_CH0,TSL_CH1,Overflow,Battery_Pct',
    CO2: 'Timestamp,Temperature_C,Humidity_Pct,CO2_ppm,Pressure_hPa,GasRes_Ohm,Lux,Battery_Pct'
};

/**
 * Air Quality Thresholds (Single Source of Truth)
 * Based on WHO/EPA guidelines
 * Used by: events.js, heatmap.js, sparklines, settings display
 */
export const AIR_QUALITY_THRESHOLDS = {
    pm25: {
        label: 'PM2.5',
        unit: 'μg/m³',
        levels: {
            good:   { max: 12,  color: '#10b981', label: 'Good' },
            yellow: { max: 35,  color: '#f59e0b', label: 'Moderate' },
            orange: { max: 55,  color: '#f97316', label: 'Unhealthy (Sensitive)' },
            red:    { max: Infinity, color: '#ef4444', label: 'Unhealthy' }
        }
    },
    pm10: {
        label: 'PM10',
        unit: 'μg/m³',
        levels: {
            good:   { max: 50,  color: '#10b981', label: 'Good' },
            yellow: { max: 150, color: '#f59e0b', label: 'Moderate' },
            orange: { max: 250, color: '#f97316', label: 'Unhealthy (Sensitive)' },
            red:    { max: Infinity, color: '#ef4444', label: 'Unhealthy' }
        }
    },
    co2: {
        label: 'CO₂',
        unit: 'ppm',
        levels: {
            good:   { max: 1000, color: '#10b981', label: 'Good' },
            yellow: { max: 1500, color: '#f59e0b', label: 'Moderate' },
            orange: { max: 2000, color: '#f97316', label: 'Poor' },
            red:    { max: Infinity, color: '#ef4444', label: 'Unhealthy' }
        }
    }
};

/**
 * Get threshold value for a metric and severity level
 */
export function getThresholdValue(metric, severity) {
    return AIR_QUALITY_THRESHOLDS[metric]?.levels[severity]?.max;
}

/**
 * Get color for a metric value based on thresholds
 */
export function getColorForValue(metric, value) {
    const config = AIR_QUALITY_THRESHOLDS[metric];
    if (!config || value == null) return '#9ca3af'; // gray

    const levels = config.levels;
    if (value < levels.good.max) return levels.good.color;
    if (value < levels.yellow.max) return levels.yellow.color;
    if (value < levels.orange.max) return levels.orange.color;
    return levels.red.color;
}

/**
 * Get severity level name for a metric value
 */
export function getSeverityForValue(metric, value) {
    const config = AIR_QUALITY_THRESHOLDS[metric];
    if (!config || value == null) return null;

    const levels = config.levels;
    if (value < levels.good.max) return 'good';
    if (value < levels.yellow.max) return 'yellow';
    if (value < levels.orange.max) return 'orange';
    return 'red';
}

// Legacy - keep for backward compatibility, will be removed
// CO2 Air Quality Thresholds (ppm)
export const CO2_THRESHOLDS = {
    GOOD: 1000,
    MODERATE: 1500,
    POOR: 2000,
    VERY_POOR: 2000
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
    },
    co2: {
        range: { min: 400, max: 2000 },  // ppm (indoor CO2)
        thresholds: [
            { label: '800', value: 800, color: '#10b981', name: 'Good' },              // green
            { label: '1000', value: 1000, color: '#f59e0b', name: 'Moderate' },        // yellow
            { label: '1500', value: 1500, color: '#ef4444', name: 'Poor' }             // red
        ]
    },
    pressure: {
        range: { min: 980, max: 1040 },  // hPa (sea level typical range)
        thresholds: [
            { label: '1000', value: 1000, color: '#6b7280', name: 'Low' },             // gray
            { label: '1013', value: 1013, color: '#3b82f6', name: 'Standard' },        // blue
            { label: '1030', value: 1030, color: '#6b7280', name: 'High' }             // gray
        ]
    }
};
