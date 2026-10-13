<script>
  import { getAlphabet } from '../utils/alphabet.js';

  // clicking a letter inserts its glyph via onpick
  let { scriptType, scriptLang, onpick } = $props();

  const groups = $derived(getAlphabet(scriptType));
</script>

<div class="alphabet">
  {#each groups as group (group.name)}
    {#if groups.length > 1}
      <span class="group-label">{group.name}</span>
    {/if}
    <div class="grid">
      {#each group.letters as letter (letter.latin)}
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
    </div>
  {/each}
</div>

<style>
  .alphabet {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .group-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.6;
  }

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

  .latin {
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
</style>
