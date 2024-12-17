<script>
import {copy} from 'svelte-copy'
import {elbasanMapping, vithkuqiMapping} from '../data/mappings.js';
import {ScriptType} from '../utils/scriptTypes.js';
export let scriptType;

let currentMapping = scriptType === ScriptType.ELBASAN ? elbasanMapping : vithkuqiMapping;

// initial values for direction and title
let isLatinToScript = true;
let inputTitle = "latin";
let outputTitle = scriptType;

// input text and output text
let inputText = "";
let outputText = "";

// flip mapping
const flipMapping = (mapping) => {
    return Object.entries(mapping).reduce((flipped, [key, value]) => {
      flipped[value] = key;
      return flipped;
    }, {});
};

// transliteration based on direction
const transliterate = (word) => {
    word = word.toLowerCase();
    const activeMapping = isLatinToScript ? currentMapping : flipMapping(currentMapping);
    const pattern = new RegExp(Object.keys(activeMapping).join('|'), 'g');
    return word.replace(pattern, match => activeMapping[match]);
};

// swap direction
const swapDirection = () => {
    isLatinToScript = !isLatinToScript;

    // swap titles
    if (isLatinToScript) {
      inputTitle = "latin";
      outputTitle = scriptType;
    } else {
      inputTitle = scriptType;
      outputTitle = "latin";
    }

    // reset input and output
    inputText = "";
    outputText = "";
};

// input handler: transliterate text and update output
const handleInput = (event) => {
    inputText = event.target.value;
    outputText = transliterate(inputText);
};

// paste text from clipboard
const pasteFromClipboard = async () => {
    try {
        const clipboardText = await navigator.clipboard.readText();
        inputText = clipboardText;
        outputText = transliterate(inputText);
    } catch (error) {
        console.error("Error accessing clipboard: ", error);
    }
};
</script>

<div class="switchArea">
    <div class="input-div">
      <div class="input-container">
        <div class="input-header">
          <h2>{inputTitle}</h2>
          <button class="switch-button" title="Switch" aria-label="paste" on:click={pasteFromClipboard}></button>
        </div>
        <textarea
          id="inp"
          class="styled-input"
          placeholder="input text"
          on:input={handleInput}
          bind:value={inputText}
        ></textarea>
        <div class="input-bottom-line"></div>
      </div>
  
  
      <div class="swap-container">
        <button class="swap-button" title="Swap" aria-label="Swap direction" on:click={swapDirection}></button>
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
          bind:value={outputText}
        ></textarea>
        <div class="input-bottom-line"></div>
      </div>
    </div>
  
</div>

<style>
  .switchArea {
    display: relative;
    flex-direction: row;
    gap: 3%;
  }

  .input-div {
    display: flex;
    flex-direction: row;
    padding-right: 20%;
    padding-bottom: 5%;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    flex: 2;
    min-width: 300px;
    width: 300px;
  }

  .input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .switch-button {
    width: 32px;
    height: 32px;
    background-image: url("/src/assets/switch.svg");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .switch-button:hover {
    opacity: 0.8;
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
    font-family: "Univers", Arial, sans-serif;
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
    flex: 1;
    align-items: center;
    width: 300px;
    min-width: 300px;
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
    flex: 2;
    width: 300px;
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
    }

    .switch-button,
    .copy-button {
      width: 24px;
      height: 24px;
    }
  }
</style>
