<script>


  import Navbar from "../components/Navbar.svelte";
  import {elbasanMapping} from "../data/mappings.js";


  // Initiale Werte für Richtung und Titel
  let isLatinToElbasan = true; // true = Latin -> Elbasan, false = Elbasan -> Latin
  let inputTitle = "latin";
  let outputTitle = "elbasan";

  // Eingabetext und Ausgabetext
  let inputText = ""; // Text im Eingabefeld
  let outputText = ""; // Text im Ausgabefeld

  // Funktion, um das Mapping umzukehren
  const flipMapping = (mapping) => {
    return Object.entries(mapping).reduce((flipped, [key, value]) => {
      flipped[value] = key;
      return flipped;
    }, {});
  };

  // Transliteration basierend auf der Richtung
  const transliterate = (word) => {
    word = word.toLowerCase();
    const activeMapping = isLatinToElbasan ? elbasanMapping : flipMapping(elbasanMapping);
    const pattern = new RegExp(Object.keys(activeMapping).join('|'), 'g');
    return word.replace(pattern, match => activeMapping[match]);
  };

  // Funktion zum Swappen der Richtung
  const swapDirection = () => {
    isLatinToElbasan = !isLatinToElbasan;

    // Tausche die Titel
    if (isLatinToElbasan) {
      inputTitle = "latin";
      outputTitle = "elbasan";
    } else {
      inputTitle = "elbasan";
      outputTitle = "latin";
    }

    // Resette Eingabe und Ausgabe
    inputText = "";
    outputText = "";
  };

  // Eingabe-Handler: Text transliterieren und Output aktualisieren
  const handleInput = (event) => {
    inputText = event.target.value;
    outputText = transliterate(inputText);
  };



  // Funktion, um den Inhalt aus der Zwischenablage zu lesen und in das Eingabefeld einzufügen
const pasteFromClipboard = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText();
    inputText = clipboardText; // Fügt den Text in das Eingabefeld ein
    outputText = transliterate(inputText); // Transliterate den eingefügten Text direkt
  } catch (error) {
    console.error("Error accessing clipboard: ", error);
  }
};

// Funktion, um den Inhalt des Ausgabefeldes in die Zwischenablage zu kopieren
const copyToClipboard = () => {
  try {
    navigator.clipboard.writeText(outputText);
    console.log("Text copied to clipboard:", outputText);
  } catch (error) {
    console.error("Error copying text: ", error);
  }
};
</script>


<main>
  <div class="top-section">
  <div class="redLine">
    <!-- rote Linie -->
  </div>
  <div class="headingTop">
    <h1>elbasan <br> alphabet</h1>
  </div>
  <div class="insertNav">
    <!-- nav -->
    <Navbar />
    <!-- Router -->
  </div>
  <div class="logoIcon">
    <p>𐔋</p>
  </div>
</div>


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

  <div class="bottom-content">
    <div class="text-left">
      <div class="text-left-item">
        <p id="sign">!</p>
      </div>
      <div>
        <p id="disclaimer">
          elbasanscript is being misused on social media by far-right extremists. the developer of
          this page explicitly distances himself from such ideologies and condemns them.
        </p>
      </div>
    </div>
    <div class="text-right">
      <p id="author">
        developed by <a href="http://github.com/gjelbrim">gjelbrim haskaj</a> <br />
        designed by <a href="https://github.com/Litorian113">franz anhäupl</a>
      </p>
      <p id="wiki"><br>more info about the elbasan alphabet on <a href="https://en.wikipedia.org/wiki/Elbasan_alphabet">wikipedia</a></p>
    </div>
  </div>
</main>
