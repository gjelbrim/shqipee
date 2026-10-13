# Contributing to shqip.ee

Thanks for helping! Bug reports, corrections to the character maps and small improvements are all welcome.

## Before you start

- **Bugs:** open an issue with the page (elbasan, vithkuqi or todhri), what you typed, what you expected and what you got. Browser and device help too.
- **Wrong or missing letters:** open an issue with a source (e.g. the Unicode chart or a scholarly reference) for the correct mapping.
- **New features or bigger changes:** open an issue first so we can agree on the idea and the design before you write code. The design follows a strict Swiss-style look; visual changes need the designer's OK.

## Setup

Requires Node.js 22.

```bash
git clone https://github.com/gjelbrim/shqipee.git
cd shqipee
npm ci
npm run dev       # http://localhost:5173
```

## Workflow

1. Branch off `dev` (`git checkout -b fix/short-description origin/dev`).
2. Keep a pull request to **one** change; unrelated fixes go into separate PRs.
3. Before pushing, run what CI runs:
   ```bash
   npm run check     # type check
   npm test          # unit tests
   npm run build     # production build
   ```
4. Open the pull request against **`dev`** (not `main`). Describe what changed, why, and how you tested it; add screenshots for visual changes (light and dark mode, desktop and mobile).
5. A maintainer reviews every PR. `dev` is released to `main` (and deployed) from time to time.

Commit messages: short imperative English summary (`Fix caret position after pasting`), details in the body if needed.

## Code conventions

- **Svelte 5 runes** (`$state`, `$derived`, `$props`, `$effect`); no stores, no extra UI or router libraries.
- **Types via JSDoc**, checked by `npm run check` (strict). Type props with `/** @type {{…}} */` above `$props()` and reuse the shared typedefs (`Script`, `Mapping`, `HistoryEntry`, …).
- **Tests** live next to the code (`*.test.js`, Vitest). Logic changes need a test.
- **CSS:** use the design tokens from `src/app.css` (`var(--…)`) instead of literal colors or sizes, so dark mode keeps working. Only the two breakpoints `1200px` and `768px` are allowed (a test checks this).
- **Text in the UI is all lowercase**, also labels and messages.
- **Accessibility:** everything must work with the keyboard and keep a visible focus state; give icon buttons an `aria-label`; feedback must not shift the layout.

## Good to know

- **Character maps** (`src/data/mappings.js`): keys must stay ordered longest-first (`ngj` before `ng` before `n`), and no two letters may share a code point. The tests check both and include round trips; add the word that was wrong to them.
- **Inline script in `index.html`:** the Content-Security-Policy in `vercel.json` allows it only by its SHA-256 hash. If you change it, update the hash; `src/securityHeaders.test.js` fails until you do.
- **New page:** add it to `PAGE_META` (`src/utils/pageMeta.js`), to the rewrites in `vercel.json` and to `public/sitemap.xml`.
- **Fonts** are self-hosted under the SIL Open Font License; keep the `OFL_*.txt` files next to them.
- `CLAUDE.md` describes the architecture in more detail.

## License

By contributing you agree that your contribution is licensed under the [GNU General Public License v3.0](LICENSE), like the rest of the code.
