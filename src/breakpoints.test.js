import {describe, expect, it} from 'vitest';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

// every width-based @media query must use one of the documented breakpoints (see app.css)
const BREAKPOINTS = ['max-width: 1200px', 'max-width: 768px'];

const styleFiles = (dir) => readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return styleFiles(path);
    return /\.(svelte|css)$/.test(entry.name) ? [path] : [];
});

describe('breakpoints', () => {
    const queries = styleFiles('src').flatMap(file =>
        [...readFileSync(file, 'utf8').matchAll(/@media\s*\(([^)]*)\)/g)]
            .map(match => [file, match[1].trim()])
            .filter(([, query]) => query.includes('width'))
    );

    it('finds media queries to check', () => {
        expect(queries.length).toBeGreaterThan(0);
    });

    it.each(queries)('%s uses a documented breakpoint (%s)', (_, query) => {
        expect(BREAKPOINTS).toContain(query);
    });
});
