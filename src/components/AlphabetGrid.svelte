<script>
  import { getAlphabet } from '../utils/alphabet.js';

  // clicking a letter inserts its glyph via onpick
  let { scriptType, scriptLang, onpick } = $props();

  const groups = $derived(getAlphabet(scriptType));
  // scripts with capitals (Vithkuqi) get a shift key that toggles between the groups
  const capitals = $derived(groups.find(group => group.name === 'capitals'));
  let shift = $state(false);
  const letters = $derived(shift && capitals ? capitals.letters : groups[0].letters);
</script>

<div class="grid">
  {#each letters as letter (letter.latin)}
    <button
      class="tile"
      type="button"
      title={`insert ${letter.latin}`}
      aria-label={letter.latin}
      onclick={() => onpick(letter.glyph)}
    >
      <span class="glyph" lang={scriptLang} aria-hidden="true">{letter.glyph}</span>
      <span class="latin" aria-hidden="true">{letter.latin}</span>
    </button>
  {/each}
  {#if capitals}
    <button
      class="tile shift"
      class:active={shift}
      type="button"
      title={shift ? 'lowercase' : 'capitals'}
      aria-label="capitals"
      aria-pressed={shift}
      onclick={() => shift = !shift}
    >
      <span class="glyph" aria-hidden="true">⇧</span>
      <span class="latin" aria-hidden="true">{shift ? 'abc' : 'ABC'}</span>
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
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.15s ease, color 0.15s ease;
  }

  .tile:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .glyph {
    font-size: 1.5rem;
    line-height: 1.2;
  }

  .shift.active {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .latin {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
</style>
