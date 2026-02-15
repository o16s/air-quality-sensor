# Octanis ICS - Developer Documentation

## Project Overview

This is a browser-based WebUSB interface for Octanis environmental sensors (STM32F303CCTx-based hardware). It enables direct USB communication with the sensor device without drivers, allowing users to view live sensor data and download historical logs stored in flash memory.

### Technology Stack

- **Vanilla JavaScript** (ES6 modules) - Vite build
- **Tailwind CSS** (v4) - Modern, responsive styling
- **WebUSB API** - Direct USB communication
- **IndexedDB** - Browser-based log storage
- **Vitest** - Unit testing framework
- **i18n** - Custom vanilla JS internationalization (EN/DE)

### Browser Compatibility

- Chrome 61+, Edge 79+, Opera 48+
- Safari, Firefox (no WebUSB support)

## Architecture

### UI States

The dashboard has three distinct states that control what content is displayed:

#### 1. Getting Started State (Initial Load)
**When:** User first visits the page, no device has ever been connected
**Displayed:**
- Connect button card with Octanis logo above button (centered)
- Blue "Getting Started" instructions box
- NO footer logo

**Elements:**
- `#connect-section` - shown
- `#instructions` - shown
- `#device-info` - hidden
- `#main-content` - hidden
- `#footer-logo` - hidden

#### 2. Connected State
**When:** Device is physically connected via USB and successfully paired
**Displayed:**
- Device info card (model image, name, status indicators)
- Live sensor data with sparklines
- Measurement history table
- Footer logo (bottom-right, 30% opacity)

**Elements:**
- `#connect-section` - hidden
- `#instructions` - hidden
- `#device-info` - shown
- `#main-content` - shown
- `#footer-logo` - shown

#### 3. Disconnected State
**When:** Device was connected but user clicked disconnect or device was unplugged
**Displayed:**
- Connect button card with logo (same as Getting Started)
- Blue "Getting Started" instructions
- Measurement history (if any logs were downloaded)
- NO footer logo

**Elements:**
- Same as Getting Started state
- Note: Previously downloaded data persists in IndexedDB and remains visible

**State Transitions:**
```
Getting Started → Connected: Click "Connect Device" and select device
Connected → Disconnected: Click eject button or device unplugged
Disconnected → Connected: Click "Connect Device" and select device
```

### File Structure

```
web/
├── index.html              # Main UI
├── package.json            # Dependencies + scripts
├── vite.config.js          # Vite build configuration
├── vitest.config.js        # Test configuration
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── constants.js       # Buffer layouts, thresholds, error messages, USB config
│   ├── deviceTypes.js     # Device type registry (single source of truth)
│   ├── i18n.js            # Internationalization (EN/DE translations)
│   ├── utils.js           # Shared utility functions
│   ├── protocol.js        # Firmware protocol & USB communication
│   ├── webusb.js          # USB device connection management
│   ├── storage.js         # IndexedDB wrapper
│   ├── export.js          # CSV/JSON/GeoJSON export
│   ├── events.js          # Air quality event detection (MAD + thresholds)
│   ├── heatmap.js         # Heatmap data generation
│   ├── report.js          # Report computation
│   └── ui/
│       ├── state.js       # Centralized UI state
│       ├── init.js        # App initialization, widget configuration
│       ├── connection.js  # USB connect/disconnect handlers
│       ├── liveData.js    # Live sensor value display
│       ├── logTable.js    # Measurement history table
│       ├── historyChart.js    # ECharts renderer
│       ├── historyChartUI.js  # Chart data fetching/aggregation
│       ├── sparklines.js  # Sparkline canvas rendering
│       ├── heatmapUI.js   # Heatmap visualization
│       ├── eventsUI.js    # Events timeline display
│       ├── deviceSwitcher.js  # Device selection dropdown
│       ├── modals.js      # Settings & edit device modals
│       ├── export.js      # Export button handlers
│       ├── reportUI.js    # Report page UI
│       ├── sync.js        # Auto-refresh, download logs, time sync
│       └── utils.js       # UI-specific helpers
├── img/                   # Device images
└── __tests__/
    ├── setup.js           # Test mocks (WebUSB, IndexedDB, DOM)
    ├── deviceTypes.test.js # Device type registry tests
    ├── utils.test.js      # Utils tests (includes duplicate detection)
    ├── webusb.test.js     # WebUSB tests
    ├── storage.test.js    # Storage tests
    ├── export.test.js     # Export tests
    ├── events.test.js     # Event detection tests
    ├── report.test.js     # Report tests
    └── heatmap.test.js    # Heatmap tests
```

### Module Responsibilities

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| **constants.js** | Buffer layouts, thresholds, USB config, error messages | `LOG_TYPE`, `AIR_QUALITY_THRESHOLDS`, `SPARKLINE_THRESHOLDS` |
| **deviceTypes.js** | Device type registry — single source of truth for what each sensor type produces | `DEVICE_TYPES`, `getDeviceTypeById()`, `getAllKnownMetrics()`, `getMetricColorsMap()` |
| **i18n.js** | Internationalization (EN/DE) | `i18n.t()`, `setLanguage()`, `translatePage()` |
| **utils.js** | Shared utilities used across modules | Device validation, buffer helpers, download helper, **duplicate detection** |
| **protocol.js** | Firmware protocol implementation | USB vendor requests, data parsing, erase logs |
| **webusb.js** | USB device lifecycle management | Connect, disconnect, auto-reconnect, callbacks |
| **storage.js** | IndexedDB persistence layer | Store/retrieve logs, queries, statistics, **duplicate prevention**, device metadata |
| **export.js** | Data export functionality | CSV, JSON, GeoJSON, statistics export (registry-driven) |
| **events.js** | Air quality event detection | MAD-based anomaly detection, threshold violations |
| **ui/state.js** | Centralized UI state | `connectedDeviceSerial`, `selectedDeviceSerial`, `currentLogType` |
| **ui/init.js** | App initialization, widget configuration | `configureWidgetsForLogType()` (registry-driven) |

### Data Flow

```
Hardware Device (USB)
    ↓
webusb.js (connection)
    ↓
protocol.js (parse binary → flat JS object)
    ↓
Flat log record: {timestamp, deviceSerial, logType, temperature, humidity, pm25, ...}
    ↓
├─→ storage.js (persist to IndexedDB as-is)
├─→ ui/ modules (display — driven by deviceTypes.js registry)
└─→ export.js (download — columns from deviceTypes.js registry)
```

## Data Model

### Device Type Registry (`deviceTypes.js`)

The single source of truth for "what does each sensor type produce." Three device types, each identified by a `LOG_TYPE` integer set at firmware compile time:

| Type | ID | Metrics | Extra Fields |
|------|----|---------|--------------|
| **GPS** | 0 | temperature, humidity, pm25, pm10 | lat, lon, fix |
| **TSL2591** | 1 | temperature, humidity, pm25, pm10, lux | tslCH0, tslCH1, overflow |
| **CO2** | 2 | temperature, humidity, co2, pressure, gasResistance, lux | *(none)* |

**Metrics** are plottable sensor values that appear in charts, sparklines, tables, and exports. Each metric definition carries: `key`, `label`, `unit`, `color`, `precision`, `i18nKey`, `csvHeader`, `csvPrecision`, `valueId`, `sparklineId`, `cardId`.

**Extra fields** are non-metric data included in exports but not charted (GPS coordinates, TSL raw channels).

Every downstream module asks the registry what to do with a log record instead of hardcoding field names:
- **Widget visibility** — shows cards for metrics on the device type, hides the rest
- **Live data** — updates only values the device type declares
- **Sparklines** — renders sparklines for each metric with a `SPARKLINE_THRESHOLDS` entry
- **Charts** — aggregates all metrics found in data; registry provides colors, units, labels
- **Tables** — columns built from `deviceType.metrics`
- **CSV/JSON export** — headers and row values from `deviceType.metrics` + `deviceType.extraFields`
- **Events/Heatmap** — operates on "detectable" metrics (`getDetectableMetrics()`) — those with `AIR_QUALITY_THRESHOLDS`
- **Duplicate detection** — exact match on `timestamp` + `deviceSerial`

### IndexedDB Schema

Three object stores, currently at DB version 3. **No version bump is needed when adding new device types** — the stores are schemaless for record content.

| Store | keyPath | Indexes | Purpose |
|-------|---------|---------|---------|
| `logs` | `id` (auto-increment) | `timestamp`, `deviceSerial`, `['deviceSerial', 'timestamp']` | Measurement records |
| `deviceMetadata` | `serial` | *(none)* | One record per physical device |
| `reportLocations` | `id` | *(none)* | Report building/room data |

**Log records** are flat JavaScript objects stored as-is. The parser in `protocol.js` returns `{timestamp, temperature, humidity, pm25, ...}` for GPS or `{timestamp, temperature, humidity, co2, pressure, ...}` for CO2 — whatever fields the parser produced. IndexedDB stores all properties without validation. The indexes are on fields common to all log types (`timestamp`, `deviceSerial`), so queries work regardless of which sensor-specific fields are present.

**Device metadata** records: `{serial, name, tags, model, deviceType, updatedAt}`. The `deviceType` field (LOG_TYPE integer) is persisted when a device connects, so the UI can identify offline devices without scanning their logs.

### UI State (`ui/state.js`)

Two device serial concepts:
- `connectedDeviceSerial` — the device physically on USB right now (null if none)
- `selectedDeviceSerial` — the device the UI is showing (can be an offline device with stored data)

Other state: `currentDeviceModel`, `currentLogType`, `currentEventsTimeFilter`, `autoRefreshInterval`, `isDownloading`, report stats.

## Code Guidelines

### 1. Constants Management

**Rule**: All magic numbers, configuration, and error messages MUST be in `constants.js`

```javascript
// BAD: Magic numbers
view.setInt16(0, 23500, true);
throw new Error('Device not connected');

// GOOD: Use constants
import { STATUS_LAYOUT, ERRORS } from './constants.js';
setBufferValue(view, STATUS_LAYOUT.TEMPERATURE, temp);
throw new Error(ERRORS.DEVICE_NOT_CONNECTED);
```

### 2. Don't Repeat Yourself (DRY)

**Rule**: Extract repeated logic into `utils.js` or shared functions

```javascript
// BAD: Repeated validation
if (!device || !device.opened) {
    throw new Error('Device not connected');
}

// GOOD: Use utility
import { validateDevice } from './utils.js';
validateDevice(device);
```

### 3. Buffer Operations

**Rule**: Use buffer layout constants and helper functions

```javascript
// BAD: Hardcoded offsets
view.setInt16(0, temp * 1000, true);
view.setUint16(2, humidity * 1000, true);

// GOOD: Use layout and helpers
import { STATUS_LAYOUT } from './constants.js';
import { setBufferValue } from './utils.js';
setBufferValue(view, STATUS_LAYOUT.TEMPERATURE, temp);
setBufferValue(view, STATUS_LAYOUT.HUMIDITY, humidity);
```

### 4. Error Handling

**Rule**: Use centralized error messages from constants

```javascript
// BAD: Inline error strings
throw new Error('WebUSB is not supported in this browser');

// GOOD: Use ERRORS constant
import { ERRORS } from './constants.js';
throw new Error(ERRORS.WEBUSB_NOT_SUPPORTED);
```

### 5. File Downloads

**Rule**: Use `downloadFile()` utility for all exports

```javascript
// BAD: Duplicate download logic
const blob = new Blob([content], { type: mimeType });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
// ... more boilerplate

// GOOD: Use utility
import { downloadFile } from './utils.js';
import { EXPORT_FILENAMES, MIME_TYPES } from './constants.js';
downloadFile(content, EXPORT_FILENAMES.CSV, MIME_TYPES.CSV);
```

### 6. Testing Requirements

**Rule**: All new functions MUST have corresponding tests

```javascript
// When adding a new export function:
// 1. Add function to export.js
// 2. Add test to __tests__/export.test.js
// 3. Run: npm test
// 4. Ensure coverage doesn't drop
```

## Testing

### Running Tests

```bash
npm test              # Run once
npm run test:watch    # Watch mode (auto-rerun on changes)
npm run test:coverage # Coverage report
npm run test:ui       # Interactive UI
```

### Test Coverage Goals

- Core modules (storage, webusb, export): **>80%**
- Utility functions: **>80%**
- UI logic: Covered by Electron integration tests (see below)

### Electron Integration Tests (run after large changes)

```bash
# 1. Build the web app
cd web && npm run build

# 2. Kill stale Electron instances
pkill -f "electron ." || true

# 3. Launch with CDP debugging + run smoke test
cd desktop-app && npx electron . --remote-debugging-port=9222 &
sleep 3 && npm run test:integration

# 4. Cleanup
pkill -f "electron ." || true
```

Verifies: app loads without console errors, all nav elements exist, page navigation works. See `desktop-app/guides/integration_testing.md` for details.

### Writing Tests

Follow the pattern in existing test files:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { functionToTest } from '../js/module.js';

describe('Module - Feature', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do expected behavior', () => {
    const result = functionToTest(input);
    expect(result).toBe(expected);
  });
});
```

## Firmware Protocol

### USB Device Configuration

```javascript
VID: 0x0483  // STMicroelectronics
PID: 0x5740  // CDC Virtual COM Port
Vendor Code: 0x22
```

### Commands

| Command | Code | Direction | Size | Description |
|---------|------|-----------|------|-------------|
| GET_STATUS | 0x00 | IN | 24 bytes | Current sensor readings |
| GET_LOG_COUNT | 0x01 | IN | 2 bytes | Number of stored logs |
| GET_URL | 0x02 | IN | variable | WebUSB landing page URL |
| READ_LOG | 0x03 | IN | 24 bytes | Single log record |
| ERASE_LOGS | 0x04 | IN | 1 byte | Erase all logs (wValue=0xDEAD) |
| GET_VERSION | 0x05 | IN | 32 bytes | Firmware version string |
| GET_TEST_RESULTS | 0x06 | IN | 64 bytes | Unity test framework results |
| GET_PRINT_BUFFER | 0x07 | IN | 64 bytes | Debug print buffer |
| SET_TIME | 0x08 | OUT | 4 bytes | Set device RTC (Host-to-Device) |
| ACQUIRE | 0x09 | OUT | 0 bytes | Trigger sensor measurement |
| GET_LOG_TYPE | 0x0A | IN | 1 byte | Get log format type |

### SET_TIME Command (0x08)

**Special**: This is a **Host-to-Device OUT transfer** (all others are IN transfers)

**Sends 4 bytes**: uint32_t Unix epoch timestamp (little-endian)

**Control Transfer Parameters**:
- `bmRequestType`: `0x40` (Host-to-Device, Vendor, Device)
- `bRequest`: `0x22` (WebUSB vendor code)
- `wIndex`: `0x08` (SET_TIME command)
- `wValue`: `0` (unused)
- `wLength`: `4` (sending 4 bytes)

**Usage**: Automatically called when device connects to sync device time with system time.

### GET_LOG_TYPE Command (0x0A)

**Purpose**: Detects which log format the device uses

**Returns**: 1 byte
- `0x00` = GPS format (latitude, longitude, GPS fix)
- `0x01` = TSL2591 format (lux, CH0, CH1, overflow)
- `0x02` = CO2 format (CO2 ppm, pressure, gas resistance)

**Usage**: Call once when device connects to determine how to parse log records.

**Example**:
```javascript
const logType = await getLogType(device);
if (logType === LOG_TYPE.GPS) {
    // Parse logs with GPS fields (lat/lon/fix)
} else if (logType === LOG_TYPE.TSL2591) {
    // Parse logs with light sensor fields (lux/ch0/ch1/overflow)
} else if (logType === LOG_TYPE.CO2) {
    // Parse logs with CO2 fields (co2/pressure/gasResistance)
}
```

**Note**: Log format is determined at firmware compile time and cannot change without reflashing. All logs on a device use the same format.

### Buffer Layouts

Defined in `constants.js`:

- **`STATUS_LAYOUT`** - 24-byte GPS status response
- **`STATUS_LAYOUT_TSL`** - 24-byte TSL2591 status response
- **`STATUS_LAYOUT_CO2`** - 24-byte CO2 status response
- **`LOG_LAYOUT`** - 24-byte GPS log record
- **`LOG_LAYOUT_TSL`** - 24-byte TSL2591 log record
- **`LOG_LAYOUT_CO2`** - 24-byte CO2 log record

Each layout specifies: offset, type (Int16/Uint16/etc), scale factor

**Key differences by format**:
- **GPS**: Contains latitude, longitude, GPS fix quality
- **TSL2591**: Contains lux, CH0/CH1 raw counts, overflow flag, PM2.5/PM10
- **CO2**: Contains CO2 ppm, pressure (hPa), gas resistance (ohms), lux

### Battery Encoding & Percentage Calculation

**Packed Format** (1 byte in GET_STATUS and all log formats):
- Bit 7: Charging flag (0=not charging, 1=charging)
- Bits 6-0: Voltage encoding (0-127 steps)
- Formula: `voltage_mv = (byte & 0x7F) * 20 + 3000`

**Percentage Calculation** (aligned with firmware):
- **3300mV = 0%** (LiPo cutoff voltage)
- **4150mV = 100%** (LiPo fully charged)
- Linear interpolation between 3300-4150mV
- Formula: `percentage = (voltage_mv - 3300) * 100 / (4150 - 3300)`

**Implementation**: See `decodeBatteryByte()` in `utils.js` and `updateBattery()` in `ui/liveData.js`

## Features

### Duplicate Detection & Smart Sync

**Problem**: Users could re-download the same logs multiple times, filling up browser storage with duplicates.

**Solution**: Exact-match duplicate detection using timestamp + deviceSerial. Device timestamps are reliable (synced on connect via SET_TIME), so fuzzy matching is unnecessary and risks false positives on consecutive readings with similar values.

**`utils.js` - `isDuplicateLog()` function:**
- Compares `deviceSerial` and `timestamp` — both must match exactly
- Returns `true` if records are duplicates

**`storage.js` - `storeLogs()` function:**
```javascript
// Before storing, checks all existing logs for duplicates
const result = await storeLogs(logs, deviceSerial);
// Returns: { success, skipped, errors, total }
```

### Device Capacity Tracking & Erase

**`constants.js` - Device capacity:**
```javascript
export const DEVICE_CAPACITY = {
    MAX_LOG_CAPACITY: 4680,      // Maximum log records
    ERASE_MAGIC_VALUE: 0xDEAD    // Safety parameter for erase
};
```

**`ui.js` - Capacity display:**
- Located in **Device Info box** (top of page)
- Shows: "512 / 4680 (10.9%)"
- Progress bar with color coding:
  - Blue: <50% full
  - Yellow: 50-75% full
  - Orange: 75-90% full
  - Red: >90% full
- Updates automatically after downloads/erases

**`ui.js` - Erase button:**
- Located in Device Settings modal
- **Double confirmation** dialog for safety
- Updates capacity display after erase

### Serial Number Column

Added "Serial" column to log table for tracking logs from multiple devices.

### Widget Configuration System

**Problem**: Different device types (GPS, TSL2591, CO2) need different sensor cards displayed.

**Solution**: `configureWidgetsForLogType(logType)` in `ui/init.js` is driven by the device type registry. It iterates `getAllKnownMetrics()` and shows cards for metrics present on the device type, hides the rest.

- No separate `WIDGET_CONFIG` object — visibility is derived from `deviceType.metrics`
- Each metric in the registry has a `cardId` (e.g. `'co2-card'`) for toggling visibility
- `pm25`/`pm10` cards use the `closest('.sensor-card')` pattern instead of a fixed card ID
- Temperature and humidity cards are always visible (no `cardId`, never toggled)
- All sparkline canvases are cleared on device type change to prevent stale data
- Called on device connect (after log type detection) and disconnect (resets to GPS default)

**Key principle**: Widget visibility is set ONCE when device connects, not on every data update.

### Internationalization (i18n)

**Languages**: English (default), Swiss German (Schweizer Hochdeutsch)

**Architecture**:
- `i18n.js` - Core module with I18n class and ~170 translation keys
- Static HTML: `data-i18n="key"` attributes, translated on page load
- Dynamic JS: `i18n.t('key', {params})` for runtime strings
- Language switcher in footer, persists to localStorage, page reloads on change

**Key Design Decisions**:
- Flat key structure: `nav_overview` not `nav.overview`
- `{{variable}}` interpolation syntax
- Pluralization with `_one`/`_other` suffixes
- Page reload on language change (no runtime re-rendering)
- Swiss German uses `ss` instead of `ß`, proper umlauts (ä, ö, ü)
- BAFU-compliant terminology for environmental metrics

**Usage in Static HTML**:
```html
<span data-i18n="nav_overview">Overview</span>
<input data-i18n-placeholder="search_placeholder">
<button data-i18n-title="tooltip_key" title="Default tooltip">
```

**Usage in JavaScript**:
```javascript
import { i18n } from '../i18n.js';

// Simple translation
i18n.t('nav_overview')  // "Overview" or "Übersicht"

// With interpolation
i18n.t('sync_progress', { current: 10, total: 50 })  // "10 / 50"

// Pluralization (automatic based on count)
i18n.t('measurements', { count: 1 })   // "1 measurement"
i18n.t('measurements', { count: 5 })   // "5 measurements"
```

**Adding New Translation Keys**:
1. Add key to both `en` and `de` objects in `i18n.js`
2. Use descriptive flat key names: `category_item` or `category_subcategory_item`
3. For plurals, add both `key_one` and `key_other` variants
4. Missing keys log `console.warn` and return the key name as fallback

## Adding New Features

### Adding a New Sensor Type

Only 3 files need changes. Everything else (charts, tables, exports, sparklines, heatmap, events, widgets, duplicate detection) picks it up automatically from the device type registry.

1. **Add constants** to `constants.js`:
```javascript
export const LOG_TYPE = {
    GPS: 0,
    TSL2591: 1,
    CO2: 2,
    RADAR: 3  // NEW
};

export const LOG_LAYOUT_RADAR = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 100 },
    // ... other fields
};
```

2. **Add parsing function** to `protocol.js`:
```javascript
function parseLogItemRadar(data) {
    const view = new DataView(data.buffer);
    return {
        temperature: getBufferValue(view, LOG_LAYOUT_RADAR.TEMPERATURE),
        // ... other fields
    };
}
```
Update `readLogRecord()` and `getDeviceStatus()` to dispatch on the new type.

3. **Add device type entry** to `deviceTypes.js`:
```javascript
// Add metric definitions for any new metrics (e.g., radarDistance)
// Then add to DEVICE_TYPES:
RADAR: {
    id: LOG_TYPE.RADAR,
    name: 'Radar',
    metrics: [
        METRIC_DEFS.temperature,
        METRIC_DEFS.humidity,
        METRIC_DEFS.radarDistance,  // new metric
    ],
    extraFields: [],
}
```

4. **Add HTML cards** in `index.html` for any new metric types (with matching `cardId`, `valueId`, `sparklineId` from the metric definition).

5. **Run tests**: `npm test`

**Zero changes needed to**: charts, tables, exports, sparklines, heatmap, events, widgets, state, duplicate detection.

**No IndexedDB schema change needed** — log records are flat JS objects stored as-is. New fields are just extra properties on the object.

## Deployment

### GitHub Pages Setup

Deployed via GitHub Actions (`.github/workflows/deploy-pages.yml`). On push to `master`, the workflow builds `web/dist` and deploys to GitHub Pages.

Site: `https://o16s.github.io/air-quality-sensor/`

**Setup**: repo Settings > Pages > Source: "GitHub Actions"

### Local Development

```bash
cd web
npm install
npm run dev    # Vite dev server with HMR
npm run build  # Production build to dist/
npm test       # Run all tests
```

## Troubleshooting

### WebUSB Not Working

1. Ensure using Chrome/Edge (not Safari/Firefox)
2. Check HTTPS requirement (localhost is OK)
3. Verify device is not in use by another app
4. Check browser console for specific errors

### Buffer Parsing Issues

1. Verify buffer size matches layout
2. Check scale factors in constants
3. Ensure little-endian byte order

### Seeing "N/A" or No Data

If UI shows "N/A" for sensor values:

1. **Check device connection**: Click "Connect Device" and select your sensor
2. **Check firmware implementation**: Does your firmware implement the WebUSB commands?
   - GET_STATUS (0x00) - Required for live sensor data
   - GET_LOG_COUNT (0x01) - Required for log count
   - GET_VERSION (0x05) - Required for firmware version
3. **Check browser console** (F12):
   - Look for error messages about control transfers
   - Check for "Failed to read sensor data" errors

## Best Practices Summary

**DO**:
- Put all constants in `constants.js`
- Define new metrics/device types in `deviceTypes.js` — never hardcode metric lists in UI modules
- Use utility functions from `utils.js`
- Write tests for new features
- Use buffer layout constants
- Keep functions small and focused
- Document complex logic
- Use `i18n.t()` for all user-facing strings in JavaScript
- Add `data-i18n` attributes for static HTML text

**DON'T**:
- Use magic numbers anywhere
- Duplicate metric lists across files — use registry helpers (`getAllKnownMetrics()`, `getDetectableMetrics()`, etc.)
- Hardcode `if (logType === CO2)` branches — use `getDeviceTypeById()` and loop over `deviceType.metrics`
- Hardcode error messages
- Skip writing tests
- Modify buffer layouts without updating tests
- Use inline USB constants
- Hardcode user-facing strings in JavaScript (use `i18n.t()` instead)
- **Use emojis in UI text** - Emojis are forbidden in all user-facing text, labels, and headings

---

**Last Updated**: 2026-02-12
**Total Tests**: 178 passing
**Supported Log Formats**: GPS, TSL2591, CO2
