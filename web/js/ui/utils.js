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
 * Get or create the toast container (fixed bottom-right)
 */
function getToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {'error'|'success'} type - Toast type
 * @param {number} duration - Auto-dismiss in ms (0 = manual dismiss only)
 */
function showToast(message, type, duration = 5000) {
    const container = getToastContainer();

    const colors = type === 'error'
        ? 'bg-red-50 border-red-200 text-red-800'
        : 'bg-green-50 border-green-200 text-green-800';

    const toast = document.createElement('div');
    toast.className = `flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg text-sm ${colors} transition-opacity duration-300`;
    toast.innerHTML = `<span class="flex-1">${message}</span><button class="ml-2 opacity-60 hover:opacity-100">&times;</button>`;

    toast.querySelector('button').addEventListener('click', () => dismiss());
    container.appendChild(toast);

    function dismiss() {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }

    if (duration > 0) {
        setTimeout(dismiss, duration);
    }
}

/**
 * Show error message as a toast notification
 * @param {string} message - Error message
 */
export function showError(message) {
    console.error(message);
    showToast(message, 'error');
}

/**
 * Show success message as a toast notification
 * @param {string} message - Success message
 */
export function showSuccess(message) {
    console.log(message);
    showToast(message, 'success', 3000);
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
