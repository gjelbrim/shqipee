<script>
import {copy} from 'svelte-copy'
import {transliterate} from '../utils/transliterate.js';
import { onMount, onDestroy } from 'svelte';

let { scriptType } = $props();

// direction and input; titles and output follow from them
let isLatinToScript = $state(true);
let inputText = $state("");
let pasteError = $state(false);

const inputTitle = $derived(isLatinToScript ? "latin" : scriptType);
const outputTitle = $derived(isLatinToScript ? scriptType : "latin");
const outputText = $derived(transliterate(inputText, scriptType, isLatinToScript));

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
    inputText = previousOutput;
    saveToStorage(inputText, isLatinToScript);
};

// debounce timer for localStorage writes
let saveDebounceTimer;

// timer for clearing paste error message
let pasteErrorTimer;

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
        saveToStorage(inputText, isLatinToScript);
        pasteError = false;
    } catch (error) {
        pasteError = true;
        clearTimeout(pasteErrorTimer);
        pasteErrorTimer = setTimeout(() => pasteError = false, 3000);
    }
};

onMount(() => {
    try {
        // drop pre-per-script keys, which leaked state between scripts
        localStorage.removeItem('transliterationInput');
        localStorage.removeItem('transliterationIsLatin');
        const savedInput = localStorage.getItem(`transliterationInput:${scriptType}`);
        const savedIsLatinRaw = localStorage.getItem(`transliterationIsLatin:${scriptType}`);
        if (savedInput !== null && savedIsLatinRaw !== null) {
            isLatinToScript = savedIsLatinRaw === 'true';
            inputText = savedInput;
        }
    } catch (e) {
        console.warn('localStorage unavailable, saved state could not be restored:', e);
    }
});

onDestroy(() => {
    clearTimeout(pasteErrorTimer);
    clearTimeout(saveDebounceTimer);
});
</script>

<div class="switchArea">
    <div class="input-div">
      <div class="input-container">
        <div class="input-header">
          <h2>{inputTitle}</h2>
          <button class="paste-button" title="Paste" aria-label="Paste from clipboard" onclick={pasteFromClipboard}></button>
        </div>
        <textarea
          id="inp"
          class="styled-input"
          placeholder="input text"
          oninput={handleInput}
          bind:value={inputText}
        ></textarea>
        <div class="input-bottom-line"></div>
        {#if pasteError}
          <p class="paste-error" role="alert">Unable to read from clipboard</p>
        {/if}
      </div>
  
  
      <div class="swap-container">
        <button class="swap-button" title="Swap" aria-label="Swap direction" onclick={swapDirection}></button>
      </div>
  
  
  
      <div class="output-container">
        <div class="input-header">
          <h2>{outputTitle}</h2>
          <button class="copy-button" title="Copy" aria-label="Copy text" use:copy={{ text: outputText }}></button>
        </div>
        <textarea
          id="out"
          class="styled-input"
          placeholder="transliteration"
          readonly
          value={outputText}
        ></textarea>
        <div class="input-bottom-line"></div>
      </div>
    </div>
  
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
    min-width: 300px;
  }

  .input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .paste-button {
    width: 32px;
    height: 32px;
    background-image: url("/src/assets/paste.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .paste-button:hover {
    opacity: 0.8;
  }

  .paste-error {
    font-size: 0.75rem;
    color: #c3181e;
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

  .styled-input::placeholder {
    color: rgb(0, 0, 0);
    opacity: 0.7;
  }

  .input-bottom-line {
    display: flex;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #1d1d1b;
  }

  .swap-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 200px;
    min-width: 200px;
  }

  .swap-button {
    width: 64px;
    height: 64px;
    background-image: url("/src/assets/swap.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .swap-button:hover {
    opacity: 0.8;
  }

  .output-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 300px;
  }

  .copy-button {
    width: 32px;
    height: 32px;
    background-image: url("/src/assets/copy.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    border: none;
    cursor: pointer;
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
      transform: rotate(90deg);
    }

    .swap-container {
      padding-top: 1.5em;
      padding-bottom: 1.5em;
    }

    .paste-button,
    .copy-button {
      width: 24px;
      height: 24px;
    }
  }
</style>
