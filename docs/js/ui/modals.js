/**
 * Modals Module
 * Handles settings and device edit modals
 */

import { getDeviceMetadata, setDeviceMetadata } from '../storage.js';
import * as state from './state.js';
import { showError } from './utils.js';
import { updateDeviceFilter, updateSwitcherDisplay } from './deviceSwitcher.js';

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
    const currentDeviceSerial = state.get('currentDeviceSerial');
    if (!currentDeviceSerial) return;
    await openEditDeviceModalForSerial(currentDeviceSerial);
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
    const currentDeviceSerial = state.get('currentDeviceSerial');
    const serial = modal.dataset.editingSerial || currentDeviceSerial;

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
