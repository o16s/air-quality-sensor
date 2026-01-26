/**
 * UI Management and Updates
 * Main entry point - imports modules and exports initUI
 *
 * Module structure:
 * - state.js       → Centralized state management
 * - init.js        → Initialization, widget config, page switching
 * - connection.js  → USB connection lifecycle
 * - deviceSwitcher.js → Device selection dropdown
 * - liveData.js    → Sensor value display updates
 * - sync.js        → Auto-refresh, log downloads
 * - logTable.js    → Measurement history table
 * - eventsUI.js    → Events timeline display
 * - heatmapUI.js   → Heatmap visualization
 * - sparklines.js  → Sparkline charts
 * - reportUI.js    → Report page functions
 * - modals.js      → Settings & device edit modals
 * - utils.js       → Error handling, formatters
 * - export.js      → CSV/JSON export handlers
 */

// Re-export initUI from init module
export { initUI } from './ui/init.js';
