import {elbasanMapping, vithkuqiMapping, todhriMapping} from '../data/mappings.js';
import {ScriptType} from './scriptTypes.js';

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

const isLowerCase = (key) => key === key.toLowerCase();
const capitalize = (key) => key[0].toUpperCase() + key.slice(1);

// the letters of the Albanian alphabet first, then the script's extra letters in mapping order
const ordered = (keys) => [
    ...ALBANIAN_ALPHABET.filter(letter => keys.includes(letter)),
    ...keys.filter(key => !ALBANIAN_ALPHABET.includes(key))
];

// letters of a script for the alphabet table: [{latin, glyph}], grouped into rows of
// lowercase letters and, for Vithkuqi, capitals (title case, e.g. "Dh")
export const getAlphabet = (scriptType) => {
    const mapping = mappings[scriptType];
    const lower = ordered(Object.keys(mapping).filter(isLowerCase));
    const groups = [{name: 'letters', letters: lower.map(latin => ({latin, glyph: mapping[latin]}))}];
    if (scriptType === ScriptType.VITHKUQI) {
        const capitals = lower.map(capitalize).filter(latin => latin in mapping);
        groups.push({name: 'capitals', letters: capitals.map(latin => ({latin, glyph: mapping[latin]}))});
    }
    return groups;
};
