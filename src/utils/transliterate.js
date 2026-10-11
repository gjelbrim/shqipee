import {elbasanMapping, vithkuqiMapping, todhriMapping} from '../data/mappings.js';
import {ScriptType} from './scriptTypes.js';

const mappings = {
    [ScriptType.ELBASAN]: elbasanMapping,
    [ScriptType.VITHKUQI]: vithkuqiMapping,
    [ScriptType.TODHRI]: todhriMapping
};

// flip mapping
export const flipMapping = (mapping) => {
    return Object.entries(mapping).reduce((flipped, [key, value]) => {
      flipped[value] = key;
      return flipped;
    }, {});
};

// regex matching any key of the mapping; longest keys first so multi-character
// sequences match before their prefixes (the flipped mappings lose that order)
const buildMatcher = (mapping) => {
    const keys = Object.keys(mapping).sort((a, b) => b.length - a.length);
    return {mapping, pattern: new RegExp(keys.join('|'), 'g')};
};

// built once per script and direction instead of on every call
const matchers = Object.fromEntries(Object.entries(mappings).map(([scriptType, mapping]) => [
    scriptType,
    {toScript: buildMatcher(mapping), toLatin: buildMatcher(flipMapping(mapping))}
]));

// transliterate text from Latin to the given script, or back if isLatinToScript is false
export const transliterate = (text, scriptType, isLatinToScript) => {
    if (scriptType === ScriptType.TODHRI || scriptType === ScriptType.ELBASAN) text = text.toLowerCase();
    const {mapping, pattern} = matchers[scriptType][isLatinToScript ? 'toScript' : 'toLatin'];
    return text.replace(pattern, match => mapping[match]);
};
