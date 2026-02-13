import { describe, it, expect } from 'vitest';
import { latestOnly } from '../js/ui/utils.js';

describe('latestOnly', () => {
    it('single call works normally', async () => {
        const results = [];
        const fn = latestOnly(async (stale, value) => {
            results.push(value);
        });

        await fn('a');
        expect(results).toEqual(['a']);
    });

    it('stale() returns false for single call', async () => {
        let staleResult;
        const fn = latestOnly(async (stale) => {
            staleResult = stale();
        });

        await fn();
        expect(staleResult).toBe(false);
    });

    it('second call causes first call stale() to return true', async () => {
        let resolve1;
        const barrier = new Promise(r => { resolve1 = r; });
        const staleChecks = [];

        const fn = latestOnly(async (stale, id) => {
            if (id === 'first') {
                staleChecks.push({ id, before: stale() });
                await barrier;
                staleChecks.push({ id, after: stale() });
            } else {
                staleChecks.push({ id, before: stale() });
            }
        });

        const p1 = fn('first');
        const p2 = fn('second');

        resolve1();
        await Promise.all([p1, p2]);

        // First call: stale was false before await, true after
        expect(staleChecks.find(c => c.id === 'first' && 'before' in c).before).toBe(false);
        expect(staleChecks.find(c => c.id === 'first' && 'after' in c).after).toBe(true);
        // Second call: never stale
        expect(staleChecks.find(c => c.id === 'second').before).toBe(false);
    });

    it('only latest call result takes effect', async () => {
        let resolve1, resolve2;
        const barrier1 = new Promise(r => { resolve1 = r; });
        const barrier2 = new Promise(r => { resolve2 = r; });
        const domWrites = [];

        const fn = latestOnly(async (stale, id, barrier) => {
            await barrier;
            if (!stale()) {
                domWrites.push(id);
            }
        });

        const p1 = fn('first', barrier1);
        const p2 = fn('second', barrier2);

        // Resolve second first, then first
        resolve2();
        await p2;
        resolve1();
        await p1;

        // Only second call should have written
        expect(domWrites).toEqual(['second']);
    });

    it('preserves function name', () => {
        const wrapped = latestOnly(async function myRenderer(stale) {});
        expect(wrapped.name).toBe('myRenderer');
    });

    it('third call supersedes second', async () => {
        let resolve1, resolve2, resolve3;
        const b1 = new Promise(r => { resolve1 = r; });
        const b2 = new Promise(r => { resolve2 = r; });
        const b3 = new Promise(r => { resolve3 = r; });
        const domWrites = [];

        const fn = latestOnly(async (stale, id, barrier) => {
            await barrier;
            if (!stale()) domWrites.push(id);
        });

        const p1 = fn('first', b1);
        const p2 = fn('second', b2);
        const p3 = fn('third', b3);

        resolve3();
        await p3;
        resolve2();
        await p2;
        resolve1();
        await p1;

        expect(domWrites).toEqual(['third']);
    });
});
