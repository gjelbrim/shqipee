/// <reference types="node" />
import {describe, expect, it} from 'vitest';
import {readFileSync} from 'node:fs';
import {PAGE_META, SITE_URL, renderHead} from './pageMeta.js';
import {ScriptType} from './scriptTypes.js';

const indexHtml = readFileSync('index.html', 'utf8');

describe('page meta', () => {
    it('matches the head of index.html for the Elbasan page', () => {
        // index.html is the Elbasan page; its tags must say the same as PAGE_META
        expect(renderHead(indexHtml, PAGE_META[ScriptType.ELBASAN])).toBe(indexHtml);
    });

    it('renders the head of another page and leaves the rest alone', () => {
        const meta = PAGE_META[ScriptType.VITHKUQI];
        const html = renderHead(indexHtml, meta);
        expect(html).toContain(`<title>${meta.title}</title>`);
        expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/vithkuqi" />`);
        expect(html).toContain(`<meta property="og:url" content="${SITE_URL}/vithkuqi" />`);
        expect(html).toContain(`<meta property="og:title" content="${meta.title}" />`);
        expect(html).toContain(`<meta name="description" content="${meta.description}" />`);
        expect(html.split('\n').length).toBe(indexHtml.split('\n').length);
        expect(html).toContain(indexHtml.slice(indexHtml.indexOf('<script>'), indexHtml.indexOf('</script>')));
    });

    it('escapes quotes and angle brackets', () => {
        const html = renderHead(indexHtml, {path: '/x', title: 'a "b" <c>', description: 'd & e'});
        expect(html).toContain('<title>a &quot;b&quot; &lt;c&gt;</title>');
        expect(html).toContain('content="d &amp; e"');
    });

    it('fails when index.html lacks a tag', () => {
        expect(() => renderHead('<title>x</title>', PAGE_META[ScriptType.TODHRI])).toThrow();
    });

    it('keeps titles and descriptions short enough for search results', () => {
        for (const meta of Object.values(PAGE_META)) {
            expect(meta.title.length).toBeLessThanOrEqual(60);
            expect(meta.description.length).toBeLessThanOrEqual(170);
        }
    });

    it('lists every page in the sitemap', () => {
        const sitemap = readFileSync('public/sitemap.xml', 'utf8');
        const urls = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(match => match[1]).sort();
        expect(urls).toEqual(Object.values(PAGE_META).map(meta => SITE_URL + meta.path).sort());
    });

    it('has valid structured data', () => {
        const match = indexHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        expect(match).not.toBeNull();
        const data = JSON.parse(match?.[1] ?? '');
        expect(data['@graph'].map((/** @type {{'@type': string}} */ item) => item['@type'])).toEqual(['WebSite', 'WebApplication']);
    });
});
