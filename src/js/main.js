import { checkWebUSBSupport } from './webusb.js';
import { initUI } from './ui.js';

// Check browser compatibility
if (!checkWebUSBSupport()) {
    document.getElementById('browser-warning').classList.remove('hidden');
}

// Initialize UI
initUI();
