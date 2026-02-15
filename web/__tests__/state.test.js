import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $state, $dataVersion, bumpDataVersion, get, set, getState, update, reset } from '../js/ui/state.js';

describe('State Management (nanostores)', () => {
    beforeEach(() => {
        // Reset to defaults before each test
        reset();
        $dataVersion.set(0);
    });

    describe('$state map', () => {
        it('has expected default values', () => {
            const s = $state.get();
            expect(s.connectedDeviceSerial).toBeNull();
            expect(s.selectedDeviceSerial).toBeNull();
            expect(s.currentDeviceModel).toBeNull();
            expect(s.currentLogType).toBeNull();
            expect(s.currentEventsTimeFilter).toBe('7d');
            expect(s.autoRefreshInterval).toBeNull();
            expect(s.isDownloading).toBe(false);
            expect(s.reportStats).toBeNull();
            expect(s.reportEventStats).toBeNull();
            expect(s.reportGI2Status).toBeNull();
        });

        it('setKey updates a single value', () => {
            $state.setKey('connectedDeviceSerial', 'ABC123');
            expect($state.get().connectedDeviceSerial).toBe('ABC123');
        });

        it('set replaces the full state', () => {
            $state.setKey('connectedDeviceSerial', 'ABC');
            $state.set({ ...$state.get(), connectedDeviceSerial: 'XYZ', isDownloading: true });
            expect($state.get().connectedDeviceSerial).toBe('XYZ');
            expect($state.get().isDownloading).toBe(true);
        });
    });

    describe('backwards-compatible helpers', () => {
        it('get() reads a key', () => {
            $state.setKey('selectedDeviceSerial', 'DEV1');
            expect(get('selectedDeviceSerial')).toBe('DEV1');
        });

        it('set() writes a key', () => {
            set('currentDeviceModel', 'OAQ-1-2');
            expect($state.get().currentDeviceModel).toBe('OAQ-1-2');
        });

        it('getState() returns the full state', () => {
            set('isDownloading', true);
            const s = getState();
            expect(s.isDownloading).toBe(true);
            expect(s.connectedDeviceSerial).toBeNull();
        });

        it('update() merges multiple keys', () => {
            update({ connectedDeviceSerial: 'A', selectedDeviceSerial: 'B' });
            expect(get('connectedDeviceSerial')).toBe('A');
            expect(get('selectedDeviceSerial')).toBe('B');
        });

        it('reset() restores all defaults', () => {
            set('connectedDeviceSerial', 'X');
            set('isDownloading', true);
            set('currentEventsTimeFilter', '30d');
            reset();
            expect(get('connectedDeviceSerial')).toBeNull();
            expect(get('isDownloading')).toBe(false);
            expect(get('currentEventsTimeFilter')).toBe('7d');
        });

        it('reset(keys) restores only specified keys', () => {
            set('connectedDeviceSerial', 'X');
            set('isDownloading', true);
            reset(['connectedDeviceSerial']);
            expect(get('connectedDeviceSerial')).toBeNull();
            expect(get('isDownloading')).toBe(true);
        });

        it('set() supports dynamic keys (e.g. report fields)', () => {
            set('reportIntro', 'Hello World');
            expect(get('reportIntro')).toBe('Hello World');
        });
    });

    describe('$dataVersion atom', () => {
        it('starts at 0', () => {
            expect($dataVersion.get()).toBe(0);
        });

        it('bumpDataVersion increments by 1', () => {
            bumpDataVersion();
            expect($dataVersion.get()).toBe(1);
            bumpDataVersion();
            expect($dataVersion.get()).toBe(2);
        });

        it('listen() fires on bump', () => {
            const callback = vi.fn();
            const unsub = $dataVersion.listen(callback);
            bumpDataVersion();
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback.mock.calls[0][0]).toBe(1);  // new value
            expect(callback.mock.calls[0][1]).toBe(0);   // old value
            unsub();
        });
    });

    describe('subscriptions', () => {
        it('listenKeys fires when a watched key changes', async () => {
            const { listenKeys } = await import('nanostores');
            const callback = vi.fn();
            const unsub = listenKeys($state, ['selectedDeviceSerial'], callback);

            set('selectedDeviceSerial', 'DEV1');
            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback.mock.calls[0][0].selectedDeviceSerial).toBe('DEV1');

            unsub();
        });

        it('listenKeys does not fire for unwatched keys', async () => {
            const { listenKeys } = await import('nanostores');
            const callback = vi.fn();
            const unsub = listenKeys($state, ['selectedDeviceSerial'], callback);

            set('isDownloading', true);
            expect(callback).not.toHaveBeenCalled();

            unsub();
        });

        it('multiple listenKeys on different keys are independent', async () => {
            const { listenKeys } = await import('nanostores');
            const cbDevice = vi.fn();
            const cbDownload = vi.fn();
            const unsub1 = listenKeys($state, ['connectedDeviceSerial'], cbDevice);
            const unsub2 = listenKeys($state, ['isDownloading'], cbDownload);

            set('connectedDeviceSerial', 'X');
            expect(cbDevice).toHaveBeenCalledTimes(1);
            expect(cbDownload).not.toHaveBeenCalled();

            set('isDownloading', true);
            expect(cbDownload).toHaveBeenCalledTimes(1);

            unsub1();
            unsub2();
        });

        it('unsubscribe stops notifications', async () => {
            const { listenKeys } = await import('nanostores');
            const callback = vi.fn();
            const unsub = listenKeys($state, ['selectedDeviceSerial'], callback);

            set('selectedDeviceSerial', 'A');
            expect(callback).toHaveBeenCalledTimes(1);

            unsub();
            set('selectedDeviceSerial', 'B');
            expect(callback).toHaveBeenCalledTimes(1); // No additional call
        });

        it('update() fires ALL listenKeys (uses set() which replaces whole state)', async () => {
            const { listenKeys } = await import('nanostores');
            const cbConnected = vi.fn();
            const cbSelected = vi.fn();
            const cbUnrelated = vi.fn();
            const unsub1 = listenKeys($state, ['connectedDeviceSerial'], cbConnected);
            const unsub2 = listenKeys($state, ['selectedDeviceSerial'], cbSelected);
            const unsub3 = listenKeys($state, ['isDownloading'], cbUnrelated);

            update({ connectedDeviceSerial: 'ABC', selectedDeviceSerial: 'ABC' });

            // All subscribers fire (set() passes changed=undefined, matching all)
            expect(cbConnected).toHaveBeenCalledTimes(1);
            expect(cbSelected).toHaveBeenCalledTimes(1);
            expect(cbUnrelated).toHaveBeenCalledTimes(1); // fires even though isDownloading didn't change

            unsub1();
            unsub2();
            unsub3();
        });

        it('setKey via set() fires only the specific key subscriber', async () => {
            const { listenKeys } = await import('nanostores');
            const cbConnected = vi.fn();
            const cbDownload = vi.fn();
            const unsub1 = listenKeys($state, ['connectedDeviceSerial'], cbConnected);
            const unsub2 = listenKeys($state, ['isDownloading'], cbDownload);

            // setKey only fires subscribers for that key
            set('connectedDeviceSerial', 'X');
            expect(cbConnected).toHaveBeenCalledTimes(1);
            expect(cbDownload).not.toHaveBeenCalled();

            unsub1();
            unsub2();
        });
    });
});
