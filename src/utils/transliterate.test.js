import {describe, expect, it} from 'vitest';
import {transliterate} from './transliterate.js';
import {ScriptType} from './scriptTypes.js';
import {elbasanMapping, vithkuqiMapping, todhriMapping} from '../data/mappings.js';

const toScript = (text, scriptType) => transliterate(text, scriptType, true);
const toLatin = (text, scriptType) => transliterate(text, scriptType, false);

const mappings = {
    [ScriptType.ELBASAN]: elbasanMapping,
    [ScriptType.VITHKUQI]: vithkuqiMapping,
    [ScriptType.TODHRI]: todhriMapping
};

describe('mappings', () => {
    it.each(Object.entries(mappings))('%s keys are ordered longest-first', (_, mapping) => {
        const lengths = Object.keys(mapping).map(key => key.length);
        expect(lengths).toEqual([...lengths].sort((a, b) => b - a));
    });
});

describe('elbasan', () => {
    const E = ScriptType.ELBASAN;

    it('maps single letters', () => {
        expect(toScript('abc', E)).toBe('\u{10500}\u{10501}\u{10502}');
    });

    it('prefers digraphs and trigraphs over single letters', () => {
        expect(toScript('sh', E)).toBe('\u{1051C}');
        expect(toScript('ngj', E)).toBe('\u{10514}\u{1050B}');
        expect(toScript('ng', E)).toBe('\u{10514}\u{1050A}');
    });

    it('is case-insensitive', () => {
        expect(toScript('SHQIP', E)).toBe(toScript('shqip', E));
    });

    it('keeps unmapped characters', () => {
        expect(toScript('a, b! 1', E)).toBe('\u{10500}, \u{10501}! 1');
    });
});

describe('vithkuqi', () => {
    const V = ScriptType.VITHKUQI;

    it('is case-sensitive', () => {
        expect(toScript('A', V)).toBe('\u{10570}');
        expect(toScript('a', V)).toBe('\u{10597}');
    });

    it('maps title-case and upper-case digraphs to the same capital', () => {
        expect(toScript('Sh', V)).toBe('\u{1058D}');
        expect(toScript('SH', V)).toBe('\u{1058D}');
    });

    it('marks xh with a zero-width non-joiner to tell it apart from ç', () => {
        expect(toScript('xh', V)).toBe('\u{1059B}‌');
        expect(toScript('ç', V)).toBe('\u{1059B}');
    });
});

describe('todhri', () => {
    const T = ScriptType.TODHRI;

    it('prefers trigraphs over digraphs', () => {
        expect(toScript('sht', T)).toBe('\u{105E1}');
        expect(toScript('sh', T)).toBe('\u{105E0}');
    });

    it('is case-insensitive', () => {
        expect(toScript('Shtëpi', T)).toBe(toScript('shtëpi', T));
    });
});

describe('round trip', () => {
    const words = {
        [ScriptType.ELBASAN]: ['shqipëri', 'ngjyrë', 'dhe', 'ndërtesë', 'çaj', 'gjuha'],
        [ScriptType.VITHKUQI]: ['Shqipëria', 'Gjergj', 'xhami', 'çaj', 'Llapi', 'nata', 'Zhurmë', 'zhurmë', 'ZHURMË'],
        [ScriptType.TODHRI]: ['shtëpi', 'asht', 'nxënës', 'juga', 'mbret']
    };

    for (const [scriptType, list] of Object.entries(words)) {
        it.each(list)(`${scriptType}: %s`, (word) => {
            const expected = scriptType === ScriptType.VITHKUQI ? word : word.toLowerCase();
            expect(toLatin(toScript(word, scriptType), scriptType)).toBe(expected);
        });
    }
});
