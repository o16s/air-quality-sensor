/**
 * Report Locations UI Module
 * Location/room CRUD modals, list rendering, building photo upload
 */

import { i18n } from '../shared/i18n.js';
import {
    getDatabaseStats,
    getAllDeviceMetadata,
} from '../storage/storage.js';
import {
    saveReportLocation,
    getReportLocation,
    getAllReportLocations,
    deleteReportLocation,
    addRoomToLocation,
    updateRoomInLocation,
    deleteRoomFromLocation
} from '../reporting/reportLocations.js';
import * as state from './state.js';
import { showError, escapeHtmlAttr } from './utils.js';
import { fileToDataUrl } from './reportForm.js';

// Location/Room state
let currentLocationId = null;
let currentEditingRoomId = null;

// Building photo state
let currentBuildingPhotoDataUrl = null;
const MAX_BUILDING_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

// Callback for when location/room data changes (set by orchestrator)
let onLocationDataChanged = null;

/**
 * Set callback for location data changes
 * @param {Function} cb - Async callback to invoke after location/room CRUD
 */
export function setOnLocationDataChanged(cb) {
    onLocationDataChanged = cb;
}

/**
 * Generate a UUID
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Initialize location and room UI
 */
export function initLocationRoomUI() {
    // Location modal buttons
    document.getElementById('add-location-btn')?.addEventListener('click', () => openLocationModal());
    document.getElementById('save-location-btn')?.addEventListener('click', handleSaveLocation);
    document.getElementById('cancel-location-btn')?.addEventListener('click', closeLocationModal);
    document.getElementById('delete-location-btn')?.addEventListener('click', handleDeleteLocation);

    // Room modal buttons
    document.getElementById('add-room-btn')?.addEventListener('click', () => openRoomModal());
    document.getElementById('save-room-btn')?.addEventListener('click', handleSaveRoom);
    document.getElementById('cancel-room-btn')?.addEventListener('click', closeRoomModal);

    // Smoking distance toggle
    document.getElementById('room-smoking-policy')?.addEventListener('change', (e) => {
        document.getElementById('room-smoking-distance-group')
            ?.classList.toggle('hidden', e.target.value !== 'nearby');
    });

    // Building photo upload
    initBuildingPhotoUpload();

    // Initialize location summary
    populateLocationSummary();
}

/**
 * Open location modal
 * @param {string|null} editId - Location ID to edit, or null for new
 */
export async function openLocationModal(editId = null) {
    const modal = document.getElementById('location-modal');
    const deleteBtn = document.getElementById('delete-location-btn');

    if (editId) {
        // Edit existing location
        const location = await getReportLocation(editId);
        if (location) {
            currentLocationId = editId;
            document.getElementById('loc-name').value = location.name || '';
            document.getElementById('loc-street').value = location.street || '';
            document.getElementById('loc-postal').value = location.postalCode || '';
            document.getElementById('loc-city').value = location.city || '';
            document.getElementById('loc-canton').value = location.canton || '';
            document.getElementById('loc-egid').value = location.egid || '';
            document.getElementById('loc-gps').value = location.gpsCoordinates || '';
            document.getElementById('loc-category').value = location.buildingCategory || 'single_family';
            document.getElementById('loc-year').value = location.constructionYear || '';
            document.getElementById('loc-renovation').value = location.lastRenovation || '';
            document.getElementById('loc-foundation').value = location.foundationStructure || 'concrete';
            document.getElementById('loc-basement').value = location.basement || 'full';
            document.getElementById('loc-hillside').checked = location.hillsideLocation || false;
            document.getElementById('loc-ventilation').value = location.ventilationType || 'natural';
            document.getElementById('loc-ventilation-details').value = location.ventilationDetails || '';
            // Load building photo
            currentBuildingPhotoDataUrl = location.buildingPhotoDataUrl || null;
            displayBuildingPhoto(currentBuildingPhotoDataUrl);
            deleteBtn.classList.remove('hidden');
        }
    } else {
        // New location
        currentLocationId = null;
        document.getElementById('loc-name').value = '';
        document.getElementById('loc-street').value = '';
        document.getElementById('loc-postal').value = '';
        document.getElementById('loc-city').value = '';
        document.getElementById('loc-canton').value = '';
        document.getElementById('loc-egid').value = '';
        document.getElementById('loc-gps').value = '';
        document.getElementById('loc-category').value = 'single_family';
        document.getElementById('loc-year').value = '';
        document.getElementById('loc-renovation').value = '';
        document.getElementById('loc-foundation').value = 'concrete';
        document.getElementById('loc-basement').value = 'full';
        document.getElementById('loc-hillside').checked = false;
        document.getElementById('loc-ventilation').value = 'natural';
        document.getElementById('loc-ventilation-details').value = '';
        // Clear building photo
        currentBuildingPhotoDataUrl = null;
        displayBuildingPhoto(null);
        deleteBtn.classList.add('hidden');
    }

    modal.classList.remove('hidden');
}

/**
 * Close location modal
 */
export function closeLocationModal() {
    document.getElementById('location-modal').classList.add('hidden');
    currentLocationId = null;
}

/**
 * Handle save location
 */
export async function handleSaveLocation() {
    const location = {
        id: currentLocationId || generateUUID(),
        name: document.getElementById('loc-name').value,
        street: document.getElementById('loc-street').value,
        postalCode: document.getElementById('loc-postal').value,
        city: document.getElementById('loc-city').value,
        canton: document.getElementById('loc-canton').value,
        egid: document.getElementById('loc-egid').value,
        gpsCoordinates: document.getElementById('loc-gps').value,
        buildingCategory: document.getElementById('loc-category').value,
        constructionYear: document.getElementById('loc-year').value,
        lastRenovation: document.getElementById('loc-renovation').value,
        foundationStructure: document.getElementById('loc-foundation').value,
        basement: document.getElementById('loc-basement').value,
        hillsideLocation: document.getElementById('loc-hillside').checked,
        ventilationType: document.getElementById('loc-ventilation').value,
        ventilationDetails: document.getElementById('loc-ventilation-details').value,
        buildingPhotoDataUrl: currentBuildingPhotoDataUrl,
        rooms: []
    };

    // Preserve existing rooms if editing
    if (currentLocationId) {
        const existing = await getReportLocation(currentLocationId);
        if (existing && existing.rooms) {
            location.rooms = existing.rooms;
        }
    }

    try {
        await saveReportLocation(location);
        closeLocationModal();
        await populateLocationSummary();
        if (onLocationDataChanged) await onLocationDataChanged();
    } catch (error) {
        console.error('Failed to save location:', error);
        showError('Failed to save location: ' + error.message);
    }
}

/**
 * Handle delete location
 */
export async function handleDeleteLocation() {
    if (!currentLocationId) return;

    if (!confirm(i18n.t('location_delete_confirm'))) {
        return;
    }

    try {
        await deleteReportLocation(currentLocationId);
        closeLocationModal();
        await populateLocationSummary();
        if (onLocationDataChanged) await onLocationDataChanged();
    } catch (error) {
        console.error('Failed to delete location:', error);
        showError('Failed to delete location: ' + error.message);
    }
}

/**
 * Populate location summary in report panel
 */
export async function populateLocationSummary() {
    const container = document.getElementById('report-location-summary');
    const roomsSection = document.getElementById('rooms-section');
    const locations = await getAllReportLocations();

    if (locations.length === 0) {
        container.innerHTML = `
            <button id="add-location-btn" class="w-full border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 py-2 px-3 rounded text-sm flex items-center justify-center gap-2 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span data-i18n="location_add_building">${i18n.t('location_add_building')}</span>
            </button>
        `;
        document.getElementById('add-location-btn').addEventListener('click', () => openLocationModal());
        roomsSection?.classList.add('hidden');
        return;
    }

    // Use first location (single location per report)
    const location = locations[0];
    state.set('currentReportLocationId', location.id);

    const displayAddress = [location.street, location.postalCode, location.city].filter(Boolean).join(', ');

    container.innerHTML = `
        <div class="border border-gray-200 rounded p-3 bg-gray-50">
            <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-800 truncate">${escapeHtmlAttr(location.name) || i18n.t('location_unnamed')}</p>
                    ${displayAddress ? `<p class="text-sm text-gray-500 truncate">${escapeHtmlAttr(displayAddress)}</p>` : ''}
                    <p class="text-xs text-gray-400 mt-1">${i18n.t('building_' + location.buildingCategory)}</p>
                </div>
                <button id="edit-location-btn" class="p-1 text-gray-400 hover:text-blue-500" title="${i18n.t('action_edit')}">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;

    document.getElementById('edit-location-btn').addEventListener('click', () => openLocationModal(location.id));

    // Show rooms section
    roomsSection?.classList.remove('hidden');
    await populateRoomsList(location);
}

/**
 * Populate rooms list
 * @param {Object} location - Location object with rooms
 */
export async function populateRoomsList(location) {
    const container = document.getElementById('report-rooms-list');

    if (!location.rooms || location.rooms.length === 0) {
        container.innerHTML = `<p class="text-gray-400 text-xs italic">${i18n.t('room_none_added')}</p>`;
        return;
    }

    const metadataList = await getAllDeviceMetadata();
    const metadataMap = {};
    metadataList.forEach(m => { metadataMap[m.serial] = m; });

    let html = '';
    for (const room of location.rooms) {
        const deviceName = room.deviceSerial
            ? (metadataMap[room.deviceSerial]?.name || room.deviceSerial)
            : '-';

        // Build dimensions string
        const dims = [];
        if (room.area) dims.push(`${room.area} m²`);
        if (room.ceilingHeight) dims.push(`${i18n.t('room_ceiling_abbr')} ${room.ceilingHeight}m`);
        if (room.sensorHeight) dims.push(`${i18n.t('room_sensor_abbr')} ${room.sensorHeight}m`);
        const dimsStr = dims.length > 0 ? dims.join(', ') : '';

        html += `
            <div class="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-700 text-sm truncate">${escapeHtmlAttr(room.name) || i18n.t('room_unnamed')}</p>
                    <p class="text-xs text-gray-500">${room.floor ? room.floor + ' - ' : ''}${i18n.t('room_' + room.roomType)}${room.occupancy ? ' - ' + i18n.t('room_occupancy_' + room.occupancy) : (room.regularOccupancy ? ' - ' + i18n.t('room_occupied') : '')}${dimsStr ? ' - ' + dimsStr : ''}</p>
                    <p class="text-xs text-gray-400">${i18n.t('room_device')}: ${escapeHtmlAttr(deviceName)}</p>
                </div>
                <div class="flex items-center gap-1">
                    <button class="edit-room-btn p-1 text-gray-400 hover:text-blue-500" data-room-id="${room.id}" title="${i18n.t('action_edit')}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                    <button class="delete-room-btn p-1 text-gray-400 hover:text-red-500" data-room-id="${room.id}" title="${i18n.t('action_delete')}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;

    // Attach event listeners
    container.querySelectorAll('.edit-room-btn').forEach(btn => {
        btn.addEventListener('click', () => openRoomModal(btn.dataset.roomId));
    });
    container.querySelectorAll('.delete-room-btn').forEach(btn => {
        btn.addEventListener('click', () => handleDeleteRoom(btn.dataset.roomId));
    });
}

/**
 * Populate device select for room modal
 */
export async function populateDeviceSelectForRoom() {
    const select = document.getElementById('room-device');
    const stats = await getDatabaseStats();
    const metadataList = await getAllDeviceMetadata();

    const metadataMap = {};
    metadataList.forEach(m => { metadataMap[m.serial] = m; });

    let html = `<option value="">${i18n.t('room_no_device')}</option>`;
    for (const serial of stats.devices) {
        const name = metadataMap[serial]?.name || serial;
        html += `<option value="${serial}">${escapeHtmlAttr(name)}</option>`;
    }

    select.innerHTML = html;
}

/**
 * Open room modal
 * @param {string|null} editId - Room ID to edit, or null for new
 */
export async function openRoomModal(editId = null) {
    const modal = document.getElementById('room-modal');
    const title = document.getElementById('room-modal-title');

    await populateDeviceSelectForRoom();

    const locationId = state.get('currentReportLocationId');
    if (!locationId) {
        showError('Please add a building first');
        return;
    }

    if (editId) {
        // Edit existing room
        title.textContent = i18n.t('room_edit_title');
        currentEditingRoomId = editId;

        const location = await getReportLocation(locationId);
        const room = location?.rooms?.find(r => r.id === editId);

        if (room) {
            document.getElementById('room-name').value = room.name || '';
            document.getElementById('room-floor').value = room.floor || '';
            document.getElementById('room-type').value = room.roomType || 'living_room';
            document.getElementById('room-area').value = room.area || '';
            document.getElementById('room-ceiling').value = room.ceilingHeight || '';
            document.getElementById('room-sensor-height').value = room.sensorHeight || '';
            document.getElementById('room-device').value = room.deviceSerial || '';
            document.getElementById('room-ventilation').value = room.roomVentilation || 'windows_mechanical';
            const smokingPolicy = room.smokingPolicy || 'none';
            document.getElementById('room-smoking-policy').value = smokingPolicy;
            document.getElementById('room-smoking-distance-group')
                .classList.toggle('hidden', smokingPolicy !== 'nearby');
            document.getElementById('room-smoking-distance').value = room.smokingDistance || 'lt5';
            // Known issues checkboxes
            const knownIssues = room.knownIssues || [];
            document.querySelectorAll('.room-known-issue').forEach(cb => {
                cb.checked = knownIssues.includes(cb.value);
            });
            document.getElementById('room-occupancy').value = room.occupancy || (room.regularOccupancy ? '1to2' : 'unoccupied');
            document.getElementById('room-notes').value = room.notes || '';
        }
    } else {
        // New room
        title.textContent = i18n.t('room_add_title');
        currentEditingRoomId = null;

        document.getElementById('room-name').value = '';
        document.getElementById('room-floor').value = '';
        document.getElementById('room-type').value = 'living_room';
        document.getElementById('room-area').value = '';
        document.getElementById('room-ceiling').value = '';
        document.getElementById('room-sensor-height').value = '';
        document.getElementById('room-device').value = '';
        document.getElementById('room-ventilation').value = 'windows_mechanical';
        document.getElementById('room-smoking-policy').value = 'none';
        document.getElementById('room-smoking-distance-group').classList.add('hidden');
        document.getElementById('room-smoking-distance').value = 'lt5';
        document.querySelectorAll('.room-known-issue').forEach(cb => { cb.checked = false; });
        document.getElementById('room-occupancy').value = '1to2';
        document.getElementById('room-notes').value = '';
    }

    modal.classList.remove('hidden');
}

/**
 * Close room modal
 */
export function closeRoomModal() {
    document.getElementById('room-modal').classList.add('hidden');
    currentEditingRoomId = null;
}

/**
 * Handle save room
 */
export async function handleSaveRoom() {
    const locationId = state.get('currentReportLocationId');
    if (!locationId) return;

    const smokingPolicy = document.getElementById('room-smoking-policy').value;
    const occupancy = document.getElementById('room-occupancy').value;

    const room = {
        id: currentEditingRoomId || generateUUID(),
        name: document.getElementById('room-name').value,
        floor: document.getElementById('room-floor').value,
        roomType: document.getElementById('room-type').value,
        area: parseFloat(document.getElementById('room-area').value) || null,
        ceilingHeight: parseFloat(document.getElementById('room-ceiling').value) || null,
        sensorHeight: parseFloat(document.getElementById('room-sensor-height').value) || null,
        deviceSerial: document.getElementById('room-device').value,
        roomVentilation: document.getElementById('room-ventilation').value,
        smokingPolicy: smokingPolicy,
        smokingDistance: smokingPolicy === 'nearby' ? document.getElementById('room-smoking-distance').value : null,
        knownIssues: Array.from(document.querySelectorAll('.room-known-issue:checked')).map(cb => cb.value),
        occupancy: occupancy,
        regularOccupancy: occupancy !== 'unoccupied',
        notes: document.getElementById('room-notes').value
    };

    try {
        if (currentEditingRoomId) {
            await updateRoomInLocation(locationId, currentEditingRoomId, room);
        } else {
            await addRoomToLocation(locationId, room);
        }

        closeRoomModal();
        await populateLocationSummary();
        if (onLocationDataChanged) await onLocationDataChanged();
    } catch (error) {
        console.error('Failed to save room:', error);
        showError('Failed to save room: ' + error.message);
    }
}

/**
 * Handle delete room
 * @param {string} roomId - Room ID to delete
 */
export async function handleDeleteRoom(roomId) {
    const locationId = state.get('currentReportLocationId');
    if (!locationId) return;

    if (!confirm(i18n.t('room_delete_confirm'))) {
        return;
    }

    try {
        await deleteRoomFromLocation(locationId, roomId);
        await populateLocationSummary();
        if (onLocationDataChanged) await onLocationDataChanged();
    } catch (error) {
        console.error('Failed to delete room:', error);
        showError('Failed to delete room: ' + error.message);
    }
}

/**
 * Get current report location with rooms
 * @returns {Promise<Object|null>} Location object or null
 */
export async function getCurrentReportLocation() {
    const locationId = state.get('currentReportLocationId');
    if (!locationId) return null;
    return await getReportLocation(locationId);
}

// ============================================
// Building Photo Upload Functions
// ============================================

/**
 * Initialize building photo upload handlers
 */
function initBuildingPhotoUpload() {
    const uploadBtn = document.getElementById('building-photo-upload-btn');
    const uploadInput = document.getElementById('building-photo-upload');
    const removeBtn = document.getElementById('building-photo-remove-btn');

    uploadBtn?.addEventListener('click', () => uploadInput?.click());
    uploadInput?.addEventListener('change', handleBuildingPhotoUpload);
    removeBtn?.addEventListener('click', removeBuildingPhoto);
}

/**
 * Handle building photo file upload
 */
async function handleBuildingPhotoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showError(i18n.t('location_photo_invalid_type'));
        return;
    }

    if (file.size > MAX_BUILDING_PHOTO_SIZE) {
        showError(i18n.t('location_photo_too_large'));
        return;
    }

    try {
        const dataUrl = await fileToDataUrl(file);
        currentBuildingPhotoDataUrl = dataUrl;
        displayBuildingPhoto(dataUrl);
    } catch (error) {
        console.error('Failed to upload building photo:', error);
    }
}

/**
 * Display building photo in preview
 * @param {string|null} dataUrl - Data URL or null to clear
 */
function displayBuildingPhoto(dataUrl) {
    const preview = document.getElementById('building-photo-preview');
    const placeholder = document.getElementById('building-photo-placeholder');
    const removeBtn = document.getElementById('building-photo-remove-btn');

    if (dataUrl) {
        preview.src = dataUrl;
        preview?.classList.remove('hidden');
        placeholder?.classList.add('hidden');
        removeBtn?.classList.remove('hidden');
    } else {
        preview.src = '';
        preview?.classList.add('hidden');
        placeholder?.classList.remove('hidden');
        removeBtn?.classList.add('hidden');
    }
}

/**
 * Remove building photo
 */
function removeBuildingPhoto() {
    currentBuildingPhotoDataUrl = null;
    displayBuildingPhoto(null);

    const uploadInput = document.getElementById('building-photo-upload');
    if (uploadInput) uploadInput.value = '';
}
