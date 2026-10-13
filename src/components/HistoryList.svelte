<script>
  import { transliterate } from '../utils/transliterate.js';

  // entries: [{text, isLatinToScript}], newest first
  let { entries, scriptType, scriptLang, onpick, onremove, onclear } = $props();

  // clearing everything takes a second click, so one stray tap doesn't wipe the history
  let confirmClear = $state(false);
  let confirmTimer;
  const clearAll = () => {
    if (!confirmClear) {
      confirmClear = true;
      clearTimeout(confirmTimer);
      confirmTimer = setTimeout(() => confirmClear = false, 3000);
      return;
    }
    clearTimeout(confirmTimer);
    confirmClear = false;
    onclear();
  };
</script>

{#if entries.length}
  <ul class="entries">
    {#each entries as entry, index (entry.text + entry.isLatinToScript)}
      <li class="entry">
        <button class="restore" type="button" onclick={() => onpick(index)}>
          <span class="text" lang={entry.isLatinToScript ? 'sq' : scriptLang}>{entry.text}</span>
          <span class="result" lang={entry.isLatinToScript ? scriptLang : 'sq'}>
            → {transliterate(entry.text, scriptType, entry.isLatinToScript)}
          </span>
        </button>
        <button class="remove" type="button" aria-label="Remove {entry.text} from history" title="Remove" onclick={() => onremove(index)}>✕</button>
      </li>
    {/each}
  </ul>
  <button class="clear" type="button" onclick={clearAll}>
    {confirmClear ? 'click again to clear history' : 'clear history'}
  </button>
{:else}
  <p class="empty">no translations yet</p>
{/if}

<style>
  .entries {
    list-style: none;
    display: flex;
    flex-direction: column;
  }

  .entry {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid color-mix(in srgb, var(--color-ink) 20%, transparent);
  }

  .restore {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 10px 4px;
    font: inherit;
    text-align: left;
    color: var(--color-text);
    background: none;
    border: none;
    cursor: pointer;
  }

  .restore:hover .text {
    color: var(--color-accent);
  }

  .text,
  .result {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text {
    font-size: 1.1rem;
  }

  .result {
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }

  .remove {
    flex: none;
    width: 32px;
    height: 32px;
    font: inherit;
    color: var(--color-text-muted);
    background: none;
    border: none;
    cursor: pointer;
  }

  .remove:hover {
    color: var(--color-accent);
  }

  .clear {
    margin-top: 12px;
    padding: 0 0 2px;
    font: inherit;
    font-size: 0.9rem;
    color: var(--color-ink);
    background: none;
    border: none;
    border-bottom: 1px solid var(--color-ink);
    cursor: pointer;
  }

  .clear:hover {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
  }

  .empty {
    color: var(--color-text-muted);
  }
</style>
