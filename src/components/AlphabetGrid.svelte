<script>
  import { getAlphabet, shiftAfterTap, shiftAfterLetter } from '../utils/alphabet.js';

  // clicking a letter inserts its glyph via onpick
  /** @import {Script} from '../utils/scriptTypes.js' */
  /** @import {Letter, ShiftState} from '../utils/alphabet.js' */
  /** @type {{scriptType: Script, scriptLang: string, onpick: (glyph: string) => void}} */
  let { scriptType, scriptLang, onpick } = $props();

  const groups = $derived(getAlphabet(scriptType));
  // scripts with capitals (Vithkuqi) get a shift key: a tap gives one capital, a double
  // tap or long press locks it (see shiftAfterTap)
  const capitals = $derived(groups.find(group => group.name === 'capitals'));
  /** @type {ShiftState} */
  let shift = $state('off');
  const letters = $derived(shift !== 'off' && capitals ? capitals.letters : groups[0].letters);

  const DOUBLE_TAP_MS = 400;
  const LONG_PRESS_MS = 500;
  let lastTap = 0;
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let longPressTimer;
  let longPressed = false;

  const tapShift = () => {
    // the click that ends a long press has already locked it
    if (longPressed) {
      longPressed = false;
      return;
    }
    const now = Date.now();
    shift = shiftAfterTap(shift, now - lastTap < DOUBLE_TAP_MS);
    lastTap = now;
  };
  const startLongPress = () => {
    longPressed = false;
    clearTimeout(longPressTimer);
    longPressTimer = setTimeout(() => {
      longPressed = true;
      shift = 'lock';
    }, LONG_PRESS_MS);
  };
  const cancelLongPress = () => clearTimeout(longPressTimer);

  /** @param {Letter} letter */
  const pick = (letter) => {
    onpick(letter.glyph);
    shift = shiftAfterLetter(shift);
  };
</script>

<div class="grid">
  {#each letters as letter (letter.latin)}
    <button
      class="tile"
      type="button"
      title={`insert ${letter.latin}`}
      aria-label={letter.latin}
      onclick={() => pick(letter)}
    >
      <span class="glyph" lang={scriptLang} aria-hidden="true">{letter.glyph}</span>
      <span class="latin" aria-hidden="true">{letter.latin}</span>
    </button>
  {/each}
  {#if capitals}
    <button
      class="tile shift"
      class:active={shift !== 'off'}
      class:locked={shift === 'lock'}
      type="button"
      title="tap: one capital · double tap or hold: caps lock"
      aria-label={shift === 'lock' ? 'caps lock' : 'capitals'}
      aria-pressed={shift !== 'off'}
      onclick={tapShift}
      onpointerdown={startLongPress}
      onpointerup={cancelLongPress}
      onpointerleave={cancelLongPress}
      onpointercancel={cancelLongPress}
      oncontextmenu={(event) => event.preventDefault()}
    >
      <span class="glyph" aria-hidden="true">{shift === 'lock' ? '⇪' : '⇧'}</span>
      <span class="latin" aria-hidden="true">{shift === 'off' ? 'ABC' : shift === 'once' ? 'Abc' : 'ABC lock'}</span>
    </button>
  {/if}
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
    gap: 6px;
  }

  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-height: 56px;
    padding: 6px 2px;
    background: transparent;
    color: var(--color-text);
    border: 1px solid color-mix(in srgb, var(--color-ink) 25%, transparent);
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease;
    /* no blue tap flash on mobile; hover/focus styles give the feedback */
    -webkit-tap-highlight-color: transparent;
  }

  .tile:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .glyph {
    font-size: 1.5rem;
    line-height: 1.2;
  }

  /* no double-tap zoom or long-press callout on touch screens */
  .shift {
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }

  .shift.active {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  /* caps lock: filled, after .active so it wins */
  .shift.locked {
    background: var(--color-accent);
    color: var(--color-bg);
  }

  .shift.locked .latin {
    color: var(--color-bg);
  }

  .latin {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
</style>
