/**
 * Modals Module
 * Handles settings and device edit modals
 */

import { getDeviceMetadata, setDeviceMetadata, deleteDeviceMetadata, clearDeviceLogs } from '../storage/storage.js';
import { getSettings, setSettings, setRecording } from '../device/protocol.js';
import { MEASUREMENT_INTERVALS } from '../shared/constants.js';
import { i18n } from '../shared/i18n.js';
import { isDeviceConnected, getDevice } from '../device/webusb.js';
import { listenKeys } from 'nanostores';
import { $state, bumpDataVersion } from './state.js';
import * as state from './state.js';
import { showError, showSuccess } from './utils.js';
import { updateDeviceFilter, updateSwitcherDisplay } from './deviceSwitcher.js';
import { updateOverviewVisibility } from './fleetView.js';

/**
 * Open settings modal
 */
export function openSettingsModal() {
    document.getElementById('settings-modal').classList.remove('hidden');
}

/**
 * Close settings modal
 */
export function closeSettingsModal() {
    document.getElementById('settings-modal').classList.add('hidden');
}

/**
 * Open edit device modal with current values (for connected device)
 */
export async function openEditDeviceModal() {
    const connectedDeviceSerial = state.get('connectedDeviceSerial');
    if (!connectedDeviceSerial) return;
    await openEditDeviceModalForSerial(connectedDeviceSerial);
}

/**
 * Open edit device modal for a specific serial
 * @param {string} serial - Device serial number
 */
export async function openEditDeviceModalForSerial(serial) {
    const modal = document.getElementById('edit-device-modal');
    const nameInput = document.getElementById('edit-device-name-input');
    const tagsInput = document.getElementById('edit-device-tags-input');

    // Store the serial being edited
    modal.dataset.editingSerial = serial;

    try {
        const metadata = await getDeviceMetadata(serial);
        nameInput.value = metadata?.name || '';
        tagsInput.value = metadata?.tags?.join(', ') || '';
    } catch (error) {
        console.error('Failed to load metadata for editing:', error);
        nameInput.value = '';
        tagsInput.value = '';
    }

    modal.classList.remove('hidden');
    nameInput.focus();
}

/**
 * Close edit device modal
 */
export function closeEditDeviceModal() {
    document.getElementById('edit-device-modal').classList.add('hidden');
}

/**
 * Handle save device metadata button click
 */
export async function handleSaveDeviceMetadata() {
    const modal = document.getElementById('edit-device-modal');
    const connectedDeviceSerial = state.get('connectedDeviceSerial');
    const serial = modal.dataset.editingSerial || connectedDeviceSerial;

    if (!serial) return;

    const nameInput = document.getElementById('edit-device-name-input');
    const tagsInput = document.getElementById('edit-device-tags-input');

    const name = nameInput.value.trim();
    const tagsRaw = tagsInput.value;

    // Parse tags: split by comma, trim whitespace, filter empty
    const tags = tagsRaw
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

    try {
        await setDeviceMetadata(serial, { name, tags });

        // Update device filter dropdown to show new name
        await updateDeviceFilter();

        // Update switcher display if this is the selected device
        const selectedDeviceSerial = state.get('selectedDeviceSerial');
        if (serial === selectedDeviceSerial) {
            await updateSwitcherDisplay();
        }

        closeEditDeviceModal();
        console.log('Device metadata saved successfully');
    } catch (error) {
        console.error('Failed to save device metadata:', error);
        showError('Failed to save device metadata: ' + error.message);
    }
}

/**
 * Populate the interval dropdown with options
 */
function populateIntervalDropdown() {
    const select = document.getElementById('settings-interval');
    if (!select) return;

    select.innerHTML = '';
    MEASUREMENT_INTERVALS.forEach(({ index, minutes, isDefault }) => {
        const option = document.createElement('option');
        option.value = index;
        // Format label: "X min" or "X min (default)"
        let label = `${minutes} min`;
        if (isDefault) {
            label += ` ${i18n.t('settings_default')}`;
        }
        option.textContent = label;
        select.appendChild(option);
    });
}

/**
 * Load device settings and populate the settings section
 * Called when settings modal opens
 */
export async function loadDeviceSettings() {
    const section = document.getElementById('device-settings-section');
    const intervalSelect = document.getElementById('settings-interval');
    const ledCheckbox = document.getElementById('settings-led-always-on');

    // Populate interval dropdown
    populateIntervalDropdown();

    // Show/hide settings section based on device connection
    if (!isDeviceConnected()) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');

    try {
        const device = getDevice();
        const settings = await getSettings(device);

        // Set interval dropdown to current value
        intervalSelect.value = settings.intervalIndex;

        // Set LED checkbox
        ledCheckbox.checked = settings.ledAlwaysOn;

        console.log('Device settings loaded:', settings);
    } catch (error) {
        console.error('Failed to load device settings:', error);
        // Still show section but with defaults
        intervalSelect.value = 2; // Default: 3 minutes
        ledCheckbox.checked = false;
    }
}

/**
 * Handle recording toggle change
 * Sends recording state to device immediately
 * @param {Event} event - Change event from checkbox
 */
export async function handleRecordingToggle(event) {
    if (!isDeviceConnected()) return;

    const checkbox = event.target;
    const enabled = checkbox.checked;

    try {
        const device = getDevice();
        await setRecording(device, enabled);
        console.log(`Recording ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
        console.error('Failed to set recording:', error);
        showError(`Failed to set recording: ${error.message}`);
        // Revert checkbox state on error
        checkbox.checked = !enabled;
    }
}

/**
 * Handle save settings button click
 * Sends settings to device
 */
export async function handleSaveSettings() {
    if (!isDeviceConnected()) return;

    const intervalSelect = document.getElementById('settings-interval');
    const ledCheckbox = document.getElementById('settings-led-always-on');
    const saveBtn = document.getElementById('save-settings-btn');

    const intervalIndex = parseInt(intervalSelect.value, 10);
    const ledAlwaysOn = ledCheckbox.checked;

    // Disable button during save
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = '...';

    try {
        const device = getDevice();
        await setSettings(device, { intervalIndex, ledAlwaysOn });

        // Show success feedback on button
        saveBtn.textContent = i18n.t('settings_settingsSaved');
        saveBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        saveBtn.classList.add('bg-green-500');

        // Revert after 2 seconds
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.classList.remove('bg-green-500');
            saveBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
            saveBtn.disabled = false;
        }, 2000);

        console.log('Settings saved:', { intervalIndex, ledAlwaysOn });
    } catch (error) {
        console.error('Failed to save settings:', error);
        showError('Failed to save settings: ' + error.message);
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
    }
}

/**
 * Handle forget device button click in edit device modal.
 * Removes device metadata and all its logs from browser storage.
 */
export async function handleForgetDevice() {
    const modal = document.getElementById('edit-device-modal');
    const serial = modal.dataset.editingSerial;
    if (!serial) return;

    if (!confirm(i18n.t('editDevice_forgetConfirm'))) return;

    try {
        await deleteDeviceMetadata(serial);
        await clearDeviceLogs(serial);

        // If the forgotten device was selected, deselect it
        if (state.get('selectedDeviceSerial') === serial) {
            state.set('selectedDeviceSerial', null);
        }

        closeEditDeviceModal();
        bumpDataVersion();
        await updateDeviceFilter();
        await updateOverviewVisibility();
    } catch (error) {
        console.error('Failed to forget device:', error);
        showError('Failed to forget device: ' + error.message);
    }
}

// ── Reactive subscriptions ────────────────────────────────────────────

// Close settings modal when device disconnects (stale device context)
listenKeys($state, ['connectedDeviceSerial'], (value) => {
    if (value.connectedDeviceSerial === null) {
        closeSettingsModal();
    }
});
