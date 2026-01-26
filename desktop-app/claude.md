# Electron Desktop App

Wraps the `docs/` SPA in Electron for Win/Mac/Linux with native WebUSB support.

## Quick Start

```bash
cd desktop-app
npm install
npm start
```

## Build Distributable

```bash
# macOS: Set up signing credentials first (see docs/macos_distribution.md)
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
├── docs/
│   ├── macos_distribution.md  # Code signing & notarization guide
│   └── github_ci.md           # GitHub Actions setup guide
└── claude.md             # This file

.github/workflows/
└── electron-build.yml    # CI for Win/Mac/Linux builds
```

## How It Works

The app loads `../docs/index.html` directly. In packaged builds, docs is bundled as an extra resource.

### WebUSB
Electron requires explicit USB permission handling in the main process.

**User experience:** Plug in the sensor and it auto-connects. No device picker dialog (unlike Chrome browser).

**Implementation:**
- `setDevicePermissionHandler`: Grants USB device access automatically
- `setPermissionCheckHandler`: Allows USB permission checks
- Device auto-reconnects via the web app's existing auto-reconnect logic

### macOS Distribution
Signed with Developer ID and notarized by Apple. See [docs/macos_distribution.md](docs/macos_distribution.md).

### Windows Distribution
Uses Squirrel installer with `electron-squirrel-startup` for proper lifecycle handling:
- Creates Start Menu shortcut on install
- Creates Desktop shortcut on install
- Appears in Add/Remove Programs
- Handles uninstall cleanly

**Note:** WebUSB requires firmware with MS OS 2.0 descriptors for Windows to auto-load WinUSB driver.

### GitHub Actions CI
Automated builds for all platforms on tag push. See [docs/github_ci.md](docs/github_ci.md).

**Trigger a build:**
```bash
git tag v0.0.1
git push origin v0.0.1
```

## Milestones

- [x] **Milestone 1**: Minimal Electron app - window shows SPA
- [x] **Milestone 2**: WebUSB support - USB permission handlers
- [x] **Milestone 3**: Electron Forge packaging + macOS signing/notarization
- [x] **Milestone 4**: GitHub Actions CI - automated builds
- [ ] **Milestone 5**: Polish - icons, udev rules
