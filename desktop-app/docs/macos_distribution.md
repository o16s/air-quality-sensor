# macOS Code Signing & Notarization

For macOS apps distributed outside the App Store to open without Gatekeeper warnings.

## Prerequisites

1. **Apple Developer Account** ($99/year)
2. **Developer ID Application certificate** (not iOS/Development cert)
3. **App-specific password** for notarization API

## Setup

### 1. Create Developer ID Application Certificate

```bash
# Check existing certificates
security find-identity -v -p codesigning
```

If you don't see "Developer ID Application":
1. Go to [Apple Developer Certificates](https://developer.apple.com/account/resources/certificates/list)
2. Click "+" → Select "Developer ID Application"
3. Choose "G2 Sub-CA"
4. Create CSR: Keychain Access → Certificate Assistant → Request a Certificate From a Certificate Authority
5. Upload CSR, download cert, double-click to install

### 2. Create App-Specific Password

1. Go to https://account.apple.com
2. Sign-In and Security → App-Specific Passwords
3. Generate new password, name it "Electron Notarize"
4. Copy the password (format: `xxxx-xxxx-xxxx-xxxx`)

### 3. Configure Environment

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```
APPLE_ID=your-apple-id@example.com
APPLE_ID_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

## Build Signed & Notarized App

```bash
npm run make
```

This will:
1. Build the Electron app
2. Sign with Developer ID certificate
3. Submit to Apple for notarization
4. Staple notarization ticket to app

## Verify

```bash
# Check signature
codesign -dv --verbose=4 "out/Octanis Sensor Dashboard-darwin-arm64/Octanis Sensor Dashboard.app"

# Check notarization
spctl -a -vv "out/Octanis Sensor Dashboard-darwin-arm64/Octanis Sensor Dashboard.app"
```

Expected output:
```
source=Notarized Developer ID
origin=Developer ID Application: Octanis Instruments OU (SS9XDVWZ4K)
```

## Entitlements

The app requires these entitlements (`entitlements.plist`):
- `com.apple.security.cs.allow-unsigned-executable-memory` - Required for Electron
- `com.apple.security.cs.allow-jit` - Required for V8 JavaScript engine
- `com.apple.security.device.usb` - Required for WebUSB sensor access

## Troubleshooting

### "Developer ID Application" certificate not found
Create one at Apple Developer portal (see Setup step 1).

### Notarization fails with authentication error
- Verify APPLE_ID and APPLE_ID_PASSWORD in `.env`
- Ensure app-specific password is correct (regenerate if needed)
- Check Team ID in `forge.config.js` matches your account

### App still shows Gatekeeper warning
- Verify notarization: `spctl -a -vv "path/to/app"`
- If not notarized, check build logs for errors
- Ensure DMG was built after notarization setup
