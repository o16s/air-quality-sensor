/**
 * Vitest Setup File
 * Mocks browser APIs that aren't available in test environment
 */

import { vi } from 'vitest';
import 'fake-indexeddb/auto';

// Mock WebUSB API
global.navigator.usb = {
  requestDevice: vi.fn(),
  getDevices: vi.fn().mockResolvedValue([]),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
};

// Mock URL.createObjectURL and revokeObjectURL for export tests
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

// Mock document.createElement for download link tests
const originalCreateElement = document.createElement.bind(document);
document.createElement = vi.fn((tagName) => {
  const element = originalCreateElement(tagName);
  if (tagName === 'a') {
    element.click = vi.fn();
  }
  return element;
});

// Mock console methods to reduce test noise (optional)
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
};
