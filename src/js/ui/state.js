/**
 * UI State Management
 * Centralized state for all UI modules
 */

// UI state object
const state = {
    // Device state
    connectedDeviceSerial: null,  // Currently connected device via USB (null if none)
    selectedDeviceSerial: null,   // Currently selected device in UI (may not be connected)
    currentDeviceSerial: null,    // Serial number of currently connected device
    currentDeviceModel: null,     // Model name of currently connected device (e.g., "OAQ-1-2")
    currentLogType: null,         // LOG_TYPE.GPS, LOG_TYPE.TSL2591, or LOG_TYPE.CO2

    // Filters
    currentDeviceFilter: null,    // Current device filter selection (null = all devices)
    currentEventsTimeFilter: '7d', // Events time filter: '24h', '7d', '30d', 'all'

    // Control
    autoRefreshInterval: null,
    isDownloading: false,

    // Report
    reportStats: null,
    reportEventStats: null,
    reportGI2Status: null
};

/**
 * Get the full state object (for reading multiple values)
 * @returns {Object} The state object
 */
export function getState() {
    return state;
}

/**
 * Get a specific state value
 * @param {string} key - State key
 * @returns {*} State value
 */
export function get(key) {
    return state[key];
}

/**
 * Set a specific state value
 * @param {string} key - State key
 * @param {*} value - New value
 */
export function set(key, value) {
    state[key] = value;
}

/**
 * Update multiple state values at once
 * @param {Object} updates - Key-value pairs to update
 */
export function update(updates) {
    Object.assign(state, updates);
}

/**
 * Reset state to initial values (useful for disconnect)
 * @param {Array<string>} keys - Keys to reset, or all if not specified
 */
export function reset(keys = null) {
    const defaults = {
        connectedDeviceSerial: null,
        selectedDeviceSerial: null,
        currentDeviceSerial: null,
        currentDeviceModel: null,
        currentLogType: null,
        currentDeviceFilter: null,
        currentEventsTimeFilter: '7d',
        autoRefreshInterval: null,
        isDownloading: false,
        reportStats: null,
        reportEventStats: null,
        reportGI2Status: null
    };

    if (keys) {
        keys.forEach(key => {
            if (key in defaults) {
                state[key] = defaults[key];
            }
        });
    } else {
        Object.assign(state, defaults);
    }
}
