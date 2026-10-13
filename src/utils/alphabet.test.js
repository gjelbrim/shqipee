import {describe, expect, it} from 'vitest';
import {getAlphabet} from './alphabet.js';
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
