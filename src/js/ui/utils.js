/**
 * UI Utilities
 * Error handling, formatters, analytics (no dependencies on other UI modules to avoid circular imports)
 */

/** Track event safely - fails silently if offline or umami unavailable */
export function track(event, data) {
    try {
        if (typeof umami !== 'undefined') {
            umami.track(event, data);
        }
    } catch (e) {
        // Fail silently - analytics should never break the app
    }
}

/**
 * Format Unix timestamp to readable string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date/time string
 */
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}

/**
 * Escape HTML attributes to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export function escapeHtmlAttr(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Show error message (console only, no annoying alerts)
 * @param {string} message - Error message
 */
export function showError(message) {
    console.error('❌', message);
    // Could add a toast notification here in the future
}

/**
 * Show success message (console only, no annoying alerts)
 * @param {string} message - Success message
 */
export function showSuccess(message) {
    console.log('✅', message);
    // Sync/export success is already obvious from UI updates
}

/**
 * Wrap an async render function so only the latest invocation can write to the DOM.
 * The wrapped function receives a `stale()` checker as its first argument.
 * When a newer call starts, all prior calls' `stale()` returns true so they bail out.
 *
 * @param {Function} fn - async function(stale, ...args)
 * @returns {Function} wrapped async function(...args)
 */
export function latestOnly(fn) {
    let gen = 0;
    const wrapper = async function (...args) {
        const myGen = ++gen;
        return fn(() => myGen !== gen, ...args);
    };
    Object.defineProperty(wrapper, 'name', { value: fn.name });
    return wrapper;
}
