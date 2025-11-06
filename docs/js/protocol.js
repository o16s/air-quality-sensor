/**
 * Firmware Protocol Implementation
 * Handles vendor requests and data parsing for Octanis Sensors
 */

import {
    USB,
    COMMANDS,
    BUFFER_SIZES,
    STATUS_LAYOUT,
    LOG_LAYOUT,
    LOG_LAYOUT_TSL,
    LOG_TYPE,
    MOCK_DATA,
    DELAYS,
    ERRORS
} from './constants.js';

import {
    validateDevice,
    delay,
    executeWithMockFallback,
    setBufferValue,
    getBufferValue,
    parseBuffer,
    getCurrentTimestamp,
    boolToNumber,
    formatGPSFix,
    createMapsURL
} from './utils.js';

// Mock mode for testing without hardware
let useMockData = false;

/**
 * Check if mock mode should be enabled based on URL hash
 * Mock mode is ONLY active when URL contains #mock
 */
function shouldUseMockMode() {
    return window.location.hash === '#mock';
}

/**
 * Enable/disable mock data mode for testing
 */
export function setMockMode(enabled) {
    useMockData = enabled;
    console.log(`Mock mode ${enabled ? 'enabled' : 'disabled'}`);
}

/**
 * Send a control transfer to the device
 */
async function sendControlTransfer(device, command, param, length) {
    if (!device || !device.opened) {
        throw new Error(ERRORS.DEVICE_NOT_CONNECTED);
    }

    try {
        const result = await device.controlTransferIn({
            requestType: 'vendor',
            recipient: 'device',
            request: USB.VENDOR_CODE,
            value: param,
            index: command
        }, length);

        if (result.status !== 'ok') {
            throw new Error(`Transfer failed: ${result.status}`);
        }

        return result.data;

    } catch (error) {
        throw new Error(`${ERRORS.CONTROL_TRANSFER_FAILED}: ${error.message}`);
    }
}

/**
 * Generate mock status data for testing
 */
function generateMockStatus() {
    const buffer = new ArrayBuffer(BUFFER_SIZES.STATUS);
    const view = new DataView(buffer);

    const now = getCurrentTimestamp();
    const measuredAt = now - 32;  // Simulate measurement 32 seconds ago

    setBufferValue(view, STATUS_LAYOUT.TEMPERATURE, MOCK_DATA.TEMPERATURE_C);
    setBufferValue(view, STATUS_LAYOUT.HUMIDITY, MOCK_DATA.HUMIDITY_PERCENT);
    setBufferValue(view, STATUS_LAYOUT.PM25, MOCK_DATA.PM25_UG_M3);
    setBufferValue(view, STATUS_LAYOUT.PM10, MOCK_DATA.PM10_UG_M3);
    setBufferValue(view, STATUS_LAYOUT.BATTERY, MOCK_DATA.BATTERY_PERCENT);
    setBufferValue(view, STATUS_LAYOUT.CHARGING, boolToNumber(MOCK_DATA.IS_CHARGING));
    setBufferValue(view, STATUS_LAYOUT.GPS_FIX, MOCK_DATA.GPS_FIX_QUALITY);
    setBufferValue(view, STATUS_LAYOUT.DEVICE_FLAGS, 0x01);  // Bit 0: GPS enabled
    setBufferValue(view, STATUS_LAYOUT.CURRENT_TIME, now);
    setBufferValue(view, STATUS_LAYOUT.MEASURED_AT, measuredAt);

    return new Uint8Array(buffer);
}

/**
 * Generate mock log item for testing (GPS format)
 */
function generateMockLogItem(index) {
    const buffer = new ArrayBuffer(BUFFER_SIZES.LOG_RECORD);
    const view = new DataView(buffer);

    // Generate realistic-looking data with some variation
    const baseTime = getCurrentTimestamp() - (MOCK_DATA.LOG_COUNT - index) * MOCK_DATA.LOG_INTERVAL_SECONDS;

    const temperature = MOCK_DATA.TEMP_MIN_C + Math.random() * (MOCK_DATA.TEMP_MAX_C - MOCK_DATA.TEMP_MIN_C);
    const humidity = MOCK_DATA.HUMIDITY_MIN_PERCENT + Math.random() * (MOCK_DATA.HUMIDITY_MAX_PERCENT - MOCK_DATA.HUMIDITY_MIN_PERCENT);
    const pm25 = MOCK_DATA.PM25_MIN_UG_M3 + Math.random() * (MOCK_DATA.PM25_MAX_UG_M3 - MOCK_DATA.PM25_MIN_UG_M3);
    const pm10 = MOCK_DATA.PM10_MIN_UG_M3 + Math.random() * (MOCK_DATA.PM10_MAX_UG_M3 - MOCK_DATA.PM10_MIN_UG_M3);
    const battery = MOCK_DATA.BATTERY_MIN_PERCENT + Math.random() * (MOCK_DATA.BATTERY_MAX_PERCENT - MOCK_DATA.BATTERY_MIN_PERCENT);

    setBufferValue(view, LOG_LAYOUT.TEMPERATURE, temperature);
    setBufferValue(view, LOG_LAYOUT.HUMIDITY, humidity);
    setBufferValue(view, LOG_LAYOUT.PM25, pm25);
    setBufferValue(view, LOG_LAYOUT.PM10, pm10);
    setBufferValue(view, LOG_LAYOUT.LATITUDE, MOCK_DATA.GPS_LAT);
    setBufferValue(view, LOG_LAYOUT.LONGITUDE, MOCK_DATA.GPS_LON);
    setBufferValue(view, LOG_LAYOUT.GPS_FIX, MOCK_DATA.GPS_FIX_QUALITY);
    setBufferValue(view, LOG_LAYOUT.BATTERY, battery);
    setBufferValue(view, LOG_LAYOUT.PADDING, 0);  // Compiler alignment padding
    setBufferValue(view, LOG_LAYOUT.TIMESTAMP, baseTime);

    return new Uint8Array(buffer);
}

/**
 * Generate mock log item for testing (TSL2591 format)
 */
function generateMockLogItemTSL(index) {
    const buffer = new ArrayBuffer(BUFFER_SIZES.LOG_RECORD);
    const view = new DataView(buffer);

    // Generate realistic-looking data with some variation
    const baseTime = getCurrentTimestamp() - (MOCK_DATA.LOG_COUNT - index) * MOCK_DATA.LOG_INTERVAL_SECONDS;

    const temperature = MOCK_DATA.TEMP_MIN_C + Math.random() * (MOCK_DATA.TEMP_MAX_C - MOCK_DATA.TEMP_MIN_C);
    const humidity = MOCK_DATA.HUMIDITY_MIN_PERCENT + Math.random() * (MOCK_DATA.HUMIDITY_MAX_PERCENT - MOCK_DATA.HUMIDITY_MIN_PERCENT);
    const pm25 = MOCK_DATA.PM25_MIN_UG_M3 + Math.random() * (MOCK_DATA.PM25_MAX_UG_M3 - MOCK_DATA.PM25_MIN_UG_M3);
    const pm10 = MOCK_DATA.PM10_MIN_UG_M3 + Math.random() * (MOCK_DATA.PM10_MAX_UG_M3 - MOCK_DATA.PM10_MIN_UG_M3);
    const battery = MOCK_DATA.BATTERY_MIN_PERCENT + Math.random() * (MOCK_DATA.BATTERY_MAX_PERCENT - MOCK_DATA.BATTERY_MIN_PERCENT);
    const lux = MOCK_DATA.TSL_LUX_MIN + Math.random() * (MOCK_DATA.TSL_LUX_MAX - MOCK_DATA.TSL_LUX_MIN);
    const ch0 = Math.floor(MOCK_DATA.TSL_CH0_MIN + Math.random() * (MOCK_DATA.TSL_CH0_MAX - MOCK_DATA.TSL_CH0_MIN));
    const ch1 = Math.floor(MOCK_DATA.TSL_CH1_MIN + Math.random() * (MOCK_DATA.TSL_CH1_MAX - MOCK_DATA.TSL_CH1_MIN));

    setBufferValue(view, LOG_LAYOUT_TSL.TEMPERATURE, temperature);
    setBufferValue(view, LOG_LAYOUT_TSL.HUMIDITY, humidity);
    setBufferValue(view, LOG_LAYOUT_TSL.PM25, pm25);
    setBufferValue(view, LOG_LAYOUT_TSL.PM10, pm10);
    setBufferValue(view, LOG_LAYOUT_TSL.TSL_CH0, ch0);
    setBufferValue(view, LOG_LAYOUT_TSL.TSL_CH1, ch1);
    setBufferValue(view, LOG_LAYOUT_TSL.LUX, lux);
    setBufferValue(view, LOG_LAYOUT_TSL.OVERFLOW, MOCK_DATA.TSL_OVERFLOW);
    setBufferValue(view, LOG_LAYOUT_TSL.BATTERY, battery);
    setBufferValue(view, LOG_LAYOUT_TSL.RESERVED1, 0);
    setBufferValue(view, LOG_LAYOUT_TSL.RESERVED2, 0);
    setBufferValue(view, LOG_LAYOUT_TSL.TIMESTAMP, baseTime);

    return new Uint8Array(buffer);
}

/**
 * Get current sensor status (live data)
 * Returns: { temperature, humidity, pm25, pm10, battery, charging, gpsFix, timestamp }
 */
export async function getDeviceStatus(device) {
    // Always validate device first
    validateDevice(device);

    const data = await executeWithMockFallback(
        device,
        async (d) => {
            return await sendControlTransfer(d, COMMANDS.GET_STATUS, 0, BUFFER_SIZES.STATUS);
        },
        async () => {
            await delay(DELAYS.STATUS_READ);
            return generateMockStatus();
        },
        useMockData,
        setMockMode
    );

    return parseStatusData(data);
}

/**
 * Parse status data buffer
 */
function parseStatusData(data) {
    const view = new DataView(data.buffer);

    const currentTime = getBufferValue(view, STATUS_LAYOUT.CURRENT_TIME);

    return {
        temperature: getBufferValue(view, STATUS_LAYOUT.TEMPERATURE),
        humidity: getBufferValue(view, STATUS_LAYOUT.HUMIDITY),
        pm25: getBufferValue(view, STATUS_LAYOUT.PM25),
        pm10: getBufferValue(view, STATUS_LAYOUT.PM10),
        battery: getBufferValue(view, STATUS_LAYOUT.BATTERY),
        charging: getBufferValue(view, STATUS_LAYOUT.CHARGING) === 1,
        gpsFix: getBufferValue(view, STATUS_LAYOUT.GPS_FIX),
        currentTime: currentTime,
        measuredAt: getBufferValue(view, STATUS_LAYOUT.MEASURED_AT),
        timestamp: currentTime  // Backward compatibility - maps to currentTime
    };
}

/**
 * Get number of log records stored on device
 * Returns: number of records
 */
export async function getLogCount(device) {
    const data = await executeWithMockFallback(
        device,
        async (d) => {
            return await sendControlTransfer(d, COMMANDS.GET_LOG_COUNT, 0, BUFFER_SIZES.LOG_COUNT);
        },
        async () => {
            await delay(DELAYS.LOG_COUNT_READ);
            const buffer = new ArrayBuffer(BUFFER_SIZES.LOG_COUNT);
            new DataView(buffer).setUint16(0, MOCK_DATA.LOG_COUNT, true);
            return new Uint8Array(buffer);
        },
        useMockData,
        setMockMode
    );

    const view = new DataView(data.buffer);
    return view.getUint16(0, true);
}

/**
 * Read a single log record by index
 * @param {USBDevice} device - The USB device
 * @param {number} index - Log record index (0-based)
 * @param {number} logType - Optional log type (LOG_TYPE.GPS or LOG_TYPE.TSL2591)
 * Returns: { temperature, humidity, pm25, pm10, ... } - fields depend on log type
 */
export async function readLogRecord(device, index, logType = null) {
    // Auto-detect log type if not provided
    if (logType === null) {
        logType = await getLogType(device);
    }

    const data = await executeWithMockFallback(
        device,
        async (d) => {
            return await sendControlTransfer(d, COMMANDS.READ_LOG, index, BUFFER_SIZES.LOG_RECORD);
        },
        async () => {
            await delay(DELAYS.LOG_RECORD_READ);
            return logType === LOG_TYPE.TSL2591
                ? generateMockLogItemTSL(index)
                : generateMockLogItem(index);
        },
        useMockData,
        setMockMode
    );

    return logType === LOG_TYPE.TSL2591
        ? parseLogItemTSL(data)
        : parseLogItem(data);
}

/**
 * Parse log item data buffer (GPS format)
 */
function parseLogItem(data) {
    const view = new DataView(data.buffer);

    return {
        temperature: getBufferValue(view, LOG_LAYOUT.TEMPERATURE),
        humidity: getBufferValue(view, LOG_LAYOUT.HUMIDITY),
        pm25: getBufferValue(view, LOG_LAYOUT.PM25),
        pm10: getBufferValue(view, LOG_LAYOUT.PM10),
        lat: getBufferValue(view, LOG_LAYOUT.LATITUDE),
        lon: getBufferValue(view, LOG_LAYOUT.LONGITUDE),
        fix: getBufferValue(view, LOG_LAYOUT.GPS_FIX),
        battery: getBufferValue(view, LOG_LAYOUT.BATTERY),
        timestamp: getBufferValue(view, LOG_LAYOUT.TIMESTAMP)
    };
}

/**
 * Parse log item data buffer (TSL2591 format)
 */
function parseLogItemTSL(data) {
    const view = new DataView(data.buffer);

    return {
        temperature: getBufferValue(view, LOG_LAYOUT_TSL.TEMPERATURE),
        humidity: getBufferValue(view, LOG_LAYOUT_TSL.HUMIDITY),
        pm25: getBufferValue(view, LOG_LAYOUT_TSL.PM25),
        pm10: getBufferValue(view, LOG_LAYOUT_TSL.PM10),
        tslCH0: getBufferValue(view, LOG_LAYOUT_TSL.TSL_CH0),
        tslCH1: getBufferValue(view, LOG_LAYOUT_TSL.TSL_CH1),
        lux: getBufferValue(view, LOG_LAYOUT_TSL.LUX),
        overflow: getBufferValue(view, LOG_LAYOUT_TSL.OVERFLOW),
        battery: getBufferValue(view, LOG_LAYOUT_TSL.BATTERY),
        timestamp: getBufferValue(view, LOG_LAYOUT_TSL.TIMESTAMP)
    };
}

/**
 * Download all logs from device
 * Calls progressCallback(current, total) for each record
 * Returns: { logType, logs } - logType indicates GPS or TSL2591 format
 */
export async function downloadAllLogs(device, progressCallback) {
    // Detect log type once for all records
    const logType = await getLogType(device);

    // Get total count
    const count = await getLogCount(device);

    if (count === 0) {
        return { logType, logs: [] };
    }

    const logs = [];

    // Download each record
    for (let i = 0; i < count; i++) {
        try {
            const logItem = await readLogRecord(device, i, logType);
            logs.push(logItem);

            // Report progress
            if (progressCallback) {
                progressCallback(i + 1, count);
            }

        } catch (error) {
            console.error(`Error reading log ${i}:`, error);
            // Continue with next record
        }
    }

    return { logType, logs };
}

/**
 * Get firmware version string
 * Returns: version string (e.g., "v1.0.0-webusb")
 */
export async function getFirmwareVersion(device) {
    const data = await executeWithMockFallback(
        device,
        async (d) => {
            return await sendControlTransfer(d, COMMANDS.GET_VERSION, 0, BUFFER_SIZES.VERSION);
        },
        async () => {
            await delay(DELAYS.STATUS_READ);
            const encoder = new TextEncoder();
            const versionBytes = encoder.encode("v1.0.0-mock");
            const buffer = new Uint8Array(BUFFER_SIZES.VERSION);
            buffer.set(versionBytes);
            return buffer;
        },
        useMockData,
        setMockMode
    );

    const decoder = new TextDecoder('utf-8');
    const version = decoder.decode(data).replace(/\0/g, '').trim();
    return version || "Unknown";
}

/**
 * Get log format type (GPS or TSL2591)
 * Returns: LOG_TYPE.GPS (0) or LOG_TYPE.TSL2591 (1)
 */
export async function getLogType(device) {
    const data = await executeWithMockFallback(
        device,
        async (d) => {
            return await sendControlTransfer(d, COMMANDS.GET_LOG_TYPE, 0, BUFFER_SIZES.LOG_TYPE_RESPONSE);
        },
        async () => {
            await delay(DELAYS.STATUS_READ);
            const buffer = new Uint8Array(BUFFER_SIZES.LOG_TYPE_RESPONSE);
            // Mock mode: Return GPS format by default (can be overridden via URL hash #tsl)
            buffer[0] = window.location.hash === '#tsl' ? LOG_TYPE.TSL2591 : LOG_TYPE.GPS;
            return buffer;
        },
        useMockData,
        setMockMode
    );

    return data[0];
}

/**
 * Erase all logs on device (requires confirmation)
 * Returns: true if successful
 */
export async function eraseLogs(device) {
    if (useMockData) {
        await delay(DELAYS.STATUS_READ);
        return true;
    }

    try {
        const data = await sendControlTransfer(
            device,
            COMMANDS.ERASE_LOGS,
            0xDEAD,  // Safety parameter
            1
        );

        const status = new DataView(data.buffer).getUint8(0);
        return status === 0x00;  // 0x00 = success

    } catch (error) {
        console.error('Failed to erase logs:', error);
        return false;
    }
}

/**
 * Set device RTC to specified Unix timestamp
 * Host-to-Device OUT transfer (different from all other commands)
 * @param {USBDevice} device - The USB device
 * @param {number} unixTimestamp - Unix epoch seconds (e.g., Math.floor(Date.now() / 1000))
 * @returns {Promise<void>}
 */
export async function setDeviceTime(device, unixTimestamp) {
    validateDevice(device);

    // Validate timestamp parameter
    if (!Number.isInteger(unixTimestamp) || unixTimestamp < 0) {
        throw new Error('unixTimestamp must be a non-negative integer');
    }

    if (useMockData) {
        console.log(`Mock mode: Would set device time to ${unixTimestamp}`);
        return;
    }

    try {
        // Create 4-byte buffer with Unix timestamp (little-endian)
        const buffer = new Uint8Array(4);
        const view = new DataView(buffer.buffer);
        view.setUint32(0, unixTimestamp, true);

        // Send Host-to-Device OUT transfer
        await device.controlTransferOut({
            requestType: 'vendor',
            recipient: 'device',
            request: USB.VENDOR_CODE,
            value: 0,
            index: COMMANDS.SET_TIME
        }, buffer);

        console.log(`Device time set to ${new Date(unixTimestamp * 1000).toLocaleString()}`);

    } catch (error) {
        throw new Error(`Failed to set device time: ${error}`);
    }
}

/**
 * Trigger immediate sensor measurement (ACQUIRE command)
 * Host-to-Device OUT transfer with 0 bytes payload
 * @param {USBDevice} device - The USB device
 * @returns {Promise<void>}
 */
export async function triggerAcquisition(device) {
    validateDevice(device);

    if (useMockData) {
        console.log('Mock mode: Would trigger sensor acquisition');
        return;
    }

    try {
        // Send Host-to-Device OUT transfer with 0 bytes
        await device.controlTransferOut({
            requestType: 'vendor',
            recipient: 'device',
            request: USB.VENDOR_CODE,
            value: 0,
            index: COMMANDS.ACQUIRE
        }, new Uint8Array(0));

        console.log('Sensor acquisition triggered');

    } catch (error) {
        throw new Error(`Failed to trigger acquisition: ${error.message}`);
    }
}

// Export utility functions that are used by UI
export { formatGPSFix, createMapsURL };

// Initialize mock mode based on URL hash
// Mock mode is ONLY active when URL contains #mock
setMockMode(shouldUseMockMode());

// Listen for hash changes to dynamically toggle mock mode
window.addEventListener('hashchange', () => {
    setMockMode(shouldUseMockMode());
});
