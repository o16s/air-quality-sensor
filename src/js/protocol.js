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
    STATUS_LAYOUT_RADAR,
    LOG_LAYOUT,
    LOG_LAYOUT_TSL,
    LOG_LAYOUT_CO2,
    LOG_LAYOUT_RADAR,
    LOG_LAYOUT_SPECTRAL,
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

    const statusSize = (logType === LOG_TYPE.SPECTRAL)
        ? BUFFER_SIZES.STATUS_SPECTRAL
        : BUFFER_SIZES.STATUS;
    const data = await sendControlTransfer(device, COMMANDS.GET_STATUS, 0, statusSize);

    if (logType === LOG_TYPE.SPECTRAL) {
        return parseStatusDataSpectral(data);
    } else if (logType === LOG_TYPE.RADAR) {
        return parseStatusDataRadar(data);
    } else if (logType === LOG_TYPE.CO2) {
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
 * Parse status data buffer (Spectral AS7341 format, 48 bytes)
 * First 24 bytes share common layout (temp, humidity, battery, time),
 * bytes 24-47 are 12 × uint16 spectral channels.
 */
function parseStatusDataSpectral(data) {
    const view = new DataView(data.buffer);

    const currentTime = getBufferValue(view, STATUS_LAYOUT.CURRENT_TIME);
    const batteryByte = getBufferValue(view, STATUS_LAYOUT.BATTERY);
    const battery = decodeBatteryByte(batteryByte);

    return {
        temperature: getBufferValue(view, STATUS_LAYOUT.TEMPERATURE),
        humidity: getBufferValue(view, STATUS_LAYOUT.HUMIDITY),
        batteryVoltage: battery.voltageMv,
        charging: battery.isCharging,
        currentTime,
        measuredAt: getBufferValue(view, STATUS_LAYOUT.MEASURED_AT),
        timestamp: currentTime,
        // 12 spectral channels at offsets 24-47
        f1_415nm:  view.getUint16(24, true),
        f2_445nm:  view.getUint16(26, true),
        f3_480nm:  view.getUint16(28, true),
        f4_515nm:  view.getUint16(30, true),
        clear1:    view.getUint16(32, true),
        nir1:      view.getUint16(34, true),
        f5_555nm:  view.getUint16(36, true),
        f6_590nm:  view.getUint16(38, true),
        f7_630nm:  view.getUint16(40, true),
        f8_680nm:  view.getUint16(42, true),
        clear2:    view.getUint16(44, true),
        nir2:      view.getUint16(46, true),
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

    const recordSize = logType === LOG_TYPE.SPECTRAL
        ? BUFFER_SIZES.LOG_RECORD_SPECTRAL
        : BUFFER_SIZES.LOG_RECORD;
    const data = await sendControlTransfer(device, COMMANDS.READ_LOG, index, recordSize);

    if (logType === LOG_TYPE.SPECTRAL) {
        return parseLogItemSpectral(data);
    } else if (logType === LOG_TYPE.RADAR) {
        return parseLogItemRadar(data);
    } else if (logType === LOG_TYPE.CO2) {
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
 * Parse status data buffer (Radar format)
 */
function parseStatusDataRadar(data) {
    const view = new DataView(data.buffer);

    const currentTime = getBufferValue(view, STATUS_LAYOUT_RADAR.CURRENT_TIME);
    const measuredAt = getBufferValue(view, STATUS_LAYOUT_RADAR.MEASURED_AT);
    const batteryByte = getBufferValue(view, STATUS_LAYOUT_RADAR.BATTERY);
    const battery = decodeBatteryByte(batteryByte);

    return {
        temperature: getBufferValue(view, STATUS_LAYOUT_RADAR.TEMPERATURE),
        humidity: getBufferValue(view, STATUS_LAYOUT_RADAR.HUMIDITY),
        trafficCount: getBufferValue(view, STATUS_LAYOUT_RADAR.TRAFFIC_COUNT),
        engageCount: getBufferValue(view, STATUS_LAYOUT_RADAR.ENGAGE_COUNT),
        batteryVoltage: battery.voltageMv,
        charging: battery.isCharging,
        distance: getBufferValue(view, STATUS_LAYOUT_RADAR.DISTANCE) === 255 ? null : getBufferValue(view, STATUS_LAYOUT_RADAR.DISTANCE),
        energy: getBufferValue(view, STATUS_LAYOUT_RADAR.ENERGY),
        trafficActive: getBufferValue(view, STATUS_LAYOUT_RADAR.TRAFFIC_ACTIVE),
        engageActive: getBufferValue(view, STATUS_LAYOUT_RADAR.ENGAGE_ACTIVE),
        variance: getBufferValue(view, STATUS_LAYOUT_RADAR.VARIANCE),
        currentTime: currentTime,
        measuredAt: measuredAt,
        timestamp: currentTime
    };
}

/**
 * Parse log item data buffer (Radar format)
 */
function parseLogItemRadar(data) {
    const view = new DataView(data.buffer);

    return {
        temperature: getBufferValue(view, LOG_LAYOUT_RADAR.TEMPERATURE),
        humidity: getBufferValue(view, LOG_LAYOUT_RADAR.HUMIDITY),
        trafficCount: getBufferValue(view, LOG_LAYOUT_RADAR.TRAFFIC_COUNT),
        engageCount: getBufferValue(view, LOG_LAYOUT_RADAR.ENGAGE_COUNT),
        trafficTime10s: getBufferValue(view, LOG_LAYOUT_RADAR.TRAFFIC_TIME_10S),
        engageTime10s: getBufferValue(view, LOG_LAYOUT_RADAR.ENGAGE_TIME_10S),
        engageMax10s: getBufferValue(view, LOG_LAYOUT_RADAR.ENGAGE_MAX_10S),
        presencePct: getBufferValue(view, LOG_LAYOUT_RADAR.PRESENCE_PCT),
        varianceAvg: getBufferValue(view, LOG_LAYOUT_RADAR.VARIANCE_AVG),
        variancePeak: getBufferValue(view, LOG_LAYOUT_RADAR.VARIANCE_PEAK),
        distanceMinCm: getBufferValue(view, LOG_LAYOUT_RADAR.DISTANCE_MIN_CM),
        distanceAvgCm: getBufferValue(view, LOG_LAYOUT_RADAR.DISTANCE_AVG_CM),
        energyAvg: getBufferValue(view, LOG_LAYOUT_RADAR.ENERGY_AVG),
        engageFocusedCount: getBufferValue(view, LOG_LAYOUT_RADAR.ENGAGE_FOCUSED_COUNT),
        timestamp: getBufferValue(view, LOG_LAYOUT_RADAR.TIMESTAMP)
    };
}

/**
 * Parse log item data buffer (Spectral AS7341 format, 28 bytes)
 */
function parseLogItemSpectral(data) {
    const view = new DataView(data.buffer);

    return {
        f1_415nm:  getBufferValue(view, LOG_LAYOUT_SPECTRAL.F1_415NM),
        f2_445nm:  getBufferValue(view, LOG_LAYOUT_SPECTRAL.F2_445NM),
        f3_480nm:  getBufferValue(view, LOG_LAYOUT_SPECTRAL.F3_480NM),
        f4_515nm:  getBufferValue(view, LOG_LAYOUT_SPECTRAL.F4_515NM),
        clear1:    getBufferValue(view, LOG_LAYOUT_SPECTRAL.CLEAR1),
        nir1:      getBufferValue(view, LOG_LAYOUT_SPECTRAL.NIR1),
        f5_555nm:  getBufferValue(view, LOG_LAYOUT_SPECTRAL.F5_555NM),
        f6_590nm:  getBufferValue(view, LOG_LAYOUT_SPECTRAL.F6_590NM),
        f7_630nm:  getBufferValue(view, LOG_LAYOUT_SPECTRAL.F7_630NM),
        f8_680nm:  getBufferValue(view, LOG_LAYOUT_SPECTRAL.F8_680NM),
        clear2:    getBufferValue(view, LOG_LAYOUT_SPECTRAL.CLEAR2),
        nir2:      getBufferValue(view, LOG_LAYOUT_SPECTRAL.NIR2),
        timestamp: getBufferValue(view, LOG_LAYOUT_SPECTRAL.TIMESTAMP)
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
    const typeNames = { 0: 'GPS', 1: 'TSL2591', 2: 'CO2', 3: 'Radar', 4: 'Spectral' };
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
        // value=1 (short press): trigger measurement + enable recording
        await device.controlTransferOut({
            requestType: 'vendor',
            recipient: 'device',
            request: USB.VENDOR_CODE,
            value: 1,
            index: COMMANDS.ACQUIRE
        }, new Uint8Array(0));

        console.log('Sensor acquisition triggered');

    } catch (error) {
        throw new Error(`Failed to trigger acquisition: ${error.message}`);
    }
}

/**
 * Set device recording mode (start/stop automatic measurements)
 * @param {USBDevice} device - The USB device
 * @param {boolean} enabled - true to enable recording, false to disable
 */
export async function setRecording(device, enabled) {
    validateDevice(device);

    try {
        // value=1 (short press): enables recording + triggers measurement
        // value=0 (long press): disables recording
        await device.controlTransferOut({
            requestType: 'vendor',
            recipient: 'device',
            request: USB.VENDOR_CODE,
            value: enabled ? 1 : 0,
            index: COMMANDS.ACQUIRE
        }, new Uint8Array(0));

        console.log(`Recording ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
        throw new Error(`Failed to set recording: ${error.message}`);
    }
}

/**
 * Get device settings (measurement interval, LED mode)
 * @param {USBDevice} device - The USB device
 * @returns {Promise<{intervalIndex: number, intervalMinutes: number, ledAlwaysOn: boolean}>}
 */
export async function getSettings(device) {
    validateDevice(device);

    const data = await sendControlTransfer(device, COMMANDS.GET_SETTINGS, 0, 8);
    const view = new DataView(data.buffer);

    return {
        intervalIndex: view.getUint8(0),
        intervalMinutes: view.getUint16(1, true),
        ledAlwaysOn: view.getUint8(3) === 1
    };
}

/**
 * Set device settings (measurement interval, LED mode)
 * Host-to-Device OUT transfer
 * @param {USBDevice} device - The USB device
 * @param {Object} settings - Settings to change
 * @param {number} [settings.intervalIndex] - Interval index (0-10), or undefined to leave unchanged
 * @param {boolean} [settings.ledAlwaysOn] - LED always-on mode, or undefined to leave unchanged
 * @returns {Promise<void>}
 */
export async function setSettings(device, { intervalIndex, ledAlwaysOn }) {
    validateDevice(device);

    // Build settings buffer
    // Byte 0: interval index (0xFF = unchanged)
    // Byte 1: LED always-on (0=off, 1=on, 0xFF=unchanged)
    // Bytes 2-3: Reserved
    const buffer = new Uint8Array([
        intervalIndex ?? 0xFF,
        ledAlwaysOn === undefined ? 0xFF : (ledAlwaysOn ? 1 : 0),
        0,
        0
    ]);

    await device.controlTransferOut({
        requestType: 'vendor',
        recipient: 'device',
        request: USB.VENDOR_CODE,
        value: 0,
        index: COMMANDS.SET_SETTINGS
    }, buffer);

    console.log('Device settings updated');
}

// Export utility functions that are used by UI
export { formatGPSFix, createMapsURL };
