# Integration Testing via Chrome DevTools Protocol

Test the Electron app programmatically by connecting to its DevTools Protocol (CDP) remote debugging port.

## Quick Start

```bash
# 1. Kill any existing Electron instances (only one can hold the USB device)
pkill -f "electron ." || true

# 2. Launch Electron with remote debugging
cd desktop-app
npx electron . --remote-debugging-port=9222

# 3. In another terminal, run a test script
node tests/smoke.js
```

## How It Works

Electron exposes the same CDP interface as Chrome. With `--remote-debugging-port=9222`, any CDP client (Puppeteer, Playwright, or raw WebSocket) can:

- **Read console output** (errors, warnings, logs)
- **Execute JavaScript** in the renderer process
- **Click elements** and interact with the UI
- **Inspect DOM state** and take screenshots
- **Monitor network requests**

This works with the real Electron app — same WebUSB handlers, same `file://` origin, same everything. No mocking.

## Connecting with Puppeteer

```js
const puppeteer = require('puppeteer-core');

async function connect() {
    // Connect to the running Electron instance
    const browser = await puppeteer.connect({
        browserURL: 'http://localhost:9222',
        defaultViewport: null
    });

    const pages = await browser.pages();
    const page = pages[0]; // Main window

    return { browser, page };
}
```

## Example: Smoke Test

Check that the app loads, no console errors, and the connect button is visible:

```js
const { connect } = require('./helpers');

async function smokeTest() {
    const { browser, page } = await connect();

    // Collect console errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });

    // Wait for app to initialize
    await page.waitForSelector('#connect-btn', { timeout: 5000 });

    // Check critical elements exist
    const connectBtn = await page.$('#connect-btn');
    if (!connectBtn) throw new Error('Connect button not found');

    // Check no JS errors on load
    if (errors.length > 0) {
        throw new Error(`Console errors on load:\n${errors.join('\n')}`);
    }

    console.log('Smoke test passed');
    await browser.disconnect();
}
```

## Example: Read Console After USB Connect

When debugging USB issues, capture what happens after a device connects:

```js
async function captureConnectionLogs() {
    const { browser, page } = await connect();

    const logs = [];
    page.on('console', msg => {
        logs.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Wait for auto-connect (device must be plugged in)
    console.log('Waiting for device connection...');
    await page.waitForFunction(
        () => document.getElementById('device-serial')?.textContent?.length > 0,
        { timeout: 15000 }
    ).catch(() => {
        console.log('No device connected within timeout');
    });

    console.log('Console output:');
    logs.forEach(l => console.log(l));

    await browser.disconnect();
}
```

## Example: Click Through UI

```js
async function testPageNavigation() {
    const { browser, page } = await connect();

    // Navigate to History page
    await page.click('[data-page="history"]');
    const historyPage = await page.$('#page-history.active');
    if (!historyPage) throw new Error('History page did not activate');

    // Navigate to Report page
    await page.click('[data-page="report"]');
    const reportPage = await page.$('#page-report.active');
    if (!reportPage) throw new Error('Report page did not activate');

    // Back to Overview
    await page.click('[data-page="overview"]');

    console.log('Page navigation test passed');
    await browser.disconnect();
}
```

## Example: Take Screenshot

```js
async function screenshot(filename = 'screenshot.png') {
    const { browser, page } = await connect();
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`Screenshot saved to ${filename}`);
    await browser.disconnect();
}
```

## Tips

- **Only one Electron instance** can hold a USB device at a time. Kill stale instances with `pkill -f "electron ."` before launching.
- **CDP doesn't bypass WebUSB security** — you can't programmatically trigger `requestDevice()` (it requires a user gesture). But auto-reconnect to previously paired devices works without interaction.
- **Use `page.evaluate()`** to run arbitrary JS in the renderer: `await page.evaluate(() => window.someGlobal)`.
- **For CI**, launch Electron headlessly with `xvfb-run` on Linux or use `--headless` (Electron 28+).

## Dependencies

For test scripts using Puppeteer:

```bash
cd desktop-app
npm install --save-dev puppeteer-core
```

`puppeteer-core` connects to an existing browser — it doesn't download Chromium (Electron is the browser).
