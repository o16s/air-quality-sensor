/**
 * Report Locations CRUD
 * Manages building/room data used in report generation.
 * Uses the shared IndexedDB instance from storage.
 */

import { ensureDB } from '../storage/storage.js';

const REPORT_LOCATIONS_STORE = 'reportLocations';

/**
 * Save a report location (create or update)
 * @param {Object} location - Location object with building and rooms data
 * @returns {Promise<void>}
 */
export async function saveReportLocation(location) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([REPORT_LOCATIONS_STORE], 'readwrite');
        const store = transaction.objectStore(REPORT_LOCATIONS_STORE);

        const record = {
            ...location,
            updatedAt: Date.now()
        };

        // Set createdAt only if it's a new record
        if (!record.createdAt) {
            record.createdAt = Date.now();
        }

        const request = store.put(record);

        request.onsuccess = () => {
            console.log(`Report location saved: ${location.id}`);
            resolve();
        };

        request.onerror = () => {
            reject(new Error('Failed to save report location'));
        };
    });
}

/**
 * Get a report location by ID
 * @param {string} id - Location ID
 * @returns {Promise<Object|null>} Location object or null if not found
 */
export async function getReportLocation(id) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([REPORT_LOCATIONS_STORE], 'readonly');
        const store = transaction.objectStore(REPORT_LOCATIONS_STORE);
        const request = store.get(id);

        request.onsuccess = () => {
            resolve(request.result || null);
        };

        request.onerror = () => {
            reject(new Error('Failed to get report location'));
        };
    });
}

/**
 * Get all report locations
 * @returns {Promise<Object[]>} Array of location records
 */
export async function getAllReportLocations() {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([REPORT_LOCATIONS_STORE], 'readonly');
        const store = transaction.objectStore(REPORT_LOCATIONS_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result || []);
        };

        request.onerror = () => {
            reject(new Error('Failed to get all report locations'));
        };
    });
}

/**
 * Delete a report location by ID
 * @param {string} id - Location ID
 * @returns {Promise<void>}
 */
export async function deleteReportLocation(id) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([REPORT_LOCATIONS_STORE], 'readwrite');
        const store = transaction.objectStore(REPORT_LOCATIONS_STORE);
        const request = store.delete(id);

        request.onsuccess = () => {
            console.log(`Report location deleted: ${id}`);
            resolve();
        };

        request.onerror = () => {
            reject(new Error('Failed to delete report location'));
        };
    });
}

/**
 * Add a room to a location
 * @param {string} locationId - Location ID
 * @param {Object} room - Room object
 * @returns {Promise<void>}
 */
export async function addRoomToLocation(locationId, room) {
    const location = await getReportLocation(locationId);
    if (!location) {
        throw new Error('Location not found');
    }

    if (!location.rooms) {
        location.rooms = [];
    }

    location.rooms.push(room);
    await saveReportLocation(location);
}

/**
 * Update a room in a location
 * @param {string} locationId - Location ID
 * @param {string} roomId - Room ID
 * @param {Object} roomData - Updated room data
 * @returns {Promise<void>}
 */
export async function updateRoomInLocation(locationId, roomId, roomData) {
    const location = await getReportLocation(locationId);
    if (!location) {
        throw new Error('Location not found');
    }

    const roomIndex = location.rooms?.findIndex(r => r.id === roomId);
    if (roomIndex === -1 || roomIndex === undefined) {
        throw new Error('Room not found');
    }

    location.rooms[roomIndex] = { ...location.rooms[roomIndex], ...roomData };
    await saveReportLocation(location);
}

/**
 * Delete a room from a location
 * @param {string} locationId - Location ID
 * @param {string} roomId - Room ID
 * @returns {Promise<void>}
 */
export async function deleteRoomFromLocation(locationId, roomId) {
    const location = await getReportLocation(locationId);
    if (!location) {
        throw new Error('Location not found');
    }

    location.rooms = location.rooms?.filter(r => r.id !== roomId) || [];
    await saveReportLocation(location);
}
