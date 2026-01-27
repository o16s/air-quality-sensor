/**
 * Live Data Module
 * Handles live sensor value display updates
 */

import { i18n } from '../i18n.js';
import { isDeviceConnected, getDevice } from '../webusb.js';
import { getDeviceStatus, formatGPSFix, createMapsURL } from '../protocol.js';
import { LOG_TYPE, CO2_THRESHOLDS, TIME_SYNC } from '../constants.js';
import * as state from './state.js';
import { showError } from './utils.js';

/**
 * Update live sensor data from connected device
 */
export async function updateLiveData() {
    if (!isDeviceConnected()) {
        return;
    }

    try {
        const device = getDevice();
        const currentLogType = state.get('currentLogType');
        const status = await getDeviceStatus(device, currentLogType);

        // Update temperature (°C only)
        document.getElementById('temp-value').textContent =
            `${status.temperature.toFixed(1)}°C`;

        // Update humidity
        document.getElementById('humidity-value').textContent =
            `${status.humidity.toFixed(1)}%`;

        // Update format-specific values (widget visibility handled by configureWidgetsForLogType)
        if (currentLogType === LOG_TYPE.CO2) {
            // CO2 format: update CO2 value (lux hidden for CO2 — pressure/gasResistance from sync)
            updateCO2Value('co2-value', status.co2);
        } else {
            // GPS/TSL2591 format: update PM values
            updatePMValue('pm25-value', status.pm25);
            updatePMValue('pm10-value', status.pm10);
            // Update Lux for TSL2591 format
            if (currentLogType === LOG_TYPE.TSL2591) {
                updateLux(status.lux);
            }
        }

        // Update battery (now uses voltage instead of percentage)
        updateBattery(status.batteryVoltage, status.charging);

        // Update PM measurement age
        const ageSeconds = status.currentTime - status.measuredAt;
        if (ageSeconds < 5) {
            document.getElementById('measured-age').textContent = i18n.t('time_fresh');
        } else if (ageSeconds < 60) {
            document.getElementById('measured-age').textContent = i18n.t('time_secondsOld', { seconds: ageSeconds });
        } else if (ageSeconds < 3600) {
            document.getElementById('measured-age').textContent = i18n.t('time_minutesOld', { minutes: Math.floor(ageSeconds / 60) });
        } else {
            document.getElementById('measured-age').textContent = i18n.t('time_hoursOld', { hours: Math.floor(ageSeconds / 3600) });
        }

    } catch (error) {
        console.error('Failed to update live data:', error);
        showError(i18n.t('sensor_readFailed', { message: error.message }));

        // Set all sensor values to N/A when data is unavailable
        document.getElementById('temp-value').textContent = 'N/A';
        document.getElementById('humidity-value').textContent = 'N/A';
        document.getElementById('pm25-value').textContent = 'N/A';
        document.getElementById('pm10-value').textContent = 'N/A';
        document.getElementById('co2-value').textContent = 'N/A';
        document.getElementById('lux-value').textContent = 'N/A';
        document.getElementById('measured-age').textContent = '--';
    }
}

/**
 * Update PM value with AQI color coding
 * @param {string} elementId - Element ID to update
 * @param {number} value - PM value in μg/m³
 */
export function updatePMValue(elementId, value) {
    const el = document.getElementById(elementId);
    el.textContent = `${value.toFixed(1)} μg/m³`;

    // Remove existing color classes
    el.classList.remove('text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600', 'text-purple-600');

    // Apply AQI color based on PM2.5 levels
    if (value <= 12) {
        el.classList.add('text-green-600'); // Good
    } else if (value <= 35.4) {
        el.classList.add('text-yellow-600'); // Moderate
    } else if (value <= 55.4) {
        el.classList.add('text-orange-600'); // Unhealthy for sensitive
    } else if (value <= 150.4) {
        el.classList.add('text-red-600'); // Unhealthy
    } else {
        el.classList.add('text-purple-600'); // Very unhealthy
    }
}

/**
 * Update CO2 value with color coding based on indoor air quality thresholds
 * @param {string} elementId - Element ID to update
 * @param {number} value - CO2 value in ppm
 */
export function updateCO2Value(elementId, value) {
    const el = document.getElementById(elementId);
    el.textContent = `${Math.round(value)} ppm`;

    // Remove existing color classes
    el.classList.remove('text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600', 'text-purple-600');

    // Apply color based on CO2 levels
    if (value < CO2_THRESHOLDS.GOOD) {
        el.classList.add('text-green-600'); // Good (< 800 ppm)
    } else if (value < CO2_THRESHOLDS.MODERATE) {
        el.classList.add('text-yellow-600'); // Moderate (800-1000 ppm)
    } else if (value < CO2_THRESHOLDS.POOR) {
        el.classList.add('text-orange-600'); // Poor (1000-1500 ppm)
    } else {
        el.classList.add('text-red-600'); // Very poor (> 1500 ppm)
    }
}

/**
 * Get Tailwind color class for CO2 value (for table display)
 * @param {number} value - CO2 value in ppm
 * @returns {string} Tailwind CSS classes
 */
export function getCO2ColorClass(value) {
    if (value < CO2_THRESHOLDS.GOOD) {
        return 'text-green-600 font-semibold'; // Good (< 800 ppm)
    } else if (value < CO2_THRESHOLDS.MODERATE) {
        return 'text-yellow-600 font-semibold'; // Moderate (800-1000 ppm)
    } else if (value < CO2_THRESHOLDS.POOR) {
        return 'text-orange-600 font-semibold'; // Poor (1000-1500 ppm)
    } else {
        return 'text-red-600 font-semibold'; // Very poor (> 1500 ppm)
    }
}

/**
 * Format battery voltage for display with charging icon
 * @param {number} voltageMv - Battery voltage in millivolts
 * @param {boolean} charging - Whether battery is charging
 * @returns {string} Formatted HTML string with voltage and charging icon
 */
export function formatBatteryVoltage(voltageMv, charging) {
    const voltage = (voltageMv / 1000).toFixed(2);
    const chargingIcon = charging ? '<svg class="w-3 h-3 inline ml-1 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>' : '';
    return `${voltage}V${chargingIcon}`;
}

/**
 * Update battery display (inline status bar)
 * Uses battery voltage (mV) instead of percentage
 * @param {number} voltageMv - Battery voltage in millivolts
 * @param {boolean} charging - Whether battery is charging
 */
export function updateBattery(voltageMv, charging) {
    const batteryStatus = document.getElementById('battery-status-inline');
    const batteryPercent = document.getElementById('battery-percent-inline');
    const batteryCharging = document.getElementById('battery-charging-inline');
    const batteryFill = document.getElementById('battery-fill');

    const selectedDeviceSerial = state.get('selectedDeviceSerial');
    const connectedDeviceSerial = state.get('connectedDeviceSerial');

    // Only show battery if viewing the connected device
    if (selectedDeviceSerial !== connectedDeviceSerial) {
        return;
    }

    // Convert voltage to percentage (LiPo battery curve approximation)
    // 3.3V = 0%, 4.15V = 100% (matches firmware calculation)
    let level;
    if (voltageMv <= 3300) {
        level = 0;
    } else if (voltageMv >= 4150) {
        level = 100;
    } else {
        // Linear approximation between 3.3V and 4.15V
        level = Math.round(((voltageMv - 3300) / (4150 - 3300)) * 100);
    }

    // Show battery status with voltage in tooltip
    batteryStatus.classList.remove('hidden');
    batteryPercent.textContent = `${level}%`;
    batteryPercent.setAttribute('title', `${(voltageMv / 1000).toFixed(2)}V`);

    // Update charging indicator
    if (charging) {
        batteryCharging.classList.remove('hidden');
    } else {
        batteryCharging.classList.add('hidden');
    }

    // Update battery fill width (SVG rect width attribute)
    const fillWidth = (16 * level) / 100;  // 16 is the max width of the battery body
    batteryFill.setAttribute('width', fillWidth);

    // Update battery color based on level
    const batteryContainer = batteryStatus.querySelector('svg');
    batteryContainer.classList.remove('text-green-600', 'text-yellow-600', 'text-red-600');
    if (level > 50) {
        batteryContainer.classList.add('text-green-600');
    } else if (level > 20) {
        batteryContainer.classList.add('text-yellow-600');
    } else {
        batteryContainer.classList.add('text-red-600');
    }

    // Show/hide low battery warning (< 2%)
    const batteryWarning = document.getElementById('battery-warning');
    if (batteryWarning) {
        if (level < 2) {
            batteryWarning.classList.remove('hidden');
        } else {
            batteryWarning.classList.add('hidden');
        }
    }
}

/**
 * Update GPS display
 * @param {number} fix - GPS fix quality (0=no fix, 1+=valid)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
export function updateGPS(fix, lat, lon) {
    const gpsPanel = document.getElementById('gps-panel');
    const luxWidget = document.getElementById('lux-widget');

    if (gpsPanel) gpsPanel.classList.remove('hidden');
    if (luxWidget) luxWidget.classList.add('hidden');

    document.getElementById('gps-fix').textContent = formatGPSFix(fix);

    if (fix > 0 && lat !== undefined && lon !== undefined) {
        document.getElementById('gps-lat').textContent = lat.toFixed(7);
        document.getElementById('gps-lon').textContent = lon.toFixed(7);

        const mapLink = document.getElementById('gps-map-link');
        mapLink.href = createMapsURL(lat, lon);
        mapLink.classList.remove('hidden');
    } else {
        document.getElementById('gps-lat').textContent = '-';
        document.getElementById('gps-lon').textContent = '-';
        document.getElementById('gps-map-link').classList.add('hidden');
    }
}

/**
 * Update Lux display (TSL2591 light sensor)
 * @param {number} lux - Lux value
 */
export function updateLux(lux) {
    const gpsPanel = document.getElementById('gps-panel');
    const luxCard = document.getElementById('lux-card');

    if (gpsPanel) gpsPanel.classList.add('hidden');
    if (luxCard) luxCard.classList.remove('hidden');

    if (lux !== undefined) {
        document.getElementById('lux-value').textContent = `${lux.toFixed(1)} lux`;
    } else {
        document.getElementById('lux-value').textContent = '-- lux';
    }
}

/**
 * Update device time display
 * Displays device timestamp vs system time and calculates/shows time drift
 * @param {number} deviceTimestamp - Unix epoch timestamp from device
 */
export function updateDeviceTime(deviceTimestamp) {
    // Device time from firmware
    const deviceTime = new Date(deviceTimestamp * 1000);
    document.getElementById('device-time').textContent = deviceTime.toLocaleTimeString();

    // System time
    const systemTime = new Date();
    document.getElementById('system-time').textContent = systemTime.toLocaleTimeString();

    // Calculate drift
    const driftSeconds = Math.abs(deviceTime - systemTime) / 1000;
    const driftEl = document.getElementById('time-drift');

    if (driftSeconds < TIME_SYNC.DRIFT_THRESHOLD_SECONDS) {
        driftEl.textContent = 'Synced';
        driftEl.classList.remove('text-red-600');
        driftEl.classList.add('text-green-600');
    } else {
        driftEl.textContent = `±${driftSeconds.toFixed(0)}s`;
        driftEl.classList.remove('text-green-600');
        driftEl.classList.add('text-red-600');
    }
}
