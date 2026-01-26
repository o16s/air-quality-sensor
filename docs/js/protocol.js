/**
 * Firmware Protocol Implementation
 * Handles vendor requests and data parsing for Octanis ICS
 */

import {
    USB,
    COMMANDS,
    BUFFER_SIZES,
    STATUS_LAYOUT,
    STATUS_LAYOUT_TSL,
    STATUS_LAYOUT_CO2,
    LOG_LAYOUT,
    LOG_LAYOUT_TSL,
    LOG_LAYOUT_CO2,
    LOG_TYPE,
    ERRORS
} from './constants.js';

import {
    validateDevice,
    getBufferValue,
    formatGPSFix,
    createMapsURL,
    decodeBatteryByte
} from './utils.js';

/**
 * Send a control transfer to the device
 */
async function sendControlTransfer(device, command, param, length) {
    if (!device || !device.opened) {
        throw new Error(ERRORS.DEVICE_NOT_CONNECTED);
    }

    try {
        console.log(`USB Control Transfer: command=0x${command.toString(16).padStart(2, '0')}, param=${param}, length=${length}`);
        const result = await device.controlTransferIn({
            requestType: 'vendor',
            recipient: 'device',
            request: USB.VENDOR_CODE,
            value: param,
            index: command
        }, length);

        console.log(`USB Response: status=${result.status}, bytesRead=${result.data?.byteLength || 0}`);

        if (result.status !== 'ok') {
            throw new Error(`Transfer failed: ${result.status}`);
        }

        return result.data;

    } catch (error) {
        throw new Error(`${ERRORS.CONTROL_TRANSFER_FAILED}: ${error.message}`);
    }
}

/**
 * Get current sensor status (live data)
 * @param {USBDevice} device - The USB device
 * @param {number} logType - Optional log type (LOG_TYPE.GPS, LOG_TYPE.TSL2591, or LOG_TYPE.CO2)
 * Returns: { temperature, humidity, pm25, pm10, battery, charging, ... }
 */
export async function getDeviceStatus(device, logType = null) {
    validateDevice(device);

    // Auto-detect log type if not provided
    if (logType === null) {
        try {
            logType = await getLogType(device);
        } catch (error) {
            console.log('Failed to detect log type, defaulting to GPS:', error.message);
            logType = LOG_TYPE.GPS;
        }
    }

    const data = await sendControlTransfer(device, COMMANDS.GET_STATUS, 0, BUFFER_SIZES.STATUS);

    if (logType === LOG_TYPE.CO2) {
        return parseStatusDataCO2(data);
    } else if (logType === LOG_TYPE.TSL2591) {
        return parseStatusDataTSL(data);
    } else {
        return parseStatusData(data);
    }
}

/**
 * Parse status data buffer (GPS format)
 */
function parseStatusData(data) {
    const view = new DataView(data.buffer);

    const currentTime = getBufferValue(view, STATUS_LAYOUT.CURRENT_TIME);
    const batteryByte = getBufferValue(view, STATUS_LAYOUT.BATTERY);
    const battery = decodeBatteryByte(batteryByte);

    const temperature = getBufferValue(view, STATUS_LAYOUT.TEMPERATURE);
    console.log(`[Status Parse] Temperature: ${temperature}°C (raw: ${view.getInt16(0, true)})`);

    return {
        temperature: temperature,
        humidity: getBufferValue(view, STATUS_LAYOUT.HUMIDITY),
        pm25: getBufferValue(view, STATUS_LAYOUT.PM25),
        pm10: getBufferValue(view, STATUS_LAYOUT.PM10),
        batteryVoltage: battery.voltageMv,
        charging: battery.isCharging,
        gpsFix: getBufferValue(view, STATUS_LAYOUT.GPS_FIX),
        currentTime: currentTime,
        measuredAt: getBufferValue(view, STATUS_LAYOUT.MEASURED_AT),
        timestamp: currentTime  // Backward compatibility - maps to currentTime
    };
}

/**
 * Parse status data buffer (TSL2591 format)
 */
function parseStatusDataTSL(data) {
    const view = new DataView(data.buffer);

    const currentTime = getBufferValue(view, STATUS_LAYOUT_TSL.CURRENT_TIME);
    const measuredAt = getBufferValue(view, STATUS_LAYOUT_TSL.MEASURED_AT);
    const batteryByte = getBufferValue(view, STATUS_LAYOUT_TSL.BATTERY);
    const battery = decodeBatteryByte(batteryByte);

    return {
        temperature: getBufferValue(view, STATUS_LAYOUT_TSL.TEMPERATURE),
        humidity: getBufferValue(view, STATUS_LAYOUT_TSL.HUMIDITY),
        pm25: getBufferValue(view, STATUS_LAYOUT_TSL.PM25),
        pm10: getBufferValue(view, STATUS_LAYOUT_TSL.PM10),
        batteryVoltage: battery.voltageMv,
        charging: battery.isCharging,
        lux: getBufferValue(view, STATUS_LAYOUT_TSL.LUX),  // Float32, no scaling
        currentTime: currentTime,
        measuredAt: measuredAt,
        timestamp: currentTime  // Backward compatibility - maps to currentTime
    };
}

/**
 * Parse status data buffer (CO2 format)
 */
function parseStatusDataCO2(data) {
    const view = new DataView(data.buffer);

    const currentTime = getBufferValue(view, STATUS_LAYOUT_CO2.CURRENT_TIME);
    const measuredAt = getBufferValue(view, STATUS_LAYOUT_CO2.MEASURED_AT);
    const batteryByte = getBufferValue(view, STATUS_LAYOUT_CO2.BATTERY);
    const battery = decodeBatteryByte(batteryByte);

    return {
        temperature: getBufferValue(view, STATUS_LAYOUT_CO2.TEMPERATURE),
        humidity: getBufferValue(view, STATUS_LAYOUT_CO2.HUMIDITY),
        co2: getBufferValue(view, STATUS_LAYOUT_CO2.CO2),
        batteryVoltage: battery.voltageMv,
        charging: battery.isCharging,
        lux: getBufferValue(view, STATUS_LAYOUT_CO2.LUX),  // Float32, no scaling
        currentTime: currentTime,
        measuredAt: measuredAt,
        timestamp: currentTime  // Backward compatibility - maps to currentTime
    };
}

/**
 * Get number of log records stored on device
 * Returns: number of records
 */
export async function getLogCount(device) {
    validateDevice(device);

    const data = await sendControlTransfer(device, COMMANDS.GET_LOG_COUNT, 0, BUFFER_SIZES.LOG_COUNT);
    const view = new DataView(data.buffer);
    return view.getUint16(0, true);
}

/**
 * Read a single log record by index
 * @param {USBDevice} device - The USB device
 * @param {number} index - Log record index (0-based)
 * @param {number} logType - Optional log type (LOG_TYPE.GPS, LOG_TYPE.TSL2591, or LOG_TYPE.CO2)
 * Returns: { temperature, humidity, pm25, pm10, ... } - fields depend on log type
 */
export async function readLogRecord(device, index, logType = null) {
    validateDevice(device);

    // Auto-detect log type if not provided
    if (logType === null) {
        logType = await getLogType(device);
    }

    const data = await sendControlTransfer(device, COMMANDS.READ_LOG, index, BUFFER_SIZES.LOG_RECORD);

    if (logType === LOG_TYPE.CO2) {
        return parseLogItemCO2(data);
    } else if (logType === LOG_TYPE.TSL2591) {
        return parseLogItemTSL(data);
    } else {
        return parseLogItem(data);
    }
}

/**
 * Parse log item data buffer (GPS format)
 */
function parseLogItem(data) {
    const view = new DataView(data.buffer);

    const batteryByte = getBufferValue(view, LOG_LAYOUT.BATTERY);
    const battery = decodeBatteryByte(batteryByte);

    return {
        temperature: getBufferValue(view, LOG_LAYOUT.TEMPERATURE),
        humidity: getBufferValue(view, LOG_LAYOUT.HUMIDITY),
        pm25: getBufferValue(view, LOG_LAYOUT.PM25),
        pm10: getBufferValue(view, LOG_LAYOUT.PM10),
        lat: getBufferValue(view, LOG_LAYOUT.LATITUDE),
        lon: getBufferValue(view, LOG_LAYOUT.LONGITUDE),
        fix: getBufferValue(view, LOG_LAYOUT.GPS_FIX),
        batteryVoltage: battery.voltageMv,
        charging: battery.isCharging,
        timestamp: getBufferValue(view, LOG_LAYOUT.TIMESTAMP)
    };
}

/**
 * Parse log item data buffer (TSL2591 format)
 */
function parseLogItemTSL(data) {
    const view = new DataView(data.buffer);

    const batteryByte = getBufferValue(view, LOG_LAYOUT_TSL.BATTERY);
    const battery = decodeBatteryByte(batteryByte);

    return {
        temperature: getBufferValue(view, LOG_LAYOUT_TSL.TEMPERATURE),
        humidity: getBufferValue(view, LOG_LAYOUT_TSL.HUMIDITY),
        pm25: getBufferValue(view, LOG_LAYOUT_TSL.PM25),
        pm10: getBufferValue(view, LOG_LAYOUT_TSL.PM10),
        tslCH0: getBufferValue(view, LOG_LAYOUT_TSL.TSL_CH0),
        tslCH1: getBufferValue(view, LOG_LAYOUT_TSL.TSL_CH1),
        lux: getBufferValue(view, LOG_LAYOUT_TSL.LUX),
        overflow: getBufferValue(view, LOG_LAYOUT_TSL.OVERFLOW),
        batteryVoltage: battery.voltageMv,
        charging: battery.isCharging,
        timestamp: getBufferValue(view, LOG_LAYOUT_TSL.TIMESTAMP)
    };
}

/**
 * Parse log item data buffer (CO2 format)
 */
function parseLogItemCO2(data) {
    const view = new DataView(data.buffer);

    const batteryByte = getBufferValue(view, LOG_LAYOUT_CO2.BATTERY);
    const battery = decodeBatteryByte(batteryByte);

    return {
        temperature: getBufferValue(view, LOG_LAYOUT_CO2.TEMPERATURE),
        humidity: getBufferValue(view, LOG_LAYOUT_CO2.HUMIDITY),
        co2: getBufferValue(view, LOG_LAYOUT_CO2.CO2),
        tslCH0: getBufferValue(view, LOG_LAYOUT_CO2.TSL_CH0),
        tslCH1: getBufferValue(view, LOG_LAYOUT_CO2.TSL_CH1),
        lux: getBufferValue(view, LOG_LAYOUT_CO2.LUX),
        overflow: getBufferValue(view, LOG_LAYOUT_CO2.OVERFLOW),
        batteryVoltage: battery.voltageMv,
        charging: battery.isCharging,
        pressure: getBufferValue(view, LOG_LAYOUT_CO2.PRESSURE),
        gasResistance: getBufferValue(view, LOG_LAYOUT_CO2.GAS_RESISTANCE),
        timestamp: getBufferValue(view, LOG_LAYOUT_CO2.TIMESTAMP)
    };
}

/**
 * Download all logs from device
 * Calls progressCallback(current, total) for each record
 * Returns: { logType, logs } - logType indicates GPS, TSL2591, or CO2 format
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
    validateDevice(device);

    const data = await sendControlTransfer(device, COMMANDS.GET_VERSION, 0, BUFFER_SIZES.VERSION);

    const decoder = new TextDecoder('utf-8');
    const version = decoder.decode(data).replace(/\0/g, '').trim();
    return version || "Unknown";
}

/**
 * Get log format type (GPS, TSL2591, or CO2)
 * Returns: LOG_TYPE.GPS (0), LOG_TYPE.TSL2591 (1), or LOG_TYPE.CO2 (2)
 */
export async function getLogType(device) {
    validateDevice(device);

    const data = await sendControlTransfer(device, COMMANDS.GET_LOG_TYPE, 0, BUFFER_SIZES.LOG_TYPE_RESPONSE);

    const view = new DataView(data.buffer);
    const logType = view.getUint8(0);
    const typeNames = { 0: 'GPS', 1: 'TSL2591', 2: 'CO2' };
    console.log(`GET_LOG_TYPE returned: ${logType} (${typeNames[logType] || 'UNKNOWN'})`);
    return logType;
}

/**
 * Erase all logs on device (requires confirmation)
 * Returns: true if successful
 */
export async function eraseLogs(device) {
    validateDevice(device);

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
