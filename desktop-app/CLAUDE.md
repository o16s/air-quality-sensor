# Electron Desktop App

Wraps the `web/dist` SPA in Electron for Win/Mac/Linux with native WebUSB support.

## Quick Start

```bash
cd desktop-app
npm install
npm start
```

## Build Distributable

```bash
# macOS: Set up signing credentials first (see guides/macos_distribution.md)
cp .env.example .env
# Edit .env with your Apple credentials

npm run make
# Output: out/make/
```

## File Structure
```
desktop-app/
├── package.json          # Electron 40.0.0 + Forge
├── forge.config.js       # Packaging config, signing, notarization
├── entitlements.plist    # macOS entitlements (USB access)
├── .env.example          # Template for Apple credentials
├── .env                  # Local credentials (gitignored)
├── src/
│   └── main.js           # Main process - window, USB handlers
├── guides/
│   ├── macos_distribution.md  # Code signing & notarization guide
│   ├── github_ci.md           # GitHub Actions setup guide
│   └── integration_testing.md # CDP-based integration testing
└── CLAUDE.md             # This file

.github/workflows/
└── electron-build.yml    # CI for Win/Mac/Linux builds
```

## How It Works

The app loads `../web/dist/index.html` directly. In packaged builds, dist is bundled as an extra resource.

### WebUSB
Electron requires explicit USB permission handling in the main process.

**User experience:** Plug in the sensor and it auto-connects. No device picker dialog (unlike Chrome browser).

**Implementation:**
- `setDevicePermissionHandler`: Grants USB device access automatically
- `setPermissionCheckHandler`: Allows USB permission checks
- Device auto-reconnects via the web app's existing auto-reconnect logic

### macOS Distribution
Signed with Developer ID and notarized by Apple. See [guides/macos_distribution.md](guides/macos_distribution.md).

### Windows Distribution
Uses Squirrel installer with `electron-squirrel-startup` for proper lifecycle handling:
- Creates Start Menu shortcut on install
- Creates Desktop shortcut on install
- Appears in Add/Remove Programs
- Handles uninstall cleanly

**Note:** WebUSB requires firmware with MS OS 2.0 descriptors for Windows to auto-load WinUSB driver.

### GitHub Actions CI
Automated builds for all platforms on tag push. See [guides/github_ci.md](guides/github_ci.md).

**Trigger a build:**
```bash
git tag v0.0.1
git push origin v0.0.1
```

### Integration Testing

**Run after every large change** (refactors, new features, dependency updates).

```bash
# 1. Build the web app first
cd web && npm run build

# 2. Kill stale Electron instances (only one can hold USB)
pkill -f "electron ." || true

# 3. Launch Electron with CDP debugging
cd desktop-app && npx electron . --remote-debugging-port=9222 &

# 4. Wait for app to start, then run smoke test
sleep 3 && npm run test:integration

# 5. Kill Electron when done
pkill -f "electron ." || true
```

The smoke test (`tests/smoke.js`) verifies: app loads without console errors, all nav elements exist, page navigation works, and captures a screenshot to `tests/screenshot.png`.

See [guides/integration_testing.md](guides/integration_testing.md) for writing custom CDP tests (console capture, UI interaction, screenshots).

**Important:** Only one Electron instance can hold a USB device. Kill stale instances before launching.

## Milestones

- [x] **Milestone 1**: Minimal Electron app - window shows SPA
- [x] **Milestone 2**: WebUSB support - USB permission handlers
- [x] **Milestone 3**: Electron Forge packaging + macOS signing/notarization
- [x] **Milestone 4**: GitHub Actions CI - automated builds
- [ ] **Milestone 5**: Polish - icons, udev rules
