import {describe, expect, it} from 'vitest';
import {deleteBackward} from './textEdit.js';
import {transliterate} from './transliterate.js';
import {ScriptType} from './scriptTypes.js';

describe('deleteBackward', () => {
    it('removes the character before the caret', () => {
        expect(deleteBackward('shqip', 5, 5)).toEqual({text: 'shqi', caret: 4});
        expect(deleteBackward('shqip', 2, 2)).toEqual({text: 'sqip', caret: 1});
    });

    it('does nothing at the start', () => {
        expect(deleteBackward('shqip', 0, 0)).toEqual({text: 'shqip', caret: 0});
        expect(deleteBackward('', 0, 0)).toEqual({text: '', caret: 0});
    });

    it('removes the selection instead', () => {
        expect(deleteBackward('shqipëri', 1, 5)).toEqual({text: 'sëri', caret: 1});
    });

    it('removes a whole script letter, not half of it', () => {
        const text = transliterate('dhe', ScriptType.VITHKUQI, true);
        const {text: rest, caret} = deleteBackward(text, text.length, text.length);
        expect(rest).toBe(transliterate('dh', ScriptType.VITHKUQI, true));
        expect(caret).toBe(rest.length);
    });

    it('removes the Elbasan xh together with its zero-width non-joiner', () => {
        const text = transliterate('axh', ScriptType.ELBASAN, true);
        expect(deleteBackward(text, text.length, text.length).text).toBe(transliterate('a', ScriptType.ELBASAN, true));
    });

    it('removes a letter with a combining accent as one', () => {
        expect(deleteBackward('në', 3, 3)).toEqual({text: 'n', caret: 1});
    });
});
