import {describe, expect, it} from 'vitest';
import {buildShareUrl, parseShareParams} from './shareLink.js';

describe('share links', () => {
    it('builds a Latin link without a direction', () => {
        expect(buildShareUrl('https://shqip.ee/vithkuqi', 'vithkuqi', 'Shqipëria', true))
            .toBe('https://shqip.ee/vithkuqi?text=Shqip%C3%ABria');
    });

    it('adds the script as "from" for script -> Latin', () => {
        expect(buildShareUrl('https://shqip.ee/todhri', 'todhri', 'x', false))
            .toBe('https://shqip.ee/todhri?text=x&from=todhri');
    });

    it('drops existing query and hash from the page URL', () => {
        expect(buildShareUrl('https://shqip.ee/?text=old#top', 'elbasan', 'new', true))
            .toBe('https://shqip.ee/?text=new');
    });

    it.each([
        ['Latin text', 'shqip', true],
        ['script text with a joiner', '\u{10503}‌', false],
        ['text with & = ? # and spaces', 'a & b = c? #d', true]
    ])('round-trips %s', (_, text, isLatinToScript) => {
        const url = new URL(buildShareUrl('https://shqip.ee/', 'elbasan', text, isLatinToScript));
        expect(parseShareParams(url.search, 'elbasan')).toEqual({text, isLatinToScript});
    });

    it('ignores pages without a text parameter', () => {
        expect(parseShareParams('', 'elbasan')).toBeNull();
        expect(parseShareParams('?from=elbasan', 'elbasan')).toBeNull();
    });

    it('treats "from" for another script as Latin input', () => {
        expect(parseShareParams('?text=x&from=todhri', 'elbasan')).toEqual({text: 'x', isLatinToScript: true});
    });
});
