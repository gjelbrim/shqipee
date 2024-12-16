<script>


    import Navbar from "../components/Navbar.svelte";
    import BottomContent from "../components/bottomContent.svelte";
    import { vithkuqiMapping } from "../data/mappings.js";
  
  
    // Initiale Werte für Richtung und Titel
    let isLatinToVithkuqi = true; // true = Latin -> Elbasan, false = Elbasan -> Latin
    let inputTitle = "latin";
    let outputTitle = "vithkuqi";
  
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
      const activeMapping = isLatinToVithkuqi ? vithkuqiMapping : flipMapping(vithkuqiMapping);
      const pattern = new RegExp(Object.keys(activeMapping).join('|'), 'g');
      return word.replace(pattern, match => activeMapping[match]);
    };
  
    // Funktion zum Swappen der Richtung
    const swapDirection = () => {
      isLatinToVithkuqi = !isLatinToVithkuqi;
  
      // Tausche die Titel
      if (isLatinToVithkuqi) {
        inputTitle = "latin";
        outputTitle = "vithkuqi";
      } else {
        inputTitle = "vithkuqi";
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
      <h1>vithkuqi <br> alphabet</h1>
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
  
    <BottomContent/>
  </main>