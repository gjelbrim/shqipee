<script>


    import Navbar from "../components/Navbar.svelte";
  
  
    // Initiale Werte für Richtung und Titel
    let isLatinToVithkuqi = true; // true = Latin -> Elbasan, false = Elbasan -> Latin
    let inputTitle = "latin";
    let outputTitle = "vithkuqi";
  
    // Eingabetext und Ausgabetext
    let inputText = ""; // Text im Eingabefeld
    let outputText = ""; // Text im Ausgabefeld
  
    // Char-Code-Mapping nur einmal definieren
    const charCodes = {
      //two letter majuscule+majuscule (CAPS)
      DH: '\u{10576}',
      GI: '\u{1057A}\u{105A6}',
      GJ: '\u{1057A}\u{105A6}',
      JI: '\u{10580}\u{105A6}',
      LL: '\u{10583}',
      NJ: '\u{10586}',
      RR: '\u{1058A}',
      SH: '\u{1058D}',
      TH: '\u{1058F}',
      XH: '\u{1057A}\u{105A6}',
      ZH: '\u{1058D}\u{10595}',
      
      //two letter majuscule+minuscule
      Dh: '\u{10576}',
      Gi: '\u{1057A}\u{105A6}',
      Gj: '\u{1057A}\u{105A6}',
      Ji: '\u{10580}\u{105A6}',
      Ll: '\u{10583}',
      Nj: '\u{10586}',
      Rr: '\u{1058A}',
      Sh: '\u{1058D}',
      Th: '\u{1058F}',
      Xh: '\u{10574}',
      Zh: '\u{1058D}\u{105BC}',
      //two letter minuscule
      dh: '\u{1059D}',
      gi: '\u{105A1}\u{105A6}',
      gj: '\u{105A1}\u{105A6}',
      ji: '\u{105A7}\u{105A6}',
      ll: '\u{105AA}',
      nj: '\u{105AD}',
      rr: '\u{105B1}',
      sh: '\u{105B4}',
      th: '\u{105B6}',
      xh: '\u{1059B}',
      zh: '\u{105B4}\u{105BC}',

      //single letter majuscule
      A: '\u{10570}', B: '\u{10572}', C: '\u{10573}', Ç: '\u{10574}', D: '\u{10575}', E: '\u{10577}', Ë: '\u{10578}', F: '\u{10579}', G: '\u{1057A}', H: '\u{1057C}', I: '\u{1057E}', J: '\u{10580}', K: '\u{10581}', L: '\u{10582}', M: '\u{10584}', N: '\u{10585}', O: '\u{10587}', P: '\u{10588}', Q: '\u{10589}', R: '\u{1058A}', S: '\u{1058C}', T: '\u{1058E}', U: '\u{10590}', V: '\u{10591}', X: '\u{10592}', Y: '\u{10594}', Z: '\u{10595}', 
      //single letter minuscule
      a: '\u{10597}', b: '\u{10599}', c: '\u{1059A}', ç: '\u{1059B}', d: '\u{1059C}', e: '\u{1059E}', ë: '\u{1059F}', f: '\u{105A0}', g: '\u{105A1}', h: '\u{105A3}', i: '\u{105A5}', j: '\u{105A7}', k: '\u{105A8}', l: '\u{105A9}', m: '\u{105AB}', n: '\u{105AC}', o: '\u{105AE}', p: '\u{105AF}', q: '\u{105B0}', r: '\u{105B1}', s: '\u{105B3}', t: '\u{105B5}', u: '\u{105B7}', v: '\u{105B8}', x: '\u{105B9}', y: '\u{105BB}', z: '\u{105BC}'

    };
  
    // Funktion, um das Mapping umzukehren
    const flipMapping = (mapping) => {
      return Object.entries(mapping).reduce((flipped, [key, value]) => {
        flipped[value] = key;
        return flipped;
      }, {});
    };
  
    // Transliteration basierend auf der Richtung
    const transliterate = (word) => {
      const activeMapping = isLatinToVithkuqi ? charCodes : flipMapping(charCodes);
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
          developed by gjelbrim haskaj <br />
          designed by franz anhäupl
        </p>
        <p id="wiki"><br>more info about the elbasan script on wikipedia</p>
      </div>
    </div>
  </main>
  
  <style>

.insertNav {
    display: flex;

    /* justify-content: center; */
  }
  
  .top-section {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* justify-content: baseline; */
    padding-bottom: 10%;
  
  }
  .headingTop {
    display: flex;
    flex: 2;
    border-left: 14px solid #C3181E;
    padding-left: 10px;
  }
  
  .logoIcon {
    font-size: 128px;
    display: flex;
    flex: 1;
    color: #C3181E;
    margin: 0px;
    justify-content:center;
  
  }
  /* Bestehende CSS bleibt wie es ist */
  h2 {
    font-size: 64px;
    margin: 0;
  }
  
  .switchArea {
    display: relative;
    flex-direction: row;
    gap: 3%;
  }
  
  
  .input-div {
    display: flex;
    flex-direction: row;
    /* flex-wrap: wrap; */
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
  
  .swap-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    width: 300px;
    min-width: 300px;
  }
  
  .output-container {
    display: flex;
    flex-direction: column;
    flex: 2;
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
  
  
  
  .input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .styled-input {
    /* width: 100%; */
    height: 150px;
    border: none;
    outline: none;
    background: none;
    font-size: 1rem;
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
  
  #sign {
    font-size: 120px;
    color: #C3181E;
    line-height: 1em;
    margin: auto;
  }
  
  main {
    display: relative;
    max-width: 1600px; /* Maximale Breite des Inhalts */
    margin: 0 auto; /* Zentriert den Inhalt horizontal */
    padding: 20px 80px; /* Fester Abstand innen (links und rechts) */
    box-sizing: border-box;
  
  }
  
  h1 {
    font-size: 92px;
    line-height: 0.9em;
    padding-bottom: 5%;
  }
  
  #author,
  #disclaimer {
    line-height: 1.2em;
    font-size: 20px;
  }
  
  #wiki {
    font-size: 14px;
  }
  
  .bottom-content {
    display: flex;
    flex-direction: row;
    gap: 20%;
  }
  
  .text-left {
    display: flex;
    flex-direction: row;
    flex: 2;
    min-width: 300px;
    max-width: 450px;
  }
  
  .text-left-item {
    display: flex;
    flex-direction: row;
  }
  
  .text-right {
    display: flex;
    flex-direction: column;
    flex: 2;
    min-width: 300px;
    max-width: 450px;
  }
  @media (max-width: 1200px) {
      .input-div {
          display: flex;
          flex-direction: column;
          width: 100%; /* Schriftgröße verkleinert für mobile Ansicht */
          /* align-items: stretch; */
          flex-wrap: wrap;
      }
      .input-container {
        flex: 1;
        width: 100%;
      }
      .output-container {
        flex: 1;
        width: 100%;
      }
      .swap-container {
        flex: 1;
        width: 100%;
      }
      .bottom-content {
        flex-direction: column;
      }
      .text-right {
        padding-top: 40px;
        padding-left: 45px;
        padding-bottom: 80px;
      }
  }
  
  </style>
  