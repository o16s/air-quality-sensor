/**
 * Shared Utility Functions
 * Common helpers used across multiple modules
 */

import { ERRORS } from './constants.js';

/**
 * Validate that a device is connected and ready
 * @param {USBDevice} device - The USB device to validate
 * @throws {Error} If device is not connected or not opened
 */
export function validateDevice(device) {
    if (!device || !device.opened) {
        throw new Error(ERRORS.DEVICE_NOT_CONNECTED);
    }
}

/**
 * Async delay helper
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute a function with automatic fallback to mock data
 * Centralizes the mock/real data pattern used throughout protocol.js
 *
 * @param {USBDevice} device - The USB device
 * @param {Function} realFn - Function to execute with real device (receives device)
 * @param {Function} mockFn - Function to execute for mock data (no args)
 * @param {boolean} useMockData - Whether to use mock data
 * @param {Function} setMockMode - Function to set mock mode (receives boolean)
 * @returns {Promise<any>} Result from either real or mock function
 */
export async function executeWithMockFallback(device, realFn, mockFn, useMockData, setMockMode) {
    if (useMockData) {
        return await mockFn();
    }

    try {
        return await realFn(device);
    } catch (error) {
        console.warn('Operation failed, falling back to mock data:', error.message);
        setMockMode(true);
        return await mockFn();
    }
}

/**
 * Set a value in a DataView buffer using layout configuration
 * @param {DataView} view - The DataView to write to
 * @param {Object} layout - Layout config with offset, type, and scale
 * @param {number} value - The value to write
 */
export function setBufferValue(view, layout, value) {
    const scaledValue = Math.round(value * layout.scale);
    const method = `set${layout.type}`;

    if (typeof view[method] !== 'function') {
        throw new Error(`Invalid buffer type: ${layout.type}`);
    }

    // Use little-endian for multi-byte values
    const littleEndian = layout.type !== 'Uint8' && layout.type !== 'Int8';
    view[method](layout.offset, scaledValue, littleEndian);
}

/**
 * Get a value from a DataView buffer using layout configuration
 * @param {DataView} view - The DataView to read from
 * @param {Object} layout - Layout config with offset, type, and scale
 * @returns {number} The unscaled value
 */
export function getBufferValue(view, layout) {
    const method = `get${layout.type}`;

    if (typeof view[method] !== 'function') {
        throw new Error(`Invalid buffer type: ${layout.type}`);
    }

    // Use little-endian for multi-byte values
    const littleEndian = layout.type !== 'Uint8' && layout.type !== 'Int8';
    const rawValue = view[method](layout.offset, littleEndian);

    return rawValue / layout.scale;
}

/**
 * Create a structured buffer from a layout and data object
 * @param {Object} layout - Layout configuration object
 * @param {Object} data - Data object with values matching layout keys
 * @param {number} bufferSize - Size of buffer to create
 * @returns {Uint8Array} The populated buffer
 */
export function createBuffer(layout, data, bufferSize) {
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);

    Object.entries(layout).forEach(([key, config]) => {
        const value = data[key.toLowerCase()];
        if (value !== undefined) {
            setBufferValue(view, config, value);
        }
    });

    return new Uint8Array(buffer);
}

/**
 * Parse a buffer into an object using a layout configuration
 * @param {Uint8Array} data - The buffer data to parse
 * @param {Object} layout - Layout configuration object
 * @returns {Object} Parsed data object
 */
export function parseBuffer(data, layout) {
    const view = new DataView(data.buffer);
    const result = {};

    Object.entries(layout).forEach(([key, config]) => {
        result[key.toLowerCase()] = getBufferValue(view, config);
    });

    return result;
}

/**
 * Download data as a file in the browser
 * Common pattern used across all export functions
 *
 * @param {string} content - The file content
 * @param {string} filename - The filename to use
 * @param {string} mimeType - The MIME type
 */
export function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

/**
 * Format a GPS fix quality code as a human-readable string
 * @param {number} fix - GPS fix quality (0-2)
 * @returns {string} Human-readable fix quality
 */
export function formatGPSFix(fix) {
    const labels = {
        0: 'No Fix',
        1: 'GPS',
        2: 'DGPS'
    };
    return labels[fix] || 'Unknown';
}

/**
 * Create a Google Maps URL from coordinates
 * @param {number} lat - Latitude in degrees
 * @param {number} lon - Longitude in degrees
 * @returns {string} Google Maps URL
 */
export function createMapsURL(lat, lon) {
    return `https://www.google.com/maps?q=${lat},${lon}`;
}

/**
 * Get the current Unix timestamp in seconds
 * @returns {number} Unix timestamp
 */
export function getCurrentTimestamp() {
    return Math.floor(Date.now() / 1000);
}

/**
 * Convert boolean to number (for buffer storage)
 * @param {boolean} value - Boolean value
 * @returns {number} 1 for true, 0 for false
 */
export function boolToNumber(value) {
    return value ? 1 : 0;
}

/**
 * Convert number to boolean (from buffer storage)
 * @param {number} value - Numeric value
 * @returns {boolean} true if non-zero
 */
export function numberToBool(value) {
    return value !== 0;
}
