<script>
import {copy} from 'svelte-copy'
import AlphabetGrid from './AlphabetGrid.svelte';
import { alphabet } from '../alphabet.svelte.js';
import {transliterate} from '../utils/transliterate.js';
import { onMount, onDestroy } from 'svelte';

let { scriptType } = $props();

// direction and input; titles and output follow from them
let isLatinToScript = $state(true);
let inputText = $state("");
let pasteError = $state(false);
let copyStatus = $state(null);   // null | 'copied' | 'failed'
let announcement = $state("");   // read out by screen readers via the status region

// language tags so screen readers pick an Albanian voice and know the script
const LANGUAGE_TAGS = {latin: 'sq', elbasan: 'sq-Elba', vithkuqi: 'sq-Vith', todhri: 'sq-Todr'};

const inputTitle = $derived(isLatinToScript ? "latin" : scriptType);
const outputTitle = $derived(isLatinToScript ? scriptType : "latin");
const outputText = $derived(transliterate(inputText, scriptType, isLatinToScript));
const inputLang = $derived(LANGUAGE_TAGS[inputTitle]);
const scriptLang = $derived(LANGUAGE_TAGS[scriptType]);
// on-screen alphabet, offered while typing in the script (script -> Latin): a popover
// above the input on wider screens, an inline panel below it on mobile
let keyboardButton;
let inputEl;
let popoverEl = $state();
let popoverMaxHeight = $state(0);

// same width as the 768px breakpoint in app.css
const mobileQuery = matchMedia('(max-width: 768px)');
let isMobile = $state(mobileQuery.matches);
const updateIsMobile = (event) => isMobile = event.matches;

// the popover grows upwards from the top of the input over the heading; give it the
// room above the input, scrolling the page up a bit if that's too little
const MIN_POPOVER_HEIGHT = 320;
const fitPopover = () => {
    if (!inputEl) return;
    const spaceAbove = () => inputEl.getBoundingClientRect().top - 16;
    if (spaceAbove() < MIN_POPOVER_HEIGHT) window.scrollBy(0, spaceAbove() - MIN_POPOVER_HEIGHT);
    popoverMaxHeight = Math.max(160, spaceAbove());
};

$effect(() => {
    if (popoverEl) fitPopover();
});
const outputLang = $derived(LANGUAGE_TAGS[outputTitle]);

// persist state to localStorage, ignoring errors (quota exceeded, private mode, etc.)
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
    const previousOutput = outputText;
    isLatinToScript = !isLatinToScript;
    alphabet.open = false;
    inputText = previousOutput;
    caret = null;
    saveToStorage(inputText, isLatinToScript);
    announcement = `now ${inputTitle} to ${outputTitle}`;
};

// debounce timer for localStorage writes
let saveDebounceTimer;

// timer for clearing paste error message
let pasteErrorTimer;

// timer for clearing the copy confirmation
let copyStatusTimer;

const showCopyStatus = (status) => {
    copyStatus = status;
    announcement = status === 'copied' ? 'copied to clipboard' : '';
    clearTimeout(copyStatusTimer);
    copyStatusTimer = setTimeout(() => copyStatus = null, 2000);
};

// caret/selection in the input field, tracked here because the browser resets the
// selection of an unfocused textarea when its value is set; null means "at the end"
let caret = null;
const rememberCaret = (event) => {
    caret = {start: event.target.selectionStart, end: event.target.selectionEnd};
};

// insert text (from the alphabet table) at the caret of the input field without
// focusing it, so the on-screen keyboard of a phone stays closed
const insertAtCursor = (text) => {
    const start = Math.min(caret?.start ?? inputText.length, inputText.length);
    const end = Math.min(caret?.end ?? start, inputText.length);
    inputText = inputText.slice(0, start) + text + inputText.slice(end);
    caret = {start: start + text.length, end: start + text.length};
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => saveToStorage(inputText, isLatinToScript), 300);
};

// input handler: bind:value updates the text; debounce the localStorage write
const handleInput = (event) => {
    const input = event.target.value;
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = setTimeout(() => saveToStorage(input, isLatinToScript), 300);
};

// paste text from clipboard
const pasteFromClipboard = async () => {
    try {
        inputText = await navigator.clipboard.readText();
        caret = null;
        saveToStorage(inputText, isLatinToScript);
        pasteError = false;
    } catch (error) {
        pasteError = true;
        clearTimeout(pasteErrorTimer);
        pasteErrorTimer = setTimeout(() => pasteError = false, 3000);
    }
};

// close the popover on Escape or a click outside it (the inline panel on mobile is
// part of the page and stays open until toggled)
const closeOnOutside = (event) => {
    if (!alphabet.open || isMobile) return;
    if (!popoverEl?.contains(event.target) && !keyboardButton?.contains(event.target)) alphabet.open = false;
};
const closeOnEscape = (event) => {
    if (event.key !== 'Escape' || !alphabet.open) return;
    alphabet.open = false;
    keyboardButton?.focus();
};

onMount(() => {
    mobileQuery.addEventListener('change', updateIsMobile);
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
    alphabet.open = false;
    mobileQuery.removeEventListener('change', updateIsMobile);
    clearTimeout(pasteErrorTimer);
    clearTimeout(copyStatusTimer);
    clearTimeout(saveDebounceTimer);
});
</script>

<svelte:window onclick={closeOnOutside} onkeydown={closeOnEscape} onresize={() => popoverEl && fitPopover()} />

<div class="switchArea">
    <div class="input-div">
      <div class="input-container">
        <div class="input-header">
          <h2 id="input-title">{inputTitle}</h2>
          {#if alphabet.open && !isMobile}
            <div
              id="alphabet-panel"
              class="popover"
              role="group"
              aria-label="{scriptType} alphabet"
              style:max-height="{popoverMaxHeight}px"
              bind:this={popoverEl}
            >
              <AlphabetGrid {scriptType} {scriptLang} onpick={insertAtCursor} />
            </div>
          {/if}
          <div class="header-buttons">
            {#if !isLatinToScript}
              <button
                class="keyboard-button"
                class:open={alphabet.open}
                title="Alphabet"
                aria-label="Show {scriptType} alphabet"
                aria-expanded={alphabet.open}
                aria-controls="alphabet-panel"
                bind:this={keyboardButton}
                onclick={() => alphabet.open = !alphabet.open}
              ></button>
            {/if}
            <button class="paste-button" title="Paste" aria-label="Paste from clipboard" onclick={pasteFromClipboard}></button>
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
        {#if alphabet.open && isMobile}
          <div id="alphabet-panel" class="alphabet-inline" role="group" aria-label="{scriptType} alphabet">
            <AlphabetGrid {scriptType} {scriptLang} onpick={insertAtCursor} />
          </div>
        {/if}
        {#if pasteError}
          <p class="paste-error" role="alert">Unable to read from clipboard</p>
        {/if}
      </div>
  
  
      <div class="swap-container">
        <button class="swap-button" title="Swap" aria-label="Swap direction" onclick={swapDirection}></button>
      </div>
  
  
  
      <div class="output-container" class:flash={copyStatus === 'copied'}>
        <div class="input-header">
          <h2 id="output-title">{outputTitle}</h2>
          <button
            class:copied={copyStatus === 'copied'}
            class="copy-button"
            title="Copy"
            aria-label="Copy text"
            use:copy={{ text: outputText, onCopy: () => showCopyStatus('copied'), onError: () => showCopyStatus('failed') }}
          ></button>
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
        {#if copyStatus === 'failed'}
          <p class="paste-error" role="alert">Unable to copy to clipboard</p>
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
    padding-bottom: 5%;
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

  /* covers the heading and grows upwards from the top of the input field,
     leaving the buttons on the right uncovered (2 x 32px icons + 14px gap + 10px) */
  .popover {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 88px;
    z-index: 30;
    overflow-y: auto;
    padding: 14px;
    background: var(--color-bg);
    border: 1px solid var(--color-ink);
    border-radius: 8px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  }

  /* on mobile the alphabet sits between the input and the swap button */
  .alphabet-inline {
    margin-top: 16px;
  }

  .header-buttons {
    display: flex;
    gap: 14px;
  }

  /* the icons are black SVGs; --icon-filter lightens them in dark mode */
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

  .paste-error {
    font-size: 0.75rem;
    color: var(--color-accent);
    margin-top: 4px;
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

  /* after copying the icon turns into a check mark for a moment */
  .copy-button.copied {
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
      padding-bottom: 2%;
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
    .keyboard-button {
      width: 24px;
      height: 24px;
    }
  }
</style>
