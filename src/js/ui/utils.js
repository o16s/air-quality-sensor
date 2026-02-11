/**
 * UI Utilities
 * Error handling and formatters (no dependencies on other UI modules to avoid circular imports)
 */

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
