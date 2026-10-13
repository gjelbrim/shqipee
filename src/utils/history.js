// translation history per script, newest first: [{text, isLatinToScript, time}]

export const MAX_HISTORY = 20;

const storageKey = (scriptType) => `transliterationHistory:${scriptType}`;

// add the current input; continuing to type the newest entry's text (or deleting from
// its end) updates that entry instead of adding one per pause, and an existing text
// moves to the top instead of appearing twice
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

export const removeEntry = (entries, index) => entries.filter((_, i) => i !== index);

export const loadHistory = (scriptType) => {
    try {
        const entries = JSON.parse(localStorage.getItem(storageKey(scriptType)) ?? '[]');
        return Array.isArray(entries) ? entries.filter(entry => typeof entry?.text === 'string') : [];
    } catch (e) {
        return [];
    }
};

export const saveHistory = (scriptType, entries) => {
    try {
        if (entries.length) localStorage.setItem(storageKey(scriptType), JSON.stringify(entries));
        else localStorage.removeItem(storageKey(scriptType));
    } catch (e) {
        console.warn('localStorage unavailable, history will not be persisted:', e);
    }
};
