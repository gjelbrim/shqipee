/// <reference types="node" />
import {describe, expect, it} from 'vitest';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

// the Content-Security-Policy in vercel.json only allows inline scripts by hash; if the
// theme script in index.html changes, its new hash has to go into vercel.json, otherwise
// browsers block it (dark mode would flash light on load)
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const csp = vercel.headers.flatMap((/** @type {{headers: {key: string, value: string}[]}} */ rule) => rule.headers)
    .find((/** @type {{key: string}} */ header) => header.key === 'Content-Security-Policy')?.value ?? '';
const inlineScripts = [...readFileSync('index.html', 'utf8').matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => match[1]);

describe('content security policy', () => {
    it('is set in vercel.json', () => {
        expect(csp).toContain("frame-ancestors 'none'");
    });

    it('finds the inline theme script', () => {
        expect(inlineScripts.length).toBeGreaterThan(0);
    });

    it.each(inlineScripts.map((script, i) => [i, script]))('allows inline script %i by its hash', (_, script) => {
        const hash = createHash('sha256').update(String(script)).digest('base64');
        expect(csp).toContain(`'sha256-${hash}'`);
    });

    it('allows no inline scripts beyond the hashed ones', () => {
        expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    });
});
