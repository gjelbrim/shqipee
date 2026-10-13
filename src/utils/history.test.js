import {describe, expect, it} from 'vitest';
import {addEntry, removeEntry, MAX_HISTORY} from './history.js';

/** @import {HistoryEntry} from './history.js' */

/** @param {HistoryEntry[]} entries */
const texts = (entries) => entries.map(entry => entry.text);

describe('history', () => {
    it('adds entries newest first', () => {
        const entries = addEntry(addEntry([], 'dhe', true), 'nata', true);
        expect(texts(entries)).toEqual(['nata', 'dhe']);
    });

    it('ignores empty and whitespace-only input', () => {
        expect(addEntry([], '   ', true)).toEqual([]);
    });

    it('updates the newest entry while typing continues', () => {
        let entries = addEntry([], 'shq', true);
        entries = addEntry(entries, 'shqip', true);
        entries = addEntry(entries, 'shqipëria', true);
        expect(texts(entries)).toEqual(['shqipëria']);
    });

    it('updates the newest entry when deleting from its end', () => {
        const entries = addEntry(addEntry([], 'shqipëria', true), 'shqip', true);
        expect(texts(entries)).toEqual(['shqip']);
    });

    it('keeps separate entries for the other direction', () => {
        const entries = addEntry(addEntry([], 'shq', true), 'shqip', false);
        expect(entries.map(entry => [entry.text, entry.isLatinToScript])).toEqual([['shqip', false], ['shq', true]]);
    });

    it('moves an existing text to the top instead of duplicating it', () => {
        let entries = addEntry([], 'dhe', true);
        entries = addEntry(entries, 'nata', true);
        entries = addEntry(entries, 'dhe', true);
        expect(texts(entries)).toEqual(['dhe', 'nata']);
    });

    it(`keeps at most ${MAX_HISTORY} entries`, () => {
        /** @type {HistoryEntry[]} */
        let entries = [];
        for (let i = 0; i < MAX_HISTORY + 5; i++) entries = addEntry(entries, `word ${String.fromCharCode(97 + i)}`, true);
        expect(entries).toHaveLength(MAX_HISTORY);
        expect(entries[0].text).toBe(`word ${String.fromCharCode(97 + MAX_HISTORY + 4)}`);
    });

    it('removes a single entry', () => {
        const entries = addEntry(addEntry(addEntry([], 'a1', true), 'b2', true), 'c3', true);
        expect(texts(removeEntry(entries, 1))).toEqual(['c3', 'a1']);
    });
});
