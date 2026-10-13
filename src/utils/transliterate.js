import {elbasanMapping, vithkuqiMapping, todhriMapping} from '../data/mappings.js';
import {ScriptType} from './scriptTypes.js';

/** @import {Script} from './scriptTypes.js' */
/** @typedef {Record<string, string>} Mapping */

/** @type {Record<Script, Mapping>} */
const mappings = {
    [ScriptType.ELBASAN]: elbasanMapping,
    [ScriptType.VITHKUQI]: vithkuqiMapping,
    [ScriptType.TODHRI]: todhriMapping
};

// flip mapping
/** @param {Mapping} mapping */
export const flipMapping = (mapping) => {
    return Object.entries(mapping).reduce((flipped, [key, value]) => {
      flipped[value] = key;
      return flipped;
    }, /** @type {Mapping} */ ({}));
};

// regex matching any key of the mapping; longest keys first so multi-character
// sequences match before their prefixes (the flipped mappings lose that order)
/** @param {Mapping} mapping */
const buildMatcher = (mapping) => {
    const keys = Object.keys(mapping).sort((a, b) => b.length - a.length);
    return {mapping, pattern: new RegExp(keys.join('|'), 'g')};
};

// built once per script and direction instead of on every call
/** @typedef {ReturnType<typeof buildMatcher>} Matcher */
const matchers = /** @type {Record<Script, {toScript: Matcher, toLatin: Matcher}>} */ (Object.fromEntries(Object.entries(mappings).map(([scriptType, mapping]) => [
    scriptType,
    {toScript: buildMatcher(mapping), toLatin: buildMatcher(flipMapping(mapping))}
])));

// transliterate text from Latin to the given script, or back if isLatinToScript is false
/**
 * @param {string} text
 * @param {Script} scriptType
 * @param {boolean} isLatinToScript
 * @returns {string}
 */
export const transliterate = (text, scriptType, isLatinToScript) => {
    if (scriptType === ScriptType.TODHRI || scriptType === ScriptType.ELBASAN) text = text.toLowerCase();
    const {mapping, pattern} = matchers[scriptType][isLatinToScript ? 'toScript' : 'toLatin'];
    return text.replace(pattern, match => mapping[match]);
};
