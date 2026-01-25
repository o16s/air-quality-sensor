require('dotenv').config();

const isDarwin = process.platform === 'darwin';
const hasSigningCredentials = process.env.APPLE_ID && process.env.APPLE_ID_PASSWORD;

const packagerConfig = {
  name: 'Octanis Sensor Dashboard',
  executableName: 'octanis-sensor-dashboard',
  extraResource: ['../docs'],
  asar: true
};

// Only add signing/notarization on macOS with credentials
if (isDarwin && hasSigningCredentials) {
  packagerConfig.osxSign = {
    identity: 'Developer ID Application: Octanis Instruments OU (SS9XDVWZ4K)',
    optionsForFile: () => ({
      entitlements: './entitlements.plist'
    })
  };
  packagerConfig.osxNotarize = {
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID || 'SS9XDVWZ4K'
  };
}

module.exports = {
  packagerConfig,
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'octanis-sensor-dashboard'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux', 'win32']
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    }
  ]
};
