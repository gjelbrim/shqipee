// per-page title, description and URL; used at runtime (applyPageMeta, when the client-side
// router switches pages) and at build time (renderHead, which writes vithkuqi.html and
// todhri.html so link previews and crawlers without JavaScript get the right head too)
import {ScriptType} from './scriptTypes.js';

/** @import {Script} from './scriptTypes.js' */
/** @typedef {{path: string, title: string, description: string}} PageMeta */

export const SITE_URL = 'https://shqip.ee';

/** @type {Record<Script, PageMeta>} */
export const PAGE_META = {
    [ScriptType.ELBASAN]: {
        path: '/',
        title: 'Albanian Elbasan Alphabet Converter | shqip.ee',
        description: 'Convert Albanian text from the Latin alphabet into the historical Elbasan script and back, letter by letter. Free, no sign-up, works offline.'
    },
    [ScriptType.VITHKUQI]: {
        path: '/vithkuqi',
        title: 'Albanian Vithkuqi Alphabet Converter | shqip.ee',
        description: 'Convert Albanian text from the Latin alphabet into the Vithkuqi (Büthakukye) script of Naum Veqilharxhi and back, with capital letters. Free, no sign-up, works offline.'
    },
    [ScriptType.TODHRI]: {
        path: '/todhri',
        title: 'Albanian Todhri Alphabet Converter | shqip.ee',
        description: 'Convert Albanian text from the Latin alphabet into the historical Todhri script and back, letter by letter. Free, no sign-up, works offline.'
    }
};

/** @param {string} text */
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// the tags in index.html that differ per page, as [pattern, replacement for a page]
/** @type {[RegExp, (meta: PageMeta) => string][]} */
const HEAD_TAGS = [
    [/<title>[^<]*<\/title>/, meta => `<title>${escapeHtml(meta.title)}</title>`],
    [/<meta name="description" content="[^"]*" \/>/, meta => `<meta name="description" content="${escapeHtml(meta.description)}" />`],
    [/<link rel="canonical" href="[^"]*" \/>/, meta => `<link rel="canonical" href="${SITE_URL}${meta.path}" />`],
    [/<meta property="og:url" content="[^"]*" \/>/, meta => `<meta property="og:url" content="${SITE_URL}${meta.path}" />`],
    [/<meta property="og:title" content="[^"]*" \/>/, meta => `<meta property="og:title" content="${escapeHtml(meta.title)}" />`],
    [/<meta property="og:description" content="[^"]*" \/>/, meta => `<meta property="og:description" content="${escapeHtml(meta.description)}" />`]
];

// index.html with the head of the given page; throws if a tag is missing so the build
// fails instead of silently shipping the Elbasan head on every page
/**
 * @param {string} html
 * @param {PageMeta} meta
 * @returns {string}
 */
export const renderHead = (html, meta) => HEAD_TAGS.reduce((result, [pattern, render]) => {
    if (!pattern.test(result)) throw new Error(`index.html has no tag matching ${pattern}`);
    return result.replace(pattern, () => render(meta));
}, html);

// same for the live document, when the client-side router changes the page
/** @param {PageMeta} meta */
export const applyPageMeta = (meta) => {
    document.title = meta.title;
    const url = SITE_URL + meta.path;
    /** @type {[string, string, string][]} */
    const tags = [
        ['meta[name="description"]', 'content', meta.description],
        ['link[rel="canonical"]', 'href', url],
        ['meta[property="og:url"]', 'content', url],
        ['meta[property="og:title"]', 'content', meta.title],
        ['meta[property="og:description"]', 'content', meta.description]
    ];
    // the 404 page removes the canonical link (see notfound.svelte)
    if (!document.head.querySelector('link[rel="canonical"]')) {
        const link = document.createElement('link');
        link.rel = 'canonical';
        document.head.append(link);
    }
    for (const [selector, attribute, value] of tags) document.head.querySelector(selector)?.setAttribute(attribute, value);
};
