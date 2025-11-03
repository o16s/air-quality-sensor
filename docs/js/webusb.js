/**
 * WebUSB Connection Management
 * Handles device connection, disconnection, and communication
 */

// Device filter configuration
const DEVICE_FILTERS = [{
    vendorId: 0x0483,  // STMicroelectronics
    productId: 0x5740  // CDC Virtual COM Port
}];

// Connection state
let device = null;
let isConnected = false;
const connectionCallbacks = [];
const disconnectionCallbacks = [];

/**
 * Check if WebUSB is supported in the current browser
 */
export function checkWebUSBSupport() {
    return 'usb' in navigator;
}

/**
 * Get current device connection status
 */
export function isDeviceConnected() {
    return isConnected && device !== null;
}

/**
 * Get the current connected device
 */
export function getDevice() {
    return device;
}

/**
 * Register callback for connection events
 */
export function onConnect(callback) {
    connectionCallbacks.push(callback);
}

/**
 * Register callback for disconnection events
 */
export function onDisconnect(callback) {
    disconnectionCallbacks.push(callback);
}

/**
 * Request user to select and connect to a USB device
 */
export async function connectDevice() {
    if (!checkWebUSBSupport()) {
        throw new Error('WebUSB is not supported in this browser');
    }

    try {
        // Request device from user
        device = await navigator.usb.requestDevice({
            filters: DEVICE_FILTERS
        });

        await openDevice();

        return device;
    } catch (error) {
        if (error.name === 'NotFoundError') {
            throw new Error('No device selected');
        }
        throw error;
    }
}

/**
 * Open and configure the USB device
 */
async function openDevice() {
    if (!device) {
        throw new Error('No device available');
    }

    try {
        // Open device
        if (!device.opened) {
            await device.open();
        }

        // Select configuration (usually configuration 1)
        if (device.configuration === null) {
            await device.selectConfiguration(1);
        }

        // Claim the interface
        // For CDC devices, this is typically interface 0
        const interfaceNumber = 0;

        if (!device.configuration.interfaces[interfaceNumber].claimed) {
            await device.claimInterface(interfaceNumber);
        }

        isConnected = true;

        // Notify connection callbacks
        connectionCallbacks.forEach(callback => {
            try {
                callback(device);
            } catch (err) {
                console.error('Error in connection callback:', err);
            }
        });

        console.log('Device connected successfully:', device.productName);

    } catch (error) {
        isConnected = false;

        if (error.name === 'NotFoundError') {
            throw new Error('Device disconnected during initialization');
        } else if (error.name === 'SecurityError') {
            throw new Error('WebUSB requires HTTPS. Please use localhost or a secure origin.');
        } else if (error.name === 'NetworkError') {
            throw new Error('Device is busy or already in use by another application');
        }

        throw error;
    }
}

/**
 * Disconnect from the current device
 */
export async function disconnectDevice() {
    if (!device) {
        return;
    }

    try {
        if (device.opened) {
            // Release interface
            const interfaceNumber = 0;
            if (device.configuration?.interfaces[interfaceNumber]?.claimed) {
                await device.releaseInterface(interfaceNumber);
            }

            // Close device
            await device.close();
        }

        isConnected = false;

        // Notify disconnection callbacks
        disconnectionCallbacks.forEach(callback => {
            try {
                callback();
            } catch (err) {
                console.error('Error in disconnection callback:', err);
            }
        });

        console.log('Device disconnected successfully');

    } catch (error) {
        console.error('Error disconnecting device:', error);
    } finally {
        device = null;
        isConnected = false;
    }
}

/**
 * Attempt to reconnect to previously paired devices
 */
export async function autoReconnect() {
    if (!checkWebUSBSupport()) {
        return false;
    }

    try {
        // Get list of previously authorized devices
        const devices = await navigator.usb.getDevices();

        // Find matching device
        const matchingDevice = devices.find(d =>
            d.vendorId === DEVICE_FILTERS[0].vendorId &&
            d.productId === DEVICE_FILTERS[0].productId
        );

        if (matchingDevice) {
            device = matchingDevice;
            await openDevice();
            return true;
        }

        return false;

    } catch (error) {
        console.error('Auto-reconnect failed:', error);
        return false;
    }
}

/**
 * Monitor USB device connection/disconnection events
 */
export function monitorUSBEvents() {
    if (!checkWebUSBSupport()) {
        return;
    }

    // Listen for device connections
    navigator.usb.addEventListener('connect', async (event) => {
        console.log('USB device connected:', event.device);

        // Check if it matches our filter
        if (event.device.vendorId === DEVICE_FILTERS[0].vendorId &&
            event.device.productId === DEVICE_FILTERS[0].productId) {

            // Auto-connect if no device is currently connected
            if (!isConnected) {
                try {
                    device = event.device;
                    await openDevice();
                } catch (error) {
                    console.error('Failed to auto-connect:', error);
                }
            }
        }
    });

    // Listen for device disconnections
    navigator.usb.addEventListener('disconnect', (event) => {
        console.log('USB device disconnected:', event.device);

        // Check if it's our current device
        if (device && event.device === device) {
            isConnected = false;
            device = null;

            // Notify disconnection callbacks
            disconnectionCallbacks.forEach(callback => {
                try {
                    callback();
                } catch (err) {
                    console.error('Error in disconnection callback:', err);
                }
            });
        }
    });
}

/**
 * Get device information
 */
export function getDeviceInfo() {
    if (!device) {
        return null;
    }

    return {
        productName: device.productName || 'STM32 Virtual ComPort',
        manufacturerName: device.manufacturerName || 'STMicroelectronics',
        serialNumber: device.serialNumber || 'Unknown',
        vendorId: device.vendorId,
        productId: device.productId
    };
}

/**
 * Handle USB errors with user-friendly messages
 */
export function handleUSBError(error) {
    console.error('USB Error:', error);

    if (error.name === 'NotFoundError') {
        return 'Device disconnected. Please reconnect your sensor.';
    } else if (error.name === 'SecurityError') {
        return 'Security error. WebUSB requires HTTPS or localhost.';
    } else if (error.name === 'NetworkError') {
        return 'Device is busy or in use by another application.';
    } else if (error.name === 'InvalidStateError') {
        return 'Invalid device state. Try disconnecting and reconnecting.';
    } else if (error.name === 'NotSupportedError') {
        return 'This operation is not supported by the device.';
    } else if (error.message) {
        return error.message;
    }

    return 'An unknown USB error occurred.';
}

// Initialize USB event monitoring when module loads
if (checkWebUSBSupport()) {
    monitorUSBEvents();
}
