import {elbasanMapping, vithkuqiMapping, todhriMapping} from '../data/mappings.js';
import {ScriptType} from './scriptTypes.js';

/** @import {Script} from './scriptTypes.js' */
/** @import {Mapping} from './transliterate.js' */
/** @typedef {{latin: string, glyph: string}} Letter */
/** @typedef {{name: 'letters' | 'capitals', letters: Letter[]}} LetterGroup */
/** @typedef {'off' | 'once' | 'lock'} ShiftState */

/** @type {Record<Script, Mapping>} */
const mappings = {
    [ScriptType.ELBASAN]: elbasanMapping,
    [ScriptType.VITHKUQI]: vithkuqiMapping,
    [ScriptType.TODHRI]: todhriMapping
};

// the 36 letters of the Albanian alphabet, in order
const ALBANIAN_ALPHABET = [
    'a', 'b', 'c', 'ç', 'd', 'dh', 'e', 'ë', 'f', 'g', 'gj', 'h', 'i', 'j', 'k', 'l', 'll', 'm',
    'n', 'nj', 'o', 'p', 'q', 'r', 'rr', 's', 'sh', 't', 'th', 'u', 'v', 'x', 'xh', 'y', 'z', 'zh'
];

/** @param {string} key */
const isLowerCase = (key) => key === key.toLowerCase();
/** @param {string} key */
const capitalize = (key) => key[0].toUpperCase() + key.slice(1);

// the letters of the Albanian alphabet first, then the script's extra letters in mapping order
/** @param {string[]} keys */
const ordered = (keys) => [
    ...ALBANIAN_ALPHABET.filter(letter => keys.includes(letter)),
    ...keys.filter(key => !ALBANIAN_ALPHABET.includes(key))
];

// letters of a script for the alphabet table: [{latin, glyph}], grouped into rows of
// lowercase letters and, for Vithkuqi, capitals (title case, e.g. "Dh")
/**
 * @param {Script} scriptType
 * @returns {LetterGroup[]}
 */
export const getAlphabet = (scriptType) => {
    const mapping = mappings[scriptType];
    const lower = ordered(Object.keys(mapping).filter(isLowerCase));
    /** @type {LetterGroup[]} */
    const groups = [{name: 'letters', letters: lower.map(latin => ({latin, glyph: mapping[latin]}))}];
    if (scriptType === ScriptType.VITHKUQI) {
        const capitals = lower.map(capitalize).filter(latin => latin in mapping);
        groups.push({name: 'capitals', letters: capitals.map(latin => ({latin, glyph: mapping[latin]}))});
    }
    return groups;
};

// shift key of the alphabet table, like a phone keyboard: 'off', 'once' (next letter
// is a capital, then back to 'off') or 'lock' (caps lock, from a double tap or long press)
/**
 * @param {ShiftState} state
 * @param {boolean} isDoubleTap
 * @returns {ShiftState}
 */
export const shiftAfterTap = (state, isDoubleTap) => {
    if (isDoubleTap && state === 'once') return 'lock';
    return state === 'off' ? 'once' : 'off';
};

/**
 * @param {ShiftState} state
 * @returns {ShiftState}
 */
export const shiftAfterLetter = (state) => state === 'once' ? 'off' : state;
