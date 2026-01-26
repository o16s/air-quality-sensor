# Octanis ICS - Developer Documentation

## Project Overview

This is a browser-based WebUSB interface for Octanis environmental sensors (STM32F303CCTx-based hardware). It enables direct USB communication with the sensor device without drivers, allowing users to view live sensor data and download historical logs stored in flash memory.

### Technology Stack

- **Vanilla JavaScript** (ES6 modules) - No build step required
- **Tailwind CSS** (via CDN) - Modern, responsive styling
- **WebUSB API** - Direct USB communication
- **IndexedDB** - Browser-based log storage
- **Vitest** - Unit testing framework

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
docs/
├── index.html              # Main UI
├── package.json            # Test dependencies only
├── vitest.config.js        # Test configuration
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── constants.js       # All configuration constants
│   ├── utils.js           # Shared utility functions
│   ├── protocol.js        # Firmware protocol & USB communication
│   ├── webusb.js          # USB device connection management
│   ├── storage.js         # IndexedDB wrapper
│   ├── ui.js              # UI updates and rendering
│   └── export.js          # CSV/JSON/GeoJSON export
└── __tests__/
    ├── setup.js           # Test mocks (WebUSB, IndexedDB, DOM)
    ├── webusb.test.js     # WebUSB tests
    ├── storage.test.js    # Storage tests (includes duplicate detection)
    ├── export.test.js     # Export tests
    └── utils.test.js      # Utils tests
```

### Module Responsibilities

| Module | Purpose | Key Functions |
|--------|---------|---------------|
| **constants.js** | Single source of truth for all configuration | USB constants, buffer layouts, error messages, device capacity |
| **utils.js** | Shared utilities used across modules | Device validation, buffer helpers, download helper, **duplicate detection** |
| **protocol.js** | Firmware protocol implementation | USB vendor requests, data parsing, erase logs |
| **webusb.js** | USB device lifecycle management | Connect, disconnect, auto-reconnect, callbacks |
| **storage.js** | IndexedDB persistence layer | Store/retrieve logs, queries, statistics, **duplicate prevention** |
| **ui.js** | User interface logic | Event handlers, data display, **widget configuration**, **capacity tracking** |
| **export.js** | Data export functionality | CSV, JSON, GeoJSON, statistics export |

### Data Flow

```
Hardware Device (USB)
    ↓
webusb.js (connection)
    ↓
protocol.js (vendor requests)
    ↓
Parsed Data
    ↓
├─→ ui.js (display)
├─→ storage.js (persist)
└─→ export.js (download)
```

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
- UI logic: Not tested (requires integration tests)

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

**Implementation**: See `decodeBatteryByte()` in `utils.js` and `updateBattery()` in `ui.js`

## Features

### Duplicate Detection & Smart Sync

**Problem**: Users could re-download the same logs multiple times, filling up browser storage with duplicates.

**Solution**: Intelligent duplicate detection that works even when device timestamps are incorrect.

**`utils.js` - `isDuplicateLog()` function:**
- **Exact match**: timestamp + deviceSerial (instant detection)
- **Fuzzy match**: ±2 second timestamp tolerance + sensor value comparison
  - Compares: temperature (±0.1°C), humidity (±0.5%), PM2.5 (±0.5), PM10 (±0.5)
  - Handles clock drift and timestamp errors
- Returns `true` if logs are duplicates

**`storage.js` - Enhanced `storeLogs()` function:**
```javascript
// Before storing, checks all existing logs for duplicates
const result = await storeLogs(logs, deviceSerial);
// Returns: { success, skipped, errors, total }
```

**`ui.js` - User feedback:**
```
"Downloaded 50 logs: 30 new, 20 duplicates skipped"
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

**Problem**: Different device types (GPS, TSL2591, CO2) need different sensor cards displayed. The previous approach of hiding/showing cards in multiple places was fragile.

**Solution**: Centralized widget configuration in `ui.js`:

```javascript
const WIDGET_CONFIG = {
    [LOG_TYPE.GPS]: {
        pm25: { visible: true, label: 'PM2.5', ... },
        pm10: { visible: true, label: 'PM10', ... },
        co2:  { visible: false },
        lux:  { visible: false }
    },
    [LOG_TYPE.TSL2591]: {
        pm25: { visible: true, ... },
        pm10: { visible: true, ... },
        co2:  { visible: false },
        lux:  { visible: true, label: 'Light', ... }
    },
    [LOG_TYPE.CO2]: {
        pm25: { visible: false },
        pm10: { visible: false },
        co2:  { visible: true, label: 'CO2', ... },
        lux:  { visible: true, label: 'Light', ... }
    }
};
```

**`configureWidgetsForLogType(logType)`** - Single function that:
- Shows/hides appropriate sensor cards
- Sets correct labels
- Clears stale sparkline canvases
- Called on device connect (after log type detection)
- Called on device disconnect (resets to GPS default)

**Key principle**: Widget visibility is set ONCE when device connects, not on every data update.

## Adding New Features

### Example: Adding a New Sensor Type

1. **Add constants** to `constants.js`:
```javascript
export const LOG_TYPE = {
    GPS: 0,
    TSL2591: 1,
    CO2: 2,
    NEW_TYPE: 3  // NEW
};

export const LOG_LAYOUT_NEW = {
    TEMPERATURE: { offset: 0, type: 'Int16', scale: 100 },
    // ... other fields
};
```

2. **Add parsing function** to `protocol.js`:
```javascript
function parseLogItemNew(data) {
    const view = new DataView(data.buffer);
    return {
        temperature: getBufferValue(view, LOG_LAYOUT_NEW.TEMPERATURE),
        // ... other fields
    };
}
```

3. **Update `readLogRecord()`** to handle new type:
```javascript
if (logType === LOG_TYPE.NEW_TYPE) {
    return parseLogItemNew(data);
}
```

4. **Add widget configuration** in `ui.js`:
```javascript
const WIDGET_CONFIG = {
    // ... existing configs ...
    [LOG_TYPE.NEW_TYPE]: {
        pm25: { visible: false },
        pm10: { visible: false },
        co2:  { visible: false },
        lux:  { visible: true },
        // Add new widget entries as needed
    }
};
```

5. **Update `updateLiveData()`** in `ui.js` to handle new sensor values

6. **Update export** in `export.js` for CSV/JSON headers

7. **Run tests**:
```bash
npm test
```

## Deployment

### GitHub Pages Setup

1. Enable Pages in repo settings
2. Source: `master` branch, `/docs` folder
3. Site will be at: `https://o16s.github.io/air-quality-sensor/`

### Local Development

```bash
# Serve locally
python3 -m http.server 8000
# or
npx http-server

# Visit http://localhost:8000
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
- Use utility functions from `utils.js`
- Write tests for new features
- Use buffer layout constants
- Keep functions small and focused
- Document complex logic

**DON'T**:
- Use magic numbers anywhere
- Duplicate logic across files
- Hardcode error messages
- Skip writing tests
- Modify buffer layouts without updating tests
- Use inline USB constants
- **Use emojis in UI text** - Emojis are forbidden in all user-facing text, labels, and headings

---

**Last Updated**: 2026-01-26
**Total Tests**: 116 passing
**Supported Log Formats**: GPS, TSL2591, CO2
