# CCC Sensor WebUSB Interface

A browser-based interface for the CCC environmental sensor device using the WebUSB API.

## Features

- **Real-time Monitoring**: View live sensor data (temperature, humidity, PM2.5, PM10)
- **GPS Tracking**: Display GPS coordinates and fix quality
- **Battery Status**: Monitor battery level and charging state
- **Data Logging**: Download and store historical sensor logs
- **Data Export**: Export logs to CSV or JSON formats
- **No Drivers Required**: Direct USB communication via WebUSB API

## Browser Compatibility

This webapp requires **WebUSB API** support:

- ✅ Chrome 61+
- ✅ Edge 79+
- ✅ Opera 48+
- ❌ Safari (not supported)
- ❌ Firefox (not supported)

## Getting Started

### 1. Deploy to GitHub Pages

This webapp is designed to be hosted on GitHub Pages:

1. Push this repository to GitHub
2. Go to **Settings** → **Pages**
3. Select **Source**: `master` branch, `/docs` folder
4. Save and wait for deployment
5. Access your site at: `https://o16s.github.io/air-quality-sensor/`

### 2. Local Testing

For local development, you can use any HTTP server:

```bash
# Using Python
cd docs
python3 -m http.server 8000

# Using Node.js
npx http-server docs

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

**Note**: WebUSB works on `localhost` even without HTTPS, but requires HTTPS for production deployment.

## Usage

### Connecting Your Device

1. Connect your CCC Sensor via USB
2. Open the webapp in Chrome or Edge
3. Click **"Connect Device"**
4. Select your device from the browser dialog (look for "STM32 Virtual ComPort")
5. Click **"Connect"**

### Viewing Live Data

Once connected, the dashboard will automatically:
- Display current sensor readings
- Update every 10 seconds
- Show battery status and GPS information
- Display connection status

### Downloading Logs

1. Click **"Download All Logs"** to retrieve historical data from the device
2. Progress will be shown during download
3. Logs are stored in your browser's IndexedDB for persistence
4. View recent logs in the table below

### Exporting Data

- **CSV**: Click "Export CSV" for spreadsheet-compatible format
- **JSON**: Click "Export JSON" for structured data with metadata

### Managing Storage

- **Browser Storage**: Shows how many logs are stored locally
- **Clear Logs**: Removes all logs from browser storage (device logs are unaffected)

## Mock Mode (Testing Without Hardware)

The webapp includes **mock data mode** for testing without physical hardware:

- Automatically enabled when device vendor requests are not implemented
- Generates realistic sensor data
- Simulates 50 historical log records
- Perfect for UI development and testing

To disable mock mode once firmware is ready, the webapp will automatically detect real responses.

## Architecture

### File Structure

```
docs/
├── index.html          # Main UI
├── css/
│   └── style.css      # Custom styles
└── js/
    ├── webusb.js      # WebUSB connection management
    ├── protocol.js    # Firmware protocol implementation
    ├── storage.js     # IndexedDB wrapper
    ├── ui.js          # UI updates and rendering
    └── export.js      # CSV/JSON export functions
```

### Technology Stack

- **Vanilla JavaScript** (ES6 modules)
- **Tailwind CSS** (via CDN)
- **WebUSB API** (native browser API)
- **IndexedDB** (persistent browser storage)

No build tools or dependencies required!

## Testing

This project includes comprehensive unit tests using **Vitest**.

### Running Tests

First, install test dependencies:

```bash
cd docs
npm install
```

Then run tests:

```bash
# Run tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with interactive UI
npm run test:ui
```

### Test Coverage

Tests cover all core functionality:

- **Protocol parsing** (`protocol.test.js`) - Data parsing, mock mode, GPS formatting
- **Storage operations** (`storage.test.js`) - IndexedDB CRUD, queries, statistics
- **WebUSB connection** (`webusb.test.js`) - Device connection, callbacks, error handling
- **Export functions** (`export.test.js`) - CSV/JSON/GeoJSON export, statistics

### Test Structure

```
docs/
├── __tests__/
│   ├── setup.js          # Global test configuration
│   ├── protocol.test.js  # Protocol tests (40+ tests)
│   ├── storage.test.js   # Storage tests (30+ tests)
│   ├── webusb.test.js    # WebUSB tests (25+ tests)
│   └── export.test.js    # Export tests (30+ tests)
├── package.json          # Test dependencies
└── vitest.config.js      # Vitest configuration
```

### Why Tests Matter

✅ **Catch bugs early** - Know immediately if changes break anything
✅ **Safe refactoring** - Modify code with confidence
✅ **Documentation** - Tests show how functions should be used
✅ **Fast feedback** - No manual browser testing needed
✅ **CI/CD ready** - Can run in GitHub Actions

### Mocking

Tests use mocked browser APIs:
- **WebUSB** - Simulated USB device connection
- **IndexedDB** - In-memory database (`fake-indexeddb`)
- **DOM** - Lightweight DOM simulation (`happy-dom`)

This allows tests to run **fast** (milliseconds) without real hardware or a browser.

## Firmware Integration

This webapp expects the firmware to implement WebUSB vendor requests:

### Required Commands

| Command | Code | Description |
|---------|------|-------------|
| GET_STATUS | 0x00 | Get current sensor readings (16 bytes) |
| GET_LOG_COUNT | 0x01 | Get number of stored logs (2 bytes) |
| READ_LOG | 0x02 | Read log record by index (20 bytes) |
| GET_VERSION | 0x04 | Get firmware version string (32 bytes) |

### Device Filter

- **VID**: `0x0483` (STMicroelectronics)
- **PID**: `0x5740` (CDC Virtual COM Port)

See the full specification document for detailed protocol information.

## Data Format

### Live Status (16 bytes)

- Temperature: int16_t (°C × 1000)
- Humidity: uint16_t (% × 1000)
- PM2.5: uint16_t (μg/m³ × 10)
- PM10: uint16_t (μg/m³ × 10)
- Battery: uint8_t (0-100%)
- Charging: uint8_t (0 or 1)
- GPS Fix: uint8_t (0=no fix, 1=GPS, 2=DGPS)
- Timestamp: uint32_t (seconds)

### Log Record (20 bytes)

- Temperature: int16_t (°C × 1000)
- Humidity: uint16_t (% × 1000)
- PM2.5: uint16_t (μg/m³ × 10)
- PM10: uint16_t (μg/m³ × 10)
- Latitude: int32_t (degrees × 10⁷)
- Longitude: int32_t (degrees × 10⁷)
- GPS Fix: uint8_t
- Battery: uint8_t
- Timestamp: uint32_t (Unix epoch)

## Troubleshooting

### Device Not Found

- Ensure device is plugged in
- Check USB cable is data-capable (not charge-only)
- Try a different USB port
- Restart browser

### Connection Failed

- Check if device is in use by another application
- Windows: Close any serial terminal programs
- macOS/Linux: Check for kernel drivers claiming the device

### No Data Displayed

- Firmware may not have vendor requests implemented yet
- Check browser console for errors (F12)
- Verify firmware version supports WebUSB

### Logs Not Downloading

- Check device has logs stored
- Verify firmware READ_LOG command is implemented
- Try refreshing the page and reconnecting

## Security & Privacy

- All data stays in your browser (no cloud uploads)
- IndexedDB storage is isolated per origin
- Device access requires explicit user permission
- HTTPS required for production deployment

## Future Enhancements

- Real-time data visualization (charts)
- Air quality index (AQI) calculations
- Multi-device support
- Firmware update via WebUSB
- Progressive Web App (PWA) support
- Data export to cloud services

## Contributing

Found a bug or have a feature request? Please open an issue on GitHub!

## License

See the main repository LICENSE file (CERN OHL v1.2).

---

**GitHub Pages URL**: `https://o16s.github.io/air-quality-sensor/`

For firmware implementation details, see the full WebUSB specification document.
