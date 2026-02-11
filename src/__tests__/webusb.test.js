/**
 * WebUSB Tests
 * Tests USB device connection and management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  checkWebUSBSupport,
  isDeviceConnected,
  getDevice,
  onConnect,
  onDisconnect,
  connectDevice,
  disconnectDevice,
  autoReconnect,
  getDeviceInfo,
  handleUSBError
} from '../js/webusb.js';

// Mock USB device
const createMockDevice = (overrides = {}) => ({
  vendorId: 0x0483,
  productId: 0x5740,
  productName: 'STM32 Virtual ComPort',
  manufacturerName: 'STMicroelectronics',
  serialNumber: 'TEST-SERIAL-123',
  opened: false,
  configuration: null,
  open: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  selectConfiguration: vi.fn().mockResolvedValue(undefined),
  claimInterface: vi.fn().mockResolvedValue(undefined),
  releaseInterface: vi.fn().mockResolvedValue(undefined),
  controlTransferIn: vi.fn(),
  controlTransferOut: vi.fn(),
  ...overrides
});

describe('WebUSB - Browser Support', () => {
  it('should detect WebUSB support', () => {
    const supported = checkWebUSBSupport();
    expect(supported).toBe(true); // In our test environment, we mock it
  });
});

describe('WebUSB - Device Connection', () => {
  beforeEach(() => {
    // Reset navigator.usb mock
    navigator.usb.requestDevice.mockReset();
    navigator.usb.getDevices.mockReset();
  });

  it('should connect to device successfully', async () => {
    const mockDevice = createMockDevice();

    // Mock selectConfiguration to set configuration after being called
    mockDevice.selectConfiguration.mockImplementation(() => {
      mockDevice.configuration = {
        interfaces: [{ claimed: false }]
      };
      return Promise.resolve();
    });

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);

    const device = await connectDevice();

    expect(device).toBeDefined();
    expect(mockDevice.open).toHaveBeenCalled();
    expect(mockDevice.selectConfiguration).toHaveBeenCalledWith(1);
    expect(mockDevice.claimInterface).toHaveBeenCalledWith(0);
  });

  it('should throw error when user cancels device selection', async () => {
    const error = new Error('No device selected');
    error.name = 'NotFoundError';
    navigator.usb.requestDevice.mockRejectedValue(error);

    await expect(connectDevice()).rejects.toThrow('No device selected');
  });

  it('should disconnect device successfully', async () => {
    const mockDevice = createMockDevice({
      opened: true,
      configuration: {
        interfaces: [
          { claimed: true }
        ]
      }
    });

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);

    // Connect first
    await connectDevice();

    // Then disconnect
    await disconnectDevice();

    expect(mockDevice.releaseInterface).toHaveBeenCalledWith(0);
    expect(mockDevice.close).toHaveBeenCalled();
  });

  it('should handle disconnect when no device is connected', async () => {
    // Should not throw
    await expect(disconnectDevice()).resolves.not.toThrow();
  });
});

describe('WebUSB - Connection State', () => {
  beforeEach(() => {
    navigator.usb.requestDevice.mockReset();
  });

  it('should report disconnected state initially', () => {
    expect(isDeviceConnected()).toBe(false);
  });

  it('should report connected state after connection', async () => {
    const mockDevice = createMockDevice({
      configuration: {
        interfaces: [{ claimed: false }]
      }
    });

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);
    await connectDevice();

    expect(isDeviceConnected()).toBe(true);
  });

  it('should provide current device', async () => {
    const mockDevice = createMockDevice({
      configuration: {
        interfaces: [{ claimed: false }]
      }
    });

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);
    await connectDevice();

    const device = getDevice();
    expect(device).toBe(mockDevice);
  });
});

describe('WebUSB - Callbacks', () => {
  beforeEach(() => {
    navigator.usb.requestDevice.mockReset();
  });

  it('should call onConnect callback when connected', async () => {
    const mockDevice = createMockDevice({
      configuration: {
        interfaces: [{ claimed: false }]
      }
    });

    const connectCallback = vi.fn();
    onConnect(connectCallback);

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);
    await connectDevice();

    expect(connectCallback).toHaveBeenCalledWith(mockDevice);
  });

  it('should call onDisconnect callback when disconnected', async () => {
    const mockDevice = createMockDevice({
      opened: true,
      configuration: {
        interfaces: [{ claimed: true }]
      }
    });

    const disconnectCallback = vi.fn();
    onDisconnect(disconnectCallback);

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);
    await connectDevice();
    await disconnectDevice();

    expect(disconnectCallback).toHaveBeenCalled();
  });

  it('should handle callback errors gracefully', async () => {
    const mockDevice = createMockDevice({
      configuration: {
        interfaces: [{ claimed: false }]
      }
    });

    const faultyCallback = vi.fn().mockImplementation(() => {
      throw new Error('Callback error');
    });
    onConnect(faultyCallback);

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);

    // Should not throw despite callback error
    await expect(connectDevice()).resolves.not.toThrow();
  });
});

describe('WebUSB - Auto-Reconnect', () => {
  beforeEach(() => {
    navigator.usb.getDevices.mockReset();
  });

  it('should auto-reconnect to previously paired device', async () => {
    const mockDevice = createMockDevice({
      configuration: {
        interfaces: [{ claimed: false }]
      }
    });

    navigator.usb.getDevices.mockResolvedValue([mockDevice]);

    const reconnected = await autoReconnect();

    expect(reconnected).toBe(true);
    expect(mockDevice.open).toHaveBeenCalled();
  });

  it('should return false when no devices are paired', async () => {
    navigator.usb.getDevices.mockResolvedValue([]);

    const reconnected = await autoReconnect();

    expect(reconnected).toBe(false);
  });

  it('should skip devices with wrong VID/PID', async () => {
    const wrongDevice = createMockDevice({
      vendorId: 0x9999,
      productId: 0x8888
    });

    navigator.usb.getDevices.mockResolvedValue([wrongDevice]);

    const reconnected = await autoReconnect();

    expect(reconnected).toBe(false);
    expect(wrongDevice.open).not.toHaveBeenCalled();
  });
});

describe('WebUSB - Device Info', () => {
  beforeEach(async () => {
    navigator.usb.requestDevice.mockReset();
    // Ensure clean state - disconnect any previous device
    await disconnectDevice();
  });

  it('should return null when no device is connected', () => {
    const info = getDeviceInfo();
    expect(info).toBeNull();
  });

  it('should return device information when connected', async () => {
    const mockDevice = createMockDevice({
      configuration: {
        interfaces: [{ claimed: false }]
      }
    });

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);
    await connectDevice();

    const info = getDeviceInfo();

    expect(info).toBeDefined();
    expect(info.productName).toBe('STM32 Virtual ComPort');
    expect(info.manufacturerName).toBe('STMicroelectronics');
    expect(info.serialNumber).toBe('TEST-SERIAL-123');
    expect(info.vendorId).toBe(0x0483);
    expect(info.productId).toBe(0x5740);
  });

  it('should provide defaults for missing device info', async () => {
    const mockDevice = createMockDevice({
      productName: undefined,
      manufacturerName: undefined,
      serialNumber: undefined,
      configuration: {
        interfaces: [{ claimed: false }]
      }
    });

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);
    await connectDevice();

    const info = getDeviceInfo();

    expect(info.productName).toBe('STM32 Virtual ComPort');
    expect(info.manufacturerName).toBe('STMicroelectronics');
    expect(info.serialNumber).toBe('Unknown');
  });
});

describe('WebUSB - Error Handling', () => {
  it('should handle NotFoundError', () => {
    const error = new Error('Device not found');
    error.name = 'NotFoundError';

    const message = handleUSBError(error);
    expect(message).toContain('disconnected');
  });

  it('should handle SecurityError', () => {
    const error = new Error('Security error');
    error.name = 'SecurityError';

    const message = handleUSBError(error);
    expect(message).toContain('HTTPS');
  });

  it('should handle NetworkError', () => {
    const error = new Error('Network error');
    error.name = 'NetworkError';

    const message = handleUSBError(error);
    expect(message).toContain('busy');
  });

  it('should handle InvalidStateError', () => {
    const error = new Error('Invalid state');
    error.name = 'InvalidStateError';

    const message = handleUSBError(error);
    expect(message).toContain('Invalid device state');
  });

  it('should handle NotSupportedError', () => {
    const error = new Error('Not supported');
    error.name = 'NotSupportedError';

    const message = handleUSBError(error);
    expect(message).toContain('not supported');
  });

  it('should handle unknown errors', () => {
    const error = new Error('Something went wrong');

    const message = handleUSBError(error);
    expect(message).toBe('Something went wrong');
  });

  it('should handle errors without messages', () => {
    const error = { name: 'UnknownError' };

    const message = handleUSBError(error);
    expect(message).toContain('unknown');
  });
});

describe('WebUSB - Connection Edge Cases', () => {
  beforeEach(() => {
    navigator.usb.requestDevice.mockReset();
  });

  it('should handle device already opened', async () => {
    const mockDevice = createMockDevice({
      opened: true,
      configuration: {
        interfaces: [{ claimed: false }]
      }
    });

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);
    await connectDevice();

    // open() should not be called if already opened
    expect(mockDevice.open).not.toHaveBeenCalled();
  });

  it('should handle interface already claimed', async () => {
    const mockDevice = createMockDevice({
      configuration: {
        interfaces: [{ claimed: true }]
      }
    });

    navigator.usb.requestDevice.mockResolvedValue(mockDevice);
    await connectDevice();

    // claimInterface() should not be called if already claimed
    expect(mockDevice.claimInterface).not.toHaveBeenCalled();
  });

  it('should throw error when WebUSB is not supported', async () => {
    const originalUsb = navigator.usb;
    delete navigator.usb;

    await expect(connectDevice()).rejects.toThrow('WebUSB is not supported');

    navigator.usb = originalUsb;
  });
});
