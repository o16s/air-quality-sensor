/**
 * UI State Management
 * Reactive state using nanostores — widgets subscribe to keys they care about
 */

import { map, atom } from 'nanostores';

/** Default state values (used by reset) */
const DEFAULTS = {
    connectedDeviceSerial: null,  // Currently connected device via USB (null if none)
    selectedDeviceSerial: null,   // Currently selected device in UI (may not be connected)
    historyDeviceSerial: null,    // Device filter for History page (decoupled from Overview)
    currentDeviceModel: null,     // Model name of currently connected device (e.g., "OAQ-1-2")
    currentLogType: null,         // LOG_TYPE.GPS, LOG_TYPE.TSL2591, or LOG_TYPE.CO2
    currentEventsTimeFilter: '7d', // Events time filter: '24h', '7d', '30d', 'all'
    autoRefreshInterval: null,
    isDownloading: false,
    reportStats: null,
    reportEventStats: null,
    reportGI2Status: null,
};

/** Main UI state — same keys as before, now reactive */
export const $state = map({ ...DEFAULTS });

/**
 * Bumped when new data is stored (log download, clear, etc.)
 * Widgets subscribe to refresh themselves.
 */
export const $dataVersion = atom(0);

/** Increment $dataVersion to notify data-dependent widgets */
export function bumpDataVersion() {
    $dataVersion.set($dataVersion.get() + 1);
}

// ── Backwards-compatible helpers (thin wrappers) ──────────────────────

/**
 * Get a specific state value
 * @param {string} key
 * @returns {*}
 */
export function get(key) {
    return $state.get()[key];
}

/**
 * Get the full state object
 * @returns {Object}
 */
export function getState() {
    return $state.get();
}

/**
 * Set a specific state value (fires subscriptions)
 * @param {string} key
 * @param {*} value
 */
export function set(key, value) {
    $state.setKey(key, value);
}

/**
 * Update multiple state values at once
 * @param {Object} updates
 */
export function update(updates) {
    const current = $state.get();
    $state.set({ ...current, ...updates });
}

/**
 * Reset state to initial values
 * @param {Array<string>|null} keys - Keys to reset, or all if not specified
 */
export function reset(keys = null) {
    if (keys) {
        for (const key of keys) {
            if (key in DEFAULTS) {
                $state.setKey(key, DEFAULTS[key]);
            }
        }
    } else {
        $state.set({ ...DEFAULTS });
    }
}
