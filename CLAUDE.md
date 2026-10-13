# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:5173, SPA routing via historyApiFallback)
npm run build     # Build to ./dist
npm run preview   # Preview the production build
npm test          # Run Vitest unit tests once
```

Tests live next to the code (`*.test.js`). CI (`.github/workflows/ci.yml`) runs `npm test` and `npm run build` on every PR and push to `main`.

## Architecture

**shqipee** is a Svelte 5 SPA that transliterates Albanian Latin text into three historical scripts — Elbasan, Vithkuqi, and Todhri — and back. Routing is a small hand-written client-side router in `src/router.svelte.js` (`historyApiFallback: true` in Vite makes deep links work in dev; `vercel.json` rewrites all paths to `index.html` in production).

### Data flow

```
src/data/mappings.js          — character maps (Latin → Unicode codepoints)
src/utils/scriptTypes.js      — ScriptType enum { ELBASAN, VITHKUQI, TODHRI }
src/utils/transliterate.js    — pure transliterate(text, scriptType, isLatinToScript) + flipMapping()
src/routes/ScriptRoute.svelte                — page for one script (title, TopSection, Transliterator, BottomContent); App.svelte maps paths to script types
src/components/Transliterator.svelte         — UI: calls transliterate(), swap direction, clipboard, localStorage persistence
src/utils/alphabet.js         — getAlphabet(scriptType): letters for the alphabet table (Albanian order, then script extras; Vithkuqi also capitals)
src/panel.svelte.js           — shared `panel.open` (null | 'alphabet' | 'history'); on mobile App hides the floating theme button while a panel is open
src/utils/history.js          — history per script (localStorage `transliterationHistory:<script>`, max 20): addEntry() merges continued typing into the newest entry and moves repeats to the top
src/components/HistoryList.svelte            — history entries (restore on click, ✕ removes one, "clear history" needs a second click)
src/utils/shareLink.js        — buildShareUrl()/parseShareParams(): share links `/<script>?text=…[&from=<script>]`
src/components/AlphabetGrid.svelte           — clickable alphabet table (Vithkuqi: shift tile toggles capitals), opened by the keyboard icon only in script → Latin direction. Alphabet and history share one panel slot next to the input: a popover over the input heading (desktop/tablet), an inline panel between input and swap button (mobile, `isMobile` via matchMedia at the 768px breakpoint)
src/components/TopSection.svelte             — heading + Navbar
src/router.svelte.js                         — reactive router state + navigate()
src/components/Navbar.svelte                 — links to the three routes
src/components/BottomContent.svelte          — supplementary info per script
```

### Key transliteration details

- Mapping keys in `mappings.js` are ordered longest-first so the `RegExp(Object.keys(mapping).join('|'))` pattern matches multi-character digraphs/trigraphs before single letters.
- Elbasan and Todhri are always lowercased before transliteration; Vithkuqi is case-sensitive (separate uppercase and lowercase entries in the map).
- `flipMapping()` in `transliterate.js` inverts a mapping for script→Latin direction; since the flipped keys lose that order, the regex alternatives are sorted by length. The regex for each script and direction is built once at module load (`matchers`), not per call.
- `localStorage` persists `transliterationInput:<script>` and `transliterationIsLatin:<script>` per script across page reloads.
- Share links: the link icon above the output copies `/<script>?text=<input>` (plus `&from=<script>` for script → Latin), or opens the system share sheet on touch devices. On load, `?text=` wins over the saved state, is saved, and is removed from the address bar via `history.replaceState`.


- History: the input is added after a 2s typing pause and on copy, share, swap and leaving the page (`commitHistory`).
- The alphabet popover inserts glyphs at the caret of the input without focusing it (so a phone's keyboard stays closed). Transliterator tracks the caret itself (`caret`), because browsers reset the selection of an unfocused textarea when its value is set.

### Fonts

All fonts are self-hosted WOFF2 files in `src/assets/` (no Google Fonts), declared in `src/app.css` with `font-display: swap` (the script fonts also with a `unicode-range`, so each page only downloads the fonts it renders): Roboto (variable, subset to Latin), Noto Sans Elbasan, Noto Sans Vithkuqi (variable) and Noto Serif Todhri (family name `Todhri`). Regular text is set to weight 500. All are SIL OFL 1.1; the `OFL_*.txt` files next to them must stay.

To regenerate from the upstream TTFs (fonttools + brotli), keep the name table so the copyright/license entries survive:

```bash
pyftsubset Roboto-VariableFont_wdth,wght.ttf --unicodes="U+0000-024F,U+0300-036F,U+2000-206F,U+20AC,U+2122,U+2190-21FF" \
  --layout-features='*' --name-IDs='*' --name-languages='*' --flavor=woff2 --output-file=Roboto-VariableFont_wdth_wght-latin.woff2
fonttools ttLib.woff2 compress -o NotoSansElbasan-Regular.woff2 NotoSansElbasan-Regular.ttf   # same for Vithkuqi, Todhri
```

### Styling

Global design tokens (colors, page padding, column widths, accent bar width, heading sizes) are CSS custom properties on `:root` in `src/app.css`; components use `var(--…)` instead of literal values. Mobile values are overridden in one `@media (max-width: 768px) { :root { … } }` block. Media queries can't use custom properties, so the two breakpoints are literal: `1200px` (stacked, one column) and `768px` (mobile). They're documented at the top of `app.css`, and `src/breakpoints.test.js` fails on any other `@media` value.

Dark mode: `:root[data-theme="dark"]` in `app.css` redefines the color tokens (and `--icon-filter`, which lightens the black icon SVGs). Keep new colors as tokens so both themes stay in sync. An inline script in `index.html` sets `data-theme` before the first paint from the saved choice (`localStorage.theme`) or the system setting; `src/theme.svelte.js` holds the state, follows system changes until the user picks a theme, and `ThemeToggle.svelte` (fixed bottom-right, rendered in `App.svelte`) switches it.

### Accessibility

- `.visually-hidden` (global, `app.css`) hides text on screen but keeps it for screen readers, e.g. "(opens in a new tab)" on external links.
- The textareas are labelled by their `h2` (`aria-labelledby`) and carry BCP 47 language tags (`sq`, `sq-Elba`, `sq-Vith`, `sq-Todr`) that follow the swap direction.
- `Transliterator.svelte` has one `role="status"` region (`announcement`) for spoken feedback (copy, swap); errors use a visually hidden `role="alert"`. Visible feedback never shifts the layout: the icon turns into a check mark (success) or a red cross (clipboard error) and the line under the field flashes red.
- Keep a visible focus state for anything focusable; the textareas show it as a red bottom line.

### Routing

`src/router.svelte.js` exports a `$state` object `router` (`router.path`, kept in sync on `popstate`) and `navigate(href)`, which calls `history.pushState` and updates `router.path`. `App.svelte` picks what to render from `router.path` (`/` → Elbasan, `/vithkuqi`, `/todhri`, anything else → `notfound.svelte`). `Navbar.svelte` renders plain `<a>` links whose `onclick` calls `navigate()` and highlights the link matching `router.path`.
