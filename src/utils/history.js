// translation history per script, newest first: [{text, isLatinToScript, time}]

/** @import {Script} from './scriptTypes.js' */
/** @typedef {{text: string, isLatinToScript: boolean, time: number}} HistoryEntry */

export const MAX_HISTORY = 20;

/** @param {Script} scriptType */
const storageKey = (scriptType) => `transliterationHistory:${scriptType}`;

// add the current input; continuing to type the newest entry's text (or deleting from
// its end) updates that entry instead of adding one per pause, and an existing text
// moves to the top instead of appearing twice
/**
 * @param {HistoryEntry[]} entries
 * @param {string} text
 * @param {boolean} isLatinToScript
 * @param {number} [time]
 * @returns {HistoryEntry[]}
 */
export const addEntry = (entries, text, isLatinToScript, time = Date.now()) => {
    if (!text.trim()) return entries;
    const [newest, ...rest] = entries;
    const continuesNewest = newest
        && newest.isLatinToScript === isLatinToScript
        && (text.startsWith(newest.text) || newest.text.startsWith(text));
    const older = (continuesNewest ? rest : entries)
        .filter(entry => entry.text !== text || entry.isLatinToScript !== isLatinToScript);
    return [{text, isLatinToScript, time}, ...older].slice(0, MAX_HISTORY);
};

/**
 * @param {HistoryEntry[]} entries
 * @param {number} index
 * @returns {HistoryEntry[]}
 */
export const removeEntry = (entries, index) => entries.filter((_, i) => i !== index);

/**
 * @param {Script} scriptType
 * @returns {HistoryEntry[]}
 */
export const loadHistory = (scriptType) => {
    try {
        const entries = JSON.parse(localStorage.getItem(storageKey(scriptType)) ?? '[]');
        return Array.isArray(entries) ? entries.filter(entry => typeof entry?.text === 'string') : [];
    } catch (e) {
        return [];
    }
};

/**
 * @param {Script} scriptType
 * @param {HistoryEntry[]} entries
 */
export const saveHistory = (scriptType, entries) => {
    try {
        if (entries.length) localStorage.setItem(storageKey(scriptType), JSON.stringify(entries));
        else localStorage.removeItem(storageKey(scriptType));
    } catch (e) {
        console.warn('localStorage unavailable, history will not be persisted:', e);
    }
};
