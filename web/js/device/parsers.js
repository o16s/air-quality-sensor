/**
 * Binary Data Parsers
 * Pure functions that parse USB buffer data into JS objects.
 * Separated from protocol.js so parsers can be tested without USB mocks.
 */

import {
    STATUS_LAYOUT,
    STATUS_LAYOUT_TSL,
    STATUS_LAYOUT_CO2,
    STATUS_LAYOUT_RADAR,
    LOG_LAYOUT,
    LOG_LAYOUT_TSL,
    LOG_LAYOUT_CO2,
    LOG_LAYOUT_RADAR,
    LOG_LAYOUT_SPECTRAL,
} from '../shared/constants.js';

import {
    getBufferValue,
    decodeBatteryByte
} from '../shared/utils.js';

/**
 * Parse status data buffer (GPS format)
 */
export function parseStatusData(data) {
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
export function parseStatusDataTSL(data) {
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
export function parseStatusDataCO2(data) {
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
 * Parse status data buffer (Radar format)
 */
export function parseStatusDataRadar(data) {
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
 * Parse status data buffer (Spectral AS7341 format, 48 bytes)
 * First 24 bytes share common layout (temp, humidity, battery, time),
 * bytes 24-47 are 12 x uint16 spectral channels.
 */
export function parseStatusDataSpectral(data) {
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
 * Parse log item data buffer (GPS format)
 */
export function parseLogItem(data) {
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
export function parseLogItemTSL(data) {
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
export function parseLogItemCO2(data) {
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
 * Parse log item data buffer (Radar format)
 */
export function parseLogItemRadar(data) {
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
export function parseLogItemSpectral(data) {
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
