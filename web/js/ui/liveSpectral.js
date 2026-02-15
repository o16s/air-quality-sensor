/**
 * Spectral Chart Module
 * AS7341 12-channel bar chart display for live spectral data
 */

import { i18n } from '../shared/i18n.js';
import { DEVICE_TYPES } from '../shared/deviceTypes.js';

/**
 * Spectral display order: wavelength-sorted (violet-red), then broadband channels.
 * The registry stores channels in SMUX read order (F1-F4, Clear1, NIR1, F5-F8, Clear2, NIR2),
 * but a spectrometer display should read like a spectrum left-to-right.
 */
const SPECTRAL_DISPLAY_ORDER = (() => {
    const keys = [
        'f1_415nm', 'f2_445nm', 'f3_480nm', 'f4_515nm',
        'f5_555nm', 'f6_590nm', 'f7_630nm', 'f8_680nm',
        'clear1', 'nir1', 'clear2', 'nir2',
    ];
    const metricsByKey = Object.fromEntries(
        DEVICE_TYPES.SPECTRAL.metrics.map(m => [m.key, m])
    );
    return keys.map(key => metricsByKey[key]).filter(Boolean);
})();

/** Cache the last status so we can redraw on page switch without waiting for the next poll. */
let _lastSpectralStatus = null;

/**
 * Draw spectral bar chart on canvas showing 12 AS7341 channel intensities.
 * Channels are displayed in wavelength order (like a spectrometer), not SMUX order.
 * Skips drawing when the canvas is not visible (returns 0-size rect when page is hidden).
 * @param {Object} status - Status object with spectral channel keys
 */
export function updateSpectralChart(status) {
    _lastSpectralStatus = status;

    // Show loading overlay when all spectral channels are zero (no acquisition yet)
    const channels = SPECTRAL_DISPLAY_ORDER;
    const values = channels.map(m => status[m.key] ?? 0);
    const hasData = values.some(v => v > 0);

    if (!hasData) {
        setSpectralLoading(true, i18n.t('sync_acquiring'));
        return;
    }

    const canvas = document.getElementById('spectral-chart');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Canvas not laid out (page hidden) — keep/show loader until we can actually draw
    if (rect.width === 0 || rect.height === 0) {
        setSpectralLoading(true, i18n.t('sync_acquiring'));
        return;
    }

    setSpectralLoading(false);

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    const n = channels.length;
    const padding = 12;
    const barGap = 4;
    const labelHeight = 16;
    const valueHeight = 14;
    const chartTop = valueHeight + 2;
    const chartBottom = H - labelHeight;
    const chartH = chartBottom - chartTop;
    const barWidth = Math.max((W - 2 * padding - (n - 1) * barGap) / n, 4);

    const maxVal = Math.max(...values, 1);

    for (let i = 0; i < n; i++) {
        const x = padding + i * (barWidth + barGap);
        const val = values[i];
        const barH = (val / maxVal) * chartH;

        // Bar
        ctx.fillStyle = channels[i].color;
        ctx.fillRect(x, chartBottom - barH, barWidth, barH);

        // Value above bar
        ctx.fillStyle = '#374151';
        ctx.font = '10px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(val, x + barWidth / 2, chartBottom - barH - 3);

        // Label below bar
        ctx.fillStyle = '#6b7280';
        ctx.font = '9px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(channels[i].label, x + barWidth / 2, H - 2);
    }
}

/**
 * Show or hide the spectral chart loading overlay
 * @param {boolean} show - Whether to show the overlay
 * @param {string} [text] - Optional text to display in the overlay
 */
export function setSpectralLoading(show, text) {
    const overlay = document.getElementById('spectral-loading');
    if (!overlay) return;
    overlay.classList.toggle('hidden', !show);
    if (text) {
        document.getElementById('spectral-loading-text').textContent = text;
    }
}

/**
 * Redraw the spectral chart using cached data.
 * Called when switching back to the Overview page so the chart isn't blank
 * until the next auto-refresh tick.
 */
export function redrawSpectralChart() {
    if (_lastSpectralStatus) {
        updateSpectralChart(_lastSpectralStatus);
    }
}
