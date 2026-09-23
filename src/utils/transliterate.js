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

// transliterate text from Latin to the given script, or back if isLatinToScript is false
export const transliterate = (text, scriptType, isLatinToScript) => {
    if (scriptType === ScriptType.TODHRI || scriptType === ScriptType.ELBASAN) text = text.toLowerCase();
    const mapping = mappings[scriptType];
    const activeMapping = isLatinToScript ? mapping : flipMapping(mapping);
    const pattern = new RegExp(Object.keys(activeMapping).join('|'), 'g');
    return text.replace(pattern, match => activeMapping[match]);
};
