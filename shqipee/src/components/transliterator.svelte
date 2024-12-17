<script>
import {elbasanMapping, vithkuqiMapping} from '../data/mappings.js';

const ScriptType = {
  ELBASAN: 'elbasan',
  VITHKUQI: 'vithkuqi'
}
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

// copy text to clipboard
const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
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
        <!-- Eingabetextfeld -->
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
          <button class="copy-button" title="Copy" aria-label="Copy text" on:click={copyToClipboard}></button>
        </div>
        <!-- Ausgabe in Echtzeit -->
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

</style>