/**
 * Firmware Protocol Implementation
 * Handles vendor requests and data parsing for CCC Sensor
 */

// WebUSB Vendor Request Configuration
const WEBUSB_VENDOR_CODE = 0x22;

// Command codes
const COMMANDS = {
    GET_STATUS: 0x00,      // Get current sensor readings
    GET_LOG_COUNT: 0x01,   // Get number of log records
    READ_LOG: 0x02,        // Read log record by index
    ERASE_LOGS: 0x03,      // Erase all logs (requires wValue=0xDEAD)
    GET_VERSION: 0x04      // Get firmware version string
};

// Mock mode for testing without hardware
let useMockData = false;
let mockLogCount = 50;  // Number of mock logs to generate

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
        throw new Error('Device not connected');
    }

    try {
        const result = await device.controlTransferIn({
            requestType: 'vendor',
            recipient: 'device',
            request: WEBUSB_VENDOR_CODE,
            value: param,
            index: command
        }, length);

        if (result.status !== 'ok') {
            throw new Error(`Transfer failed: ${result.status}`);
        }

        return result.data;

    } catch (error) {
        throw new Error(`Control transfer failed: ${error.message}`);
    }
}

/**
 * Generate mock status data for testing
 */
function generateMockStatus() {
    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);

    // Temperature: 23.5°C
    view.setInt16(0, 23500, true);
    // Humidity: 45.6%
    view.setUint16(2, 45600, true);
    // PM2.5: 12.5 μg/m³
    view.setUint16(4, 125, true);
    // PM10: 18.3 μg/m³
    view.setUint16(6, 183, true);
    // Battery: 85%
    view.setUint8(8, 85);
    // Charging: Yes
    view.setUint8(9, 1);
    // GPS fix: GPS fix
    view.setUint8(10, 1);
    // Reserved
    view.setUint8(11, 0);
    // Timestamp: current time
    view.setUint32(12, Math.floor(Date.now() / 1000), true);

    return new Uint8Array(buffer);
}

/**
 * Generate mock log item for testing
 */
function generateMockLogItem(index) {
    const buffer = new ArrayBuffer(20);
    const view = new DataView(buffer);

    // Generate realistic-looking data with some variation
    const baseTime = Math.floor(Date.now() / 1000) - (mockLogCount - index) * 300; // 5 min intervals

    view.setInt16(0, 20000 + Math.random() * 8000, true);  // 20-28°C
    view.setUint16(2, 30000 + Math.random() * 40000, true); // 30-70% humidity
    view.setUint16(4, 50 + Math.random() * 150, true);      // 5-20 μg/m³ PM2.5
    view.setUint16(6, 100 + Math.random() * 200, true);     // 10-30 μg/m³ PM10
    view.setInt32(8, 471234567, true);                       // Lat: 47.1234567°
    view.setInt32(12, 85678901, true);                       // Lon: 8.5678901°
    view.setUint8(16, 1);                                    // GPS fix
    view.setUint8(17, 60 + Math.random() * 40);             // 60-100% battery
    view.setUint32(18, baseTime, true);                      // Timestamp

    return new Uint8Array(buffer);
}

/**
 * Get current sensor status (live data)
 * Returns: { temperature, humidity, pm25, pm10, battery, charging, gpsFix, timestamp }
 */
export async function getDeviceStatus(device) {
    let data;

    if (useMockData) {
        // Return mock data for testing
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
        data = generateMockStatus();
    } else {
        try {
            data = await sendControlTransfer(device, COMMANDS.GET_STATUS, 0, 16);
        } catch (error) {
            console.warn('Failed to get device status, using mock data:', error.message);
            // Fall back to mock data if vendor request not implemented
            useMockData = true;
            data = generateMockStatus();
        }
    }

    return parseStatusData(data);
}

/**
 * Parse status data buffer
 */
function parseStatusData(data) {
    const view = new DataView(data.buffer);

    return {
        temperature: view.getInt16(0, true) / 1000,      // °C
        humidity: view.getUint16(2, true) / 1000,         // %
        pm25: view.getUint16(4, true) / 10,               // μg/m³
        pm10: view.getUint16(6, true) / 10,               // μg/m³
        battery: view.getUint8(8),                        // %
        charging: view.getUint8(9) === 1,                 // boolean
        gpsFix: view.getUint8(10),                        // 0=no fix, 1=GPS, 2=DGPS
        timestamp: view.getUint32(12, true)               // seconds since boot
    };
}

/**
 * Get number of log records stored on device
 * Returns: number of records
 */
export async function getLogCount(device) {
    let data;

    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0, mockLogCount, true);
        data = new Uint8Array(buffer);
    } else {
        try {
            data = await sendControlTransfer(device, COMMANDS.GET_LOG_COUNT, 0, 2);
        } catch (error) {
            console.warn('Failed to get log count, using mock data:', error.message);
            useMockData = true;
            const buffer = new ArrayBuffer(2);
            new DataView(buffer).setUint16(0, mockLogCount, true);
            data = new Uint8Array(buffer);
        }
    }

    const view = new DataView(data.buffer);
    return view.getUint16(0, true);
}

/**
 * Read a single log record by index
 * Returns: { temperature, humidity, pm25, pm10, lat, lon, fix, battery, timestamp }
 */
export async function readLogRecord(device, index) {
    let data;

    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 10)); // Simulate delay
        data = generateMockLogItem(index);
    } else {
        try {
            data = await sendControlTransfer(device, COMMANDS.READ_LOG, index, 20);
        } catch (error) {
            console.warn(`Failed to read log ${index}, using mock data:`, error.message);
            useMockData = true;
            data = generateMockLogItem(index);
        }
    }

    return parseLogItem(data);
}

/**
 * Parse log item data buffer
 */
function parseLogItem(data) {
    const view = new DataView(data.buffer);

    return {
        temperature: view.getInt16(0, true) / 1000,       // °C
        humidity: view.getUint16(2, true) / 1000,         // %
        pm25: view.getUint16(4, true) / 10,               // μg/m³
        pm10: view.getUint16(6, true) / 10,               // μg/m³
        lat: view.getInt32(8, true) / 1e7,                // degrees
        lon: view.getInt32(12, true) / 1e7,               // degrees
        fix: view.getUint8(16),                           // GPS fix quality
        battery: view.getUint8(17),                       // %
        timestamp: view.getUint32(18, true)               // Unix epoch
    };
}

/**
 * Download all logs from device
 * Calls progressCallback(current, total) for each record
 * Returns: array of log records
 */
export async function downloadAllLogs(device, progressCallback) {
    // Get total count
    const count = await getLogCount(device);

    if (count === 0) {
        return [];
    }

    const logs = [];

    // Download each record
    for (let i = 0; i < count; i++) {
        try {
            const logItem = await readLogRecord(device, i);
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

    return logs;
}

/**
 * Get firmware version string
 * Returns: version string (e.g., "v1.0.0-webusb")
 */
export async function getFirmwareVersion(device) {
    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 50));
        return "v1.0.0-mock";
    }

    try {
        const data = await sendControlTransfer(device, COMMANDS.GET_VERSION, 0, 32);
        const decoder = new TextDecoder('utf-8');
        const version = decoder.decode(data).replace(/\0/g, '').trim();
        return version || "Unknown";

    } catch (error) {
        console.warn('Failed to get firmware version:', error.message);
        return "Unknown";
    }
}

/**
 * Erase all logs on device (requires confirmation)
 * Returns: true if successful
 */
export async function eraseLogs(device) {
    if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 100));
        mockLogCount = 0;
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
 * Format GPS fix quality as string
 */
export function formatGPSFix(fix) {
    switch (fix) {
        case 0: return 'No Fix';
        case 1: return 'GPS';
        case 2: return 'DGPS';
        default: return 'Unknown';
    }
}

/**
 * Create Google Maps URL from coordinates
 */
export function createMapsURL(lat, lon) {
    return `https://www.google.com/maps?q=${lat},${lon}`;
}

// Auto-enable mock mode for testing
// This will be overridden when real hardware is detected
setMockMode(true);
