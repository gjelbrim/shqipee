import {describe, expect, it} from 'vitest';
import {getAlphabet, shiftAfterTap, shiftAfterLetter} from './alphabet.js';
import {transliterate} from './transliterate.js';
import {ScriptType} from './scriptTypes.js';

describe('alphabet table', () => {
    it.each(Object.values(ScriptType))('%s starts with the Albanian alphabet in order', (scriptType) => {
        const latin = getAlphabet(scriptType)[0].letters.map(letter => letter.latin);
        expect(latin.slice(0, 6)).toEqual(['a', 'b', 'c', 'ç', 'd', 'dh']);
        expect(latin).toContain('zh');
    });

    it.each(Object.values(ScriptType))('%s lists every letter once', (scriptType) => {
        for (const group of getAlphabet(scriptType)) {
            const latin = group.letters.map(letter => letter.latin);
            expect(new Set(latin).size).toBe(latin.length);
        }
    });

    // clicking a tile inserts its glyph into a script -> Latin input, so it must read back as the letter
    it.each(Object.values(ScriptType))('%s glyphs transliterate back to their letter', (scriptType) => {
        for (const group of getAlphabet(scriptType)) {
            for (const {latin, glyph} of group.letters) {
                expect(transliterate(glyph, scriptType, false)).toBe(latin);
            }
        }
    });

    it('adds a row of capitals only for Vithkuqi', () => {
        expect(getAlphabet(ScriptType.VITHKUQI).map(group => group.name)).toEqual(['letters', 'capitals']);
        expect(getAlphabet(ScriptType.ELBASAN).map(group => group.name)).toEqual(['letters']);
        expect(getAlphabet(ScriptType.TODHRI).map(group => group.name)).toEqual(['letters']);
    });
});

describe('shift key', () => {
    it('a tap turns it on for one letter, the letter turns it off again', () => {
        const state = shiftAfterTap('off', false);
        expect(state).toBe('once');
        expect(shiftAfterLetter(state)).toBe('off');
    });

    it('a double tap locks it, and letters keep it locked', () => {
        const state = shiftAfterTap(shiftAfterTap('off', false), true);
        expect(state).toBe('lock');
        expect(shiftAfterLetter(state)).toBe('lock');
    });

    it('a tap turns it off from either state', () => {
        expect(shiftAfterTap('once', false)).toBe('off');
        expect(shiftAfterTap('lock', false)).toBe('off');
        expect(shiftAfterTap('lock', true)).toBe('off');
    });

    it('leaves letters alone while off', () => {
        expect(shiftAfterLetter('off')).toBe('off');
    });
});
