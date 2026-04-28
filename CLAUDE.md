# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:5173, SPA routing via historyApiFallback)
npm run build     # Build to ./dist
npm run preview   # Preview the production build
```

No test runner is configured.

## Architecture

**shqipee** is a Svelte 5 SPA that transliterates Albanian Latin text into three historical scripts — Elbasan, Vithkuqi, and Todhri — and back. Routing is handled by `svelte-routing` (client-side only; `historyApiFallback: true` in Vite makes deep links work in dev).

### Data flow

```
src/data/mappings.js          — character maps (Latin → Unicode codepoints)
src/utils/scriptTypes.js      — ScriptType enum { ELBASAN, VITHKUQI, TODHRI }
src/routes/{elbasan,vithkuqi,todhri}.svelte  — one route per script, passes scriptType prop down
src/components/Transliterator.svelte         — core logic: regex-replace transliteration, swap direction, localStorage persistence
src/components/TopSection.svelte             — heading + Navbar
src/components/Navbar.svelte                 — links to the three routes
src/components/BottomContent.svelte          — supplementary info per script
```

### Key transliteration details

- Mapping keys in `mappings.js` are ordered longest-first so the `RegExp(Object.keys(mapping).join('|'))` pattern matches multi-character digraphs/trigraphs before single letters.
- Elbasan and Todhri are always lowercased before transliteration; Vithkuqi is case-sensitive (separate uppercase and lowercase entries in the map).
- `flipMapping()` in `Transliterator.svelte` inverts a mapping for script→Latin direction.
- `localStorage` persists `transliterationInput` and `transliterationIsLatin` across page reloads.

### Custom font

`src/assets/TodhriFont.ttf` is loaded globally in `src/app.css` for the Todhri script rendering.

### Routing

`App.svelte` uses `<Router>` with three `<Route>` entries (`/`, `/vithkuqi`, `/todhri`). The Navbar uses `svelte-routing`'s `use:link` directive and `useLocation()` to highlight the active route.
