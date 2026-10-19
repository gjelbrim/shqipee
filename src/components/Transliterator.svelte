<script>
import {copy} from 'svelte-copy'
import AlphabetGrid from './AlphabetGrid.svelte';
import HistoryList from './HistoryList.svelte';
import { panel } from '../panel.svelte.js';
import { addEntry, removeEntry, loadHistory, saveHistory } from '../utils/history.js';
import { buildShareUrl, parseShareParams } from '../utils/shareLink.js';
import { deleteBackward } from '../utils/textEdit.js';
import {transliterate} from '../utils/transliterate.js';
import { onMount, onDestroy } from 'svelte';

/** @import {Script} from '../utils/scriptTypes.js' */
/** @import {HistoryEntry} from '../utils/history.js' */

/** @type {{scriptType: Script}} */
let { scriptType } = $props();

// direction and input; titles and output follow from them
let isLatinToScript = $state(true);
let inputText = $state("");
let pasteError = $state(false);
/** @typedef {'copied' | 'linked' | 'failed' | 'link-failed'} CopyStatus */
/** @type {CopyStatus | null} */
let copyStatus = $state(null);
let announcement = $state("");   // read out by screen readers via the status region

// language tags so screen readers pick an Albanian voice and know the script
/** @type {Record<'latin' | Script, string>} */
const LANGUAGE_TAGS = {latin: 'sq', elbasan: 'sq-Elba', vithkuqi: 'sq-Vith', todhri: 'sq-Todr'};

const inputTitle = $derived(isLatinToScript ? "latin" : scriptType);
const outputTitle = $derived(isLatinToScript ? scriptType : "latin");
const outputText = $derived(transliterate(inputText, scriptType, isLatinToScript));
const inputLang = $derived(LANGUAGE_TAGS[inputTitle]);
const scriptLang = $derived(LANGUAGE_TAGS[scriptType]);
// panels for the input (panel.open): the on-screen alphabet, offered while typing in
// the script (script -> Latin), and the history. A popover above the input on wider
// screens, an inline panel below it on mobile
/** @type {HTMLButtonElement | undefined} */
let keyboardButton = $state();
/** @type {HTMLButtonElement | undefined} */
let historyButton;
/** @type {HTMLElement | undefined} */
let headerButtonsEl;
/** @type {HTMLTextAreaElement | undefined} */
let inputEl;
/** @type {HTMLElement | undefined} */
let popoverEl = $state();
let popoverMaxHeight = $state(0);
let popoverRight = $state(0);

const PANEL_LABELS = {alphabet: 'alphabet', history: 'history'};
/** @param {'alphabet' | 'history'} name */
const togglePanel = (name) => panel.open = panel.open === name ? null : name;

// same width as the 768px breakpoint in app.css
const mobileQuery = matchMedia('(max-width: 768px)');
let isMobile = $state(mobileQuery.matches);
/** @param {MediaQueryListEvent} event */
const updateIsMobile = (event) => isMobile = event.matches;

// the popover grows upwards from the top of the input over the heading; give it the
// room above the input, scrolling the page up a bit if that's too little
const MIN_POPOVER_HEIGHT = 320;
const fitPopover = () => {
    if (!inputEl) return;
    const input = inputEl;
    const spaceAbove = () => input.getBoundingClientRect().top - 16;
    if (spaceAbove() < MIN_POPOVER_HEIGHT) window.scrollBy(0, spaceAbove() - MIN_POPOVER_HEIGHT);
    popoverMaxHeight = Math.max(160, spaceAbove());
    // leave the icons next to the heading uncovered
    popoverRight = (headerButtonsEl?.offsetWidth ?? 0) + 10;
};

$effect(() => {
    if (popoverEl) fitPopover();
});
const outputLang = $derived(LANGUAGE_TAGS[outputTitle]);

// persist state to localStorage, ignoring errors (quota exceeded, private mode, etc.)
/**
 * @param {string} input
 * @param {boolean} isLatin
 */
const saveToStorage = (input, isLatin) => {
    try {
        localStorage.setItem(`transliterationInput:${scriptType}`, input);
        localStorage.setItem(`transliterationIsLatin:${scriptType}`, String(isLatin));
    } catch (e) {
        console.warn('localStorage unavailable, state will not be persisted:', e);
    }
};

// swap direction: carry over the previous output as the new input
const swapDirection = () => {
    commitHistory();
    const previousOutput = outputText;
    isLatinToScript = !isLatinToScript;
    panel.open = null;
    inputText = previousOutput;
    caret = null;
    saveToStorage(inputText, isLatinToScript);
    announcement = `now ${inputTitle} to ${outputTitle}`;
};

// debounce timer for localStorage writes
/** @type {ReturnType<typeof setTimeout> | undefined} */
let saveDebounceTimer;

// timer for clearing paste error message
/** @type {ReturnType<typeof setTimeout> | undefined} */
let pasteErrorTimer;

// timer for clearing the copy confirmation
/** @type {ReturnType<typeof setTimeout> | undefined} */
let copyStatusTimer;

// history: the current input is added after a typing pause and when it's copied,
// shared, swapped or left (see addEntry for how continued typing is merged)
const HISTORY_PAUSE = 2000;
/** @type {HistoryEntry[]} */
let historyEntries = $state([]);
/** @type {ReturnType<typeof setTimeout> | undefined} */
let historyTimer;

const commitHistory = () => {
    clearTimeout(historyTimer);
    historyTimer = undefined;
    const next = addEntry(historyEntries, inputText, isLatinToScript);
    if (next === historyEntries) return;
    historyEntries = next;
    saveHistory(scriptType, historyEntries);
};
const scheduleHistory = () => {
    clearTimeout(historyTimer);
    historyTimer = setTimeout(commitHistory, HISTORY_PAUSE);
};

/** @param {number} index */
const restoreEntry = (index) => {
    const entry = historyEntries[index];
    clearTimeout(historyTimer);
    historyTimer = undefined;
    isLatinToScript = entry.isLatinToScript;
    inputText = entry.text;
    caret = null;
    saveToStorage(inputText, isLatinToScript);
    panel.open = null;
    announcement = `restored ${entry.text}`;
};
/** @param {number} index */
const removeHistoryEntry = (index) => {
    historyEntries = removeEntry(historyEntries, index);
    saveHistory(scriptType, historyEntries);
    announcement = 'removed from history';
};
const clearHistory = () => {
    historyEntries = [];
    saveHistory(scriptType, historyEntries);
    announcement = 'history cleared';
};

/** @type {Partial<Record<CopyStatus, string>>} */
const ANNOUNCEMENTS = {copied: 'copied to clipboard', linked: 'link copied to clipboard'};

/** @param {CopyStatus} status */
const showCopyStatus = (status) => {
    if (status === 'copied' || status === 'linked') commitHistory();
    copyStatus = status;
    announcement = ANNOUNCEMENTS[status] ?? '';
    clearTimeout(copyStatusTimer);
    copyStatusTimer = setTimeout(() => copyStatus = null, 2000);
};

// touch devices get the system share sheet; elsewhere the link is copied
const useShareSheet = matchMedia('(pointer: coarse)').matches && 'share' in navigator;

// share a link that reopens this page with the current input and direction
const shareLink = async () => {
    const url = buildShareUrl(location.href, scriptType, inputText, isLatinToScript);
    if (useShareSheet) {
        try {
            await navigator.share({title: document.title, url});
        } catch (e) {
            // dismissed share sheet; nothing to report
        }
        return;
    }
    try {
        await navigator.clipboard.writeText(url);
        showCopyStatus('linked');
    } catch (e) {
        showCopyStatus('link-failed');
    }
};

// caret/selection in the input field, tracked here because the browser resets the
// selection of an unfocused textarea when its value is set; null means "at the end"
/** @type {{start: number, end: number} | null} */
let caret = null;
/** @param {Event & {currentTarget: HTMLTextAreaElement}} event */
const rememberCaret = (event) => {
    caret = {start: event.currentTarget.selectionStart, end: event.currentTarget.selectionEnd};
};

// the alphabet table edits the input at the caret without focusing it, so the on-screen
// keyboard of a phone stays closed
const caretRange = () => {
    const start = Math.min(caret?.start ?? inputText.length, inputText.length);
    const end = Math.min(caret?.end ?? start, inputText.length);
    return {start, end};
};
/**
 * @param {string} text
 * @param {number} position  caret afterwards
 */
const setInputFromAlphabet = (text, position) => {
    inputText = text;
    caret = {start: position, end: position};
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => saveToStorage(inputText, isLatinToScript), 300);
    scheduleHistory();
};
/** @param {string} text */
const insertAtCursor = (text) => {
    const {start, end} = caretRange();
    setInputFromAlphabet(inputText.slice(0, start) + text + inputText.slice(end), start + text.length);
};
const deleteAtCursor = () => {
    const {start, end} = caretRange();
    const result = deleteBackward(inputText, start, end);
    if (result.text !== inputText) setInputFromAlphabet(result.text, result.caret);
};

// input handler: bind:value updates the text; debounce the localStorage write
/** @param {Event & {currentTarget: HTMLTextAreaElement}} event */
const handleInput = (event) => {
    const input = event.currentTarget.value;
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => saveToStorage(input, isLatinToScript), 300);
    scheduleHistory();
};

// paste text from clipboard
const pasteFromClipboard = async () => {
    try {
        inputText = await navigator.clipboard.readText();
        caret = null;
        saveToStorage(inputText, isLatinToScript);
        commitHistory();
        pasteError = false;
    } catch (error) {
        pasteError = true;
        clearTimeout(pasteErrorTimer);
        pasteErrorTimer = setTimeout(() => pasteError = false, 3000);
    }
};

// close the popover on Escape or a click outside it (the inline panel on mobile is
// part of the page and stays open until toggled)
/** @param {MouseEvent} event */
const closeOnOutside = (event) => {
    if (!panel.open || isMobile) return;
    const target = /** @type {Node} */ (event.target);
    // clicks that removed their own element (e.g. deleting a history entry) count as inside
    if (!target.isConnected) return;
    const inside = [popoverEl, keyboardButton, historyButton].some(el => el?.contains(target));
    if (!inside) panel.open = null;
};
/** @param {KeyboardEvent} event */
const closeOnEscape = (event) => {
    if (event.key !== 'Escape' || !panel.open) return;
    const button = panel.open === 'history' ? historyButton : keyboardButton;
    panel.open = null;
    button?.focus();
};

onMount(() => {
    mobileQuery.addEventListener('change', updateIsMobile);
    historyEntries = loadHistory(scriptType);

    // a shared link (?text=…) wins over the saved state; drop the query afterwards so
    // a reload doesn't bring the link text back over later edits
    const shared = parseShareParams(location.search, scriptType);
    if (shared) {
        isLatinToScript = shared.isLatinToScript;
        inputText = shared.text;
        caret = null;
        saveToStorage(inputText, isLatinToScript);
        history.replaceState(history.state, '', location.pathname);
        return;
    }

    try {
        // drop pre-per-script keys, which leaked state between scripts
        localStorage.removeItem('transliterationInput');
        localStorage.removeItem('transliterationIsLatin');
        const savedInput = localStorage.getItem(`transliterationInput:${scriptType}`);
        const savedIsLatinRaw = localStorage.getItem(`transliterationIsLatin:${scriptType}`);
        if (savedInput !== null && savedIsLatinRaw !== null) {
            isLatinToScript = savedIsLatinRaw === 'true';
            inputText = savedInput;
            caret = null;
        }
    } catch (e) {
        console.warn('localStorage unavailable, saved state could not be restored:', e);
    }
});

onDestroy(() => {
    if (historyTimer) commitHistory();
    panel.open = null;
    mobileQuery.removeEventListener('change', updateIsMobile);
    clearTimeout(pasteErrorTimer);
    clearTimeout(copyStatusTimer);
    clearTimeout(saveDebounceTimer);
});
</script>

<svelte:window
  onclick={closeOnOutside}
  onkeydown={closeOnEscape}
  onresize={() => popoverEl && fitPopover()}
  onpagehide={() => historyTimer && commitHistory()}
/>

{#snippet errorIcon()}
  <!-- shown inside an icon button for a moment when its clipboard action failed -->
  <svg class="error-icon" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5 5l10 10M15 5L5 15" />
  </svg>
{/snippet}

{#snippet panelContent()}
  {#if panel.open === 'alphabet'}
    <AlphabetGrid {scriptType} {scriptLang} onpick={insertAtCursor} ondelete={deleteAtCursor} />
  {:else if panel.open === 'history'}
    <HistoryList
      entries={historyEntries}
      {scriptType}
      {scriptLang}
      onpick={restoreEntry}
      onremove={removeHistoryEntry}
      onclear={clearHistory}
    />
  {/if}
{/snippet}

<div class="switchArea">
    <div class="input-div">
      <div class="input-container" class:flash-error={pasteError}>
        <div class="input-header">
          <h2 id="input-title">{inputTitle}</h2>
          {#if panel.open && !isMobile}
            <div
              id="{panel.open}-panel"
              class="popover"
              role="group"
              aria-label="{scriptType} {PANEL_LABELS[panel.open]}"
              style:max-height="{popoverMaxHeight}px"
              style:right="{popoverRight}px"
              bind:this={popoverEl}
            >
              {@render panelContent()}
            </div>
          {/if}
          <div class="header-buttons" bind:this={headerButtonsEl}>
            <button
              class="history-button"
              class:open={panel.open === 'history'}
              title="History"
              aria-label="Show {scriptType} history"
              aria-expanded={panel.open === 'history'}
              aria-controls="history-panel"
              bind:this={historyButton}
              onclick={() => togglePanel('history')}
            ></button>
            {#if !isLatinToScript}
              <button
                class="keyboard-button"
                class:open={panel.open === 'alphabet'}
                title="Alphabet"
                aria-label="Show {scriptType} alphabet"
                aria-expanded={panel.open === 'alphabet'}
                aria-controls="alphabet-panel"
                bind:this={keyboardButton}
                onclick={() => togglePanel('alphabet')}
              ></button>
            {/if}
            <button
              class="paste-button"
              class:failed={pasteError}
              title={pasteError ? 'Unable to read from clipboard' : 'Paste'}
              aria-label="Paste from clipboard"
              onclick={pasteFromClipboard}
            >{#if pasteError}{@render errorIcon()}{/if}</button>
          </div>
        </div>
        <textarea
          id="inp"
          class="styled-input"
          aria-labelledby="input-title"
          lang={inputLang}
          placeholder="input text"
          oninput={(event) => { handleInput(event); rememberCaret(event); }}
          onselect={rememberCaret}
          onkeyup={rememberCaret}
          onclick={rememberCaret}
          bind:value={inputText}
          bind:this={inputEl}
        ></textarea>
        <div class="input-bottom-line"></div>
        {#if panel.open && isMobile}
          <div id="{panel.open}-panel" class="panel-inline" role="group" aria-label="{scriptType} {PANEL_LABELS[panel.open]}">
            {@render panelContent()}
          </div>
        {/if}
        {#if pasteError}
          <!-- the paste icon and the line show the error; the text is for screen readers -->
          <p class="visually-hidden" role="alert">Unable to read from clipboard</p>
        {/if}
      </div>
  
  
      <div class="swap-container">
        <button class="swap-button" title="Swap" aria-label="Swap direction" onclick={swapDirection}></button>
      </div>
  
  
  
      <div
        class="output-container"
        class:flash={copyStatus === 'copied' || copyStatus === 'linked'}
        class:flash-error={copyStatus === 'failed' || copyStatus === 'link-failed'}
      >
        <div class="input-header">
          <h2 id="output-title">{outputTitle}</h2>
          <div class="header-buttons">
            <button
              class:copied={copyStatus === 'linked'}
              class:failed={copyStatus === 'link-failed'}
              class="share-button"
              title={copyStatus === 'link-failed' ? 'Unable to copy the link' : 'Share link'}
              aria-label="Share a link to this text"
              disabled={!inputText}
              onclick={shareLink}
            >{#if copyStatus === 'link-failed'}{@render errorIcon()}{/if}</button>
            <button
              class:copied={copyStatus === 'copied'}
              class:failed={copyStatus === 'failed'}
              class="copy-button"
              title={copyStatus === 'failed' ? 'Unable to copy to clipboard' : 'Copy'}
              aria-label="Copy text"
              use:copy={{ text: outputText, onCopy: () => showCopyStatus('copied'), onError: () => showCopyStatus('failed') }}
            >{#if copyStatus === 'failed'}{@render errorIcon()}{/if}</button>
          </div>
        </div>
        <textarea
          id="out"
          class="styled-input"
          aria-labelledby="output-title"
          lang={outputLang}
          placeholder="transliteration"
          readonly
          value={outputText}
        ></textarea>
        <div class="input-bottom-line"></div>
        {#if copyStatus === 'failed' || copyStatus === 'link-failed'}
          <p class="visually-hidden" role="alert">
            {copyStatus === 'failed' ? 'Unable to copy to clipboard' : 'Unable to copy the link'}
          </p>
        {/if}
      </div>
    </div>

    <p class="visually-hidden" role="status">{announcement}</p>
</div>

<style>
  .switchArea {
    flex-direction: row;
    gap: 3%;
  }

  .input-div {
    display: flex;
    flex-direction: row;
    padding-bottom: var(--space-section);
    width: 100%;
    justify-content: space-between;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: var(--column-min-width);
  }

  .input-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  /* covers the heading and grows upwards from the top of the input field; its right
     edge (style:right) leaves the buttons next to the heading uncovered */
  .popover {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 30;
    overflow-y: auto;
    padding: 14px;
    background: var(--color-bg);
    border: 1px solid var(--color-ink);
  }

  /* on mobile the panel sits between the input and the swap button */
  .panel-inline {
    margin-top: 16px;
  }

  .header-buttons {
    display: flex;
    gap: 14px;
  }

  /* the icons are black SVGs; --icon-filter lightens them in dark mode */
  .history-button {
    width: 32px;
    height: 32px;
    background-image: url("/src/assets/history.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    filter: var(--icon-filter);
    border: none;
    cursor: pointer;
  }

  .history-button:hover,
  .history-button.open {
    opacity: 0.6;
  }

  .keyboard-button {
    width: 32px;
    height: 32px;
    background-image: url("/src/assets/keyboard.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    filter: var(--icon-filter);
    border: none;
    cursor: pointer;
  }

  .keyboard-button:hover,
  .keyboard-button.open {
    opacity: 0.6;
  }

  .paste-button {
    width: 32px;
    height: 32px;
    background-image: url("/src/assets/paste.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    filter: var(--icon-filter);
    border: none;
    cursor: pointer;
  }

  .paste-button:hover {
    opacity: 0.8;
  }

  /* a failed clipboard action turns its icon into a red cross for a moment */
  .paste-button.failed,
  .copy-button.failed,
  .share-button.failed {
    background-image: none;
    filter: none;
    color: var(--color-accent);
  }

  .error-icon {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.4;
    stroke-linecap: square;
  }

  .input-container .input-bottom-line {
    transition: background-color 0.3s ease;
  }

  .input-container.flash-error .input-bottom-line,
  .output-container.flash-error .input-bottom-line {
    background-color: var(--color-accent);
  }

  .styled-input {
    height: 150px;
    border: none;
    outline: none;
    background: none;
    font-size: 1.5rem;
    resize: none;
    padding-top: 10px;
    box-sizing: border-box;
  }

  /* focus indicator: the line under the focused field turns red */
  .styled-input:focus + .input-bottom-line {
    background-color: var(--color-accent);
  }

  .styled-input::placeholder {
    color: var(--color-text);
    opacity: 0.7;
  }

  .input-bottom-line {
    display: flex;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: var(--color-ink);
  }

  .swap-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: var(--column-gap);
    min-width: var(--column-gap);
  }

  .swap-button {
    width: 64px;
    height: 64px;
    background-image: url("/src/assets/swap.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    filter: var(--icon-filter);
    border: none;
    cursor: pointer;
  }

  .swap-button:hover {
    opacity: 0.8;
  }

  .output-container {
    /* opaque so Chrome keeps subpixel text antialiasing in the output, which
       gets its own compositing layer once it has content */
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: var(--column-min-width);
  }

  .copy-button {
    width: 32px;
    height: 32px;
    background-image: url("/src/assets/copy.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    filter: var(--icon-filter);
    border: none;
    cursor: pointer;
  }

  .share-button {
    width: 32px;
    height: 32px;
    background-image: url("/src/assets/link.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    filter: var(--icon-filter);
    border: none;
    cursor: pointer;
  }

  .share-button:hover {
    opacity: 0.8;
  }

  .share-button:disabled {
    opacity: 0.3;
    cursor: default;
  }

  /* after copying the icon turns into a check mark for a moment */
  .copy-button.copied,
  .share-button.copied {
    background-image: url("/src/assets/check.svg");
  }

  .output-container .input-bottom-line {
    transition: background-color 0.3s ease;
  }

  .output-container.flash .input-bottom-line {
    background-color: var(--color-accent);
  }

  .copy-button:hover {
    opacity: 0.8;
  }

  @media (max-width: 1200px) {
    .input-div {
      display: flex;
      flex-direction: column;
      width: 100%;
      flex-wrap: wrap;
    }

    .input-container,
    .swap-container,
    .output-container {
      flex: 1;
      width: 100%;
    }

    /* fields are stacked from here on, so the arrows point up/down */
    .swap-button {
      transform: rotate(90deg);
    }
  }

  @media (max-width: 768px) {
    .switchArea {
      flex-direction: column;
      gap: 1rem;
    }

    .input-div {
      padding-right: 0;
    }

    .styled-input {
      height: 100px;
      font-size: 1rem;
    }

    .swap-button {
      width: 48px;
      height: 48px;
    }

    .swap-container {
      padding-top: 1.5em;
      padding-bottom: 1.5em;
    }

    .paste-button,
    .copy-button,
    .share-button,
    .history-button,
    .keyboard-button {
      width: 24px;
      height: 24px;
    }
  }
</style>
