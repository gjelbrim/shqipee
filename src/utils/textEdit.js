// editing the input from the on-screen alphabet, which can't rely on the browser's own
// editing because the textarea isn't focused (see Transliterator)

const graphemes = new Intl.Segmenter(undefined, {granularity: 'grapheme'});

// backspace: removes the selection, or else the whole letter before the caret; script
// letters take two UTF-16 units and the Elbasan "xh" carries a zero-width non-joiner,
// so a letter is a grapheme cluster, not a single code unit
/**
 * @param {string} text
 * @param {number} start  selection start (caret position if nothing is selected)
 * @param {number} end    selection end
 * @returns {{text: string, caret: number}}
 */
export const deleteBackward = (text, start, end) => {
    if (start !== end) return {text: text.slice(0, start) + text.slice(end), caret: start};
    if (start === 0) return {text, caret: 0};
    const before = [...graphemes.segment(text.slice(0, start))].at(-1)?.segment ?? '';
    const from = start - before.length;
    return {text: text.slice(0, from) + text.slice(start), caret: from};
};
