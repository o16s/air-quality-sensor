# GitHub Actions CI

Automated builds for Windows, macOS, and Linux.

## macOS Signing in CI

To sign and notarize macOS builds in GitHub Actions, you need to export your certificate and store it as a secret.

### 1. Export Certificate as .p12

1. Open **Keychain Access**
2. Left sidebar: select **login** keychain
3. Category: select **My Certificates**
4. Find **"Developer ID Application: Octanis Instruments OU (SS9XDVWZ4K)"**
5. Expand it (click triangle) - verify there's a **private key** underneath
6. Select the certificate → Right-click → **Export**
7. Save as `.p12` format
8. Set a strong password (you'll need this for the GitHub secret)

### 2. Base64 Encode Certificate

```bash
base64 -i /path/to/certificate.p12 | pbcopy
```

This copies the base64 string to your clipboard.

### 3. Configure GitHub Secrets

Go to your repo → Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value |
|-------------|-------|
| `APPLE_CERTIFICATE_BASE64` | Base64-encoded .p12 (from step 2) |
| `APPLE_CERTIFICATE_PASSWORD` | Password you set when exporting .p12 |
| `APPLE_ID` | Your Apple ID email |
| `APPLE_ID_PASSWORD` | App-specific password (from appleid.apple.com) |
| `APPLE_TEAM_ID` | `SS9XDVWZ4K` |

### 4. Workflow

The GitHub Actions workflow will:
1. Decode the certificate from base64
2. Create a temporary keychain
3. Import the certificate
4. Build, sign, and notarize the app
5. Upload artifacts

See `.github/workflows/electron-build.yml` for implementation.

## Platform Matrix

| Platform | Runner | Output | Signed |
|----------|--------|--------|--------|
| macOS | `macos-latest` | DMG | Yes (notarized) |
| Windows | `windows-latest` | .exe installer | No (TODO) |
| Linux | `ubuntu-latest` | .deb package | N/A |

## Windows Signing (TODO)

Windows builds are currently **unsigned**. Users will see SmartScreen "Unknown publisher" warning.

To enable signing, purchase a Windows Code Signing Certificate (~$75-400/year):
- SSL.com (cheapest OV)
- Sectigo
- DigiCert (EV for immediate trust)

## Linux USB Access

Linux users need udev rules to access USB devices without root. See `docs/linux_udev.md` (TODO).

## Triggering Builds

Builds trigger on:
- Push tags matching `v*` (e.g., `v0.0.1`)
- Manual workflow dispatch
