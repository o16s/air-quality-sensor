/**
 * IndexedDB Storage Management
 * Handles persistent storage of sensor logs in browser
 */

const DB_NAME = 'ccc-sensor-logs';
const DB_VERSION = 3;
const STORE_NAME = 'logs';
const METADATA_STORE = 'deviceMetadata';
const REPORT_LOCATIONS_STORE = 'reportLocations';

let db = null;

/**
 * Initialize IndexedDB database
 */
export async function initDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error('Failed to open database'));
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('Database initialized successfully');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // Create logs object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, {
                    keyPath: 'id',
                    autoIncrement: true
                });

                // Create indexes for efficient querying
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                objectStore.createIndex('deviceSerial', 'deviceSerial', { unique: false });
                objectStore.createIndex('deviceTimestamp', ['deviceSerial', 'timestamp'], { unique: false });

                console.log('Logs object store created');
            }

            // Create device metadata store if it doesn't exist (added in v2)
            if (!db.objectStoreNames.contains(METADATA_STORE)) {
                db.createObjectStore(METADATA_STORE, { keyPath: 'serial' });
                console.log('Device metadata store created');
            }

            // Create report locations store if it doesn't exist (added in v3)
            if (!db.objectStoreNames.contains(REPORT_LOCATIONS_STORE)) {
                db.createObjectStore(REPORT_LOCATIONS_STORE, { keyPath: 'id' });
                console.log('Report locations store created');
            }
        };
    });
}

/**
 * Ensure database is initialized
 */
async function ensureDB() {
    if (!db) {
        await initDatabase();
    }
    return db;
}

/**
 * Store a single log record
 */
export async function storeLog(logData, deviceSerial) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const record = {
            ...logData,
            deviceSerial: deviceSerial,
            downloadedAt: Math.floor(Date.now() / 1000)
        };

        const request = store.add(record);

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(new Error('Failed to store log'));
        };
    });
}

/**
 * Store multiple log records in batch
 * Automatically skips duplicate records to prevent redundant storage
 */
export async function storeLogs(logs, deviceSerial) {
    const db = await ensureDB();

    // First, get all existing logs for this device to check for duplicates
    const existingLogs = await getLogsByDevice(deviceSerial);

    return new Promise(async (resolve, reject) => {
        // Import isDuplicateLog helper
        const { isDuplicateLog } = await import('./utils.js');

        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        let successCount = 0;
        let skippedCount = 0;
        const errors = [];

        logs.forEach((logData, index) => {
            const record = {
                ...logData,
                deviceSerial: deviceSerial,
                downloadedAt: Math.floor(Date.now() / 1000)
            };

            // Check if this log is a duplicate
            const isDuplicate = existingLogs.some(existingLog =>
                isDuplicateLog(record, existingLog)
            );

            if (isDuplicate) {
                skippedCount++;
                return; // Skip this record
            }

            const request = store.add(record);

            request.onsuccess = () => {
                successCount++;
            };

            request.onerror = () => {
                errors.push({ index, error: request.error });
            };
        });

        transaction.oncomplete = () => {
            resolve({
                success: successCount,
                skipped: skippedCount,
                errors: errors,
                total: logs.length
            });
        };

        transaction.onerror = () => {
            reject(new Error('Transaction failed'));
        };
    });
}

/**
 * Get all logs from database
 */
export async function getAllLogs() {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result || []);
        };

        request.onerror = () => {
            reject(new Error('Failed to retrieve logs'));
        };
    });
}

/**
 * Get logs for specific device
 */
export async function getLogsByDevice(deviceSerial) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('deviceSerial');
        const request = index.getAll(deviceSerial);

        request.onsuccess = () => {
            resolve(request.result || []);
        };

        request.onerror = () => {
            reject(new Error('Failed to retrieve logs'));
        };
    });
}

/**
 * Get logs within a date range
 */
export async function getLogsByDateRange(startTimestamp, endTimestamp, deviceSerial = null) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        let request;
        if (deviceSerial) {
            const index = store.index('deviceTimestamp');
            const range = IDBKeyRange.bound(
                [deviceSerial, startTimestamp],
                [deviceSerial, endTimestamp]
            );
            request = index.getAll(range);
        } else {
            const index = store.index('timestamp');
            const range = IDBKeyRange.bound(startTimestamp, endTimestamp);
            request = index.getAll(range);
        }

        request.onsuccess = () => {
            resolve(request.result || []);
        };

        request.onerror = () => {
            reject(new Error('Failed to retrieve logs'));
        };
    });
}

/**
 * Get total count of logs
 */
export async function getLogCount(deviceSerial = null) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        let request;
        if (deviceSerial) {
            const index = store.index('deviceSerial');
            request = index.count(deviceSerial);
        } else {
            request = store.count();
        }

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(new Error('Failed to count logs'));
        };
    });
}

/**
 * Clear all logs from database
 */
export async function clearAllLogs() {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
            console.log('All logs cleared');
            resolve();
        };

        request.onerror = () => {
            reject(new Error('Failed to clear logs'));
        };
    });
}

/**
 * Clear logs for specific device
 */
export async function clearDeviceLogs(deviceSerial) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('deviceSerial');
        const request = index.openCursor(IDBKeyRange.only(deviceSerial));

        let deleteCount = 0;

        request.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                cursor.delete();
                deleteCount++;
                cursor.continue();
            } else {
                console.log(`Deleted ${deleteCount} logs for device ${deviceSerial}`);
                resolve(deleteCount);
            }
        };

        request.onerror = () => {
            reject(new Error('Failed to clear device logs'));
        };
    });
}

/**
 * Get latest log entry
 */
export async function getLatestLog(deviceSerial = null) {
    const logs = deviceSerial
        ? await getLogsByDevice(deviceSerial)
        : await getAllLogs();

    if (logs.length === 0) {
        return null;
    }

    // Sort by timestamp descending
    logs.sort((a, b) => b.timestamp - a.timestamp);
    return logs[0];
}

/**
 * Get recent logs (last N entries)
 */
export async function getRecentLogs(count = 10, deviceSerial = null) {
    const logs = deviceSerial
        ? await getLogsByDevice(deviceSerial)
        : await getAllLogs();

    // Sort by timestamp descending
    logs.sort((a, b) => b.timestamp - a.timestamp);

    return logs.slice(0, count);
}

/**
 * Check if logs exist for device
 */
export async function hasLogs(deviceSerial = null) {
    const count = await getLogCount(deviceSerial);
    return count > 0;
}

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        const countRequest = store.count();
        const allRequest = store.getAll();

        let stats = {
            totalLogs: 0,
            devices: new Set(),
            oldestTimestamp: null,
            newestTimestamp: null,
            estimatedSize: 0
        };

        countRequest.onsuccess = () => {
            stats.totalLogs = countRequest.result;
        };

        allRequest.onsuccess = () => {
            const logs = allRequest.result || [];

            logs.forEach(log => {
                if (log.deviceSerial) {
                    stats.devices.add(log.deviceSerial);
                }
                if (log.timestamp) {
                    if (!stats.oldestTimestamp || log.timestamp < stats.oldestTimestamp) {
                        stats.oldestTimestamp = log.timestamp;
                    }
                    if (!stats.newestTimestamp || log.timestamp > stats.newestTimestamp) {
                        stats.newestTimestamp = log.timestamp;
                    }
                }
            });

            stats.devices = Array.from(stats.devices);
            stats.estimatedSize = logs.length * 128; // Rough estimate: 128 bytes per record

            resolve(stats);
        };

        allRequest.onerror = () => {
            reject(new Error('Failed to get database stats'));
        };
    });
}

/**
 * Get device metadata by serial number
 * @param {string} serial - Device serial number
 * @returns {Promise<Object|null>} Metadata object or null if not found
 */
export async function getDeviceMetadata(serial) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([METADATA_STORE], 'readonly');
        const store = transaction.objectStore(METADATA_STORE);
        const request = store.get(serial);

        request.onsuccess = () => {
            resolve(request.result || null);
        };

        request.onerror = () => {
            reject(new Error('Failed to get device metadata'));
        };
    });
}

/**
 * Set device metadata (create or update)
 * @param {string} serial - Device serial number
 * @param {Object} metadata - Metadata to store
 * @param {string} metadata.name - Custom device name/alias
 * @param {string[]} metadata.tags - Array of tags
 * @param {string} metadata.model - Device model name (e.g., "OAQ-1-2")
 * @returns {Promise<void>}
 */
export async function setDeviceMetadata(serial, { name, tags, model }) {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([METADATA_STORE], 'readwrite');
        const store = transaction.objectStore(METADATA_STORE);

        const record = {
            serial,
            name: name || '',
            tags: tags || [],
            model: model || '',
            updatedAt: Math.floor(Date.now() / 1000)
        };

        const request = store.put(record);

        request.onsuccess = () => {
            console.log(`Device metadata saved for ${serial}`);
            resolve();
        };

        request.onerror = () => {
            reject(new Error('Failed to save device metadata'));
        };
    });
}

/**
 * Get all device metadata
 * @returns {Promise<Object[]>} Array of metadata records
 */
export async function getAllDeviceMetadata() {
    const db = await ensureDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([METADATA_STORE], 'readonly');
        const store = transaction.objectStore(METADATA_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result || []);
        };

        request.onerror = () => {
            reject(new Error('Failed to get all device metadata'));
        };
    });
}

// ============================================
// Report Locations CRUD Functions
// ============================================

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

// Initialize database on module load
initDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
});
